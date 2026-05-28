# curved-surface Specification

## Purpose
TBD - created by archiving change scene-camera-orbit-reset. Update Purpose after archive.
## Requirements
### Requirement: Camera orbit around fixed target

The curved-surface primitive SHALL support pointer drag on the WebGL canvas to orbit the camera around a fixed look-at target at the scene origin (or the state-appropriate target for the current fold/unfold morph). Orbit SHALL adjust azimuth and elevation while preserving camera distance from the target.

#### Scenario: Drag orbits camera

- **WHEN** the user pointer-drags horizontally on the curved-surface canvas
- **THEN** the camera azimuth changes and the scene appears to rotate around the vertical axis through the target

#### Scenario: Vertical drag adjusts elevation

- **WHEN** the user pointer-drags vertically on the canvas
- **THEN** the camera elevation changes within clamped bounds that prevent flipping past the poles

#### Scenario: Orbit composes with authored base camera

- **WHEN** fold or unfold inputs change from the timeline while the user has an active orbit offset
- **THEN** the authored base camera position updates for the new state
- **AND** the user's orbit offset remains applied on top until reset

### Requirement: Reset view control with animated restore

The curved-surface component SHALL render a reset icon button overlay on every 3D scene instance. Activating reset SHALL animate the orbit offset back to zero over a short ease-out duration, restoring the authored default camera framing for the current scene state.

#### Scenario: Reset button visible

- **WHEN** `LmCurvedSurfaceComponent` renders
- **THEN** a reset icon button is visible in the scene chrome overlay
- **AND** the button has an accessible label (e.g. `aria-label="Reset view"`)

#### Scenario: Reset animates to default framing

- **WHEN** the user has orbited away from the default view and clicks reset
- **THEN** the camera animates smoothly back to the authored default orientation for the current fold/unfold state
- **AND** orbit offset reads zero when the animation completes

#### Scenario: Reset does not affect timeline

- **WHEN** the user orbits or resets the camera during step playback
- **THEN** timeline narration and animate events continue unaffected

### Requirement: Orbit and reset scoped to WebGL primitives

Camera orbit and reset SHALL apply to WebGL-based scene primitives (`lm-curved-surface`). Two-dimensional SVG scene primitives (e.g. `lm-light-scene`) SHALL NOT expose orbit controls.

#### Scenario: Light scene has no orbit

- **WHEN** `LmLightSceneComponent` renders
- **THEN** no camera orbit or reset controls are present

### Requirement: WebGL curved-surface primitive

The `libs/primitives/curved-surface` library SHALL export an `LmCurvedSurfaceComponent` (`lm-curved-surface`) that renders a parametric wireframe surface in WebGL using `ogl`. The component SHALL mount a `<canvas>` element, initialize a WebGL context on mount, and dispose resources on destroy.

#### Scenario: Component renders wireframe canvas

- **WHEN** `LmCurvedSurfaceComponent` is rendered with default inputs
- **THEN** a WebGL canvas is visible in the DOM
- **AND** a wireframe surface is drawn with thin line strokes matching the ink token color

#### Scenario: Context disposed on destroy

- **WHEN** the component is destroyed (step navigation away)
- **THEN** the WebGL context and ogl resources are released without leaking animation frames

### Requirement: Cylinder and cone surface morph

The primitive SHALL accept numeric `fold` (0–1) and `curvature` (0–1) inputs. At `fold = 0` the surface SHALL appear as a flat vertical strip (time axis). At `fold = 1, curvature = 0` it SHALL appear as a cylinder with horizontal circular cross-sections and vertical meridians. At `fold = 1, curvature = 1` it SHALL appear as a cone (wide top rim, narrow bottom point) with meridians and horizontal cross-section ellipses at reduced opacity (~0.18–0.35).

#### Scenario: Flat strip at zero fold

- **WHEN** `fold = 0`
- **THEN** the surface renders as a flat vertical panel with no cylindrical curvature

#### Scenario: Cylinder at full fold zero curvature

- **WHEN** `fold = 1` and `curvature = 0`
- **THEN** top and bottom rim ellipses are visible with equal radii
- **AND** meridian lines connect top to bottom rims

#### Scenario: Cone at full fold and curvature

- **WHEN** `fold = 1` and `curvature = 1`
- **THEN** the top rim ellipse has a larger radius than the bottom rim
- **AND** slanted side lines connect the rims

### Requirement: Worldline dot with fading trail

The primitive SHALL render an accent-colored dot on the surface at a position determined by `time` (0–1). When `showTrail` is true, it SHALL render a fading trail of past positions behind the dot, with oldest segments at lowest opacity and newest at full opacity. Trail length SHALL be controlled by `trailLength` (segment count).

#### Scenario: Dot moves with time input

- **WHEN** `time` animates from 0 to 1
- **THEN** the accent dot moves along the surface geodesic path

#### Scenario: Trail fades behind dot

- **WHEN** `showTrail = true` and `time` is advancing
- **THEN** a trail of ink-colored segments follows the dot
- **AND** segments farther behind the dot have lower opacity than segments near the dot

#### Scenario: Trail hidden when disabled

- **WHEN** `showTrail = false`
- **THEN** only the current dot position renders with no trail segments

### Requirement: Theme-aware shader uniforms

The primitive SHALL read design tokens from `ThemeService` and bind `ink`, `paper`, `accent1`, and `glow1` as WebGL shader uniforms. When the user toggles light/dark theme, stroke and background colors SHALL update without remounting the component.

#### Scenario: Theme toggle updates wireframe color

- **WHEN** a user toggles from light to dark theme while viewing the curved surface
- **THEN** wireframe line colors update to the dark-theme ink token

### Requirement: Timeline-driven animatable targets

The component SHALL expose `fold`, `curvature`, and `time` as numeric inputs (0–1) that the timeline runner's `animate` events can target by path (e.g. `surface.fold`, `surface.time`).

#### Scenario: Timeline animates fold morph

- **WHEN** a timeline animate event targets `surface.fold` from 0 to 1 over 2 seconds
- **THEN** the surface morphs smoothly from flat strip to cylinder

#### Scenario: Timeline animates dot orbit

- **WHEN** a timeline animate event targets `surface.time` from 0 to 1
- **THEN** the dot travels along the cylinder surface completing one loop

### Requirement: No interactive glow on diagram wireframe

Wireframe linework and trail segments SHALL NOT use the `lmInteractive` glow directive. Only the dot MAY use accent glow treatment consistent with interactive elements.

#### Scenario: Wireframe has no hover glow

- **WHEN** a user hovers over the wireframe mesh
- **THEN** no accent glow box-shadow appears on the canvas wireframe

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

