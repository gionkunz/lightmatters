## ADDED Requirements

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
