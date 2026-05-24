## ADDED Requirements

### Requirement: App routes lazy-load chapter 1 feature

`app.routes.ts` SHALL define a route at `/ch/01` that lazy-loads `chapter01Routes` from `@lm/feature-chapter-01-position-time`.

#### Scenario: Chapter 1 chunk is lazy-loaded

- **WHEN** an operator builds the app for production
- **THEN** the chapter 1 feature produces a separate lazy chunk distinct from the landing bundle

#### Scenario: Navigating to chapter 1 does not reload the shell

- **WHEN** a user navigates from `/` to `/ch/01/step/1`
- **THEN** the app shell (wordmark, theme toggle, router outlet) persists without a full page reload

### Requirement: Primitive scope tag is enforced

The spacetime-diagram primitive library SHALL be tagged `scope:primitive`. ESLint `@nx/enforce-module-boundaries` SHALL allow `scope:primitive` to depend on `scope:engine`, `scope:design`, and `scope:physics`.

#### Scenario: Primitive may import engine types

- **WHEN** a file in `libs/primitives/spacetime-diagram` imports from `@lm/engine`
- **AND** an operator runs `nx lint spacetime-diagram --tui=false`
- **THEN** the lint command passes
