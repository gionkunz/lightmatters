## ADDED Requirements

### Requirement: Gravity-well surface profile

The `LmCurvedSurfaceComponent` SHALL accept a `surfaceProfile` input with values `'cone'` (default) or `'well'`. When `surfaceProfile='well'`, the primitive SHALL render a horizontal gravity-well wireframe with circular cross-sections (time) along a space axis, instead of the cylinder/cone mesh.

#### Scenario: Well profile renders wireframe

- **WHEN** `surfaceProfile='well'` and default well inputs are provided
- **THEN** a bidirectional well wireframe is visible with meridians and horizontal cross-section rings
- **AND** the center region is narrower than the outer rims

#### Scenario: Cone profile unchanged

- **WHEN** `surfaceProfile='cone'` (or omitted)
- **THEN** existing fold/curvature cylinder/cone behavior is unchanged from Chapter 6

### Requirement: Piecewise-to-bezier well morph

When `surfaceProfile='well'`, the primitive SHALL accept `wellReveal` (0–1) controlling progressive visibility of piecewise segments, and `wellMorph` (0–1) interpolating between the discrete five-segment piecewise profile and a smooth bezier well profile.

#### Scenario: Piecewise at zero morph

- **WHEN** `wellMorph = 0` and `wellReveal = 1`
- **THEN** the surface shows distinct cylinder/cone/cylinder segments

#### Scenario: Smooth well at full morph

- **WHEN** `wellMorph = 1`
- **THEN** the surface is a continuous smooth well with no visible segment seams

#### Scenario: Timeline animates well morph

- **WHEN** a timeline animate event targets `surface.wellMorph` from 0 to 1
- **THEN** the surface transitions smoothly from piecewise to bezier profile

### Requirement: Energy-driven well trajectory

When `surfaceProfile='well'` and `worldlineMode='well-trajectory'`, the primitive SHALL accept an `energy` input (0–1) that selects bound vs escape trajectory class. The existing `time` input (0–1) SHALL advance the dot along the selected trajectory. `showTrail` and `trailLength` SHALL behave as on cone surfaces.

#### Scenario: Dot follows well trajectory

- **WHEN** `worldlineMode='well-trajectory'` and `time` animates from 0 to 1
- **THEN** the accent dot moves along the well surface following the trajectory for the current `energy`

#### Scenario: Energy changes trajectory class

- **WHEN** `energy` is below the escape threshold
- **THEN** the trajectory is bound (does not end on the outer far cylinder)
- **WHEN** `energy` is at or above the escape threshold
- **THEN** the trajectory reaches the outer space region on the far side

#### Scenario: Timeline targets energy

- **WHEN** a timeline animate event targets `surface.energy`
- **THEN** the trajectory shape updates accordingly without remounting the component

### Requirement: Piecewise bulge unroll (`wellUnfold`)

When `surfaceProfile='well'` and `wellMorph = 0` (piecewise), the primitive SHALL accept `wellUnfold` (0–1) interpolating between the rolled 3D bulge and a flat 2D layout of its four piecewise segments (two outer cylinders, two expanding/contracting cones, one center cylinder). At `wellUnfold = 1` the surface SHALL appear as developable paper: cylinders as rectangles of height `2π·R_segment`, cones as circular sectors. The worldline dot and trail SHALL morph in lockstep so a free-fall trajectory traces a piecewise-straight line on the flat paper. The unroll SHALL be defined only for `wellMorph = 0`; when `wellMorph > 0`, `wellUnfold` SHALL be ignored or clamped to 0 (the smooth bulge cannot lay flat).

#### Scenario: Unroll lays piecewise segments flat

- **WHEN** `wellMorph = 0` and a timeline animates `surface.wellUnfold` from 0 to 1
- **THEN** the surface morphs from the rolled bulge to a flat 2D layout
- **AND** at `wellUnfold = 1`, all geometry has `z ≈ 0` in scene coordinates

#### Scenario: Worldline becomes straight on unroll

- **WHEN** `wellUnfold = 1`, `worldlineMode='well-trajectory'`, and a bound trajectory is rendered for any energy
- **THEN** the rendered trail traces a piecewise-straight line on the flat paper (one straight segment per piecewise region)

#### Scenario: Smooth bulge ignores unfold

- **WHEN** `wellMorph = 1` and `wellUnfold = 1` are set together
- **THEN** the rendered surface remains the rolled smooth bulge (no flattening)

### Requirement: Well camera framing

When `surfaceProfile='well'`, the authored default camera SHALL frame the full well horizontally (both outer cylinders visible) with oblique elevation consistent with Chapter 6 cinematic steps. Orbit and reset controls SHALL remain available.

#### Scenario: Full well visible at default camera

- **WHEN** `surfaceProfile='well'` renders at default camera with zero orbit offset
- **THEN** both outer space rims are visible within the canvas

#### Scenario: Reset restores well default framing

- **WHEN** the user orbits away and clicks reset on a well step
- **THEN** the camera animates back to the well default framing
