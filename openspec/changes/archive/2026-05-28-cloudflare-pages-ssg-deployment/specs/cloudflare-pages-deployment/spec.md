## ADDED Requirements

### Requirement: Cloudflare Pages project bound to GitHub repository

The production deployment SHALL be a Cloudflare Pages project connected to this repository via Cloudflare's native GitHub integration. Pushes to the production branch SHALL trigger production deploys; pull requests SHALL trigger preview deploys with unique URLs. No GitHub Actions workflow SHALL be required to perform the deploy.

#### Scenario: Push to main deploys to production

- **WHEN** a commit is pushed to the production branch
- **THEN** Cloudflare Pages builds the project and, on success, promotes the output to the production URL

#### Scenario: Pull request gets a preview deploy

- **WHEN** a pull request is opened or updated
- **THEN** Cloudflare Pages builds the PR and produces a unique preview URL linked to the PR

### Requirement: Build configuration reproducible from the repository

The Cloudflare Pages build SHALL be reproducible from files in the repository. The dashboard-side configuration SHALL be limited to: the build command, the build output directory, the root directory, the Node version, the GitHub connection, and the custom domain binding. All other build behavior SHALL be defined by repository files (`project.json`, `package.json`, `_headers`, `_redirects`, `.nvmrc`).

#### Scenario: Build command and output directory

- **WHEN** the Cloudflare Pages project is configured
- **THEN** its build command is `npx nx build lightmatters --tui=false` (optionally preceded by lint/test) and its build output directory is `dist/apps/lightmatters/browser`

#### Scenario: Node version pinned in the repo

- **WHEN** Cloudflare's build container starts
- **THEN** it reads the Node version from a repository file (`.nvmrc` or equivalent) or from the project's `NODE_VERSION` env var configured to match the same value documented in `docs/architecture.md`

### Requirement: Static asset cache headers

The deployed site SHALL serve hashed bundle assets and the `mathjax/` directory with a long-lived immutable cache directive, and SHALL serve HTML responses with a conservative cache directive so deploys propagate promptly. Cache rules SHALL be declared in `apps/lightmatters/public/_headers` so they are version-controlled.

#### Scenario: Hashed assets are immutable-cached

- **WHEN** the browser requests a file matching the Angular hashed-output pattern (e.g. `*.[hash].js`, `*.[hash].css`, hashed fonts)
- **THEN** the response includes `Cache-Control: public, max-age=31536000, immutable`

#### Scenario: MathJax bundle is long-lived cached

- **WHEN** the browser requests any file under `/mathjax/`
- **THEN** the response includes a long-lived `Cache-Control` directive

#### Scenario: HTML is not aggressively cached

- **WHEN** the browser requests a prerendered `*.html` page
- **THEN** the response does NOT use `immutable` and uses a short or no-cache directive so a new deploy is visible on next navigation

### Requirement: SPA fallback and edge redirects

The deployment SHALL declare URL handling rules in `apps/lightmatters/public/_redirects` such that (a) navigations to any path not matching a prerendered file are served the SPA shell so the Angular router can attempt to handle them, and (b) the chapter-9 placeholder URL `/ch/09` redirects to `/ch/09/step/1` at the edge.

#### Scenario: Unknown path falls back to SPA shell

- **WHEN** a browser requests a path that does not correspond to a prerendered HTML file or static asset
- **THEN** Cloudflare serves the SPA shell HTML so the client router can render or 404 internally

#### Scenario: Chapter 9 root redirects at the edge

- **WHEN** a browser requests `/ch/09`
- **THEN** Cloudflare responds with a redirect to `/ch/09/step/1` before the Angular bundle loads

### Requirement: Custom domain `lightmatters.app`

The production deployment SHALL be reachable at `https://lightmatters.app` over TLS provided by Cloudflare.

#### Scenario: Production URL serves the app over HTTPS

- **WHEN** a user navigates to `https://lightmatters.app/`
- **THEN** the response is the prerendered landing-page HTML served over a valid TLS connection

### Requirement: No server runtime on the deployment

The Cloudflare Pages project SHALL be a pure static-asset deployment. No `_worker.js`, Pages Function, Worker binding, or other server-side runtime SHALL be deployed as part of this capability.

#### Scenario: Deploy artifact contains only static files

- **WHEN** the deploy artifact is inspected
- **THEN** it contains only HTML, JS, CSS, fonts, images, `_headers`, and `_redirects` — no `_worker.js`, no `functions/` directory, no `wrangler.toml` consumed by Pages

### Requirement: Deployment documented in architecture doc

`docs/architecture.md` SHALL describe the deployment pipeline (Cloudflare Pages, GitHub integration, build command, output directory, Node version, cache strategy, SPA fallback). Engineers SHALL be able to recreate the Pages project from documentation alone.

#### Scenario: A new engineer can recreate the Pages project

- **WHEN** a new engineer reads `docs/architecture.md`
- **THEN** they have the information needed to configure a new Cloudflare Pages project equivalent to the production one
