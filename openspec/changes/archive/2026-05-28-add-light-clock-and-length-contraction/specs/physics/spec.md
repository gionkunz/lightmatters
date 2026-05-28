## ADDED Requirements

### Requirement: Length-contraction helper

`@lm/physics` SHALL provide a pure function `lengthContraction(properLength, vOverC)` returning the contracted length `properLength · √(1 − v²/c²)` for physical `v/c ∈ [0, 1)`, consistent with the existing `properTimeFraction`. It SHALL return `properLength` at `vOverC = 0` and approach 0 as `vOverC → 1`.

#### Scenario: Contraction matches Lorentz at sample speeds

- **WHEN** `lengthContraction(L0, 0)` is evaluated
- **THEN** it returns `L0`

#### Scenario: Contraction shrinks with speed

- **WHEN** `lengthContraction(L0, 0.6)` is evaluated
- **THEN** it returns `L0 · 0.8` within numerical tolerance
- **AND** the result is strictly less than `L0` for any `vOverC > 0`

### Requirement: Light-clock tick-period helper

`@lm/physics` SHALL provide a pure function for the dilated tick period of a moving light clock, `tickPeriod(restPeriod, vOverC) = restPeriod · γ(vOverC)`, using the existing `lorentz`. It SHALL equal `restPeriod` at `vOverC = 0` and grow without bound as `vOverC → 1`.

#### Scenario: Tick period equals rest period at rest

- **WHEN** `tickPeriod(T0, 0)` is evaluated
- **THEN** it returns `T0`

#### Scenario: Tick period dilates with speed

- **WHEN** `tickPeriod(T0, 0.6)` is evaluated
- **THEN** it returns `T0 / 0.8` within numerical tolerance (γ = 1.25)
- **AND** the result increases monotonically with `vOverC`
