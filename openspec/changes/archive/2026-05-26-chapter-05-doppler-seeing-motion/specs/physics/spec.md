## ADDED Requirements

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
