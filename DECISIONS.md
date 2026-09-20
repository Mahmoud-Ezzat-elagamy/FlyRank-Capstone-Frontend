# Architectural & Implementation Decisions (NoteForge)

This document records technical and design decisions made during the development of NoteForge, following the project specification in `PLAN.md`.

---

### Decision 1: Next.js 15 App Router & Tailwind CSS
- **Context:** Framework choice requires modern React, SSR, API route handlers, and performant bundle size.
- **Decision:** Use Next.js 15 with App Router (`app/` directory), strict TypeScript (`tsconfig.json`), and Tailwind CSS with `@media print` support.
- **Rationale:** Standard modern stack for Vercel deployment, zero server-side state, and streamlined API route handling.

### Decision 2: Partial Failure Handling Strategy
- **Context:** Gemini may occasionally produce a valid document where a single nested diagram has a broken edge pointer, or a table row misses one cell.
- **Decision:** Implemented `salvageDocument()` in `lib/schema.ts`. If a table or diagram fails strict validation, it is gracefully dropped, its `caption` or `description` is salvaged into readable text paragraphs, and a warning notice is attached to the API response.
- **Rationale:** Prevents discarding the entire generated document when 95% of it is valid and valuable to the user.

### Decision 3: Diagram Node ID Sanitization & Reserved Words
- **Context:** Mermaid flowchart syntax fails when node IDs are keywords like `end`, `graph`, `subgraph`, or contain special punctuation.
- **Decision:** Enforce `^[A-Za-z][A-Za-z0-9_]*$` in `NodeSchema`, reject Mermaid reserved keywords, and sanitize all label text in `lib/buildMermaid.ts` by escaping quotes, stripping brackets, and truncating to 60 characters.
- **Rationale:** Ensures 100% syntactically valid Mermaid definitions on the client.

### Decision 4: Gemini SDK Selection (`@google/genai`)
- **Context:** Google AI Studio has migrated to the official unified `@google/genai` SDK.
- **Decision:** Use `@google/genai` with `GEMINI_MODEL` configured via environment variable (defaulting to `gemini-2.5-flash`), strictly using JSON mode and response schemas.
- **Rationale:** Guarantees typed structured responses and avoids hardcoding model strings.

### Decision 5: Client-Side PDF Generation via Browser Print
- **Context:** Generating PDFs on serverless (e.g. Puppeteer on Vercel) is heavy, error-prone, exceeds size limits, and risks timeouts.
- **Decision:** Implement dedicated `@media print` CSS and browser `window.print()` flow.
- **Rationale:** Zero server dependencies, instant preview, accessible tagged PDF output through standard browser print engines, compliant with WCAG 2.1 AA.

### Decision 6: Automated Repair Retry on JSON / Schema Mismatch
- **Context:** While Gemini in structured output mode generally satisfies the schema, complex handwriting inputs may rarely return incomplete JSON or edge reference mismatches.
- **Decision:** Implement an automated one-repair retry in `lib/gemini.ts`. The exact Zod or JSON parse failure reason is appended to the repair prompt. If that still fails, the partial-failure salvage pipeline is executed before throwing an error.
- **Rationale:** Maximizes synthesis success rate without unbounded retry loops or quota waste.

### Decision 7: Dual Synthesis Modes
- **Context:** Users require study guides as well as quick meeting/lecture summaries.
- **Decision:** Support both `study_guide` and `meeting_summary` modes with tailored prompt constraints. In `meeting_summary`, the model structures decisions, generates an action items table (with owner and due dates, explicitly using "Unspecified" rather than guessing), and lists open questions.
- **Rationale:** Broadens utility while remaining grounded in the original notes.

### Decision 8: Manual Editor Fallback Path
- **Context:** When AI is down, quota is exceeded, or timeout occurs, users should not encounter a dead end.
- **Decision:** Provide an explicit "Create / Edit Manually in Editor" button in `ErrorState.tsx` and `HomePage` that opens the accessible `ReviewEditor` with a structured starter template.
- **Rationale:** Satisfies the resilience requirement in `PLAN.md` Section 8.

