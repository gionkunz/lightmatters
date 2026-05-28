## Context

Light Matters is an Angular 21 Nx monorepo whose only deployment decision so far is "Cloudflare Pages at lightmatters.app" (recorded in `docs/architecture.md`). The app today builds via `@angular/build:application` into `dist/apps/lightmatters/` as a pure client bundle bootstrapping from a near-empty `index.html`. No SSR or prerender step runs. The dependency list already includes `@angular/ssr` and `@angular/platform-server`, but neither is wired in.

The app surface is small and almost entirely static at the URL level:
- `/` (landing)
- `/ch/:chapter/step/:step` for chapters 1–8 (currently 4+3+5+5+5+4+6+7 = 39 step URLs, all enumerable at build time)
- `/ch/09/*` placeholder
- `/design-sheet` (per architecture doc, to be added)

There is **no per-user data, no backend, no auth, no server-rendered content that depends on a request**. Every page can be generated as flat HTML at build time. The runtime interactivity (timeline engine, WebGL primitives) hydrates from the prerendered shell.

Cloudflare Pages offers a first-class GitHub integration: connect repo → set build command + output dir → every push to `main` deploys to production, every PR gets a preview URL. We do not need GitHub Actions, Wrangler, or `_worker.js` for this use case.

## Goals / Non-Goals

**Goals:**
- Every known URL ships as a prerendered HTML file. First paint is fast and meaningful even before Angular bootstraps.
- Build, deploy, and preview URLs are driven by Cloudflare's GitHub integration — `git push` is the deploy command.
- Configuration lives in the repo (`project.json`, `_headers`, `_redirects`, `docs/architecture.md`); only the GitHub connection and domain binding live in the Cloudflare dashboard.
- The prerender route list updates automatically as chapters/steps are added — no manual list to drift.
- Long-lived cache headers on hashed assets and on the `mathjax/` bundle.
- SPA fallback for any URL not prerendered (defensive — should be empty in practice).

**Non-Goals:**
- **No runtime SSR.** We are not shipping a Node/Workers server that renders on demand.
- **No Cloudflare Functions / `_worker.js` / Pages Functions.** Static assets only.
- **No Wrangler config** for this change. Pages-via-GitHub does not require it; if a future change adds Workers, that change owns introducing Wrangler.
- **No GitHub Actions workflow** for deploys. Cloudflare runs the build.
- **No `prefers-reduced-motion` or hydration-skipping cleverness.** Per locked-in decisions, motion is the pedagogy.
- **No staging environment** beyond Cloudflare's automatic PR previews.

## Decisions

### 1. Angular `outputMode: "static"` with build-time prerender

Use `@angular/build:application` with `outputMode: "static"` and a `prerender` config. This is Angular 21's first-class SSG path. It produces `dist/apps/lightmatters/browser/` containing `index.html` per route plus the client bundle.

**Alternatives considered:**
- *Pure CSR (status quo) + Cloudflare static hosting.* Cheapest to ship, but every chapter step costs the user a JS-parse-then-bootstrap before they see anything — bad for the very thing the product is selling (visual immediacy).
- *Runtime SSR on Cloudflare Workers.* Overkill: there is nothing request-dependent to render. Adds a cold-start tax and a runtime to babysit.
- *Hybrid `outputMode: "server"` with prerendered routes.* Same overkill plus a `_worker.js` we don't need.

### 2. Route discovery via `getPrerenderParams` on the `:step` route

Each chapter's feature lib already owns its routes. Add `getPrerenderParams` (Angular 21 SSR API) to the `:step` route definition so it enumerates the steps the chapter currently has. The top-level `app.routes.ts` lists static chapter paths; Angular's prerenderer follows them.

**Alternatives considered:**
- *A static `prerender-routes.txt` checked into the repo.* Two sources of truth — guaranteed to drift.
- *Crawling via the prerenderer's `discoverRoutes` option.* Works for declared static routes but cannot fan out a `:step` param without help; we end up writing the same enumeration anyway.

Each chapter exporting an explicit `STEP_COUNT` (or a `chapterNNSteps` array) gives `getPrerenderParams` a single typed source.

### 3. Cloudflare Pages output dir = `dist/apps/lightmatters/browser`

Angular's static mode writes prerendered HTML under `browser/`. The Cloudflare project's "Build output directory" must point there, not at the parent. Build command: `npx nx build lightmatters --tui=false`. Root dir: repo root (Nx must see the whole workspace).

### 4. Static-hosting config via `_headers` and `_redirects`

Place both files in `apps/lightmatters/public/`. The existing `assets` glob already copies everything from `public/` to the deploy output, so Cloudflare picks them up.

- `_headers`: `Cache-Control: public, max-age=31536000, immutable` for `/*.<hash>.{js,css,woff2,...}` and for `/mathjax/*`. Conservative cache for HTML.
- `_redirects`: SPA fallback `/* /index.html 200` *only* as a last-resort net (most paths are prerendered files and serve directly). Plus the existing `ch/09 → ch/09/step/1` redirect (currently an Angular wildcard); moving it to the edge means it works even before the Angular bundle loads.

