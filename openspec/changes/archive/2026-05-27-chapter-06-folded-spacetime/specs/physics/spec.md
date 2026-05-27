## ADDED Requirements

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
