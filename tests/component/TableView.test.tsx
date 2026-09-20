import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TableView } from "@/components/TableView";
import type { Table } from "@/lib/schema";

const mockTable: Table = {
  caption: "Cellular Energy Comparison",
  headers: ["Process", "Location", "Yield"],
  rows: [
    ["Glycolysis", "Cytoplasm", "2 ATP"],
    ["Krebs Cycle", "Mitochondrial Matrix", "2 ATP"],
    ["Oxidative Phosphorylation", "Inner Membrane", "32-34 ATP"],
  ],
};

describe("TableView Component", () => {
  it("renders table with caption, headers, and rows", () => {
    render(<TableView table={mockTable} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Cellular Energy Comparison")).toBeInTheDocument();

    const colHeaders = screen.getAllByRole("columnheader");
    expect(colHeaders.length).toBe(3);
    expect(colHeaders[0]).toHaveTextContent("Process");
    expect(colHeaders[1]).toHaveTextContent("Location");
    expect(colHeaders[2]).toHaveTextContent("Yield");

    const rows = screen.getAllByRole("row");
    // 1 header row + 3 data rows = 4 rows
    expect(rows.length).toBe(4);
    expect(screen.getByText("Glycolysis")).toBeInTheDocument();
    expect(screen.getByText("32-34 ATP")).toBeInTheDocument();
  });
});
