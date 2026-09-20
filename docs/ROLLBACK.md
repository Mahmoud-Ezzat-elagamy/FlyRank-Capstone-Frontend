# NoteForge: Production Rollback Plan

This document defines the emergency rollback protocols for NoteForge in production on Vercel.

---

## 1. When to Initiate a Rollback

Initiate a rollback immediately if any of the following occur in production:
1. **Critical Generation Outage**: `/api/generate` returns 500 errors across all requests.
2. **Crash on Client Render**: Application throws unhandled React runtime errors on page load or document render.
3. **Severe Accessibility Regression**: Critical keyboard traps or broken focus states prevent assistive technology users from interacting with the app.
4. **Credential Exposure**: Any client bundle inspection indicates accidental leak of server environment variables.

---

## 2. Fast Rollback Procedure (Vercel Instant Rollback)

Vercel maintains immutable production deployment builds. A rollback takes **less than 10 seconds** and requires zero rebuild time.

### Method A: Via Vercel Web Dashboard (Recommended)
1. Navigate to the **Vercel Dashboard** → Select **NoteForge** project.
2. Click the **Deployments** tab.
3. Locate the last known-good deployment (marked with a green checkmark before the failure).
4. Click the three dots (`...`) on the right side of the deployment row.
5. Select **"Instant Rollback"** or **"Promote to Production"**.
6. Confirm the promotion. Traffic is immediately redirected to the prior build.

### Method B: Via Vercel CLI
If dashboard access is limited:
```bash
# List recent deployments
vercel list

# Promote previous deployment alias to production
vercel alias set <PREVIOUS_DEPLOYMENT_URL> noteforge.vercel.app
```

### Method C: Via Git Revert
If a code fix or rollback commit must be recorded in source control history:
```bash
# Revert the offending commit
git revert HEAD -m 1
git push origin main
```
Vercel's GitHub integration will automatically trigger a new clean production deployment.

---

## 3. Post-Rollback Verification Checklist

Within 5 minutes of executing a rollback:
- [ ] Ping `/api/health` and verify `200 OK`.
- [ ] Submit a test note in the input panel and confirm synthesis completes.
- [ ] Test the "Print / Save as PDF" button to ensure print stylesheet and rendering operate normally.
- [ ] Verify UptimeRobot alerts have cleared.
- [ ] Document the root cause and add an incident note in `DECISIONS.md`.
