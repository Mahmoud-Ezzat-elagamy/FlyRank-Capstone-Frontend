import { z } from "zod";

// Reserved keywords in Mermaid flowcharts that must not be used as node IDs
export const RESERVED_WORDS = new Set([
  "end",
  "graph",
  "flowchart",
  "subgraph",
  "click",
  "style",
  "class",
  "interpolate",
  "linkstyle",
]);

export const NodeSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(
      /^[A-Za-z][A-Za-z0-9_]*$/,
      "Node ID must start with a letter and contain only alphanumeric characters or underscores"
    )
    .refine((id) => !RESERVED_WORDS.has(id.toLowerCase()), {
      message: "Node ID cannot be a reserved word (e.g. 'end')",
    }),
  label: z.string().min(1),
});

export const EdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
});

export const TableSchema = z
  .object({
    caption: z.string().min(1),
    headers: z.array(z.string()).min(1),
    rows: z.array(z.array(z.string())),
  })
  .refine((t) => t.rows.every((r) => r.length === t.headers.length), {
    message: "Every row must have the same number of cells as headers",
  });

export const DiagramSchema = z
  .object({
    type: z.enum(["flowchart"]), // stretch goal: "timeline"
    title: z.string().min(1),
    description: z.string().min(1), // accessible text alternative
    nodes: z.array(NodeSchema).min(2),
    edges: z.array(EdgeSchema),
  })
  .refine(
    (d) =>
      d.edges.every(
        (e) =>
          d.nodes.some((n) => n.id === e.from) && d.nodes.some((n) => n.id === e.to)
      ),
    { message: "Every edge must reference existing node ids" }
  );

export const SectionSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string()).optional(),
  bullets: z.array(z.string()).optional(),
  table: TableSchema.optional(),
  diagram: DiagramSchema.optional(),
});

export const UncertainItemSchema = z.object({
  text: z.string(),
  reason: z.string(),
});

export const NoteDocSchema = z.object({
  title: z.string().min(1),
  summary: z.string(),
  sections: z.array(SectionSchema).min(1),
  uncertain: z.array(UncertainItemSchema),
});

export type Node = z.infer<typeof NodeSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type Table = z.infer<typeof TableSchema>;
export type Diagram = z.infer<typeof DiagramSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type UncertainItem = z.infer<typeof UncertainItemSchema>;
export type NoteDoc = z.infer<typeof NoteDocSchema>;

/**
 * Result of applying the partial-failure rule:
 * If a diagram or table within a section is invalid, it is gracefully dropped,
 * keeping the text/caption/description, and recording a notice for the UI.
 */
export interface DocumentWithNotices {
  doc: NoteDoc;
  notices: string[];
}

export function salvageDocument(raw: unknown): DocumentWithNotices {
  // If raw fails basic top-level structure, let safeParse fail upstream
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid document structure");
  }

  const obj = raw as Record<string, any>;
  const notices: string[] = [];

  const title = typeof obj.title === "string" && obj.title.trim().length > 0
    ? obj.title.trim()
    : "Untitled Study Guide";
  const summary = typeof obj.summary === "string" ? obj.summary : "";
  const uncertain = Array.isArray(obj.uncertain)
    ? obj.uncertain
        .filter((u) => u && typeof u.text === "string" && typeof u.reason === "string")
        .map((u) => ({ text: u.text, reason: u.reason }))
    : [];

  const rawSections = Array.isArray(obj.sections) ? obj.sections : [];
  const validSections: Section[] = [];

  for (let i = 0; i < rawSections.length; i++) {
    const s = rawSections[i];
    if (!s || typeof s !== "object") continue;

    const heading = typeof s.heading === "string" && s.heading.trim().length > 0
      ? s.heading.trim()
      : `Section ${i + 1}`;

    let paragraphs = Array.isArray(s.paragraphs)
      ? s.paragraphs.filter((p: unknown): p is string => typeof p === "string")
      : undefined;

    const bullets = Array.isArray(s.bullets)
      ? s.bullets.filter((b: unknown): b is string => typeof b === "string")
      : undefined;

    let table: Table | undefined = undefined;
    if (s.table) {
      const tableParsed = TableSchema.safeParse(s.table);
      if (tableParsed.success) {
        table = tableParsed.data;
      } else {
        notices.push(
          `Section "${heading}": Table had mismatched headers and rows. Caption retained as text.`
        );
        if (s.table.caption && typeof s.table.caption === "string") {
          const fallbackNote = `[Table note: ${s.table.caption}]`;
          if (!paragraphs) paragraphs = [];
          paragraphs.push(fallbackNote);
        }
      }
    }

    let diagram: Diagram | undefined = undefined;
    if (s.diagram) {
      const diagramParsed = DiagramSchema.safeParse(s.diagram);
      if (diagramParsed.success) {
        diagram = diagramParsed.data;
      } else {
        notices.push(
          `Section "${heading}": Diagram structure had invalid connections or IDs. Replaced with text description.`
        );
        if (s.diagram.description && typeof s.diagram.description === "string") {
          const fallbackDesc = `[Process note: ${s.diagram.description}]`;
          if (!paragraphs) paragraphs = [];
          paragraphs.push(fallbackDesc);
        }
      }
    }

    validSections.push({
      heading,
      paragraphs,
      bullets,
      table,
      diagram,
    });
  }

  if (validSections.length === 0) {
    validSections.push({
      heading: "Overview",
      paragraphs: ["No readable sections could be formatted."],
    });
  }

  const sanitizedDoc: NoteDoc = {
    title,
    summary,
    sections: validSections,
    uncertain,
  };

  // Ensure whole document satisfies NoteDocSchema
  const finalParse = NoteDocSchema.parse(sanitizedDoc);

  return {
    doc: finalParse,
    notices,
  };
}
