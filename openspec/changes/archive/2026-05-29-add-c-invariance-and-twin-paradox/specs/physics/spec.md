## ADDED Requirements

### Requirement: Proper time along a worldline

`@lm/physics` SHALL provide a pure function that accumulates proper time along a worldline given as a sequence of constant-velocity segments, each with a coordinate-time duration `Δt` and a speed `v/c`: `Σ Δt · √(1 − v²/c²)`, reusing `properTimeFraction`. A purely time-like (v=0) worldline SHALL return the total coordinate time; any segment with motion SHALL reduce the accumulated proper time.

#### Scenario: Straight (at-rest) worldline returns full coordinate time

- **WHEN** the worldline is a single segment with `v/c = 0` and duration `T`
- **THEN** the accumulated proper time equals `T`

#### Scenario: Out-and-back worldline ages less than the straight twin

- **WHEN** the traveller worldline has two equal segments at `v/c = 0.6` (out and back) over the same total coordinate time `T` as a stay-at-home at `v/c = 0`
- **THEN** the traveller's accumulated proper time equals `T · 0.8` within tolerance
- **AND** it is strictly less than the stay-at-home's `T`

### Requirement: Twin readout formatting

`@lm/physics` SHALL provide formatting for twin-paradox readouts (each twin's elapsed proper time and the age difference on reunion), consistent with the existing readout helpers' rounding conventions.

#### Scenario: Readout reports age difference

- **WHEN** twin proper times are computed for a given journey
- **THEN** the formatted readout reports each twin's elapsed time and their difference
- **AND** rounding follows the existing physics readout conventions
