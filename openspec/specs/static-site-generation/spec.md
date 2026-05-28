# static-site-generation Specification

## Purpose
TBD - created by archiving change cloudflare-pages-ssg-deployment. Update Purpose after archive.
## Requirements
### Requirement: Build-time prerendering of all declared routes

The `lightmatters` app build SHALL emit a prerendered HTML file for every route declared in the application's route tables, including the root route, every static chapter step path, and any other navigable route added in the future. The output SHALL be produced by `@angular/build:application` with `outputMode: "static"` and an enabled `prerender` configuration.

#### Scenario: Landing route is prerendered

- **WHEN** the app is built with `nx build lightmatters --tui=false`
- **THEN** `dist/apps/lightmatters/browser/index.html` exists and its `<body>` contains rendered landing-page markup (not an empty `<app-root></app-root>`)

#### Scenario: Every registered chapter step has its own HTML file

- **WHEN** the app is built
- **THEN** for each `/chapter/:chapter/step/:step` route registered in the app's chapter route tables, a corresponding `dist/apps/lightmatters/browser/chapter/<chapter>/step/<step>/index.html` file exists with rendered step markup

#### Scenario: Adding a new step automatically prerenders it

- **WHEN** a new step is added to a chapter's route table and the app is rebuilt
- **THEN** a new prerendered HTML file appears at the new step's URL without any change to a hand-maintained route list

### Requirement: Client hydration of prerendered DOM

The application SHALL hydrate the prerendered DOM in place rather than destroying and re-rendering it. The browser bootstrap SHALL include `provideClientHydration()` (or its successor API) so that interactive components attach to existing prerendered markup.

#### Scenario: No flash of empty content on a prerendered route

- **WHEN** a user requests a prerendered route in a browser
- **THEN** the visible content from the HTML response remains in the DOM during and after Angular bootstrap (no destroy-and-recreate flash)

### Requirement: Dynamic step routes enumerate their parameter values

Any route that uses a dynamic segment intended to be prerendered (notably the `:step` segment in each chapter) SHALL declare a `getPrerenderParams` (or equivalent Angular prerender API) function that returns the full list of valid values at build time.

#### Scenario: Chapter step route declares all its steps

- **WHEN** a chapter feature library defines a route with a `:step` segment
- **THEN** the route configuration includes a `getPrerenderParams` returning an array of objects, one per step the chapter currently has

#### Scenario: Build fails fast on missing enumeration

- **WHEN** a chapter route uses a `:step` segment without a `getPrerenderParams`
- **THEN** the prerender build either fails or the route is intentionally excluded from prerendering (documented as such in code); silent CSR fallback for an in-scope route is not acceptable

### Requirement: Prerender-safe component initialization

Components and primitives reachable by prerendered routes SHALL NOT access browser-only globals (`window`, `document`, `WebGLRenderingContext`, `IntersectionObserver`, etc.) at module evaluation time or inside constructors that run during server rendering. Browser-only work SHALL be deferred to `afterNextRender`, `afterRender`, an `isPlatformBrowser` guard, or an equivalent lifecycle hook.

#### Scenario: Prerender build does not throw on a route with WebGL primitives

- **WHEN** the build prerenders a chapter step whose template includes a WebGL primitive (e.g. `lm-curved-surface`, `lm-light-scene`)
- **THEN** the build completes successfully and emits HTML for that route

### Requirement: SSG output is committed as the deployable artifact

The build output directory `dist/apps/lightmatters/browser/` SHALL be the single artifact directory consumed by the deployment system. No additional build step (post-processing, copying, framework adapter) SHALL be required between the Angular build and asset upload.

#### Scenario: Output directory is self-contained

- **WHEN** the contents of `dist/apps/lightmatters/browser/` are uploaded to any static host
- **THEN** the site loads correctly without further build steps

