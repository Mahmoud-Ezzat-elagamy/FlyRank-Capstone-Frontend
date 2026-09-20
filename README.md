# NoteForge: Accessible Study Document Synthesizer

> Transform messy handwritten notes, pasted lecture text, and Word documents into clean, structured, and accessible study guides with comparison tables and Mermaid flowchart diagrams.

---

## 1. What It Does

NoteForge converts messy, unorganized, or handwritten study notes into structured, accessible documents ready for studying and printing.

```
[ Photo of Handwriting ]
[ Raw Pasted Notes     ]  ──▶  [ Google Gemini AI ]  ──▶  [ Structured Study Guide ]
[ Word Document (.docx)]       (Strict JSON Schema)       - Topic Headings & Bullets
                                                         - Comparison Tables
                                                         - Flowchart Diagrams
                                                         - Flagged Handwriting Readings
                                                         - Accessible "Save as PDF"
```

- **Multi-Format Input:** Accepts photos (with client-side downscaling to prevent Vercel body-size overflow), raw text (up to 30,000 characters), or Microsoft Word (`.docx`) files via Mammoth.
- **Dual Mode Support:** Standard **Study Guide** (comparisons, flows, takeaways) and **Meeting Summary** (decisions, action items table with owners/due dates, open questions).
- **Human-in-the-Loop Review:** Interactive accessible editor to adjust sections, delete unwanted blocks, or resolve flagged handwriting readings.
- **Accessible Client-Side PDF:** Browser-native print stylesheet with tagged semantic markup, zero headless Chrome dependencies.

---

## 2. Quick Start (< 5 Minutes)

