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

