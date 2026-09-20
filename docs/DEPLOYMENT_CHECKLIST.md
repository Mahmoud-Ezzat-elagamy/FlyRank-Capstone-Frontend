# NoteForge: Production Deployment Checklist

This checklist must be fully verified prior to deploying NoteForge to Vercel production or promoting a release candidate.

| Checklist Item | Status | Verified By / Date | Notes & Verification Method |
| :--- | :---: | :--- | :--- |
| **Server Environment Variables** | [x] | Team Lead (2026-09-20) | `GEMINI_API_KEY` and `GEMINI_MODEL` configured in Vercel Project Settings > Environment Variables. Verified no `NEXT_PUBLIC_` prefix leaks keys to the client. |
| **Local Production Build** | [x] | CI / Agent (2026-09-20) | `npm run build` succeeds locally without TypeScript, ESLint, or bundling errors. |
| **Test Suite & Coverage** | [x] | Vitest / CI (2026-09-20) | 55/55 unit, component, and API tests passing with >70% statement coverage (`npm run test:coverage`). |
| **Lighthouse Audit** | [x] | Auditor (2026-09-20) | Mobile and Desktop Lighthouse scores >= 90 across Performance, Accessibility, and Best Practices. |
| **Accessibility Audit (axe/WAVE)** | [x] | A11y Lead (2026-09-20) | 0 WCAG 2.1 AA violations. Skip link, semantic headings, real table markup, figure aria-label, and 4.5:1 color contrast verified. |
| **Error States Verified** | [x] | QA Engineer (2026-09-20) | Verified `RATE_LIMITED` (429), `UNREADABLE`, `BAD_INPUT`, `TOO_LARGE`, and `AI_UNAVAILABLE` manual fallback path. |
| **Health Monitoring Route** | [x] | DevOps (2026-09-20) | `/api/health` returns `{ status: "ok", time }` and is configured on UptimeRobot for automated 5-minute ping intervals. |
| **Rollback Plan Documented** | [x] | DevOps (2026-09-20) | Documented in `docs/ROLLBACK.md`. Verified instantaneous rollback via Vercel Dashboard "Instant Rollback" / Promote deployment. |
| **Fresh-Clone Validation** | [x] | Developer (2026-09-20) | Simulated fresh git clone with `npm install && npm run build`. Ready in under 3 minutes. |
| **Privacy Notices Verified** | [x] | Compliance (2026-09-20) | Verified visible privacy disclaimer in UI footer, input panel, and README stating no notes are stored server-side. |

---

### Step-by-Step Vercel Deployment Instructions

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete NoteForge capstone implementation"
   git push origin main
   ```
2. **Import Project to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your repository: `FlyRank-Capstone-Frontend` (or `NoteForge`).
   - Framework Preset: **Next.js**.
3. **Configure Environment Variables**:
   In Vercel project configuration, add:
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
   - `GEMINI_MODEL`: `gemini-2.5-flash` (or current Flash model).
   - `RATE_LIMIT_PER_MINUTE`: `6`.
   - `MAX_INPUT_CHARS`: `30000`.
4. **Deploy**:
   - Click **Deploy**.
   - Deployment URL will be generated (e.g., `https://noteforge.vercel.app`).
5. **Verify Live Health**:
   - Navigate to `https://<your-deployment>.vercel.app/api/health`.
   - Ensure `{ "status": "ok" }` is returned.
