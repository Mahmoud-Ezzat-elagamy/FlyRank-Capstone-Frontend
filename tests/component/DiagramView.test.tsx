import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { DiagramView } from "@/components/DiagramView";
import type { Diagram } from "@/lib/schema";

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockImplementation((id: string) => {
      return Promise.resolve({
        svg: `<svg id="${id}"><text>Rendered Diagram</text></svg>`,
      });
    }),
  },
}));

const mockDiagram: Diagram = {
  type: "flowchart",
  title: "Cell Cycle Diagram",
  description: "A diagram representing the phases of cell division",
  nodes: [
    { id: "A", label: "Interphase" },
    { id: "B", label: "Mitosis" },
  ],
  edges: [{ from: "A", to: "B" }],
};

describe("DiagramView Component", () => {
  it("renders accessible figure with role='img' and aria-label", async () => {
    render(<DiagramView diagram={mockDiagram} />);

    const figure = screen.getByRole("img", { name: "Cell Cycle Diagram" });
    expect(figure).toBeInTheDocument();
    expect(screen.getByText("Cell Cycle Diagram")).toBeInTheDocument();
  });

  it("renders visible figcaption with full accessible description", () => {
    render(<DiagramView diagram={mockDiagram} />);

    const caption = screen.getByText(/A diagram representing the phases of cell division/i);
    expect(caption).toBeInTheDocument();
  });

  it("renders rendered SVG content when Mermaid succeeds", async () => {
    render(<DiagramView diagram={mockDiagram} />);

    await waitFor(() => {
      expect(screen.getByText("Rendered Diagram")).toBeInTheDocument();
    });
  });
});
