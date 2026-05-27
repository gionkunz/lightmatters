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

