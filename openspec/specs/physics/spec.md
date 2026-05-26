# physics Specification

## Purpose

Pure physics functions for Light Matters: Lorentz factor, proper time, spatial speed, and speed-budget readouts shared by diagrams and narration.
## Requirements
### Requirement: Lorentz factor and proper time fraction

The `libs/physics` library SHALL export pure functions `lorentz(vOverC)` returning $\gamma = 1/\sqrt{1 - v^2/c^2}$ and `properTimeFraction(vOverC)` returning $\sqrt{1 - v^2/c^2}$ (proper time per unit coordinate time for uniform motion), for $vOverC \in [0, 1)$.

#### Scenario: Lorentz factor at half light speed

- **WHEN** `lorentz(0.5)` is evaluated
- **THEN** the result is approximately 1.155

#### Scenario: Proper time fraction at half light speed

- **WHEN** `properTimeFraction(0.5)` is evaluated
- **THEN** the result is approximately 0.866 ($\sqrt{3}/2$)

### Requirement: Spatial speed from physical vOverC

The `libs/physics` library SHALL export `spatialSpeedKms(vOverC)` returning $vOverC \times c$ in km/s.

#### Scenario: Half light speed in km/s

- **WHEN** `spatialSpeedKms(0.5)` is evaluated
- **THEN** the result equals $0.5 \times c$ in km/s (approximately 149,896 km/s)

### Requirement: Speed budget readouts use Lorentz helpers

Functions `speedBudgetComponents`, `arcSpatialSpeedKms`, and `speedBudgetTipLabel` SHALL treat their velocity argument as physical $v/c$ and derive time and space readouts from `properTimeFraction` and `spatialSpeedKms` — not from linear arc-angle mapping ($\theta = v \cdot 90°$).

#### Scenario: One coordinate year at half light speed

- **WHEN** `speedBudgetComponents(0.5, 1)` is evaluated
- **THEN** `timeYears` is approximately 0.866
- **AND** `spaceKm` equals $0.5 \times$ one light-year in km

#### Scenario: Equal split at forty-five degrees on arc

- **WHEN** `speedBudgetComponents` is evaluated at $vOverC = \sin(45°) \approx 0.707$
- **THEN** `timeYears` is approximately 0.707
- **AND** `spatialSpeedKms(vOverC)` is approximately 212,000 km/s

### Requirement: Wavefront radius milestones for timeline authoring

The physics library SHALL export `wavefrontRadiusAtObserver(layout, observer)` returning the diagram-space ring radius when an omnidirectional pulse from B first reaches the given observer ('a' or 'c'), using the same layout constants as Step 3.

#### Scenario: Milestone radius at A is less than at C for default layout

- **WHEN** `wavefrontRadiusAtObserver` is called for the Step 3 default layout with A left of B and C right of B at $v/c = 0.5$
- **THEN** the radius at A is positive and less than the radius at C

#### Scenario: Timeline animate targets use milestone radii

- **WHEN** a step timeline animates `wavefront.radius` from 0 to `wavefrontRadiusAtObserver(layout, 'a')`
- **THEN** the animation ends with the ring visually arriving at A's worldline

#### Scenario: Reception time helpers remain available

- **WHEN** `receptionTimeStationary`, `receptionTimeMoving`, and `properTimeAtReception` are called for the Step 3 layout
- **THEN** returned values are consistent with the milestone radii (same underlying geometry)

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

### Requirement: Emission position helper

The `@lm/physics` package SHALL export `sourcePositionAt(start, velocity, time)` returning `{ x: start.x + velocity.x·time, y: start.y + velocity.y·time }`.

#### Scenario: At rest
- **WHEN** velocity is `(0, 0)` and time is `T`
- **THEN** the result equals `start`

#### Scenario: Uniform motion
- **WHEN** start is `(0, 0)`, velocity is `(0.5, 0)`, time is `2`
- **THEN** the result is `(1, 0)`

### Requirement: Periodic pulse train helpers

The `@lm/physics` package SHALL export `buildPeriodicEmissions(count, interval, startTime?, idPrefix?)` returning an array of `{ id, atTime }` emission events spaced by `interval` scene-time units.

#### Scenario: Emission schedule

- **WHEN** `buildPeriodicEmissions(3, 0.5)` is called with default start time
- **THEN** three emissions are returned at times `0`, `0.5`, and `1.0`

### Requirement: Pulse arrival scene times

The `@lm/physics` package SHALL export `pulseArrivalSceneTime(...)` and `pulseArrivalSceneTimes(...)` computing when each pulse from a source reaches a stationary observer, using emission-position origins and speed $c$.

#### Scenario: Stationary source arrivals

- **WHEN** a stationary source emits periodic pulses toward a fixed observer
- **THEN** `pulseArrivalSceneTimes` returns ordered arrival times matching light-travel delay plus emission schedule

### Requirement: Mean pulse interval

The `@lm/physics` package SHALL export `meanPulseInterval(arrivals)` returning the mean Δt between consecutive arrival times, or `null` when fewer than two arrivals exist.

#### Scenario: Redshift widens mean interval

- **WHEN** the same pulse train is emitted by a source receding at $0.5\,c$ versus at rest
- **THEN** `meanPulseInterval` for the receding case exceeds the stationary baseline

#### Scenario: Blueshift compresses mean interval

- **WHEN** the same pulse train is emitted by a source approaching at $0.5\,c$ versus at rest
- **THEN** `meanPulseInterval` for the approaching case is less than the stationary baseline

