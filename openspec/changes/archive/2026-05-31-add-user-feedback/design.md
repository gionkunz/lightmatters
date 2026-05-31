## Context

Light Matters is a static Angular app on Cloudflare Pages (`lightmatters.app`). The architecture doc currently states "no backend" and the `cloudflare-pages-deployment` spec forbids any server runtime. Chapter steps are timeline-driven: each step component owns a `TimelineRunner` with signals for `activeCheckpointIndex`, `checkpoints` (each with `eventIndex`), `elapsedMs`, and narration text. Route context is `/chapter/:chapter/step/:step`. The app shell (`AppComponent`) already hosts global chrome (viewport hint); step chrome lives in `LmStepFrameComponent`.

The founder wants readers to report narrative confusion, content errors, or experience issues anonymously, with optional name, timestamp, and precise playback location (chapter, step, beat).

Constraints from the product: EB Garamond + IBM Plex Mono only, interactive elements glow via `lmInteractive`, two themes, no sans-serif, engine-first design, Nx module boundaries (`scope:design` for UI services).

## Goals / Non-Goals

**Goals:**

- A global feedback FAB visible on landing and all step routes; opens a small dialog to submit feedback in under ~30 seconds.
- Capture structured context automatically on step routes: chapter, step, checkpoint index, timeline event index, elapsed ms, route URL, client timestamp, theme.
- Persist submissions in queryable storage via a Cloudflare Pages Function on the same origin.
- Anonymous by default; optional name field only.
- Graceful degradation: if the API is unreachable, show an error and do not lose the user's typed message.

**Non-Goals:**

- No user accounts, login, or saved draft history.
- No admin dashboard or in-app review UI (query D1 directly or via Cloudflare dashboard for now).
- No rate-limiting UI (basic server-side validation only in v1; can add KV-based rate limits later).
- No feedback on non-step routes beyond route URL and timestamp (landing, design-sheet).
- No email/Slack notifications on new feedback (future enhancement).
- No modification to timeline engine event types.

## Decisions

### 1. D1 over KV for storage

**Choice:** Cloudflare **D1** (SQLite).

**Rationale:** Feedback is structured tabular data we will want to filter (`WHERE chapter = 3 AND step = 1 ORDER BY created_at DESC`). D1 gives SQL queries, typed columns, and straightforward export. KV would require append-only keys or a single growing JSON blob — awkward to query and risky at scale.

**Alternative considered:** KV with one key per UUID — workable for write-heavy append but poor for browsing/filtering without a separate index.

### 2. Pages Functions via auto-discovered `/functions` directory (file-based routing)

**Choice:** Cloudflare **Pages Functions** at `POST /api/feedback`, implemented as `functions/api/feedback.ts` at the **Pages project root**.

