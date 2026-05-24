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
