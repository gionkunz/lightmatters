## ADDED Requirements

### Requirement: Emission position helper

The `@lm/physics` package SHALL export `sourcePositionAt(start, velocity, time)` returning `{ x: start.x + velocity.x·time, y: start.y + velocity.y·time }`.

#### Scenario: At rest
- **WHEN** velocity is `(0, 0)` and time is `T`
- **THEN** the result equals `start`

#### Scenario: Uniform motion
- **WHEN** start is `(0, 0)`, velocity is `(0.5, 0)`, time is `2`
- **THEN** the result is `(1, 0)`
