## ADDED Requirements

### Requirement: Camera orbit around fixed target

The curved-surface primitive SHALL support pointer drag on the WebGL canvas to orbit the camera around a fixed look-at target at the scene origin (or the state-appropriate target for the current fold/unfold morph). Orbit SHALL adjust azimuth and elevation while preserving camera distance from the target.

#### Scenario: Drag orbits camera

- **WHEN** the user pointer-drags horizontally on the curved-surface canvas
- **THEN** the camera azimuth changes and the scene appears to rotate around the vertical axis through the target

#### Scenario: Vertical drag adjusts elevation

- **WHEN** the user pointer-drags vertically on the canvas
- **THEN** the camera elevation changes within clamped bounds that prevent flipping past the poles

#### Scenario: Orbit composes with authored base camera

- **WHEN** fold or unfold inputs change from the timeline while the user has an active orbit offset
- **THEN** the authored base camera position updates for the new state
- **AND** the user's orbit offset remains applied on top until reset

### Requirement: Reset view control with animated restore

The curved-surface component SHALL render a reset icon button overlay on every 3D scene instance. Activating reset SHALL animate the orbit offset back to zero over a short ease-out duration, restoring the authored default camera framing for the current scene state.

#### Scenario: Reset button visible

- **WHEN** `LmCurvedSurfaceComponent` renders
- **THEN** a reset icon button is visible in the scene chrome overlay
- **AND** the button has an accessible label (e.g. `aria-label="Reset view"`)

#### Scenario: Reset animates to default framing

- **WHEN** the user has orbited away from the default view and clicks reset
- **THEN** the camera animates smoothly back to the authored default orientation for the current fold/unfold state
- **AND** orbit offset reads zero when the animation completes

#### Scenario: Reset does not affect timeline

- **WHEN** the user orbits or resets the camera during step playback
- **THEN** timeline narration and animate events continue unaffected

### Requirement: Orbit and reset scoped to WebGL primitives

Camera orbit and reset SHALL apply to WebGL-based scene primitives (`lm-curved-surface`). Two-dimensional SVG scene primitives (e.g. `lm-light-scene`) SHALL NOT expose orbit controls.

#### Scenario: Light scene has no orbit

- **WHEN** `LmLightSceneComponent` renders
- **THEN** no camera orbit or reset controls are present
