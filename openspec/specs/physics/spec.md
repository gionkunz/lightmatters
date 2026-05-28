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

### Requirement: Cylinder surface parametrization

The `libs/physics` library SHALL export pure functions that map angular and vertical parameters to 3-D points on a cylinder surface. `cylinderSurfacePoint(theta, z, radius)` SHALL return `{ x, y, z }` where `theta` is the angle around the axis (radians), `z` is height along the axis, and `radius` is the cylinder radius.

#### Scenario: Point on cylinder rim

- **WHEN** `cylinderSurfacePoint(0, 0, 1)` is evaluated
- **THEN** `x` equals the radius and `y` equals 0

#### Scenario: Full revolution returns to start

- **WHEN** `cylinderSurfacePoint(0, z, r)` and `cylinderSurfacePoint(2 * Math.PI, z, r)` are evaluated
- **THEN** both return the same `{ x, y, z }` within floating-point tolerance

### Requirement: Cone surface parametrization

The library SHALL export `coneSurfacePoint(theta, t, topRadius, bottomRadius, height)` returning `{ x, y, z }` on a truncated cone, where `t ∈ [0, 1]` runs from top rim to bottom rim and radius interpolates linearly between `topRadius` and `bottomRadius`.

#### Scenario: Top rim radius

- **WHEN** `coneSurfacePoint(0, 0, 280, 90, 400)` is evaluated
- **THEN** the horizontal distance from the axis equals 280

#### Scenario: Bottom rim radius

- **WHEN** `coneSurfacePoint(0, 1, 280, 90, 400)` is evaluated
- **THEN** the horizontal distance from the axis equals 90

### Requirement: Flat-to-cylinder morph helper

The library SHALL export `morphSurfacePoint(fold, curvature, theta, properTime, params)` that interpolates between a flat vertical worldline (at `fold = 0`) and a surface point on the morphed cylinder/cone (at `fold = 1`). The `curvature` parameter SHALL control cylinder-to-cone shape when `fold = 1`.

#### Scenario: Flat worldline at zero fold

- **WHEN** `morphSurfacePoint(0, 0, 0, 0.5, params)` is evaluated
- **THEN** the result lies on a vertical line with no circular component

#### Scenario: Cylinder helix at full fold

- **WHEN** `morphSurfacePoint(1, 0, theta, properTime, params)` is evaluated with `properTime` mapping to a full revolution
- **THEN** the dot completes one loop around the cylinder axis as `theta` sweeps 0 to 2π

### Requirement: Worldline trail sample helper

The library SHALL export `worldlineTrailSamples(fold, curvature, time, segmentCount, params)` returning an array of `{ x, y, z, age }` objects where `age ∈ [0, 1]` is normalized trail age (0 = oldest, 1 = newest).

#### Scenario: Trail has requested segment count

- **WHEN** `worldlineTrailSamples(1, 0, 0.5, 32, params)` is evaluated
- **THEN** the returned array has length 32

#### Scenario: Trail ages increase toward current time

- **WHEN** `worldlineTrailSamples` is evaluated at `time = 0.5`
- **THEN** the last sample has the highest `age` value
- **AND** the first sample has the lowest `age` value

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

