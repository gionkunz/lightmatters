## ADDED Requirements

### Requirement: Relativistic energy helpers

`@lm/physics` SHALL provide pure functions for relativistic energy, building on `lorentz`: `restEnergy(mass)` = `m·c²`, `totalEnergy(mass, vOverC)` = `γ(v/c)·m·c²`, and `kineticEnergy(mass, vOverC)` = `(γ(v/c) − 1)·m·c²`. The unit convention for `c` SHALL be documented (natural units `c = 1` for diagram math; an SI constant available for human-scale readouts). At `vOverC = 0`, total energy SHALL equal rest energy and kinetic energy SHALL be 0.

#### Scenario: Total energy equals rest energy at rest

- **WHEN** `totalEnergy(m, 0)` is evaluated
- **THEN** it equals `restEnergy(m)`
- **AND** `kineticEnergy(m, 0)` equals 0

#### Scenario: Energy grows with speed

- **WHEN** `totalEnergy(m, 0.6)` is evaluated
- **THEN** it equals `restEnergy(m) · 1.25` within tolerance (γ = 1.25)
- **AND** `kineticEnergy(m, 0.6)` equals `restEnergy(m) · 0.25` within tolerance

### Requirement: Momentum and mass–energy helpers

`@lm/physics` SHALL provide `relativisticMomentum(mass, vOverC)` = `γ·m·v`, `photonMomentum(energy)` = `E/c`, and `massEnergyEquivalent(energy)` = `E/c²` (the mass carried by, or lost as, radiation of energy `E`). These SHALL be pure and consistent with the energy helpers' unit convention.

#### Scenario: Photon momentum from energy

- **WHEN** `photonMomentum(E)` is evaluated
- **THEN** it returns `E/c` in the documented units

#### Scenario: Mass lost equals energy over c squared

- **WHEN** a body emits radiation of energy `E`
- **AND** `massEnergyEquivalent(E)` is evaluated
- **THEN** it returns `E/c²`, the decrease in the body's rest mass

#### Scenario: Relativistic momentum vanishes at rest and grows with speed

- **WHEN** `relativisticMomentum(m, 0)` is evaluated
- **THEN** it returns 0
- **AND** `relativisticMomentum(m, 0.6)` is strictly greater than the classical `m·v` at the same speed
