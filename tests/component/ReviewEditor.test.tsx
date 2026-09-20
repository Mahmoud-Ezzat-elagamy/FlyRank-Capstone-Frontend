import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewEditor } from "@/components/ReviewEditor";
import type { NoteDoc } from "@/lib/schema";

const mockDoc: NoteDoc = {
  title: "Organic Chemistry",
  summary: "Functional groups and reaction mechanisms",
  sections: [
    {
      heading: "Alkanes and Alkenes",
      paragraphs: ["Saturated vs unsaturated hydrocarbons."],
      bullets: ["Single bond vs double bond"],
    },
    {
      heading: "Aromatic Compounds",
      paragraphs: ["Benzene ring resonance stability."],
      bullets: ["Huckel's rule"],
    },
  ],
  uncertain: [
    { text: "120 kcal/mol", reason: "Ink smudge near heat of hydrogenation" },
  ],
};

describe("ReviewEditor Component", () => {
  it("displays flagged readings with the required 'Readings to double-check' text label", () => {
    render(
      <ReviewEditor doc={mockDoc} onChange={vi.fn()} onPreview={vi.fn()} />
    );

    expect(screen.getByText("Readings to double-check")).toBeInTheDocument();
    expect(screen.getByText(/120 kcal\/mol/i)).toBeInTheDocument();
    expect(screen.getByText(/Ink smudge near heat of hydrogenation/i)).toBeInTheDocument();
  });

  it("allows editing the document title and section headings", async () => {
    const onChange = vi.fn();
    render(
      <ReviewEditor doc={mockDoc} onChange={onChange} onPreview={vi.fn()} />
    );

    const titleInput = screen.getByLabelText(/document title/i);
    expect(titleInput).toHaveValue("Organic Chemistry");

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Advanced Chemistry");
    expect(onChange).toHaveBeenCalled();

    const headingInput = screen.getByDisplayValue("Alkanes and Alkenes");
    await userEvent.clear(headingInput);
    await userEvent.type(headingInput, "Hydrocarbons Overview");
    expect(onChange).toHaveBeenCalled();
  });

  it("allows deleting a section", async () => {
    const onChange = vi.fn();
    render(
      <ReviewEditor doc={mockDoc} onChange={onChange} onPreview={vi.fn()} />
    );

    const deleteButtons = screen.getAllByRole("button", { name: /delete section/i });
    expect(deleteButtons.length).toBe(2);

    await userEvent.click(deleteButtons[0]);
    expect(onChange).toHaveBeenCalled();
  });
});
