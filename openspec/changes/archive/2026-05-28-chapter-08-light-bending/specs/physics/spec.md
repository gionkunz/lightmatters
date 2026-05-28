## ADDED Requirements

### Requirement: Deep well params preset

The `libs/physics` library SHALL export `DEEP_WELL_PARAMS` as a `WellParams` preset with a narrower center and steeper approach than `DEFAULT_WELL_PARAMS`, tuned so light deflection is visually obvious on the well surface.

#### Scenario: Deep well is narrower at center than Earth preset

- **WHEN** `wellRadiusAt(0, 1, DEEP_WELL_PARAMS)` and `wellRadiusAt(0, 1, DEFAULT_WELL_PARAMS)` are evaluated
- **THEN** the deep-well center radius is less than the Earth preset center radius

#### Scenario: Deep well shares outer rim scale

- **WHEN** `wellRadiusAt(-1, 1, DEEP_WELL_PARAMS)` is evaluated
- **THEN** the result equals the configured outer radius `R_outer` for the deep preset

### Requirement: Light geodesic sampling on well surface

The library SHALL export `lightGeodesicPoint(missDistance, edge, progress, wellMorph, params)` returning `{ x, y, z }` on the well surface, where `missDistance ∈ [0, 1]` controls skim distance from the mass, `edge` is `'center' | 'inner' | 'outer'`, and `progress ∈ [0, 1]` parametrises the ray from source to detector. It SHALL export `lightGeodesicSamples(missDistance, edge, segmentCount, wellMorph, params)` returning a polyline array of surface points.

#### Scenario: Single ray exits opposite side

- **WHEN** `lightGeodesicPoint(missDistance, 'center', 0, 1, DEEP_WELL_PARAMS)` and `lightGeodesicPoint(missDistance, 'center', 1, 1, DEEP_WELL_PARAMS)` are evaluated
- **THEN** the start point is on the left outer region (negative normalized x)
- **AND** the end point is on the right outer region (positive normalized x)

#### Scenario: Inner edge passes closer to mass than outer

- **WHEN** `lightGeodesicPoint(missDistance, 'inner', 0.5, 1, DEEP_WELL_PARAMS)` and `lightGeodesicPoint(missDistance, 'outer', 0.5, 1, DEEP_WELL_PARAMS)` are evaluated at the same progress
- **THEN** the inner edge's |x| at the point of closest approach is less than the outer edge's

#### Scenario: Samples form a continuous polyline

- **WHEN** `lightGeodesicSamples(0.3, 'center', 32, 1, DEEP_WELL_PARAMS)` is evaluated
- **THEN** the returned array has length 32
- **AND** consecutive samples are spatially adjacent (no large discontinuities)

### Requirement: Light geodesic arc length helper

The library SHALL export `lightGeodesicArcLength(missDistance, edge, wellMorph, params)` returning a pedagogical spatial arc-length scalar along the geodesic polyline.

#### Scenario: Outer edge arc longer than inner

- **WHEN** `lightGeodesicArcLength(missDistance, 'outer', 1, DEEP_WELL_PARAMS)` and `lightGeodesicArcLength(missDistance, 'inner', 1, DEEP_WELL_PARAMS)` are evaluated at the same `missDistance`
- **THEN** the outer arc length is greater than the inner arc length

### Requirement: Gravitational time dilation factor helper

The library SHALL export `gravitationalTimeDilationFactor(xNorm, wellMorph, params)` returning a factor in `(0, 1]` where deeper positions (smaller |x| near center, smaller well radius) yield lower values (slower clocks).

#### Scenario: Center slower than outer rim

- **WHEN** `gravitationalTimeDilationFactor(0, 1, DEEP_WELL_PARAMS)` and `gravitationalTimeDilationFactor(-1, 1, DEEP_WELL_PARAMS)` are evaluated
- **THEN** the center factor is less than the outer-rim factor

#### Scenario: Factor bounded at unity at outer rim

- **WHEN** `gravitationalTimeDilationFactor(-1, 1, params)` or `gravitationalTimeDilationFactor(1, 1, params)` is evaluated
- **THEN** the result is approximately 1

### Requirement: Beam width constant

The library SHALL export `DEFAULT_BEAM_HALF_WIDTH` as a named constant used to offset inner and outer beam edges from the center ray.

#### Scenario: Inner and outer edges distinct at default width

- **WHEN** `lightGeodesicPoint(0.3, 'inner', 0.5, 1, DEEP_WELL_PARAMS)` and `lightGeodesicPoint(0.3, 'outer', 0.5, 1, DEEP_WELL_PARAMS)` are evaluated with `DEFAULT_BEAM_HALF_WIDTH` applied
- **THEN** the returned points differ in at least one coordinate
