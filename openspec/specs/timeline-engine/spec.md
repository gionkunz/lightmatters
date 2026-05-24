# timeline-engine Specification

## Purpose
TBD - created by archiving change chapter-01-step-01. Update Purpose after archive.
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

A `narrate` event SHALL enqueue a text chunk for the narrator component to reveal with typewriter animation.

#### Scenario: Narrate event reveals text

- **WHEN** the runner reaches a `narrate` event with text "Position is a location on a line."
- **THEN** the narrator component begins revealing that text character by character

### Requirement: Timeline supports animate events

An `animate` event SHALL tween a numeric property on a named target from a `from` value to a `to` value over a specified duration with an easing function.

#### Scenario: Animate event tweens a property

- **WHEN** the runner reaches `{ animate: { target: 'diagram.position', from: 0, to: 0.5, duration: 1.2 } }`
- **THEN** the diagram's position property interpolates from 0 to 0.5 over 1.2 seconds

#### Scenario: Wait for animationDone unblocks after animate

- **WHEN** an animate event completes and the next event is `{ wait: { for: 'animationDone' } }`
- **THEN** the runner proceeds to the following event

### Requirement: Timeline supports wait events

A `wait` event SHALL pause timeline progression until its condition is satisfied. Step 1 uses `userAdvance` and `animationDone` conditions.

#### Scenario: Wait for userAdvance blocks progression

- **WHEN** the runner reaches `{ wait: { for: 'userAdvance' } }`
- **THEN** timeline progression stops until the user triggers advance (keyboard or footer control)

### Requirement: Skip fast-forwards to next wait boundary

The runner SHALL expose a `skip()` operation that instantly completes in-progress animations and jumps to the next `wait` event without losing final state values.

#### Scenario: Skip completes animations instantly

- **WHEN** a narrate event is mid-reveal and the user presses Space
- **THEN** the full narration text appears immediately
- **AND** the runner advances to the next wait boundary

#### Scenario: Skip preserves final animation values

- **WHEN** an animate event is 40% complete and the user skips
- **THEN** the animated property is set to its `to` value
- **AND** the runner advances to the next wait boundary

### Requirement: TimelineRunner exposes reactive playhead state

The runner SHALL expose signals indicating whether the timeline is running, paused at a wait, or complete, so step chrome (footer controls, skip affordance) can react.

#### Scenario: Playhead reflects wait state

- **WHEN** the runner is paused at a `userAdvance` wait
- **THEN** a `waitingForUser` signal (or equivalent) reads true

