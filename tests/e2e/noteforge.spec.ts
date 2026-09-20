import { test, expect } from "@playwright/test";

const MOCK_NOTE_DOC = {
  doc: {
    title: "Thermodynamics and Heat Transfer",
    summary: "Laws of thermodynamics, heat engines, and entropy",
    sections: [
      {
        heading: "1. The Four Laws of Thermodynamics",
        paragraphs: [
          "Thermodynamics governs how energy behaves across macroscopic physical systems.",
        ],
        bullets: [
          "Zeroth Law: Thermal equilibrium is transitive",
          "First Law: Energy conservation (dU = dQ - dW)",
          "Second Law: Entropy of an isolated system always increases",
        ],
        table: {
          caption: "Thermodynamic Processes Comparison",
          headers: ["Process", "Constant Variable", "Equation"],
          rows: [
            ["Isobaric", "Pressure", "W = P * delta V"],
            ["Isochoric", "Volume", "W = 0"],
            ["Isothermal", "Temperature", "delta U = 0"],
          ],
        },
        diagram: {
          type: "flowchart",
          title: "Carnot Engine Cycle",
          description: "Four reversible processes of the Carnot cycle",
          nodes: [
            { id: "s1", label: "Isothermal Expansion" },
            { id: "s2", label: "Adiabatic Expansion" },
            { id: "s3", label: "Isothermal Compression" },
            { id: "s4", label: "Adiabatic Compression" },
          ],
          edges: [
            { from: "s1", to: "s2" },
            { from: "s2", to: "s3" },
            { from: "s3", to: "s4" },
            { from: "s4", to: "s1" },
          ],
        },
      },
    ],
    uncertain: [
      { text: "78% efficiency", reason: "Faded handwriting in margin" },
    ],
  },
  notices: [],
};

test.describe("NoteForge End-to-End Workflow", () => {
  test("paste text -> choose Study Guide -> generate -> edit heading -> verify document", async ({
    page,
  }) => {
    // Mock the /api/generate endpoint
    await page.route("**/api/generate", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_NOTE_DOC),
      });
    });

    // 1. Visit homepage
    await page.goto("/");

    // Check title and accessibility elements
    await expect(page).toHaveTitle(/NoteForge/i);
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeAttached();

    // 2. Paste notes into textarea
    const textarea = page.locator("#notes-textarea");
    await textarea.fill("Lecture notes on thermodynamics, Carnot cycles, and entropy.");

    // 3. Ensure Study Guide radio is selected
    const studyGuideRadio = page.locator('input[value="study_guide"]');
    await expect(studyGuideRadio).toBeChecked();

    // 4. Click generate
    await page.click('button:has-text("Transform Into Study Guide")');

    // 5. Assert document renders
    await expect(
      page.locator("h1:has-text('Thermodynamics and Heat Transfer')")
    ).toBeVisible();
    await expect(
      page.locator("caption:has-text('Thermodynamic Processes Comparison')")
    ).toBeVisible();
    await expect(
      page.locator("figure[role='img']")
    ).toBeVisible();

    // 6. Click Edit Content to open ReviewEditor
    await page.click('button:has-text("Edit Content")');
    await expect(
      page.locator("h2:has-text('Review & Edit Guide')")
    ).toBeVisible();

    // 7. Verify flagged readings badge is visible with required label
    await expect(
      page.locator("h3:has-text('Readings to double-check')")
    ).toBeVisible();
    await expect(page.locator("text=78% efficiency")).toBeVisible();

    // 8. Edit title and heading
    const headingInput = page.locator('input[value="1. The Four Laws of Thermodynamics"]');
    await headingInput.fill("1. Fundamental Laws of Thermodynamics");

    // 9. Return to document view
    await page.click('button:has-text("View Formatted Document →")');
    await expect(
      page.locator("h2:has-text('1. Fundamental Laws of Thermodynamics')")
    ).toBeVisible();

    // 10. Assert Print button is present
    const printButton = page.locator('button:has-text("Print / Save as PDF")');
    await expect(printButton).toBeVisible();
  });

  test("AI unavailable state shows manual path and allows typing document directly", async ({
    page,
  }) => {
    // Mock /api/generate to fail with AI_UNAVAILABLE
    await page.route("**/api/generate", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            code: "AI_UNAVAILABLE",
            message: "AI service is temporarily offline.",
          },
        }),
      });
    });

    await page.goto("/");

    const textarea = page.locator("#notes-textarea");
    await textarea.fill("Offline test notes");

    await page.click('button:has-text("Transform Into Study Guide")');

    // Assert error state appears
    await expect(page.locator("text=AI Service Unavailable")).toBeVisible();

    // Click manual entry fallback
    const manualBtn = page.locator('button:has-text("Create / Edit Manually in Editor")');
    await expect(manualBtn).toBeVisible();
    await manualBtn.click();

    // Assert editor opened with template
    await expect(page.locator("#doc-title-input")).toHaveValue("New Study Guide");
  });
});
