import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocumentView } from "@/components/DocumentView";
import type { NoteDoc } from "@/lib/schema";

const mockDoc: NoteDoc = {
  title: "Cellular Biology",
  summary: "Comprehensive guide to cells",
  sections: [
    {
      heading: "1. Organelles",
      paragraphs: ["Cells contain specialized structures."],
      bullets: ["Ribosomes make proteins", "Mitochondria produce ATP"],
    },
  ],
  uncertain: [{ text: "Ribosome size", reason: "Slight smudge" }],
};

describe("DocumentView Component", () => {
  it("renders semantic document title, summary, heading, and bullets", () => {
    render(
      <DocumentView
        doc={mockDoc}
        notices={[]}
        onEdit={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Cellular Biology"
    );
    expect(screen.getByText("Comprehensive guide to cells")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /1\. Organelles/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Ribosomes make proteins")).toBeInTheDocument();
  });

  it("triggers window.print when clicking Print / Save as PDF", async () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});

    render(
      <DocumentView
        doc={mockDoc}
        notices={[]}
        onEdit={vi.fn()}
        onReset={vi.fn()}
      />
    );

    const printBtn = screen.getByRole("button", {
      name: /print \/ save as pdf/i,
    });
    await userEvent.click(printBtn);
    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it("calls onEdit when clicking Edit Content", async () => {
    const onEdit = vi.fn();
    render(
      <DocumentView
        doc={mockDoc}
        notices={[]}
        onEdit={onEdit}
        onReset={vi.fn()}
      />
    );

    const editBtn = screen.getByRole("button", { name: /edit content/i });
    await userEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