### Decision 9: Marketing Home Page, Dedicated Generator Route, and Accessible Navbar
- **Context:** The application required a dedicated marketing/home page presenting project information and the `PROJECTPROOF.md` capstone artifact, while preserving 100% of the existing study guide generator functionality and providing seamless navigation between both pages.
- **Decision:** 
  1. Main Home Page (`/`) serves as the comprehensive marketing and project overview page, dynamically reading and displaying `PROJECTPROOF.md` alongside feature breakdowns, architecture highlights, and call-to-actions.
  2. The existing study guide generator functionality is fully preserved in `app/generate/page.tsx` (with an `/app` alias route), ensuring zero regressions or alterations to existing features.
  3. An accessible, responsive `Navbar` component was created in `components/Navbar.tsx` with active route detection (`aria-current="page"`), keyboard focus rings, mobile dropdown support, and direct links between "Home" and "Study Guide Generator".
- **Rationale:** Separates marketing/educational content from active tool execution while providing accessible, intuitive navigation across pages without breaking any existing features or tests.

### Decision 10: "Summary with Important Points" Mode & PDF Document Input Support
- **Context:** Users needed an executive summary format that extracts and highlights critical takeaways, crucial facts, definitions, and important points, as well as the ability to upload and process PDF documents (.pdf) in addition to images and Word files (.docx).
- **Decision:**
  1. **Mode Implementation (`summary_important_points`):** Created a dedicated prompt instruction set in `lib/prompts.ts` instructing Gemini to produce a structured document featuring an Executive Summary & Core Overview, a Crucial & Important Points section, structured concept breakdowns with comparison tables/diagrams where relevant, and Actionable Conclusions.
  2. **UI & Accessibility:** Extended `ModeSelector.tsx` to display all three options cleanly in a responsive grid (`grid-cols-1 md:grid-cols-3`) with accessible radio elements, and updated `InputPanel.tsx` to dynamically adapt the submit button label based on the active mode.
  3. **PDF Ingestion (`lib/pdf.ts`):** Implemented client-side text extraction using `unpdf` to extract readable text and page counts from `.pdf` documents up to 10 MB, while also encoding base64 payload to enable multimodal visual reading of scanned or handwritten PDFs by Gemini.
- **Rationale:** Greatly enhances user flexibility by allowing students and professionals to directly ingest syllabus, lecture slide, and research PDFs and generate focused summaries with high-yield points.

### Decision 11: Comprehensive WAI-ARIA & Accessibility (a11y) Across Modes & Uploaders
- **Context:** Features added recently (Summary with Important Points mode, PDF document ingestion, drag-and-drop file upload, file removal, error handling, status feedback) required strict adherence to WCAG 2.1 AA and WAI-ARIA design patterns.
- **Decision:**
  1. **ModeSelector Keyboard & Semantic Architecture:** Implemented accessible `role="radiogroup"` with full arrow key navigation (`ArrowRight`, `ArrowLeft`, `ArrowDown`, `ArrowUp`), roving tab focus, explicit `aria-checked`, and linked `aria-labelledby` / `aria-describedby` referencing mode descriptions.
  2. **WAI-ARIA Tabs Pattern & Drag-and-Drop:** Built accessible tabbed input with `role="tablist"` / `role="tab"` / `role="tabpanel"`, roving tabindex, and left/right keyboard navigation. Extended dropzones to support drag-and-drop with `aria-dropeffect="copy"` and visual focus/drag rings.
  3. **Screen Reader Live Regions:** Added polite live regions (`role="status" aria-live="polite" aria-atomic="true"`) to announce file upload events (filename, page count, extracted characters), file removal events, and mode-specific loading/completion messages (`mode="summary_important_points"`, `meeting_summary`, and `study_guide`).
  4. **WCAG 2.5.5 / 2.5.8 Touch Targets:** Upgraded all remove buttons and alert dismiss buttons to a minimum touch target size of $44 \times 44$px (`min-h-[44px] min-w-[44px]`) with descriptive contextual labels (e.g. `aria-label="Remove uploaded PDF document <filename>"`).
  5. **WCAG 2.5.3 Label in Name:** Preserved visible button text as accessible names on top action buttons (`Print / Save as PDF`, `Start Over`, `Edit Content`) while adding accessible clipboard copy support with live status feedback.
- **Rationale:** Ensures complete parity of experience for screen-reader users, keyboard-only navigators, and individuals with visual, motor, or cognitive impairments.



