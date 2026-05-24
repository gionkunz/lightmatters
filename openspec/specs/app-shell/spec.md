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

