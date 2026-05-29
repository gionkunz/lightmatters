## ADDED Requirements

### Requirement: Step frame provides an audio mute toggle

The step frame nav SHALL render an audio mute/unmute icon button in its top-right region, grouped with the existing theme toggle. The button SHALL reflect the current mute state with a speaker / speaker-off icon and SHALL toggle audio mute when activated. The button SHALL use the standard interactive glow affordance.

#### Scenario: Audio toggle appears in the nav

- **WHEN** any step renders inside the step frame
- **THEN** an audio mute/unmute icon button is visible in the top-right of the nav alongside the theme toggle

#### Scenario: Icon reflects mute state

- **WHEN** audio is muted
- **THEN** the button shows the muted (speaker-off) icon
- **WHEN** audio is unmuted
- **THEN** the button shows the unmuted (speaker) icon

#### Scenario: Clicking the toggle changes mute state

- **WHEN** the user activates the audio toggle button
- **THEN** the audio mute state flips
- **AND** the icon updates to match the new state
