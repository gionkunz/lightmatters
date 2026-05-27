## ADDED Requirements

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