**Alternatives considered:**
- *`_worker.js` with custom routing.* Re-introduces a runtime; loses the benefit of static hosting.

### 5. Node version pinned via `.nvmrc` (or Cloudflare project env)

Cloudflare's build image follows `NODE_VERSION` env var or a `.nvmrc`. Pin to the version the team uses locally (Angular 21 needs Node ≥ 20.19 / 22.12). Prefer `.nvmrc` because it's also useful for contributors.

### 6. MathJax keeps its copy step

`postinstall` already runs `nx run lightmatters:copy-mathjax`. Cloudflare's build container runs `npm install` (or detected pkg manager), which triggers `postinstall`, which populates `apps/lightmatters/public/mathjax/`. Verify in a preview build before relying on it; fall back to making `copy-mathjax` an explicit `dependsOn` of `build` if `postinstall` is skipped.

### 7. `provideClientHydration` is in-scope; full hydration tuning is not

To get the most out of SSG, the client should hydrate the prerendered DOM in place rather than blowing it away. Add `provideClientHydration()` (and `provideServerRendering()` for the server build) to the app config. Components that draw to canvas/WebGL after bootstrap don't conflict with this — they mount into already-correct DOM.

## Risks / Trade-offs

- **Risk:** `getPrerenderParams` runs in a Node context; chapter route files currently import primitives that touch `window`/`document` at module-evaluation time → build-time crash.
  → Mitigation: keep route files import-light (route table + lazy `loadComponent`). Components that touch the DOM are only evaluated when the route is actually rendered, and Angular's SSG renderer provides a DOM shim. If a primitive does eager browser access, gate it behind `afterNextRender` or `isPlatformBrowser`.

- **Risk:** WebGL / Three.js primitives may throw during prerender.
  → Mitigation: lm-curved-surface and lm-light-scene already create their renderers inside lifecycle hooks. Verify each primitive guards `WebGLRenderer` construction behind `isPlatformBrowser` or `afterNextRender`. Add a "primitives must not touch the DOM at module load" line to the architecture doc.

- **Risk:** Build time grows roughly linearly with route count. 40-ish routes is fine; if we ever generate per-parameter URLs, watch this.
  → Mitigation: not a near-term issue; monitor in Cloudflare's build logs.

- **Trade-off:** Per-step state resets on entry (already a locked-in decision). SSG is consistent with this — every prerendered HTML is the "from-defaults" view of its step.

- **Risk:** `_redirects` SPA fallback returning `200` masks real 404s during development of new routes.
  → Mitigation: keep the fallback narrow (only `/*` last in the file, after specific rules) and rely on prerendered files for known paths; a missing file means we forgot to enumerate it. Consider `/* /index.html 404` instead so unknown paths get a 404 status even though they render the SPA — better for crawlers.

- **Risk:** Cloudflare build container missing tools used by `copy-mathjax` (the script uses `rm -rf` and `cp -r`).
  → Mitigation: both are POSIX, present in CF's Linux build image. If we ever hit a Windows-style runner, port to a Node script.

- **Trade-off:** No GitHub Actions means we lose a central place for unit-test gates pre-deploy. CF Pages can run a test step in the build command (`nx affected -t test lint build`), but a failing test kills the deploy.
  → Decision: yes, run lint + unit tests as part of the CF build command, so deploys are gated.

## Migration Plan

1. Wire SSG locally first: add `main.server.ts`, `app.config.server.ts`, switch `project.json` build to `outputMode: "static"` with `prerender`, verify `dist/apps/lightmatters/browser/index.html` and per-step HTML are non-empty.
2. Add `getPrerenderParams` to each chapter's `:step` route.
3. Add `_headers` and `_redirects` to `apps/lightmatters/public/`.
4. Open a PR. Cloudflare Pages project doesn't exist yet → first do a one-time manual `npx nx build lightmatters` and a `wrangler pages deploy` smoke test, OR (preferred) just create the Pages project pointed at the PR's branch and inspect the preview deploy.
5. In the Cloudflare dashboard: create Pages project → connect GitHub repo → set build command, output dir, root dir, `NODE_VERSION` → connect `lightmatters.app` domain.
6. Merge → production deploy goes live.

**Rollback:** Cloudflare Pages keeps deploy history; rollback is a one-click "Promote previous deployment." Code-side rollback is a `git revert` of the change.

## Open Questions

- Do we want unit tests gating production deploys (yes per above), or only lint? If full `nx affected -t test lint build`, build time grows; if just `build`, deploys are faster but a broken test can ship.
- Should `/design-sheet` be added in this change or deferred? Per architecture doc it's the "visual-regression canary" — but `landing-page` spec already covers `/`, and design-sheet isn't yet implemented. **Tentative decision:** out of scope here; SSG will pick it up automatically once its route is added.
- Do we need a `robots.txt` and `sitemap.xml`? Useful for discoverability now that pages are crawlable. Tentative: add both, generated from the same enumeration as the prerender list. Could fold into this change or a follow-up. **Tentative:** include in this change since the data is right there.
