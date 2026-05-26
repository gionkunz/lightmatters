## ADDED Requirements

### Requirement: 2-D pulse reception helpers

The `@lm/physics` package SHALL provide pure-function helpers for computing pulse reception times in a 2-D Euclidean scene with `c = 1` (or configurable `c`).

#### Scenario: Stationary observer reception time
- **WHEN** `pulseReachesStationary` is called with source `S` and stationary observer `O`
- **THEN** it returns `|O − S| / c`

#### Scenario: Moving observer reception solved as smallest positive root
- **WHEN** `pulseReachesMoving` is called with source `S`, observer start `O₀`, observer velocity `v`, and `|v| < c`
- **THEN** it returns the smallest positive `t` solving `|O₀ + v·t − S| = c·t`

#### Scenario: Moving observer faster than light returns null
- **WHEN** `pulseReachesMoving` is called with `|v| ≥ c`
- **THEN** the function returns `null`

#### Scenario: Pulse never catches up returns null
- **WHEN** the moving observer's trajectory never satisfies the reception equation for any positive `t`
- **THEN** the function returns `null`

### Requirement: Light-circle radius helper

The package SHALL provide a `lightCircleRadius(emitTime, currentTime, c?)` helper returning `max(0, c · (currentTime − emitTime))` for use by `lm-light-scene` rendering.

#### Scenario: Pulse not yet emitted
- **WHEN** `currentTime < emitTime`
- **THEN** the helper returns `0`

#### Scenario: Pulse expanding
- **WHEN** `currentTime ≥ emitTime`
- **THEN** the helper returns `c · (currentTime − emitTime)` (with default `c = 1`)
