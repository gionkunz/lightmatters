## MODIFIED Requirements

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
