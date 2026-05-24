## ADDED Requirements

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
