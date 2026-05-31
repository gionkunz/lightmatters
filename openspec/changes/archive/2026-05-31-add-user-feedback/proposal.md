## Why

Light Matters is a guided learning experience, but we have no channel for readers to tell us when narration is confusing, content is wrong, or the experience breaks down. Capturing that signal — tied to the exact chapter, step, and timeline beat — makes fixes actionable instead of vague. A lightweight, always-available feedback affordance plus a tiny Cloudflare backend is the smallest path to close that loop without accounts or analytics infrastructure.

## What Changes

- Add a global **feedback FAB** (fixed bottom-right) on every route: visible and discoverable, styled to match the design system, unobtrusive at rest, with interactive glow on hover/focus.
- Add a **feedback dialog** with a required message field, optional name field (anonymous by default), and implicit capture of submission timestamp plus playback context when the user is on a step.
- Introduce a **`FeedbackContextService`** (root-provided) that step components update from the active `TimelineRunner` so submissions include chapter, step, checkpoint index, timeline event index, elapsed ms, and current route.
- Add a **Cloudflare Pages Function** at `POST /api/feedback` via file-based routing: a `functions/api/feedback.ts` file at the **Pages project root** (repo root per current Cloudflare settings — not inside the static build output).
- Add D1 schema, `wrangler.jsonc` bindings (or dashboard bindings), and deployment documentation. Pages CI auto-discovers the `/functions` directory on Git deploy; no manual route registration or `_worker.js` advanced mode.
- Wire the Angular client to POST feedback to the same origin (`/api/feedback`) so production and preview deploys work without CORS complexity.

## Capabilities

### New Capabilities

- `feedback-ui`: Global FAB, feedback dialog/form, client-side context capture, and submission UX (loading, success, error states).
- `feedback-api`: Cloudflare Pages Function endpoint, D1 persistence, request validation, and operational setup (schema, bindings, env).

### Modified Capabilities

- `app-shell`: Host the global feedback FAB alongside the router outlet on all routes.
- `cloudflare-pages-deployment`: Allow a minimal Pages Functions runtime for the feedback API (replacing the current pure-static-only constraint for this one endpoint).

## Impact

- **`libs/design/`**: New `FeedbackService`, `FeedbackContextService`, `LmFeedbackFabComponent`, and dialog markup/styles aligned with visual guidelines.
- **`libs/engine/`**: Optional thin helper or documented pattern for step components to register runner context with `FeedbackContextService` (no engine API changes required if steps call the service directly).
- **`apps/lightmatters/src/app/app.component.ts`**: Mount the feedback FAB globally.
- **`functions/api/feedback.ts`** (new, at repo root): Pages Function handler for `POST /api/feedback`, auto-routed by filename.
- **`wrangler.jsonc`** (new or extended, at repo root): D1 binding + `pages_build_output_dir` for local dev; optional source-of-truth once opted in via dashboard.
- **Cloudflare**: D1 database creation; binding via dashboard **Settings → Functions → Bindings** and/or `wrangler.jsonc`. Deploy via existing Git integration (Direct Upload does not support Functions).
- **`docs/architecture.md`**: Document the first server-side endpoint, D1 binding, and local testing workflow.
- **Dependencies**: None in the Angular app beyond `fetch`. Worker uses Cloudflare runtime types only.
- **Privacy**: No accounts; optional name is user-provided; no cookies or tracking IDs. Store only what the user submits plus technical context.
