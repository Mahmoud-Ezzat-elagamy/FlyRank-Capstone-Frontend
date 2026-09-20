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

