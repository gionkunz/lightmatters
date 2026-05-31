## MODIFIED Requirements

### Requirement: No server runtime on the deployment

The Cloudflare Pages project SHALL remain a static-asset deployment for all user-facing pages and hashed bundles. A **minimal** Pages Functions runtime is permitted **only** for the feedback collection API at `POST /api/feedback` as defined in the `feedback-api` capability, implemented via the auto-discovered repo-root `/functions` directory (file-based routing). No Advanced-mode `_worker.js` wrapping the entire site and no other server-side routes beyond `/api/feedback` and its D1 binding.

#### Scenario: Static assets served from build output

- **WHEN** the deploy artifact in `dist/apps/lightmatters/browser` is inspected
- **THEN** it contains HTML, JS, CSS, fonts, images, `_headers`, and `_redirects` as before
- **AND** does not contain a `functions/` directory or `_worker.js`

#### Scenario: Functions discovered from repo root on Git deploy

- **WHEN** Cloudflare Pages builds from the connected Git repository (root directory = repo root)
- **THEN** it discovers `functions/api/feedback.ts` at the Pages project root and bundles it as a Pages Function for `/api/feedback`
- **AND** does not require a `_worker.js` in the static build output

#### Scenario: Static pages served without Function invocation

- **WHEN** a browser requests a prerendered chapter step HTML file or a hashed JS/CSS asset
- **THEN** the response is served as a static asset
- **AND** the feedback Function is not invoked (via auto-generated or committed `_routes.json` exclusions)

## ADDED Requirements

### Requirement: Pages project binds D1 for feedback

The Cloudflare Pages project configuration SHALL include a D1 database binding (documented name: `FEEDBACK_DB`) available to the `/api/feedback` Pages Function in production and preview environments, configured via the dashboard (**Settings → Functions → Bindings**) and/or repo-root `wrangler.jsonc`.

#### Scenario: D1 binding documented for engineers

- **WHEN** an engineer reads `docs/architecture.md`
- **THEN** they find the D1 binding name, database identifier workflow, migration commands, and the rule that `functions/` lives at the Pages project root (repo root), not in the build output

#### Scenario: Preview deploys can reach D1

- **WHEN** a pull request preview deployment is built via Git integration
- **THEN** the `/api/feedback` function can access the configured D1 binding or fails gracefully with HTTP 503 if unconfigured
