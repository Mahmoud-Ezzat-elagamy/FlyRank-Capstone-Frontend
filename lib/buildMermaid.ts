import type { Diagram } from "./schema";

/**
 * Sanitizes node and edge labels to prevent Mermaid parsing errors or syntax injection.
 * Strips quotes, parentheses, brackets, braces, angle brackets, and backticks,
 * compresses multiple whitespace into single space, and truncates to 60 characters.
 */
export const cleanLabel = (s: string): string =>
  s
    .replace(/["\[\]\(\)\{\}<>`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);

/**
 * Converts validated Diagram nodes and edges into a compliant Mermaid flowchart string.
 */
export function buildMermaid(d: Diagram): string {
  const lines: string[] = ["flowchart TD"];

  for (const n of d.nodes) {
    const safeLabel = cleanLabel(n.label);
    lines.push(`  ${n.id}["${safeLabel}"]`);
  }

  for (const e of d.edges) {
    const label = e.label ? `|${cleanLabel(e.label)}|` : "";
    lines.push(`  ${e.from} -->${label} ${e.to}`);
  }

  return lines.join("\n");
}
