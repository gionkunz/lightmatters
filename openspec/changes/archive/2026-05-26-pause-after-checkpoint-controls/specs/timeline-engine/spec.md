## MODIFIED Requirements

### Requirement: Timeline supports narrate events

A `narrate` event SHALL enqueue a text chunk for the narrator component to reveal sequentially. After the full chunk is visible, the runner SHALL hold at the checkpoint until the user continues playback — unless the narrate event immediately precedes an exploration `userAdvance` wait, in which case it advances directly into that wait.

#### Scenario: Narrate event reveals text

- **WHEN** the runner reaches a `narrate` event with text "Position is a location on a line."
- **THEN** the narrator component begins revealing that text character by character

#### Scenario: Checkpoint hold after narrate

- **WHEN** a narrate event completes typing and is not immediately followed by an exploration `userAdvance` wait
- **THEN** the timeline pauses at that checkpoint
- **AND** playback does not advance until the user presses Play, Next checkpoint, or Space/Enter

#### Scenario: Pre-exploration narrate skips hold

- **WHEN** a narrate event is immediately followed by `{ wait: { for: 'userAdvance' } }`
- **THEN** the timeline advances directly into the exploration wait without an intermediate checkpoint hold

### Requirement: Timeline supports animate events

An `animate` event SHALL tween a numeric property on a named target from a `from` value to a `to` value over a specified duration with an easing function. When the tween completes, the runner SHALL hold at the checkpoint until the user continues playback.

#### Scenario: Animate event tweens a property

- **WHEN** the runner reaches `{ animate: { target: 'diagram.position', from: 0, to: 0.5, duration: 1.2 } }`
- **THEN** the diagram's position property interpolates from 0 to 0.5 over 1.2 seconds

#### Scenario: Checkpoint hold after animate

- **WHEN** an animate event completes its tween
- **THEN** the timeline pauses at that checkpoint
- **AND** playback does not advance until the user presses Play, Next checkpoint, or Space/Enter

#### Scenario: Wait for animationDone unblocks after animate

- **WHEN** an animate event completes and the next event is `{ wait: { for: 'animationDone' } }`
- **THEN** the runner proceeds to the following event after the user continues from the checkpoint hold

### Requirement: TimelineRunner exposes reactive playhead state

The runner SHALL expose signals indicating whether the timeline is running, paused at a checkpoint hold, paused mid-event, paused at a wait, or complete, plus `progress`, `elapsedMs`, and `checkpoints`, so step chrome can react.

#### Scenario: Playhead reflects wait state

- **WHEN** the runner is paused at a `userAdvance` wait
- **THEN** a `waitingForUser` signal (or equivalent) reads true

#### Scenario: Playhead reflects checkpoint hold

- **WHEN** the runner is paused at a checkpoint hold after narrate or animate
- **THEN** an `atCheckpointHold` signal (or equivalent) reads true
- **AND** `isPaused` reads true

### Requirement: Playback transport controls timeline playback

The runner SHALL support pause/resume mid-event, advance from checkpoint hold, previous/next checkpoint navigation, and checkpoint seek.

#### Scenario: Pause freezes mid-narration

- **WHEN** the user pauses during an in-progress narrate event
- **THEN** letter reveal stops until resume

#### Scenario: Play advances from checkpoint hold

- **WHEN** the runner is paused at a checkpoint hold
- **AND** the user presses Play or Space/Enter
- **THEN** the timeline advances to the next event

#### Scenario: Previous checkpoint replays from prior beat

- **WHEN** the user triggers previous checkpoint during or after a checkpoint hold
- **THEN** the timeline seeks to the prior narrate/animate checkpoint and replays from there
