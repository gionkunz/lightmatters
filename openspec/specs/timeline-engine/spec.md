# timeline-engine Specification

## Purpose

Declarative timeline orchestration for steps: sequential `narrate`, `animate`, and `wait` events with skip, read pause, playback transport, and reactive playhead state.
## Requirements
### Requirement: TimelineRunner executes events in order

The engine SHALL provide a `TimelineRunner` service that walks a step's timeline event array sequentially, scheduling time-based events against `requestAnimationFrame` and pausing on `wait` conditions.

#### Scenario: Events run in declaration order

- **WHEN** a step with three timeline events (narrate, animate, wait) is started
- **THEN** the runner executes narrate first, then animate, then blocks on wait

#### Scenario: Runner resets on step entry

- **WHEN** a user navigates to a step (including re-visiting the same step)
- **THEN** the runner initializes from the step's default timeline state with no carry-over from a previous visit

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

### Requirement: Timeline supports wait events

A `wait` event SHALL pause timeline progression until its condition is satisfied.

#### Scenario: Wait for userAdvance blocks progression

- **WHEN** the runner reaches `{ wait: { for: 'userAdvance' } }`
- **THEN** timeline progression stops until the user triggers advance (keyboard or playback transport control)

### Requirement: Skip fast-forwards to next wait boundary

The runner SHALL expose a `skip()` operation that instantly completes in-progress animations and narration and jumps to the next `wait` event without losing final state values.

#### Scenario: Skip completes animations instantly

- **WHEN** a narrate event is mid-reveal and the user presses Space
- **THEN** the full narration text appears immediately
- **AND** the runner advances to the next wait boundary

#### Scenario: Skip preserves final animation values

- **WHEN** an animate event is 40% complete and the user skips
- **THEN** the animated property is set to its `to` value
- **AND** the runner advances to the next wait boundary

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

### Requirement: Exploration controls unlock at pre-exploration event start

When the timeline begins the last `narrate` or `animate` event immediately before a `{ wait: { for: 'userAdvance' } }` event, the runner SHALL set `atExplorationWait` to true so step-authored interactive controls become enabled while that event is still in progress (including during narrate typing or an in-flight animate tween).

#### Scenario: Slider unlocks when pre-exploration narrate starts

- **WHEN** the runner begins a `narrate` event that is immediately followed by `{ wait: { for: 'userAdvance' } }`
- **THEN** `atExplorationWait` reads true before narrate typing completes
- **AND** step components bound to `atExplorationWait` enable interactive controls

#### Scenario: Controls unlock when pre-exploration animate starts

- **WHEN** the runner begins an `animate` event that is immediately followed by `{ wait: { for: 'userAdvance' } }`
- **THEN** `atExplorationWait` reads true while the tween is in progress

#### Scenario: Exploration flag clears after userAdvance

- **WHEN** the user advances past a `{ wait: { for: 'userAdvance' } }` event
- **THEN** `atExplorationWait` reads false until the next pre-exploration event begins

#### Scenario: Narration continues while controls are unlocked

- **WHEN** `atExplorationWait` is true during an in-progress pre-exploration narrate event
- **THEN** narrate typing continues until completion
- **AND** the timeline still enters the `userAdvance` wait after the pre-exploration event completes

