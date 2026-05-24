## ADDED Requirements

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
