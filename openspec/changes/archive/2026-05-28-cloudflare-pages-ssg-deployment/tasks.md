## 1. Audit prerender safety in existing code

- [x] 1.1 Grep the workspace for module-evaluation-time access to `window`, `document`, `navigator`, `WebGLRenderingContext`, `IntersectionObserver`, `ResizeObserver`, `matchMedia`, and `localStorage` in code reachable from any chapter route or the landing page
- [x] 1.2 For each offender, either guard with `isPlatformBrowser` / `afterNextRender` or move the access into a lifecycle hook; do NOT change observable visual behavior
- [x] 1.3 Verify `libs/primitives/curved-surface`, `libs/primitives/light-scene`, `libs/primitives/spacetime-diagram`, and `libs/design/ThemeService` construct no browser-only objects until after the platform-browser guard
- [x] 1.4 Run `nx run-many -t lint test -p design engine physics curved-surface light-scene spacetime-diagram --tui=false` to confirm no regressions

## 2. Wire Angular SSR build-time prerendering

- [x] 2.1 Add `apps/lightmatters/src/main.server.ts` bootstrapping the app for server rendering
- [x] 2.2 Add `apps/lightmatters/src/app/app.config.server.ts` merging `appConfig` with `provideServerRendering()`
- [x] 2.3 Add `provideClientHydration()` to `apps/lightmatters/src/app/app.config.ts`
- [x] 2.4 Update `apps/lightmatters/project.json` build target: set `outputMode: "static"`, add `server: "apps/lightmatters/src/main.server.ts"`, add a `prerender` configuration (discoverRoutes true), update `outputPath` semantics if needed
- [x] 2.5 Update `apps/lightmatters/tsconfig.app.json` (and add a `tsconfig.server.json` if Angular's schematic requires it) so the server entry compiles
- [x] 2.6 Run `nx build lightmatters --tui=false` and verify `dist/apps/lightmatters/browser/index.html` is non-empty and contains rendered landing markup

## 3. Enumerate dynamic step routes for prerendering

- [x] 3.1 In each `libs/features/chapter-NN-*/.../routes.ts`, add `getPrerenderParams` to the `:step` route returning the chapter's full step list
- [x] 3.2 Centralize each chapter's step list as a single exported constant (e.g. `CHAPTER_01_STEPS = [1,2,3,4] as const`) and use it from both `getPrerenderParams` and any internal navigation code so there is one source of truth per chapter
- [x] 3.3 Decide handling for `/ch/09/step/:step` placeholder: either declare its prerender params (`[1]`) or document why it is intentionally CSR
- [x] 3.4 Re-run `nx build lightmatters --tui=false` and confirm `dist/apps/lightmatters/browser/ch/<c>/step/<s>/index.html` exists for every step of every implemented chapter
- [x] 3.5 Spot-check a few prerendered files: open them and confirm meaningful step content (not just an empty `<app-root>`) is in the HTML

## 4. Static-hosting config files

- [x] 4.1 Create `apps/lightmatters/public/_headers` with: long-lived immutable cache for hashed assets (`/*.js`, `/*.css`, `/*.woff2` with hash-prefix rules), long-lived cache for `/mathjax/*`, conservative cache for HTML (`/*.html` and `/`)
- [x] 4.2 Create `apps/lightmatters/public/_redirects` with: edge redirect `/ch/09 /ch/09/step/1 301`, SPA fallback `/* /index.html 200` as the final rule
- [x] 4.3 Remove the `path: 'ch/09'` and `path: '**'` redirect entries from `apps/lightmatters/src/app/app.routes.ts` only if `_redirects` cleanly covers them; otherwise leave both as defense-in-depth
- [x] 4.4 Build and confirm `_headers` and `_redirects` are copied to `dist/apps/lightmatters/browser/`

## 5. Pin Node version and verify build hygiene

- [x] 5.1 Add `.nvmrc` at the repo root pinning the Node version the team uses locally (>= Angular 21's minimum)
- [x] 5.2 Confirm `package.json` `engines` field (if any) is consistent with `.nvmrc`
- [x] 5.3 Confirm `postinstall` MathJax copy still produces `apps/lightmatters/public/mathjax/` from a clean `node_modules`
- [x] 5.4 Audit `package.json` for unused server dependencies (notably `express`) and remove if SSG output no longer needs them

## 6. Optional generated artifacts

- [x] 6.1 Generate a `robots.txt` listing the site root as crawlable and pointing at the sitemap
- [x] 6.2 Generate a `sitemap.xml` from the same chapter/step enumeration used by `getPrerenderParams` (script run as part of the build, output into the static dir)
- [x] 6.3 Verify both files appear in `dist/apps/lightmatters/browser/`

## 7. Create the Cloudflare Pages project

- [ ] 7.1 In the Cloudflare dashboard, create a new Pages project and connect it to this GitHub repository
- [ ] 7.2 Set production branch to `main` (or current production branch)
- [ ] 7.3 Set build command to `npm ci && npx nx run-many -t lint test -p lightmatters --tui=false && npx nx build lightmatters --tui=false` (decide final scope of pre-deploy checks; document the chosen command in `docs/architecture.md`)
- [ ] 7.4 Set build output directory to `dist/apps/lightmatters/browser`
- [ ] 7.5 Set root directory to the repo root (default)
- [ ] 7.6 Set `NODE_VERSION` env var to match `.nvmrc`
- [ ] 7.7 Trigger a preview deploy from a PR branch and verify the preview URL serves prerendered HTML

## 8. Bind production domain

- [ ] 8.1 Add `lightmatters.app` (and `www.lightmatters.app` if applicable) as a custom domain on the Pages project
- [ ] 8.2 Update DNS to point at the Pages project (CNAME / orange-clouded A record per Cloudflare's instructions)
- [ ] 8.3 Verify `https://lightmatters.app/` serves the production deploy with a valid TLS certificate

## 9. Documentation

- [x] 9.1 Update `docs/architecture.md` "Hosting and deployment" section: Cloudflare Pages via GitHub, build command, output dir, Node version, cache strategy, `_headers` / `_redirects` policy
- [x] 9.2 Add a short "Prerender safety" rule to `docs/architecture.md` (no browser-only access at module load; use `isPlatformBrowser` / `afterNextRender`) so future chapter authors don't break the build
- [x] 9.3 Update `AGENTS.md` "Project state" sentence to note that the app is deployed to Cloudflare Pages with SSG
- [x] 9.4 If a `README.md` covers deploy, point it at the architecture doc rather than duplicating

## 10. Verification

- [ ] 10.1 Visit production landing page and verify `view-source:` shows rendered content above the fold (not an empty shell)
- [ ] 10.2 Visit a chapter step URL directly (not via SPA navigation) and verify the same
- [ ] 10.3 Verify a deep-linked prerendered route responds with HTTP 200 and HTML, and that hashed JS/CSS assets respond with `Cache-Control: ... immutable`
- [ ] 10.4 Verify `/ch/09` returns a 301 redirect to `/ch/09/step/1` at the edge (response headers, not a client-side redirect)
- [ ] 10.5 Verify an obviously-unknown path (e.g. `/totally-not-real`) serves the SPA shell so the router can handle it
- [ ] 10.6 Run a Lighthouse / WebPageTest pass and confirm first contentful paint is HTML-driven, not waiting on the JS bundle
