## ADDED Requirements

### Requirement: Chapter 5 routes

The application SHALL register `/ch/05/step/1` through `/ch/05/step/5` lazy-loading `@lm/feature-chapter-05-doppler-seeing-motion`. The inline Chapter 5 placeholder SHALL be removed.

#### Scenario: Routes resolve

- **WHEN** navigating to `/ch/05/step/1`
- **THEN** the Chapter 5 Step 1 component loads

### Requirement: Chapter 6 placeholder route

The shell SHALL provide at least a placeholder route at `/ch/06/step/1` so that Chapter 5 Step 5 forward navigation does not 404.

#### Scenario: Outro forward navigation succeeds

- **WHEN** advancing from Chapter 5 Step 5
- **THEN** the router resolves `/ch/06/step/1` without error

## REMOVED Requirements

### Requirement: Chapter 5 placeholder

**Reason:** Chapter 5 is fully authored; placeholder route replaced by lazy-loaded feature.

**Migration:** Remove inline `Chapter05PlaceholderComponent`; use `@lm/feature-chapter-05-doppler-seeing-motion` at `ch/05`.
