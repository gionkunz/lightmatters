# app-shell Specification

## Purpose

Angular application shell: bootstrap, routing, lazy-loaded features, theme initialization, and module-boundary enforcement.
## Requirements
### Requirement: App shell bootstraps theme on startup

The application SHALL initialize `ThemeService` during bootstrap (via `APP_INITIALIZER` or equivalent) so the document root theme attribute is applied before the landing page first renders.

#### Scenario: Theme class applied at bootstrap

- **WHEN** the Angular application bootstraps
- **THEN** `ThemeService` initializes from `localStorage` (or defaults to light)
- **AND** the `<html>` element reflects the active theme

### Requirement: App routes lazy-load the landing feature

`app.routes.ts` SHALL define a default route that lazy-loads `landingRoutes` from `@lm/feature-landing` and a wildcard redirect to `/`.

#### Scenario: Landing chunk is lazy-loaded

- **WHEN** an operator builds the app for production
- **THEN** the landing feature produces a separate lazy chunk distinct from the main bundle

### Requirement: Index HTML loads brand fonts and meta

`index.html` SHALL include link tags for EB Garamond and IBM Plex Mono (Google Fonts or equivalent) and a `<title>` of "Light Matters" with a meta description suitable for the marketing landing page.

#### Scenario: Fonts load before first contentful paint

- **WHEN** the app loads in a browser
- **THEN** font link tags for EB Garamond and IBM Plex Mono are present in the document head

#### Scenario: Page title is set

- **WHEN** a user opens the app
- **THEN** the browser tab title reads "Light Matters"

### Requirement: Feature scope tag is enforced

The landing feature library SHALL be tagged `scope:feature`. ESLint `@nx/enforce-module-boundaries` SHALL allow `scope:feature` to depend on `scope:design`, `scope:engine`, `scope:primitives`, and `scope:physics`, and SHALL forbid `scope:feature` from depending on other `scope:feature` projects.

#### Scenario: Landing may import design components

- **WHEN** a file in `libs/features/landing` imports from `@lm/design`
- **AND** an operator runs `nx lint feature-landing --tui=false`
- **THEN** the lint command passes

#### Scenario: Feature cannot import another feature

- **WHEN** a file in `libs/features/landing` imports from another feature library
- **AND** an operator runs `nx lint feature-landing --tui=false`
- **THEN** the lint command fails with a module-boundaries violation

### Requirement: App routes lazy-load chapter features per chapter-routing

`app.routes.ts` SHALL register lazy-loaded chapter feature routes per the `chapter-routing` capability (canonical `/chapter/:n` paths and v1.0 numbering). Each authored chapter feature library SHALL produce a separate lazy chunk distinct from the landing bundle and from other chapter bundles.

#### Scenario: Chapter chunks are lazy-loaded

- **WHEN** an operator builds the app for production
- **THEN** each registered chapter feature produces its own lazy chunk

#### Scenario: Navigating to a chapter does not reload the shell

- **WHEN** a user navigates from `/` to `/chapter/1/step/1`
- **THEN** the app shell (wordmark, theme toggle, router outlet) persists without a full page reload

### Requirement: Primitive scope tag is enforced

The spacetime-diagram primitive library SHALL be tagged `scope:primitive`. ESLint `@nx/enforce-module-boundaries` SHALL allow `scope:primitive` to depend on `scope:engine`, `scope:design`, and `scope:physics`.

#### Scenario: Primitive may import engine types

- **WHEN** a file in `libs/primitives/spacetime-diagram` imports from `@lm/engine`
- **AND** an operator runs `nx lint spacetime-diagram --tui=false`
- **THEN** the lint command passes

### Requirement: App loads with scaled typography and controls

The application shell SHALL expose `--lm-type-scale: 1.5` and derived text/control size tokens. Narrator text, kickers, buttons, sliders, playback transport, and step chrome SHALL use those tokens so readable text and interactive targets match roughly 150% browser zoom. Diagram canvas pixel dimensions and WebGL render targets SHALL NOT be globally scaled via CSS `zoom` or viewport scale.

#### Scenario: Step text and controls appear larger at 100% browser zoom

- **WHEN** a reader opens any step route at 100% browser zoom (e.g. `/chapter/1/step/1`)
- **THEN** narrator text, playback controls, sliders, and footer buttons render larger than the pre-change baseline
- **AND** WebGL diagrams render without CSS-zoom pixelation

#### Scenario: Landing page chrome uses the same type scale

- **WHEN** a reader opens `/`
- **THEN** landing page typography and interactive elements use the same scaled tokens as step routes

### Requirement: App shell hosts global viewport resolution hint

The root application shell SHALL render the viewport resolution hint component from `@lm/design` alongside the router outlet so the hint is available on the landing page, all chapter routes, and placeholder routes without per-feature registration.

#### Scenario: Hint available on landing route

- **WHEN** a user opens `/` with an undersized viewport
- **THEN** the resolution hint may appear according to `viewport-resolution-hint` rules
- **AND** the landing route does not register the hint separately

#### Scenario: Hint available on step route

- **WHEN** a user opens a step route (e.g. `/chapter/1/step/1`) with an undersized viewport
- **THEN** the resolution hint may appear according to `viewport-resolution-hint` rules
- **AND** the step feature does not register the hint separately

#### Scenario: Shell structure includes hint and outlet

- **WHEN** the Angular application bootstraps
- **THEN** `AppComponent` renders both the router outlet and the viewport resolution hint host

### Requirement: App shell hosts global feedback FAB

The root application shell SHALL render the feedback FAB component from `@lm/design` alongside the router outlet and viewport resolution hint so feedback is available on every route without per-feature registration.

#### Scenario: FAB mounted at bootstrap

- **WHEN** the Angular application bootstraps
- **THEN** `AppComponent` renders the feedback FAB in addition to the router outlet and viewport hint

#### Scenario: FAB persists across client navigations

- **WHEN** a user navigates from `/` to `/chapter/1/step/1` via the Angular router
- **THEN** the feedback FAB remains mounted without a full page reload

#### Scenario: Shell structure includes feedback host

- **WHEN** the Angular application bootstraps
- **THEN** `AppComponent` renders the router outlet, viewport resolution hint, and feedback FAB host

