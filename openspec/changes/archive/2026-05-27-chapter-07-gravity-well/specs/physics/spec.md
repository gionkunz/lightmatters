## ADDED Requirements

### Requirement: Well radius profile helper

The `libs/physics` library SHALL export `wellRadiusAt(x, wellMorph, params)` returning the outer radius of the gravity well at normalized space coordinate `x ∈ [-1, 1]`. At `wellMorph = 0` the function SHALL return the piecewise five-segment profile. At `wellMorph = 1` it SHALL return a smooth bezier-like profile with minimum radius at `x = 0`.

#### Scenario: Maximum radius at outer edges

- **WHEN** `wellRadiusAt(-1, 1, params)` and `wellRadiusAt(1, 1, params)` are evaluated
- **THEN** both equal the configured outer radius `R_outer`

#### Scenario: Minimum radius at center

- **WHEN** `wellRadiusAt(0, 1, params)` is evaluated
- **THEN** the result equals the configured center radius `R_center`
- **AND** `R_center` is less than `R_outer`

#### Scenario: Morph interpolates profiles

- **WHEN** `wellRadiusAt(x, 0.5, params)` is evaluated
- **THEN** the result is between the piecewise and smooth values at the same `x`

### Requirement: Well surface point helper

The library SHALL export `wellSurfacePoint(theta, x, wellMorph, params)` returning `{ x, y, z }` on the well surface, where `theta` is the angle around the space axis (time direction) and `x` is the normalized space coordinate.

#### Scenario: Point on well rim

- **WHEN** `wellSurfacePoint(0, -1, 1, params)` is evaluated
- **THEN** the horizontal distance from the axis equals `wellRadiusAt(-1, 1, params)`

#### Scenario: Full revolution returns to start

- **WHEN** `wellSurfacePoint(0, x, wellMorph, params)` and `wellSurfacePoint(2 * Math.PI, x, wellMorph, params)` are evaluated
- **THEN** both return the same `{ x, y, z }` within floating-point tolerance

### Requirement: Well trajectory sampling

The library SHALL export `wellTrajectoryPoint(energy, properTime, wellMorph, params)` returning a point on the well surface along a pedagogical trajectory, and `wellTrajectorySamples(energy, segmentCount, wellMorph, params)` returning an array of `{ x, y, z, age }` trail samples. It SHALL export `isEscapeTrajectory(energy, params)` and a named constant `WELL_ESCAPE_ENERGY_THRESHOLD`.

#### Scenario: Trajectory passes through center region

- **WHEN** `wellTrajectoryPoint(energy, 0.5, 1, params)` is evaluated for bound energy below threshold
- **THEN** the returned space coordinate is near the center (|x| below the center-cylinder half-width)

#### Scenario: Escape trajectory reaches outer space

- **WHEN** `wellTrajectoryPoint(energy, 1, 1, params)` is evaluated with `energy >= WELL_ESCAPE_ENERGY_THRESHOLD`
- **THEN** the returned space coordinate is at or beyond the outer segment boundary on the positive-x side

#### Scenario: Bound trajectory does not escape

- **WHEN** `wellTrajectoryPoint(energy, 1, 1, params)` is evaluated with `energy < WELL_ESCAPE_ENERGY_THRESHOLD`
- **THEN** `isEscapeTrajectory(energy, params)` is false
- **AND** the endpoint space coordinate has not reached the far outer cylinder

#### Scenario: Trail sample count

- **WHEN** `wellTrajectorySamples(0.3, 32, 1, params)` is evaluated
- **THEN** the returned array has length 32
- **AND** ages increase toward the current position

### Requirement: Piecewise bulge unroll helpers

The library SHALL export pure functions that lay the piecewise bulge flat in 2D and map worldline points to the unrolled paper. Specifically:

- `wellUnrollSegmentLayout(params)` returning the 2D bounds of each piecewise segment (outer cylinder, expanding cone, center cylinder, contracting cone, outer cylinder) when laid flat with cylinders as rectangles of height `2π·R_segment` and cones as circular sectors.
- `wellSurfacePointUnrolled(theta, x, params)` returning a 2D point `{ x, y, z: 0 }` for the unrolled paper at piecewise position `(theta, x)`.
- `wellTrajectoryPointMorphed(energy, properTime, wellMorph, wellUnfold, params)` interpolating `wellSurfacePoint` (rolled, piecewise→smooth) with `wellSurfacePointUnrolled` (flat, piecewise only) so trail samples morph cleanly between rolled and unrolled views.

The worldline SHALL be defined such that on the unrolled piecewise paper (`wellUnfold = 1`, `wellMorph = 0`), the trail is a piecewise-straight polyline with one straight segment per piecewise region.

#### Scenario: Cylinder unrolls to rectangle of correct height

- **WHEN** `wellUnrollSegmentLayout(params)` is evaluated
- **THEN** each cylinder segment's flat height equals `2π · spaceRadius` for outer cylinders and `2π · bulgeRadius` for the center cylinder

#### Scenario: Cone unrolls to circular sector

- **WHEN** `wellUnrollSegmentLayout(params)` is evaluated for an expanding/contracting cone segment
- **THEN** the flat layout for that segment matches a circular sector with arc length equal to the cone's base circumference

#### Scenario: Worldline is piecewise straight when unrolled

- **WHEN** `wellTrajectoryPointMorphed(energy, properTime, 0, 1, params)` is sampled at many properTime values for a bound energy
- **THEN** the (x, y) projections form straight segments within each piecewise region (constant slope per segment, segment-to-segment direction changes only at piecewise boundaries)

#### Scenario: Smooth bulge ignores unfold parameter

- **WHEN** `wellTrajectoryPointMorphed(energy, properTime, 1, 1, params)` is evaluated
- **THEN** the result equals the rolled smooth-bulge point (`wellTrajectoryPoint(energy, properTime, 1, params)`)
