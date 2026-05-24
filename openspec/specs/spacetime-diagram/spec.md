# spacetime-diagram Specification

## Purpose

SVG spacetime diagram primitive with incremental variants, starting with `position-only` for Chapter 1 Step 1.
## Requirements
### Requirement: Spacetime diagram renders position-only variant

The `libs/primitives/spacetime-diagram` library SHALL export an `LmSpacetimeDiagram` component with a `position-only` variant that renders a horizontal spatial axis with tick marks, an `x` axis label, and a point marker at a normalized position (0–1).

#### Scenario: Position-only diagram renders axis and point

- **WHEN** `LmSpacetimeDiagram` renders with `variant="position-only"` and `position={0.5}`
- **THEN** a horizontal axis with tick marks is visible
- **AND** a point marker appears at the midpoint of the axis
- **AND** no vertical time axis is rendered

#### Scenario: Position updates when input changes

- **WHEN** the `position` input changes from 0.3 to 0.7
- **THEN** the point marker moves along the axis to the new location

### Requirement: Diagram uses line-art aesthetic and theme tokens

The diagram SHALL render as SVG with thin strokes, no fills on diagram elements, and colors read from design tokens (`--color-ink` or equivalent) so light/dark theme toggling updates stroke colors.

#### Scenario: Theme toggle updates diagram strokes

- **WHEN** a user toggles from light to dark theme while viewing the diagram
- **THEN** axis and point stroke colors update to the dark-theme ink token without remounting

### Requirement: Diagram exposes animatable position property

The component SHALL accept a numeric `position` input (0–1) that the timeline runner's `animate` events can target for entry animations.

#### Scenario: Timeline animates position

- **WHEN** a timeline animate event targets `diagram.position` from 0 to 0.5
- **THEN** the point marker moves smoothly from the left end to the center of the axis

### Requirement: Diagram does not use interactive glow

Diagram linework SHALL NOT use the `lmInteractive` glow directive. Only controls (slider) receive glow treatment.

#### Scenario: Diagram elements have no glow halo

- **WHEN** a user hovers over the diagram axis or point
- **THEN** no accent glow box-shadow appears on diagram SVG elements

### Requirement: Spacetime diagram renders time-only variant

The `libs/primitives/spacetime-diagram` library SHALL extend `LmSpacetimeDiagram` with a `time-only` variant that renders a vertical time axis with tick marks, a `t` axis label, and a point marker at a normalized time value (0–1).

#### Scenario: Time-only diagram renders axis and point

- **WHEN** `LmSpacetimeDiagram` renders with `variant="time-only"` and `time={0.5}`
- **THEN** a vertical axis with tick marks is visible
- **AND** a point marker appears at the midpoint of the axis
- **AND** no horizontal space axis is rendered

#### Scenario: Time updates when input changes

- **WHEN** the `time` input changes from 0.3 to 0.7
- **THEN** the point marker moves along the vertical axis to the new location

### Requirement: Time-only variant exposes animatable time property

The `time-only` variant SHALL accept a numeric `time` input (0–1) that the timeline runner's `animate` events can target for entry animations.

#### Scenario: Timeline animates time

- **WHEN** a timeline animate event targets `diagram.time` from 0 to 0.5
- **THEN** the point marker moves smoothly from the bottom to the center of the axis

### Requirement: Spacetime diagram renders full variant

The `libs/primitives/spacetime-diagram` library SHALL extend `LmSpacetimeDiagram` with a `full` variant that renders horizontal space and vertical time axes with tick marks, `x` and `t` axis labels, a dashed light-cone diagonal from the origin, a worldline segment from the origin to the current point, and a point marker at normalized `(position, time)` values (0–1 each).

#### Scenario: Full diagram renders both axes and worldline

- **WHEN** `LmSpacetimeDiagram` renders with `variant="full"`, `position={0.4}`, and `time={0.5}`
- **THEN** horizontal and vertical axes with tick marks are visible
- **AND** `x` and `t` labels are rendered
- **AND** a dashed diagonal light-cone line extends from the origin
- **AND** a line segment connects the origin to the point marker
- **AND** a point marker appears at the corresponding spacetime coordinates

#### Scenario: Point and worldline update when inputs change

- **WHEN** the `position` input changes from 0.2 to 0.6 while `time` remains 0.5
- **THEN** the point marker moves horizontally to the new position
- **AND** the worldline segment updates to connect the origin to the new point

#### Scenario: Timeline animates position and time concurrently

- **WHEN** timeline animate events target `diagram.position` from 0 to 0.4 and `diagram.time` from 0 to 0.5
- **THEN** the point marker moves smoothly from the origin toward the target coordinates
- **AND** the worldline segment grows with the point

### Requirement: Full variant exposes animatable position and time properties

The `full` variant SHALL accept numeric `position` and `time` inputs (0–1 each) that the timeline runner's `animate` events can target for entry animations.

#### Scenario: Timeline animates position on full variant

- **WHEN** a timeline animate event targets `diagram.position` from 0 to 0.4 on a full variant diagram
- **THEN** the point marker moves smoothly along the horizontal axis

#### Scenario: Timeline animates time on full variant

- **WHEN** a timeline animate event targets `diagram.time` from 0 to 0.5 on a full variant diagram
- **THEN** the point marker moves smoothly along the vertical axis

### Requirement: Spacetime diagram renders single variant

The `libs/primitives/spacetime-diagram` library SHALL extend `LmSpacetimeDiagram` with a `single` variant that renders horizontal space and vertical time axes with tick marks, `x` and `t` axis labels, a dashed light-cone diagonal from the origin, and a fixed-length velocity vector from the origin with an arrowhead polyline and optional dot at the tip.

