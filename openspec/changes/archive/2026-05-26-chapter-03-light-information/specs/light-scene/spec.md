## ADDED Requirements

### Requirement: Top-down 2-D scene primitive

The `lm-light-scene` primitive SHALL render a top-down 2-D space view with positionable observers and pulse-emitting sources. It SHALL NOT render time-axis ticks, worldlines, or any spacetime-diagram markers — both axes represent space.

#### Scenario: Component renders observers and sources as dots
- **WHEN** the component is given non-empty `observers` and `sources` inputs
- **THEN** each observer renders as a labeled dot at its `(x, y)` scene coordinate
- **AND** each source renders as a labeled dot distinct in style from observers

#### Scenario: No spacetime-diagram artifacts
- **WHEN** the component is rendered with default inputs
- **THEN** the SVG SHALL NOT contain time-axis tick marks, worldline lines, or speed-budget vectors
- **AND** axis labels are off by default

### Requirement: Expanding light circles for emitted pulses

For each `(source, emission)` pair, the primitive SHALL render an expanding circle centered on the source's position with radius `c · max(0, time − atTime)`, where `c = 1` in scene units.

#### Scenario: Pulse not yet emitted
- **WHEN** `time < emission.atTime`
- **THEN** no circle is rendered for that emission

#### Scenario: Pulse expanding
- **WHEN** `time ≥ emission.atTime`
- **THEN** a circle is rendered centered on the source with radius proportional to `time − emission.atTime`

#### Scenario: Multiple emissions from one source
- **WHEN** a source has multiple emissions and `time` is past several `atTime` values
- **THEN** all eligible circles render concurrently, each with its own radius

### Requirement: Uniform-velocity observers

The primitive SHALL support observers with optional uniform velocity `(vx, vy)` in scene units per scene time unit. Their rendered position at the current `time` SHALL equal `(x₀ + vx·time, y₀ + vy·time)`.

#### Scenario: Stationary observer
- **WHEN** an observer has no `velocity` field or velocity `(0, 0)`
- **THEN** the observer's rendered position is constant equal to `(x, y)` for all `time`

#### Scenario: Moving observer
- **WHEN** an observer has velocity `(vx, vy)` and `time = T > 0`
- **THEN** the observer's rendered dot is at `(x + vx·T, y + vy·T)`

### Requirement: Reception markers and events

When a pulse circle's radius reaches an observer's current position, the primitive SHALL render a persistent reception marker (glow) at that observer and emit a `(reception)` Angular output event with `{ observerId, sourceId, pulseId, atTime }`.

#### Scenario: Stationary observer receives a pulse
- **WHEN** scene time reaches `t = |O − S| / c` for stationary observer `O` and source `S`
- **THEN** a glow renders on `O`'s dot
- **AND** a `reception` event fires once with the matching IDs

#### Scenario: Moving observer receives a pulse
- **WHEN** scene time reaches the smallest positive `t` solving `|O₀ + v·t − S| = c·t`
- **THEN** a glow renders on `O`'s dot at its current rendered position
- **AND** a `reception` event fires once with the matching IDs

#### Scenario: Reception persists during scrubbing back and forward
- **WHEN** the timeline scrubs past a reception time and back before it and forward again
- **THEN** the reception event SHALL fire only the first time the threshold is crossed in a given playback session
- **AND** the marker is visible whenever current `time` is greater than or equal to reception time

### Requirement: Timeline-driven targets

The primitive SHALL register the following timeline targets when used inside a step's `TargetRegistry`:
- `scene.time`: scalar, drives wavefront expansion (and observer motion via velocities).
- `scene.observer.<id>.x` and `scene.observer.<id>.y`: optional per-observer overrides for steps that animate position directly rather than via uniform velocity.

#### Scenario: scene.time drives wavefront radius
- **WHEN** the timeline animates `scene.time` from `0` to `T`
- **THEN** all eligible pulse circles' radii update accordingly during the animation

#### Scenario: per-observer x/y override velocity
- **WHEN** a step registers `scene.observer.b.x` as a target and animates it
- **THEN** the observer's rendered x-position SHALL follow the animated value, ignoring any velocity field
