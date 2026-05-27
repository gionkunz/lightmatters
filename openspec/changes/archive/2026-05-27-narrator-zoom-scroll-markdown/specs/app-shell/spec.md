## ADDED Requirements

### Requirement: App loads with scaled typography and controls

The application shell SHALL expose `--lm-type-scale: 1.5` and derived text/control size tokens. Narrator text, kickers, buttons, sliders, playback transport, and step chrome SHALL use those tokens so readable text and interactive targets match roughly 150% browser zoom. Diagram canvas pixel dimensions and WebGL render targets SHALL NOT be globally scaled via CSS `zoom` or viewport scale.

#### Scenario: Step text and controls appear larger at 100% browser zoom

- **WHEN** a reader opens any step route at 100% browser zoom (e.g. `/ch/01/step/1`)
- **THEN** narrator text, playback controls, sliders, and footer buttons render larger than the pre-change baseline
- **AND** WebGL diagrams render without CSS-zoom pixelation

#### Scenario: Landing page chrome uses the same type scale

- **WHEN** a reader opens `/`
- **THEN** landing page typography and interactive elements use the same scaled tokens as step routes