### Prerequisites
- Node.js 18.18+ or Node 20+ / 24+
- A Google AI Studio API key (free at [aistudio.google.com](https://aistudio.google.com/))

### Installation
```bash
# Clone the repository
git clone https://github.com/Mahmoud-Ezzat-elagamy/FlyRank-Capstone-Frontend.git
cd FlyRank-Capstone-Frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```env
GEMINI_API_KEY=your_actual_google_ai_studio_api_key_here
GEMINI_MODEL=gemini-2.5-flash
RATE_LIMIT_PER_MINUTE=6
MAX_INPUT_CHARS=30000
```

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Architecture

```text
Browser
 ├─ InputPanel       Photo upload / paste text / .docx file
 │    └─ Client-side image downscale (max 1600px, JPEG ~0.8) to comply with serverless limits
 ├─ ModeSelector     Study Guide (default) or Meeting Summary
 ├─ ReviewEditor     Accessible editing, section deletion, and flagged "Readings to double-check"
 ├─ DocumentView     Semantic HTML rendering (tables with caption, figure with figcaption)
 └─ PrintPreview     @media print stylesheet → browser "Save as PDF"

Server (Next.js route handler: POST /api/generate)
 ├─ Request Validation (size, MIME type, mode, character count)
 ├─ Rate Limiting (in-memory sliding window per IP; best-effort serverless)
 ├─ Gemini AI Call (JSON mode + strict response schema; key stays server-side)
 ├─ Parse & Validate (JSON.parse → Zod schema → one automated repair retry on failure)
 ├─ Partial-Failure Salvage (drops malformed tables/diagrams to text rather than crashing)
 └─ Return typed NoteDoc or structured error (never leaks keys or stack traces)

GET /api/health → Returns { status: "ok", time } for UptimeRobot monitoring
```

---

## 4. AI Integration & Schema Design

- **Model Configuration:** Configured dynamically via `GEMINI_MODEL` environment variable (defaults to `gemini-2.5-flash`). Model names and secrets are never hardcoded.
- **Why Structured Output?**
  1. **Guaranteed Contract:** AI outputs predictable JSON rather than markdown soup.
  2. **Syntax-Free Diagrams:** The model generates diagram **nodes and edges as JSON data**. Our deterministic generator (`lib/buildMermaid.ts`) compiles and sanitizes the Mermaid flowchart string, eliminating syntax crashes.
  3. **Safe Partial Recovery:** If one table cell or diagram edge fails strict validation, our `salvageDocument` engine preserves the text and caption as plain paragraphs while salvaging the remaining 95% of the document.
  4. **Strict Safety:** Notes are treated purely as passive data; prompt injection attempts within notes are ignored.

---

## 5. Privacy Notice

- **Zero Server-Side Storage:** NoteForge has no database, no file storage, and does not persist notes or images. Everything is processed purely in-memory.
- **Free-Tier Advisory:** NoteForge uses Google AI Studio's API. On Google's free tier, submitted prompts and images may be reviewed by human reviewers to train and improve Google products. **Do not submit confidential, proprietary, or sensitive personal information.**

---

## 6. Testing & Quality Assurance

The project includes an extensive test suite covering unit, component, and API route layers with mocked Gemini calls (zero quota usage during testing).

```bash
# Run all unit and component tests
npm test

# Run tests with code coverage report
npm run test:coverage

# Run Playwright end-to-end suite
npm run test:e2e
```

### Verified Coverage Highlights:
- **Statements / Lines Covered:** **> 72%** (Target: >= 50%, aim 70%)
- **Test Results:** 55/55 Passing across 14 test suites
  - `schema.test.ts`: Header/row mismatch rejection, invalid node ID detection, partial-failure salvaging.
  - `buildMermaid.test.ts`: Label sanitization, bracket stripping, flowchart formatting.
  - `rateLimit.test.ts`: Sliding window rate limit and independent IP tracking.
  - `image.test.ts` & `docx.test.ts`: Format validation and Word file text extraction.
  - `generate.test.ts`: Mocked API success, 429 quota backoff, one-repair retry, timeout, oversized payloads.
  - Component tests: `InputPanel`, `ReviewEditor`, `DocumentView`, `TableView`, `DiagramView`, `ErrorState`, `ModeSelector`, `StatusRegion`.

---

## 7. Performance & Accessibility (WCAG 2.1 AA)

- **Lighthouse Scores:** 98 Performance (Desktop), 94 Performance (Mobile), 100 Accessibility, 100 Best Practices, 100 SEO.
- **Zero WCAG 2.1 AA Violations:** Verified with axe-core 4.10 and WAVE.
- **Accessibility Fix Highlight:**
  - *Before:* Amber warning badges had a 3.61:1 contrast ratio (`text-amber-600` on `bg-amber-100`).
  - *After:* Enhanced to `text-amber-950` with explicit `[Flagged]` text labels and visible `outline: 3px solid #2563eb` focus rings, achieving a contrast ratio of **11.42:1 (AAA Pass)**.
- See detailed audit evidence in [docs/AUDIT.md](docs/AUDIT.md).

---

## 8. Failure Handling & Production Operations

| Failure Scenario | HTTP Code | Handled Behavior | User Action |
| :--- | :---: | :--- | :--- |
| **Gemini 429 / Quota** | 429 | One server-side backoff retry; returns friendly busy message | "Try Again" button |
| **App Rate Limit Hit** | 429 | In-memory limiter blocks IP with `retryAfter` seconds hint | Displays remaining seconds wait hint |
| **Malformed JSON** | 422 | One server-side repair retry appending validation errors; drops bad diagrams safely | "Try Again" or manual editor |
| **Image Too Large** | 413 / Client | Blocked client-side before upload if > 10 MB | Selects smaller image |
| **Unreadable Notes** | 422 | Returns "No Legible Notes Found" with photography tips | Tips for lighting and flat page |
| **AI Offline / Timeout** | 503 / 504 | Triggers **Manual Fallback Path** | **"Create / Edit Manually in Editor"** button |

- **Deployment Checklist:** See [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md).
- **Rollback Plan:** Redeploy the last known-good commit via Vercel Instant Rollback in <10 seconds. See [docs/ROLLBACK.md](docs/ROLLBACK.md).

---

## 9. Known Limitations & Future Work

1. **Handwriting Quality:** Severe handwriting illegibility, low resolution, or intense shadows can cause extraction uncertainty.
2. **Serverless Rate Limiting:** The in-memory sliding-window limiter is per-instance (best-effort) on serverless platforms. For high-scale multi-region setups, an external Redis instance (Upstash) is recommended.
3. **Browser PDF Tagging:** PDF export uses the browser's print engine. While Chromium produces tagged structural PDFs, PDF language metadata (`/Lang`) may require setting in Acrobat Pro for formal accessibility certification.
4. **Future Extensions:** Support for multi-page batch processing, audio lecture transcription, and timeline/mind-map diagram types.

---

## 10. Reflection & Learning Prompts

*(For the program capstone reflection)*
1. **Hardest Part:** Balancing strict Zod validation with model variability, and designing the graceful partial-failure salvage pipeline so minor diagram glitches don't scrap an entire valid document.
2. **What I Would Change:** Implement streaming responses with SSE (Server-Sent Events) to display sections incrementally as Gemini generates them.
3. **What Surprised Me:** How resilient deterministic Mermaid generation is when the model is asked to output only nodes and edges as JSON instead of raw Mermaid code.
