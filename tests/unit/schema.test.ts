import { describe, it, expect } from "vitest";
import {
  TableSchema,
  DiagramSchema,
  NoteDocSchema,
  salvageDocument,
} from "@/lib/schema";

describe("TableSchema", () => {
  it("accepts a valid table", () => {
    const validTable = {
      caption: "Photosynthesis Stages",
      headers: ["Stage", "Location", "Input", "Output"],
      rows: [
        ["Light Reactions", "Thylakoid", "Light, H2O", "ATP, NADPH, O2"],
        ["Calvin Cycle", "Stroma", "CO2, ATP, NADPH", "G3P (Sugar)"],
      ],
    };
    const result = TableSchema.safeParse(validTable);
    expect(result.success).toBe(true);
  });

  it("rejects rows whose length differs from headers", () => {
    const invalidTable = {
      caption: "Cell Organelles",
      headers: ["Organelle", "Function"],
      rows: [
        ["Mitochondria", "Powerhouse of the cell"],
        ["Nucleus", "Stores genetic information", "Extra Cell Value"], // 3 cells instead of 2
      ],
    };
    const result = TableSchema.safeParse(invalidTable);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        "Every row must have the same number of cells as headers"
      );
    }
  });

  it("rejects a table with empty caption or headers", () => {
    const invalidTable = {
      caption: "",
      headers: [],
      rows: [],
    };
    const result = TableSchema.safeParse(invalidTable);
    expect(result.success).toBe(false);
  });
});

describe("DiagramSchema", () => {
  it("accepts a valid flowchart diagram", () => {
    const validDiagram = {
      type: "flowchart" as const,
      title: "Cellular Respiration Flow",
      description: "Step-by-step breakdown from Glycolysis to Krebs Cycle to ETC",
      nodes: [
        { id: "step1", label: "Glycolysis" },
        { id: "step2", label: "Krebs Cycle" },
        { id: "step3", label: "Electron Transport Chain" },
      ],
      edges: [
        { from: "step1", to: "step2", label: "Pyruvate" },
        { from: "step2", to: "step3", label: "NADH & FADH2" },
      ],
    };
    const result = DiagramSchema.safeParse(validDiagram);
    expect(result.success).toBe(true);
  });

  it("rejects edges referencing missing node ids", () => {
    const invalidDiagram = {
      type: "flowchart" as const,
      title: "Water Cycle",
      description: "Movement of water through ecosystems",
      nodes: [
        { id: "evap", label: "Evaporation" },
        { id: "cond", label: "Condensation" },
      ],
      edges: [
        { from: "evap", to: "cond" },
        { from: "cond", to: "precip" }, // 'precip' does not exist in nodes
      ],
    };
    const result = DiagramSchema.safeParse(invalidDiagram);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        "Every edge must reference existing node ids"
      );
    }
  });

  it("rejects invalid node IDs (starting with numbers or containing invalid symbols)", () => {
    const invalidDiagram = {
      type: "flowchart" as const,
      title: "Syntax Test",
      description: "Test node syntax",
      nodes: [
        { id: "1bad_id", label: "First" },
        { id: "good_id", label: "Second" },
      ],
      edges: [{ from: "1bad_id", to: "good_id" }],
    };
    const result = DiagramSchema.safeParse(invalidDiagram);
    expect(result.success).toBe(false);
  });

  it("rejects reserved Mermaid words as node IDs (e.g., 'end')", () => {
    const invalidDiagram = {
      type: "flowchart" as const,
      title: "Reserved Word Test",
      description: "Test reserved keyword 'end'",
      nodes: [
        { id: "start", label: "Start" },
        { id: "end", label: "End of flow" },
      ],
      edges: [{ from: "start", to: "end" }],
    };
    const result = DiagramSchema.safeParse(invalidDiagram);
    expect(result.success).toBe(false);
  });
});

describe("NoteDocSchema", () => {
  it("accepts a full valid NoteDoc", () => {
    const validDoc = {
      title: "Biology 101: Cellular Processes",
      summary: "Comprehensive guide covering respiration, photosynthesis, and genetics.",
      sections: [
        {
          heading: "1. Overview",
          paragraphs: ["Cells are the fundamental units of life."],
          bullets: ["Prokaryotic cells lack nuclei", "Eukaryotic cells contain organelles"],
        },
      ],
      uncertain: [{ text: "38 ATP vs 36 ATP", reason: "Ink smudge on margin" }],
    };
    const result = NoteDocSchema.safeParse(validDoc);
    expect(result.success).toBe(true);
  });

  it("rejects documents without a title or with empty sections", () => {
    const invalidDoc = {
      title: "",
      summary: "Some summary",
      sections: [],
      uncertain: [],
    };
    const result = NoteDocSchema.safeParse(invalidDoc);
    expect(result.success).toBe(false);
  });
});

describe("Partial-failure logic (salvageDocument)", () => {
  it("drops an invalid diagram, keeps description as text, and records a notice", () => {
    const rawDocWithBadDiagram = {
      title: "History of Computing",
      summary: "From Babbage to modern microprocessors",
      sections: [
        {
          heading: "Evolution of CPUs",
          paragraphs: ["Initial architecture concepts started in the 1940s."],
          diagram: {
            type: "flowchart",
            title: "Architecture Flow",
            description: "Flow from punch cards to transistor memory",
            nodes: [{ id: "n1", label: "Punch cards" }], // Only 1 node (min is 2)
            edges: [{ from: "n1", to: "n_missing" }],
          },
        },
      ],
      uncertain: [],
    };

    const { doc, notices } = salvageDocument(rawDocWithBadDiagram);
    expect(doc.title).toBe("History of Computing");
    expect(doc.sections[0].diagram).toBeUndefined();
    expect(doc.sections[0].paragraphs?.some((p) => p.includes("Flow from punch cards"))).toBe(true);
    expect(notices.length).toBeGreaterThan(0);
    expect(notices[0]).toContain("Diagram structure had invalid connections");
  });

  it("drops an invalid table, keeps caption as text, and records a notice", () => {
    const rawDocWithBadTable = {
      title: "Chemistry Formulas",
      summary: "Gas laws and equilibrium constants",
      sections: [
        {
          heading: "Ideal Gas Laws",
          table: {
            caption: "Variables comparison",
            headers: ["Variable", "Unit"],
            rows: [["Pressure", "atm", "extra cell"]], // 3 cells vs 2 headers
          },
        },
      ],
      uncertain: [],
    };

    const { doc, notices } = salvageDocument(rawDocWithBadTable);
    expect(doc.sections[0].table).toBeUndefined();
    expect(doc.sections[0].paragraphs?.some((p) => p.includes("Variables comparison"))).toBe(true);
    expect(notices.length).toBe(1);
    expect(notices[0]).toContain("Table had mismatched headers and rows");
  });
});
