import { describe, it, expect } from "vitest";
import { buildMermaid, cleanLabel } from "@/lib/buildMermaid";
import type { Diagram } from "@/lib/schema";

describe("cleanLabel", () => {
  it("strips brackets, quotes, braces, and backticks", () => {
    const raw = 'Special "Chars" [and] {brackets} (parens) <tags> `code`';
    const cleaned = cleanLabel(raw);
    expect(cleaned).toBe("Special Chars and brackets parens tags code");
  });

  it("collapses multiple whitespaces and trims", () => {
    const raw = "   Multiple    spaces    and \n newlines   ";
    const cleaned = cleanLabel(raw);
    expect(cleaned).toBe("Multiple spaces and newlines");
  });

  it("truncates labels longer than 60 characters", () => {
    const long = "A".repeat(80);
    const cleaned = cleanLabel(long);
    expect(cleaned.length).toBe(60);
  });
});

describe("buildMermaid", () => {
  it("generates correct flowchart TD syntax for valid diagram", () => {
    const diagram: Diagram = {
      type: "flowchart",
      title: "Simple Pipeline",
      description: "Step 1 to Step 2",
      nodes: [
        { id: "A", label: "Initial Data" },
        { id: "B", label: "Processed Result" },
      ],
      edges: [
        { from: "A", to: "B", label: "Transform" },
      ],
    };

    const output = buildMermaid(diagram);
    expect(output).toContain("flowchart TD");
    expect(output).toContain('A["Initial Data"]');
    expect(output).toContain('B["Processed Result"]');
    expect(output).toContain("A -->|Transform| B");
  });

  it("generates edge without label when label is undefined", () => {
    const diagram: Diagram = {
      type: "flowchart",
      title: "Unlabeled Pipeline",
      description: "Direct connection",
      nodes: [
        { id: "node1", label: "First" },
        { id: "node2", label: "Second" },
      ],
      edges: [{ from: "node1", to: "node2" }],
    };

    const output = buildMermaid(diagram);
    expect(output).toContain("node1 --> node2");
  });

  it("safely strips breaking characters in node and edge labels", () => {
    const diagram: Diagram = {
      type: "flowchart",
      title: "Dangerous Labels",
      description: "Testing sanitization",
      nodes: [
        { id: "n1", label: 'Input [with "quotes"]' },
        { id: "n2", label: "Output (safe)" },
      ],
      edges: [{ from: "n1", to: "n2", label: 'Edge "label"' }],
    };

    const output = buildMermaid(diagram);
    expect(output).toContain('n1["Input with quotes"]');
    expect(output).toContain('n2["Output safe"]');
    expect(output).toContain("n1 -->|Edge label| n2");
  });
});
