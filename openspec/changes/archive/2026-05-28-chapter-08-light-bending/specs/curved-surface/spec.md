## ADDED Requirements

### Requirement: Deep well depth preset input

The `LmCurvedSurfaceComponent` SHALL accept a `wellDepth` input with values `'earth'` (default) or `'deep'`. When `'deep'`, the primitive SHALL use `DEEP_WELL_PARAMS` from `@lm/physics` for well mesh generation and light geodesic sampling instead of `DEFAULT_WELL_PARAMS`.

#### Scenario: Deep preset renders narrower bulge

- **WHEN** `surfaceProfile='well'`, `wellMorph=1`, and `wellDepth='deep'` are set
- **THEN** the rendered well center is visually narrower than with `wellDepth='earth'` at the same camera framing

#### Scenario: Earth preset is default

- **WHEN** `LmCurvedSurfaceComponent` renders with default inputs
- **THEN** `wellDepth` behaves as `'earth'` (Chapter 7-compatible params)

### Requirement: Light beam geodesic rendering

When `surfaceProfile='well'` and `showLightBeam=true`, the primitive SHALL accept:

- `lightBeamProgress` (0–1) — visible extent along geodesics
- `lightBeamMissDistance` (0–1) — skim distance from mass
- `lightBeamHalfWidth` (0–1) — half-width for inner/outer edge offset
- `lightBeamMode`: `'single' | 'dual' | 'filled'`

In `'single'` mode one accent geodesic SHALL render. In `'dual'` mode inner (accent1) and outer (accent2) edges SHALL render. In `'filled'` mode a low-opacity band MAY render between edges when both are visible. Timeline animate events SHALL be able to target `surface.lightBeamProgress`, `surface.lightBeamMissDistance`, and `surface.lightBeamHalfWidth`.

#### Scenario: Single ray mode

- **WHEN** `showLightBeam=true`, `lightBeamMode='single'`, and `lightBeamProgress > 0`
- **THEN** one accent polyline is visible on the well surface

#### Scenario: Dual edge mode

- **WHEN** `showLightBeam=true`, `lightBeamMode='dual'`, and `lightBeamProgress > 0`
- **THEN** two accent polylines (inner and outer) are visible on the well surface

#### Scenario: Timeline animates beam progress

- **WHEN** a timeline animate event targets `surface.lightBeamProgress` from 0 to 1
- **THEN** the visible geodesic length grows smoothly without remounting the canvas

#### Scenario: Beam coexists with orbit and reset

- **WHEN** the user orbits the camera during light beam playback
- **THEN** beam geodesics remain attached to the well surface
- **AND** reset restores default well camera framing

### Requirement: Mass sphere on deep well steps

When `surfaceProfile='well'` and `wellDepth='deep'`, the primitive SHALL support displaying a wireframe sphere at the well center (via existing `showEarthSphere` or equivalent) to represent the massive body.

#### Scenario: Mass sphere visible on deep well

- **WHEN** `surfaceProfile='well'`, `wellDepth='deep'`, and the mass sphere input is enabled
- **THEN** a wireframe sphere is visible at the well center

#### Scenario: Mass sphere absent on earth preset by default

- **WHEN** `wellDepth='earth'` and no step enables the mass sphere input
- **THEN** Chapter 7 steps remain visually unchanged
