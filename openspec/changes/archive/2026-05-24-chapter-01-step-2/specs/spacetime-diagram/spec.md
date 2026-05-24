## ADDED Requirements

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
