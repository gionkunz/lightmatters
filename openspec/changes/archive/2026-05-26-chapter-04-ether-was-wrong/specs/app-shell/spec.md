## ADDED Requirements

### Requirement: Chapter 4 routes

The application SHALL register `/ch/04/step/1` through `/ch/04/step/5` lazy-loading `@lm/feature-chapter-04-ether-was-wrong`. The inline Chapter 4 placeholder SHALL be removed.

#### Scenario: Routes resolve
- **WHEN** navigating to `/ch/04/step/1`
- **THEN** the Chapter 4 Step 1 component loads

### Requirement: Chapter 5 placeholder

A placeholder route at `/ch/05/step/1` SHALL exist for Chapter 4 Step 5 forward navigation.

#### Scenario: Outro forward nav
- **WHEN** advancing from Chapter 4 Step 5
- **THEN** `/ch/05/step/1` resolves without error
