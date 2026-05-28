## Why

Light Matters needs a production deployment target. The architecture has locked in **Cloudflare Pages** at `lightmatters.app` (per `docs/architecture.md`), but no deployment configuration, prerendering setup, or CI wiring exists yet. Choosing Cloudflare's native build system with a GitHub integration keeps deploys reproducible without owning CI infrastructure, and pre-rendering every route at build time (SSG) gives users instant first paint on chapter steps — important for a learning experience whose value is in the visuals, not in waiting for an Angular bundle to bootstrap.

## What Changes

- Enable Angular **prerendering / SSG** for the `lightmatters` app via `@angular/build:application` (`outputMode: "static"` with `prerender` enabled). The full set of static routes — landing, design-sheet, and every `/ch/:c/step/:s` URL currently registered in `app.routes.ts` — is emitted as HTML at build time.
- Add a route discovery mechanism so the prerenderer knows the full list of chapter/step URLs without us hand-maintaining a routes file (a `routes.txt` generator, or `getPrerenderParams` on the step route).
- Configure **Cloudflare Pages** to build directly from the GitHub repo: build command, output directory (`dist/apps/lightmatters/browser`), Node version, and any required env vars.
- Add Cloudflare Pages static-hosting config files: `_headers` (cache headers for hashed assets and `mathjax/`), `_redirects` (SPA fallback to `index.html` for any unprerendered path, plus `ch/09` placeholder routing).
- Update `AGENTS.md` / `docs/architecture.md` to document the deploy pipeline and SSG decision.
- **No** Cloudflare Worker / Functions runtime: pure static hosting. The "Pages worker" referenced in the request is the static asset server Pages provides; we are not adding server-side code.

## Capabilities

### New Capabilities
- `static-site-generation`: Build-time prerendering of every known route in the Angular app so first paint is HTML, not an empty bootstrap shell.
- `cloudflare-pages-deployment`: Production hosting on Cloudflare Pages via the native GitHub integration, including build config, cache headers, SPA fallback, and the `lightmatters.app` custom domain.

### Modified Capabilities
<!-- None. SSG is a new build-time concern; existing specs (timeline-engine, narrator, step-chrome, primitives, chapter steps) describe runtime behavior and don't change. The workspace-structure spec is informational about the monorepo layout; deployment doesn't change layout. -->

## Impact

- **`apps/lightmatters/project.json`**: build target gains `outputMode`, `prerender`, and likely a `server` entry point or `getPrerenderParams` plumbing; output path layout shifts to `dist/apps/lightmatters/browser` (Angular's SSG convention).
- **`apps/lightmatters/src/`**: a minimal `main.server.ts` (or `app.config.server.ts`) is added so Angular can render routes in Node during the build. App code stays client-first; we are not introducing runtime SSR.
- **Route files**: each chapter's `routes.ts` may need a `getPrerenderParams` on dynamic `:step` segments so the build enumerates all steps. Alternatively, a generated `prerender-routes.txt` listed in `project.json`.
- **New files**: `apps/lightmatters/public/_headers`, `apps/lightmatters/public/_redirects` (copied verbatim to the deploy output by the existing `assets` glob).
- **Cloudflare Pages project**: must be created in the Cloudflare dashboard and bound to the GitHub repo; build command, output dir, Node version, and the `lightmatters.app` domain configured there. Settings captured in `docs/architecture.md`.
- **Dependencies**: `@angular/ssr` and `@angular/platform-server` are already in `package.json`; no new dependencies expected. `express` (currently listed) can be removed if we confirm it's unused after switching to static output.
- **CI / GitHub**: no new GitHub Actions required — Cloudflare's build runner handles it. PR previews come for free via Cloudflare's preview deployments.
- **`postinstall` script**: `nx run lightmatters:copy-mathjax` must still run inside Cloudflare's build container; verify Nx + the MathJax copy work there.