#### Scenario: Single diagram renders axes, light cone, and velocity vector

- **WHEN** `LmSpacetimeDiagram` renders with `variant="single"` and `velocity={0}`
- **THEN** horizontal and vertical axes with tick marks are visible
- **AND** `x` and `t` labels are rendered
- **AND** a dashed diagonal light-cone line extends from the origin
- **AND** a velocity vector extends vertically upward from the origin (pure time motion)
- **AND** an arrowhead polyline is rendered at the vector tip

#### Scenario: Vector tilts toward light cone as velocity increases

- **WHEN** the `velocity` input changes from 0 to 1
- **THEN** the velocity vector tilts from vertical toward the light-cone diagonal
- **AND** the vector maintains fixed length
- **AND** at `velocity={1}` the vector aligns with the light cone

#### Scenario: Vector angle updates when velocity input changes

- **WHEN** the `velocity` input changes from 0.3 to 0.7
- **THEN** the velocity vector rotates smoothly to the new angle
- **AND** the arrowhead and optional dot move with the vector tip

### Requirement: Single variant exposes animatable velocity property

The `single` variant SHALL accept a numeric `velocity` input (0–1, representing v/c) that the timeline runner's `animate` events can target for entry animations.

#### Scenario: Timeline animates velocity

- **WHEN** a timeline animate event targets `diagram.velocity` from 0 to 0.15 on a single variant diagram
- **THEN** the velocity vector tilts smoothly from vertical toward a small angle

### Requirement: Single variant vector has no decorative animation

The `single` variant velocity vector SHALL NOT use CSS keyframe swing animation. Vector angle SHALL be controlled only by the `velocity` input (timeline or slider).

#### Scenario: Vector angle is input-driven only

- **WHEN** `LmSpacetimeDiagram` renders with `variant="single"` and a fixed `velocity` value
- **THEN** the vector remains at a stable angle matching the input
- **AND** no continuous oscillation or swing animation is applied

### Requirement: Budget-arc variants map physical vOverC to arc angle via arcsin

For `single` and `pair` variants with budget arc enabled, `LmSpacetimeDiagram` SHALL place velocity vectors at angle $\theta = \arcsin(v/c)$ from the vertical (time axis), where the velocity input is physical $v/c \in [0, 1]$. The quarter-circle budget arc SVG geometry SHALL remain unchanged; only vector tip placement on that arc uses the arcsin mapping.

#### Scenario: Half light speed vector at thirty degrees

- **WHEN** `LmSpacetimeDiagram` renders with `variant="single"`, `budgetArc={true}`, and `velocity={0.5}`
- **THEN** the velocity vector tip lies at $\theta = 30°$ on the budget arc (not 45°)

#### Scenario: Equal split vector at forty-five degrees

- **WHEN** `LmSpacetimeDiagram` renders with `variant="single"`, `budgetArc={true}`, and `velocity={0.7071067811865476}`
- **THEN** the velocity vector tip lies at $\theta = 45°$ on the budget arc

### Requirement: Spacetime diagram renders pair variant

The `libs/primitives/spacetime-diagram` library SHALL extend `LmSpacetimeDiagram` with a `pair` variant that renders horizontal space and vertical time axes with tick marks, `x` and `t` axis labels, a dashed light-cone diagonal from the origin, and two fixed-length velocity vectors from the origin — one in accent-1 (red) and one in accent-2 (blue) — each with an arrowhead polyline.

#### Scenario: Pair diagram renders axes, light cone, and twin vectors

- **WHEN** `LmSpacetimeDiagram` renders with `variant="pair"`, `velocityA={0.01}`, and `velocityB={0.5}`
- **THEN** horizontal and vertical axes with tick marks are visible
- **AND** `x` and `t` labels are rendered
- **AND** a dashed diagonal light-cone line extends from the origin
- **AND** two velocity vectors extend from the origin at distinct angles
- **AND** vector A uses accent-1 stroke color
- **AND** vector B uses accent-2 stroke color

#### Scenario: Twin vectors tilt independently as velocities change

- **WHEN** `velocityA` remains at 0.01 and `velocityB` changes from 0.3 to 0.7
- **THEN** vector A remains nearly vertical
- **AND** vector B rotates to the new arcsin-mapped angle
- **AND** both vectors maintain fixed length

### Requirement: Pair variant exposes animatable velocityA and velocityB properties

The `pair` variant SHALL accept numeric `velocityA` and `velocityB` inputs (0–1, physical $v/c$) that the timeline runner's `animate` events can target for entry animations.

#### Scenario: Timeline animates velocityB on pair variant

- **WHEN** a timeline animate event targets `diagram.velocityB` from 0 to 0.5 on a pair variant diagram
- **THEN** vector B tilts smoothly from vertical to $\arcsin(0.5) = 30°$ on the budget arc

#### Scenario: Timeline animates velocityA on pair variant

- **WHEN** a timeline animate event targets `diagram.velocityA` from 0.01 to 0.2 on a pair variant diagram
- **THEN** vector A tilts smoothly to the new arcsin-mapped angle

### Requirement: Pair variant vector has no decorative animation

The `pair` variant velocity vectors SHALL NOT use CSS keyframe swing animation. Vector angles SHALL be controlled only by the `velocityA` and `velocityB` inputs (timeline or slider).

#### Scenario: Pair vectors are input-driven only

- **WHEN** `LmSpacetimeDiagram` renders with `variant="pair"` and fixed velocity inputs
- **THEN** both vectors remain at stable angles matching the inputs
- **AND** no continuous oscillation or swing animation is applied

