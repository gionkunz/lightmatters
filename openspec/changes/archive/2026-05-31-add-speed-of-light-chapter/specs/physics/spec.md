## ADDED Requirements

### Requirement: Speed-of-light constant and tangible readouts

The `libs/physics` library SHALL expose a single speed-of-light constant `SPEED_OF_LIGHT_KMS` (≈299,792.458) and pure helpers `lightTravelTimeSeconds(distanceKm)` returning `distanceKm / c` and `earthLapsPerSecond()` returning `c / earthCircumferenceKm`. All tangible-`c` figures in the speed-of-light chapter SHALL derive from this constant rather than independent hard-coded numbers.

#### Scenario: Light travel time Earth to Moon

- **WHEN** `lightTravelTimeSeconds(384400)` is evaluated
- **THEN** the result is approximately 1.28 seconds

#### Scenario: Light travel time Sun to Earth

- **WHEN** `lightTravelTimeSeconds(149600000)` is evaluated
- **THEN** the result is approximately 499 seconds (≈8 minutes 19 seconds)

#### Scenario: Laps around the Earth each second

- **WHEN** `earthLapsPerSecond()` is evaluated
- **THEN** the result is approximately 7.5

### Requirement: Speed from a measured flight over a known distance

The `libs/physics` library SHALL export `speedFromFlight(distanceKm, seconds)` returning `distanceKm / seconds`, the relation behind the two-station flash-and-detect experiment.

#### Scenario: One-kilometre baseline returns c

- **WHEN** `speedFromFlight(1, 1 / SPEED_OF_LIGHT_KMS)` is evaluated
- **THEN** the result equals `SPEED_OF_LIGHT_KMS` (≈299,792 km/s)

### Requirement: Speed of light from Maxwell's electromagnetic constants

The `libs/physics` library SHALL export `cFromMaxwellConstants(epsilon0, mu0)` returning `1 / Math.sqrt(epsilon0 * mu0)` (in m/s for SI inputs), together with default SI constants for `ε₀` and `μ₀`, so narration and readouts share one source. The chapter SHALL use it to show the electromagnetic prediction equals the experimentally measured `c`.

#### Scenario: Maxwell constants yield c

- **WHEN** `cFromMaxwellConstants(8.8541878128e-12, 1.25663706212e-6)` is evaluated
- **THEN** the result is approximately 2.998e8 m/s (≈299,792 km/s after unit conversion)

#### Scenario: Default constants are exported and consistent

- **WHEN** `cFromMaxwellConstants` is evaluated with the library's default `ε₀` and `μ₀`
- **THEN** the result agrees with `SPEED_OF_LIGHT_KMS` to within rounding