Per [Cloudflare Pages Functions get started](https://developers.cloudflare.com/pages/functions/get-started/):
- Create a `/functions` directory at the root of the Pages project — **not** inside the static build output (e.g. not under `dist/`).
- Files in `/functions` are **automatically discovered** on Git deploy; their paths map to URL routes via [file-based routing](https://developers.cloudflare.com/pages/functions/routing/).
- `functions/api/feedback.ts` with an `onRequestPost` export serves `POST /api/feedback`.
- We do **not** use Advanced mode (`_worker.js` in the build output), which would ignore the entire `/functions` directory.

**Light Matters layout:** Cloudflare Pages is configured with **root directory = repo root** and **build output = `dist/apps/lightmatters/browser`** (`docs/architecture.md`). Therefore:
```
lightmatters/                  ← Pages project root
  functions/
    api/
      feedback.ts              ← POST /api/feedback
  dist/apps/lightmatters/browser/   ← static SSG output only
```

**Rationale:** Same-origin requests avoid CORS; Git-integrated deploys pick up Functions automatically; matches the user's intent without a separate Worker project. Angular calls `fetch('/api/feedback', …)`.

**Alternative considered:** Standalone Cloudflare Worker on a subdomain — more moving parts (CORS, separate deploy, DNS). **Rejected:** Advanced mode `_worker.js` — would bypass file-based routing and is unnecessary for one endpoint.

### 3. UI in `libs/design`, context service alongside

**Choice:** `FeedbackService` (submit), `FeedbackContextService` (writable context signal), `LmFeedbackFabComponent` + dialog in `@lm/design`. Mount `<lm-feedback-fab />` in `AppComponent`.

**Rationale:** Mirrors `ThemeService` / `AudioService` / `LmViewportResolutionHintComponent` — global UX chrome belongs in design; app shell hosts it once.

**Alternative considered:** Engine-owned FAB inside `LmStepFrameComponent` — would miss landing page and duplicate per step frame.

### 4. Step context via opt-in registration, not engine coupling

**Choice:** Step components call `FeedbackContextService.setStepContext({…})` in `ngOnInit` and update on checkpoint changes (effect or runner signal subscription). Clear context in `ngOnDestroy`.

**Rationale:** Avoids importing design into engine or adding timeline-runner hooks. ~40 step components can adopt a one-liner pattern; a shared helper/directive can reduce boilerplate in a follow-up.

**Beat definition:** Store both `checkpointIndex` (`activeCheckpointIndex`) and `eventIndex` (from `checkpoints[checkpointIndex].eventIndex`) plus `elapsedMs`. This pinpoints the narrate/animate beat on the progress bar.

### 5. FAB placement and visual treatment

**Choice:** Fixed **bottom-right** FAB (`position: fixed; bottom: 1.5rem; right: 1.5rem; z-index` above content, below modals). Circular button with a speech-bubble or "?" mono kicker label. Uses `lmInteractive` for glow. Resting opacity ~0.55, full opacity on hover/focus. Dialog is a centered sheet on desktop, bottom sheet on narrow viewports.

**Rationale:** Bottom-right is standard for help/feedback, avoids collision with top-right theme/audio toggles, and stays out of the playback bar's center transport row.

### 6. D1 schema (v1)

```sql
CREATE TABLE feedback (
  id TEXT PRIMARY KEY,           -- crypto.randomUUID()
  created_at TEXT NOT NULL,      -- ISO 8601 UTC (server-set)
  message TEXT NOT NULL,
  name TEXT,                     -- nullable
  category TEXT NOT NULL DEFAULT 'general',
  route TEXT NOT NULL,
  chapter INTEGER,               -- nullable
  step INTEGER,                  -- nullable
  checkpoint_index INTEGER,      -- nullable
  event_index INTEGER,           -- nullable
  elapsed_ms INTEGER,            -- nullable
  theme TEXT,                    -- 'light' | 'dark'
  user_agent TEXT                -- from request header
);
CREATE INDEX idx_feedback_created ON feedback(created_at DESC);
CREATE INDEX idx_feedback_chapter_step ON feedback(chapter, step);
```

Server validates: `message` required, 1–2000 chars; `name` optional, max 100 chars; numeric fields bounded.

### 7. Wrangler config, D1 bindings, and local development

**Choice:** Repo-root `wrangler.jsonc` with `pages_build_output_dir: "./dist/apps/lightmatters/browser"` and a `d1_databases` entry binding `FEEDBACK_DB`. Bindings can also be configured in the Cloudflare dashboard (**Settings → Functions → Bindings**); once a Wrangler file includes `pages_build_output_dir`, it becomes the deployment source of truth — use `wrangler pages download config <PROJECT_NAME>` to sync from the dashboard rather than hand-authoring production IDs.

Local dev after a build:
```bash
npx nx build lightmatters --tui=false
npx wrangler pages dev dist/apps/lightmatters/browser --d1 FEEDBACK_DB=<database_id>
```
Wrangler discovers `./functions/` relative to the project directory (repo root). TypeScript types via `npx wrangler types --path='./functions/types.d.ts'` and a `functions/tsconfig.json` per [Pages Functions TypeScript docs](https://developers.cloudflare.com/pages/functions/typescript/).

D1 schema applied with `wrangler d1 execute FEEDBACK_DB --file=db/feedback.sql --remote`.

**`_routes.json`:** Pages CI auto-generates one when a `functions/` directory is detected. Optionally commit a `_routes.json` in the static build output (via `apps/lightmatters/public/`) to **exclude** hashed assets from Function invocations and keep static requests free — see [Functions invocation routes](https://developers.cloudflare.com/pages/functions/routing/#create-a-routesjson-file).

**Deploy constraint:** Functions require Git integration or `wrangler pages deploy`; Direct Upload from the dashboard does not support Functions.

**Alternative considered:** Mock service in dev — rejected; `wrangler pages dev` is close enough to production.

### 8. Security basics (v1)

- POST only; reject other methods with 405.
- `Content-Type: application/json` required.
- Trim and length-limit all string fields.
- No HTML stored (plain text only).
- No PII beyond optional user-provided name.
- Return generic errors to client; log details server-side.

## Risks / Trade-offs

- **[Risk] Spam / abuse** → Mitigation: length limits; optional future rate limit via CF WAF or KV counter per IP.
- **[Risk] D1 binding misconfigured on preview deploys** → Mitigation: document binding for preview + production; function returns 503 with clear client message if DB unavailable.
- **[Risk] Step components forget to register context** → Mitigation: tasks include updating a shared step base pattern or documenting in AGENTS.md; landing/non-step routes still capture route + time.
- **[Risk] Breaks pure-static deployment spec** → Mitigation: delta spec scopes server runtime to `/api/feedback` only; static assets unchanged.
- **[Trade-off] No admin UI** → Accept for v1; founder queries D1 via dashboard/CLI.

## Migration Plan

1. Create D1 database in Cloudflare dashboard; run schema migration.
2. Add repo-root `functions/api/feedback.ts`; push to a preview branch — Pages CI auto-discovers Functions on Git deploy. Verify `POST /api/feedback` on the preview URL.
3. Bind D1 to the Pages project (dashboard and/or `wrangler.jsonc`); confirm V2 build system if using Wrangler file for production config.
4. Ship Angular UI; FAB appears on next deploy.
5. Rollback: remove FAB from app shell (client-only rollback) or disable function route via `_redirects` if needed; D1 data retained.

## Open Questions

- Should we add a category dropdown (narrative / content / bug / other) in v1? **Proposal: yes, optional select with default "general"** — low cost, helps triage. (Include in spec.)
- Preview deploy D1: shared database or separate? **Default: one production D1; preview uses same binding** (acceptable for low-volume internal feedback during QA).
