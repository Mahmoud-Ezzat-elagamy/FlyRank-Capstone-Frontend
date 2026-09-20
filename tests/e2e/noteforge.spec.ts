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
  test("marketing home page renders project info, PROJECTPROOF.md, and navbar navigates to generator", async ({
    page,
  }) => {
    // 1. Visit marketing home page
    await page.goto("/");

    // Check title and accessibility elements
    await expect(page).toHaveTitle(/NoteForge/i);
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeAttached();

    // Verify PROJECTPROOF.md content is shown on the marketing page
    await expect(
      page.locator("text=Students and professionals keep notes as messy handwriting")
    ).toBeVisible();

    // Verify navbar has Home and Study Guide Generator links
    const homeNav = page.locator('header nav a:has-text("Home")');
    await expect(homeNav).toBeVisible();
    await expect(homeNav).toHaveAttribute("aria-current", "page");

    const generatorNav = page.locator('header nav a:has-text("Study Guide Generator")');
    await expect(generatorNav).toBeVisible();

    // Navigate to generator page via navbar
    await generatorNav.click();
    await expect(page).toHaveURL(/.*\/generate/);

    // Verify Generator page heading and input panel
    await expect(
      page.locator("h1:has-text('Study Guide Generator')")
    ).toBeVisible();
    await expect(page.locator("#notes-textarea")).toBeVisible();
  });

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

    // Visit generator page
    await page.goto("/generate");

    // Check accessibility elements
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeAttached();

    // Paste notes into textarea
    const textarea = page.locator("#notes-textarea");
    await textarea.fill("Lecture notes on thermodynamics, Carnot cycles, and entropy.");

    // Ensure Study Guide radio is selected
    const studyGuideRadio = page.locator('input[value="study_guide"]');
    await expect(studyGuideRadio).toBeChecked();

    // Click generate
    await page.click('button:has-text("Transform Into Study Guide")');

    // Assert document renders
    await expect(
      page.locator("h1:has-text('Thermodynamics and Heat Transfer')")
    ).toBeVisible();
    await expect(
      page.locator("caption:has-text('Thermodynamic Processes Comparison')")
    ).toBeVisible();
    await expect(
      page.locator("figure[role='img']")
    ).toBeVisible();

    // Click Edit Content to open ReviewEditor
    await page.click('button:has-text("Edit Content")');
    await expect(
      page.locator("h2:has-text('Review & Edit Guide')")
    ).toBeVisible();

    // Verify flagged readings badge is visible with required label
    await expect(
      page.locator("h3:has-text('Readings to double-check')")
    ).toBeVisible();
    await expect(page.locator("text=78% efficiency")).toBeVisible();

    // Edit title and heading
    const headingInput = page.locator('input[value="1. The Four Laws of Thermodynamics"]');
    await headingInput.fill("1. Fundamental Laws of Thermodynamics");

    // Return to document view
    await page.click('button:has-text("View Formatted Document →")');
    await expect(
      page.locator("h2:has-text('1. Fundamental Laws of Thermodynamics')")
    ).toBeVisible();

    // Assert Print button is present
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

    await page.goto("/generate");

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

  test("select Summary with Important Points mode and PDF tab", async ({ page }) => {
    await page.goto("/generate");

    // Click on PDF tab
    const pdfTab = page.locator("#tab-pdf");
    await expect(pdfTab).toBeVisible();
    await pdfTab.click();
    await expect(pdfTab).toHaveAttribute("aria-selected", "true");

    // Verify PDF upload panel
    await expect(page.locator("text=Upload PDF Document")).toBeVisible();

    // Select Summary with Important Points mode
    const summaryPointsRadio = page.locator('input[value="summary_important_points"]');
    await summaryPointsRadio.check();
    await expect(summaryPointsRadio).toBeChecked();

    // Verify submit button label updated
    await expect(
      page.locator('button:has-text("Make Summary & Important Points")')
    ).toBeVisible();
  });
});

