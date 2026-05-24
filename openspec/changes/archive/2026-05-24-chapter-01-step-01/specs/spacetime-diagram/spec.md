## ADDED Requirements

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
