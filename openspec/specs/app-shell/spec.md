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

### Requirement: App routes lazy-load chapter 1 feature

`app.routes.ts` SHALL define a route at `/ch/01` that lazy-loads `chapter01Routes` from `@lm/feature-chapter-01-position-time`.

#### Scenario: Chapter 1 chunk is lazy-loaded

- **WHEN** an operator builds the app for production
- **THEN** the chapter 1 feature produces a separate lazy chunk distinct from the landing bundle

#### Scenario: Navigating to chapter 1 does not reload the shell

- **WHEN** a user navigates from `/` to `/ch/01/step/1`
- **THEN** the app shell (wordmark, theme toggle, router outlet) persists without a full page reload

### Requirement: App routes lazy-load chapter 2 feature

`app.routes.ts` SHALL define a route at `/ch/02` that lazy-loads `chapter02Routes` from `@lm/feature-chapter-02-speed-budget`.

#### Scenario: Chapter 2 chunk is lazy-loaded

- **WHEN** an operator builds the app for production
- **THEN** the chapter 2 feature produces a separate lazy chunk distinct from the chapter 1 and landing bundles

#### Scenario: Navigating to chapter 2 does not reload the shell

- **WHEN** a user navigates from `/` to `/ch/02/step/1`
- **THEN** the app shell (wordmark, theme toggle, router outlet) persists without a full page reload

### Requirement: Primitive scope tag is enforced

The spacetime-diagram primitive library SHALL be tagged `scope:primitive`. ESLint `@nx/enforce-module-boundaries` SHALL allow `scope:primitive` to depend on `scope:engine`, `scope:design`, and `scope:physics`.

#### Scenario: Primitive may import engine types

- **WHEN** a file in `libs/primitives/spacetime-diagram` imports from `@lm/engine`
- **AND** an operator runs `nx lint spacetime-diagram --tui=false`
- **THEN** the lint command passes

### Requirement: Chapter 3 routes resolve to real components

The application shell SHALL register routes `/ch/03/step/1` through `/ch/03/step/5` resolving to the corresponding step components from `@lm/feature-chapter-03-light-information`. The previous placeholder route SHALL be removed or replaced.

#### Scenario: Routes resolve to real components
- **WHEN** the reader navigates to any of `/ch/03/step/{1..5}`
- **THEN** the router loads the matching step component (not a placeholder)

### Requirement: Chapter 4 placeholder route exists

The shell SHALL provide at least a placeholder route at `/ch/04/step/1` so that Chapter 3 Step 5's "next" navigation does not 404.

#### Scenario: Outro forward navigation succeeds
- **WHEN** the reader advances from Chapter 3 Step 5
- **THEN** the router resolves `/ch/04/step/1` without error
- **AND** the response is at least a placeholder component

### Requirement: Chapter 4 routes

The application SHALL register `/ch/04/step/1` through `/ch/04/step/5` lazy-loading `@lm/feature-chapter-04-ether-was-wrong`. The inline Chapter 4 placeholder SHALL be removed.

#### Scenario: Routes resolve
- **WHEN** navigating to `/ch/04/step/1`
- **THEN** the Chapter 4 Step 1 component loads

### Requirement: Chapter 5 routes

The application SHALL register `/ch/05/step/1` through `/ch/05/step/5` lazy-loading `@lm/feature-chapter-05-doppler-seeing-motion`. The inline Chapter 5 placeholder SHALL be removed.

#### Scenario: Routes resolve

- **WHEN** navigating to `/ch/05/step/1`
- **THEN** the Chapter 5 Step 1 component loads

### Requirement: Chapter 6 placeholder route

The shell SHALL lazy-load `@lm/feature-chapter-06-rolling-diagram` at `/ch/06/step/:step` and resolve steps 1 through 5 to real step components. The inline `Chapter06PlaceholderComponent` SHALL be removed.

#### Scenario: Chapter 6 step routes resolve

- **WHEN** the reader navigates to `/ch/06/step/1` through `/ch/06/step/5`
- **THEN** the router loads the Chapter 6 feature chunk and renders the matching step component without error

#### Scenario: Outro forward navigation from Chapter 5 succeeds

- **WHEN** advancing from Chapter 5 Step 5
- **THEN** the router resolves `/ch/06/step/1` to Chapter 6 Step 1

#### Scenario: Chapter 6 index redirect

- **WHEN** the reader navigates to `/ch/06`
- **THEN** the router redirects to `/ch/06/step/1`

### Requirement: App loads with scaled typography and controls

The application shell SHALL expose `--lm-type-scale: 1.5` and derived text/control size tokens. Narrator text, kickers, buttons, sliders, playback transport, and step chrome SHALL use those tokens so readable text and interactive targets match roughly 150% browser zoom. Diagram canvas pixel dimensions and WebGL render targets SHALL NOT be globally scaled via CSS `zoom` or viewport scale.

#### Scenario: Step text and controls appear larger at 100% browser zoom

- **WHEN** a reader opens any step route at 100% browser zoom (e.g. `/ch/01/step/1`)
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

- **WHEN** a user opens a step route (e.g. `/ch/01/step/1`) with an undersized viewport
- **THEN** the resolution hint may appear according to `viewport-resolution-hint` rules
- **AND** the step feature does not register the hint separately

#### Scenario: Shell structure includes hint and outlet

- **WHEN** the Angular application bootstraps
- **THEN** `AppComponent` renders both the router outlet and the viewport resolution hint host

