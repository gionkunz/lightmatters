## ADDED Requirements

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
