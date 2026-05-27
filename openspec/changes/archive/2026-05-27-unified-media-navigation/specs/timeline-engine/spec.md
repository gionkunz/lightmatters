## MODIFIED Requirements

### Requirement: Playback transport controls timeline playback

The runner SHALL support pause/resume mid-event, advance from checkpoint hold, previous/next checkpoint navigation, and checkpoint seek. When invoked at step boundaries (first checkpoint with no prior checkpoint, or last checkpoint / completion with no next checkpoint), the step frame SHALL delegate to step/chapter navigation instead of the runner.

#### Scenario: Pause freezes mid-narration

- **WHEN** the user pauses during an in-progress narrate event
- **THEN** letter reveal stops until resume

#### Scenario: Play advances from checkpoint hold

- **WHEN** the runner is paused at a checkpoint hold
- **AND** the user presses Play or Space/Enter
- **THEN** the timeline advances to the next event

#### Scenario: Previous checkpoint replays from prior beat

- **WHEN** the user triggers previous checkpoint during or after a checkpoint hold
- **AND** a prior checkpoint exists within the step
- **THEN** the timeline seeks to the prior narrate/animate checkpoint and replays from there

#### Scenario: Forward at last checkpoint defers to step navigation

- **WHEN** the user triggers next checkpoint
- **AND** no further checkpoints exist in the current step
- **THEN** the runner does not advance
- **AND** the step frame handles forward navigation to the next step or chapter

#### Scenario: Rewind at first checkpoint defers to step navigation

- **WHEN** the user triggers previous checkpoint
- **AND** no prior checkpoint exists in the current step
- **THEN** the runner does not seek
- **AND** the step frame handles rewind navigation to the previous step or home

## MODIFIED Requirements

### Requirement: Timeline supports wait events

A `wait` event SHALL pause timeline progression until its condition is satisfied.

#### Scenario: Wait for userAdvance blocks progression

- **WHEN** the runner reaches `{ wait: { for: 'userAdvance' } }`
- **THEN** timeline progression stops until the user triggers advance (keyboard or playback transport control)
