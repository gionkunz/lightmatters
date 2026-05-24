## ADDED Requirements

### Requirement: App routes lazy-load chapter 2 feature

`app.routes.ts` SHALL define a route at `/ch/02` that lazy-loads `chapter02Routes` from `@lm/feature-chapter-02-speed-budget`.

#### Scenario: Chapter 2 chunk is lazy-loaded

- **WHEN** an operator builds the app for production
- **THEN** the chapter 2 feature produces a separate lazy chunk distinct from the chapter 1 and landing bundles

#### Scenario: Navigating to chapter 2 does not reload the shell

- **WHEN** a user navigates from `/` to `/ch/02/step/1`
- **THEN** the app shell (wordmark, theme toggle, router outlet) persists without a full page reload
