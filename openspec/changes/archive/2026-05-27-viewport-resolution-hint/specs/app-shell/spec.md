## ADDED Requirements

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
