## ADDED Requirements

### Requirement: AudioService owns a single Web Audio graph

The system SHALL provide a root-provided `AudioService` that lazily creates one `AudioContext` and a single shared audio graph in which background music and effect sounds converge on common master nodes. All Web Audio access SHALL be guarded so it never executes during server-side rendering or static prerendering.

#### Scenario: Graph created lazily in the browser

- **WHEN** `AudioService` is first asked to produce sound in a browser environment
- **THEN** it creates exactly one `AudioContext` and builds the shared graph once
- **AND** subsequent sound activity reuses the same context and master nodes

#### Scenario: No audio work during SSR/SSG

- **WHEN** the application is rendered on the server or prerendered at build time
- **THEN** `AudioService` does not access the Web Audio API
- **AND** no error is thrown and audio methods are no-ops

### Requirement: Master chain applies compression and spatial reverb

The shared master chain where background music and effect sounds meet SHALL pass through a `DynamicsCompressorNode` and a convolution reverb (`ConvolverNode`) before reaching the destination. The reverb SHALL be mixed at low wetness yet remain clearly audible, and the reverb impulse response SHALL produce a spatial decay.

#### Scenario: Compressor glues background and effects

- **WHEN** background music and one or more effect sounds play simultaneously
- **THEN** both signals are summed onto the master bus and pass through the compressor before output

#### Scenario: Reverb is low-wetness but audible

- **WHEN** any sound plays through the master chain
- **THEN** a reverberant tail is present at a low wet level
- **AND** the dry signal remains dominant in the mix

### Requirement: Background music loops at a very low volume

`AudioService` SHALL play `bg-music.mp3` as a continuously looping ambient bed routed into the master chain at a very low, fixed volume relative to effect sounds.

#### Scenario: Background music loops continuously

- **WHEN** background music playback starts
- **THEN** the track loops without a gap when it reaches the end

#### Scenario: Background music sits below effects

- **WHEN** the background music and an effect sound play together
- **THEN** the background music level is markedly lower than the effect sound level

### Requirement: Effect sounds are synthesized from oscillators with per-play volume and pan

`AudioService` SHALL expose a method to play short effect sounds selected from a set of predefined sound types, each synthesized using `OscillatorNode`-based voices. Each play call SHALL accept an optional `volume` and an optional stereo `pan`, applied to that individual voice.

#### Scenario: Predefined sound type plays

- **WHEN** a caller requests a predefined effect sound type
- **THEN** an oscillator-based voice for that type is scheduled on the shared graph and plays to completion

#### Scenario: Per-play volume is applied

- **WHEN** a caller plays an effect sound with a specified volume
- **THEN** that voice's amplitude is scaled by the requested volume independently of other voices

#### Scenario: Per-play pan is applied

- **WHEN** a caller plays an effect sound with a pan value in the range -1 (left) to 1 (right)
- **THEN** that voice is positioned in the stereo field accordingly

#### Scenario: Voices are released after playing

- **WHEN** an effect sound voice finishes
- **THEN** its nodes are disconnected so they do not accumulate

### Requirement: Audio resumes only after a user gesture

To comply with browser autoplay policy, `AudioService` SHALL keep the `AudioContext` suspended until the first user gesture, then resume it and start the background music unless audio is muted.

#### Scenario: Context suspended before interaction

- **WHEN** a page loads and the user has not yet interacted
- **THEN** the `AudioContext` remains suspended and no sound is produced

#### Scenario: First gesture resumes audio

- **WHEN** the user performs their first pointer or keyboard interaction
- **THEN** the `AudioContext` resumes
- **AND** background music begins unless audio is muted

### Requirement: Mute state is reactive and persisted

`AudioService` SHALL expose a reactive `muted` signal and a method to toggle/set it. Mute state SHALL be persisted across sessions. Muting SHALL silence the entire master output (background and effects), and unmuting SHALL restore it.

#### Scenario: Muting silences all audio

- **WHEN** audio is muted while background music and effects are playing
- **THEN** the master output is silenced including reverb tails

#### Scenario: Unmuting restores audio

- **WHEN** audio is unmuted after being muted
- **THEN** the master output returns to its prior level

#### Scenario: Mute preference persists

- **WHEN** the user mutes audio and reloads the application
- **THEN** the muted state is restored from persistence
