## ADDED Requirements

### Requirement: lm-light-clock primitive

The workspace SHALL provide a reusable primitive library `libs/primitives/light-clock` exposing an `lm-light-clock` component, tagged `scope:primitive` and dependency-bounded to `scope:engine`, `scope:physics`, and `scope:design` only. It SHALL render two parallel mirrors and a photon bouncing between them in the project's line-art style, reading colors from theme tokens (light and dark), with glow applied only to interactive controls (never to the diagram linework).

#### Scenario: Renders mirrors and bouncing photon

- **WHEN** `lm-light-clock` is rendered with default inputs
- **THEN** two mirrors and a photon between them are drawn as thin-stroke line art
- **AND** the rendering uses theme tokens so it inverts correctly between light and dark themes

### Requirement: Animatable velocity and tick properties

`lm-light-clock` SHALL expose animatable/bindable properties the timeline can target: a `velocity` (v/c, 0 = at rest) that sets the clock's horizontal motion and the resulting photon path angle, and a `tick`/`progress` property advancing the bounce cycle. At `velocity = 0` the photon path SHALL be perpendicular to the mirrors; as `velocity` increases toward 1 the path SHALL approach the mirror plane (a longer diagonal), with the photon's speed along the path held at `c`.

#### Scenario: Velocity tilts the photon path

- **WHEN** `velocity` is animated from 0 toward 1
- **THEN** the photon path tilts from perpendicular toward a longer diagonal
- **AND** the on-path photon speed remains constant (path length increases, not speed)

#### Scenario: Tick advances the bounce

- **WHEN** the `tick`/`progress` property is animated over a cycle
- **THEN** the photon completes one mirror-to-mirror round trip per tick
- **AND** the component exposes when a tick completes so step chrome/readouts can react

### Requirement: Prerender safety

`lm-light-clock` SHALL be safe under build-time prerender: it SHALL NOT access browser-only globals at module-evaluation time or in a constructor that runs during server rendering, deferring any such work to `afterNextRender`/`afterRender` or an `isPlatformBrowser` guard.

#### Scenario: Renders during prerender without browser globals

- **WHEN** a route using `lm-light-clock` is prerendered in the Node DOM shim
- **THEN** no browser-only global is accessed during server rendering
- **AND** the prerender completes without error
