## MODIFIED Requirements

### Requirement: Step frame provides playback transport

The step frame SHALL render an `LmPlaybackBar` below the nav with a progress track on the first row and rewind / play / pause / fast-forward transport controls centered on a second row below the track, wired to the timeline runner. Transport controls SHALL be visually prominent (large hit targets, readable icons, clear active/disabled states).

#### Scenario: Playback bar shows progress during narration

- **WHEN** Step 1's timeline is playing through narrate events
- **THEN** the playback bar progress indicator advances
- **AND** checkpoint markers are visible on the progress track

#### Scenario: Transport controls on second row

- **WHEN** a step with a timeline is active
- **THEN** the progress track and elapsed/total times appear on the top row of the playback bar
- **AND** rewind, play/pause, and forward controls appear centered on a separate row below the track

#### Scenario: Prominent transport controls

- **WHEN** the playback bar is visible
- **THEN** each transport control has a hit target of at least 48×48 CSS pixels
- **AND** the play control is visually emphasized relative to rewind and forward

#### Scenario: Play visible at checkpoint hold

- **WHEN** the timeline is paused at a checkpoint hold
- **THEN** the Play control is shown
- **AND** the Pause control is hidden

#### Scenario: Pause visible during active playback

- **WHEN** the timeline is actively playing (typing, tweening)
- **THEN** the Pause control is shown
- **AND** the Play control is hidden
