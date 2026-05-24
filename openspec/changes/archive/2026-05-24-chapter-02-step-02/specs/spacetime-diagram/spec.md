## ADDED Requirements

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
