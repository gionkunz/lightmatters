## ADDED Requirements

### Requirement: Moving sources with emission-origin pulses

When a `LightSceneSource` has an optional uniform `velocity`, the primitive SHALL render the source dot at its current position `(x₀ + vx·t, y₀ + vy·t)` while each emitted pulse circle SHALL be centered on the **emission position** `(x₀ + vx·t_emit, y₀ + vy·t_emit)` with radius `c·max(0, t − t_emit)`.

#### Scenario: Stationary source unchanged
- **WHEN** a source has no `velocity` field
- **THEN** pulse circles are centered on `(x, y)` as in Chapter 3

#### Scenario: Moving source pulse stays at birth point
- **WHEN** a source with `velocity = (vx, vy)` emits at `t = 0` and scene time advances to `T > 0`
- **THEN** the pulse circle center remains at `(x₀, y₀)` (the emission position)
- **AND** the source dot has moved to `(x₀ + vx·T, y₀ + vy·T)`

#### Scenario: Reception uses emission position
- **WHEN** computing reception time for a pulse from a moving source
- **THEN** the wavefront origin is the emission position, not the source's current position
