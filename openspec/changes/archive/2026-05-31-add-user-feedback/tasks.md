## 1. D1 schema and Cloudflare Pages Functions setup

- [x] 1.1 Add `functions/api/feedback.ts` at the **repo root** (Pages project root) with `onRequestPost` handler, validation, and D1 insert — auto-routed to `POST /api/feedback` via file-based routing
- [x] 1.2 Add `functions/tsconfig.json` and generate types with `npx wrangler types --path='./functions/types.d.ts'`
- [x] 1.3 Add SQL migration file (e.g. `db/feedback.sql`) with `feedback` table and indexes per design
- [x] 1.4 Add repo-root `wrangler.jsonc` with `pages_build_output_dir: "./dist/apps/lightmatters/browser"` and `d1_databases` binding for `FEEDBACK_DB` (or document dashboard-only binding if not opting into Wrangler-as-source-of-truth yet)
- [x] 1.5 Optionally add `_routes.json` to `apps/lightmatters/public/` to exclude hashed static assets from Function invocations
- [x] 1.6 Document D1 creation, migration (`wrangler d1 execute`), bindings (dashboard **Settings → Functions → Bindings**), and `wrangler pages dev` local workflow in `docs/architecture.md`

## 2. Feedback services (libs/design)

- [x] 2.1 Create `FeedbackContextService` with `setStepContext()` / `clearStepContext()` and a readonly context signal (chapter, step, checkpointIndex, eventIndex, elapsedMs)
- [x] 2.2 Create `FeedbackService` with `submit({ message, name?, category? })` that merges context + theme + route, POSTs to `/api/feedback`, and returns success/error
- [x] 2.3 Export both services from `libs/design/src/index.ts`

## 3. Feedback UI (libs/design)

- [x] 3.1 Create `LmFeedbackFabComponent`: fixed bottom-right FAB with `lmInteractive`, opens dialog on click
- [x] 3.2 Implement feedback dialog: message textarea (required), optional name input, category select (general / narrative / content / experience), submit + dismiss
- [x] 3.3 Wire loading, success thank-you, and error states; retain user input on failure
- [x] 3.4 Style dialog with theme tokens, EB Garamond body, IBM Plex Mono kickers; support light/dark
- [x] 3.5 Export `LmFeedbackFabComponent` from `libs/design/src/index.ts`

## 4. App shell integration

- [x] 4.1 Mount `<lm-feedback-fab />` in `AppComponent` alongside router outlet and viewport hint
- [x] 4.2 Verify FAB visibility and non-overlap with playback bar on a representative step route

## 5. Step playback context registration

- [x] 5.1 Add a small helper (e.g. `registerFeedbackStepContext(runner, chapter, step)`) in `@lm/design` or `@lm/engine` that updates `FeedbackContextService` when runner checkpoint/elapsed signals change
- [x] 5.2 Integrate context registration in one chapter step as the reference pattern (e.g. chapter 1 step 1)
- [x] 5.3 Roll out context registration to remaining step components (or document batch follow-up if deferred)

## 6. Tests and verification

- [x] 6.1 Add unit tests for `FeedbackService` (payload shape, client validation) and `FeedbackContextService` (set/clear)
- [x] 6.2 Add unit tests for the Pages Function handler (valid POST, missing message, method not allowed) using Miniflare or extracted pure validation helpers
- [x] 6.3 Manual verify: `nx build lightmatters --tui=false` then `wrangler pages dev dist/apps/lightmatters/browser` submits a row to D1; Git preview deploy POST succeeds
- [x] 6.4 Run `nx lint`, `nx test`, and `nx build lightmatters --tui=false`; confirm SSG build still passes

## 7. Documentation and AGENTS.md

- [x] 7.1 Update `docs/architecture.md`: first server endpoint, D1 binding, local dev workflow, privacy note
- [x] 7.2 Update `AGENTS.md` project state blurb to mention feedback feature and step context registration pattern
