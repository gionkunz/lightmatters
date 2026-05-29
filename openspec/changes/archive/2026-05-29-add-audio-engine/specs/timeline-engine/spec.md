## ADDED Requirements

### Requirement: Timeline supports sound events

The engine SHALL support a `sound` timeline event that plays a predefined effect sound type with optional per-event `volume` and stereo `pan`. A `sound` event SHALL be fire-and-forget and zero-duration: it does not block timeline progression, contributes no time to the timeline total, and is not a seekable checkpoint. When a `sound` event is reached during normal forward playback, the runner SHALL play the sound through the registered audio sink and immediately advance to the next event.

#### Scenario: Sound event plays during playback

- **WHEN** the runner reaches `{ type: 'sound', sound: 'tilt' }` during forward playback
- **THEN** the runner plays the `tilt` sound through the audio sink
- **AND** the timeline advances to the next event without pausing

#### Scenario: Per-event volume and pan are forwarded

- **WHEN** the runner plays `{ type: 'sound', sound: 'expand', volume: 0.5, pan: -0.3 }`
- **THEN** the audio sink receives the sound type with volume 0.5 and pan -0.3

#### Scenario: Sound event adds no checkpoint

- **WHEN** a timeline contains a `sound` event between two narrate events
- **THEN** the `sound` event does not create a checkpoint on the progress track
- **AND** it adds no duration to the timeline total

### Requirement: Sound events do not fire while scrubbing or skipping

To keep audio aligned with genuine playback, the runner SHALL NOT play `sound` events during skip, checkpoint seek, rewind, or any instant completion path. Sound events SHALL play only when the playhead passes them during real forward playback.

#### Scenario: Skip does not replay sounds

- **WHEN** the user presses skip across a region containing `sound` events
- **THEN** none of those `sound` events are played
- **AND** the runner still advances to the next wait boundary

#### Scenario: Checkpoint seek is silent

- **WHEN** the user navigates to a previous or next checkpoint across `sound` events
- **THEN** no `sound` events are played during the seek

### Requirement: Timeline audio sink is registered once

The engine SHALL accept a `TimelineSoundSink` (an object exposing a `play(sound, options)` method) registered through an engine-provided registrar, decoupling the runner from the concrete audio implementation. When no sink is registered or audio is unavailable, `sound` events SHALL be silently ignored without error.

#### Scenario: Registered sink receives sound plays

- **WHEN** a `TimelineSoundSink` is registered and a `sound` event is reached during playback
- **THEN** the sink's `play` method is invoked with the event's sound type and options

#### Scenario: No sink registered is safe

- **WHEN** no audio sink is registered and a `sound` event is reached
- **THEN** the runner advances normally and no error is thrown
