## MODIFIED Requirements

### Requirement: Chapter 2 Step 3 is a single-pulse bridge to Chapter 3

Chapter 2 Step 3 SHALL be authored as a step module exporting a `Step` object with id `bridge-to-light`, layout `chat-feed`, a `wavefront`-variant spacetime diagram (A and B stationary, C at $v/c \approx 0.5$), B as emitter of **exactly one flash**, FactLine clocks for A and C, two `LmPredictionChoice` prompts, and a timeline that stages wavefront expansion to A then C with narrate pauses at each milestone. The step SHALL NOT animate a second pulse or a pulse train.

#### Scenario: Step 3 renders bridge experience

- **WHEN** a user navigates to `/ch/02/step/3`
- **THEN** the step frame displays chapter 2 title "The speed budget" and step counter "03 / 11"
- **AND** the chat-feed narrator, wavefront diagram, and A/C clock readouts render
- **AND** the timeline begins automatically on step entry

#### Scenario: Only one pulse is emitted during the step

- **WHEN** Step 3's full timeline completes
- **THEN** exactly one flash originates from B
- **AND** no additional wavefront animations or pulses occur on this step

#### Scenario: Wavefront animates to A and pauses for narrative

- **WHEN** the timeline runs the first wavefront animate segment (`wavefront.radius` from 0 to the physics-derived radius at A)
- **THEN** the pulse ring expands until it reaches A's worldline
- **AND** a reception marker appears on A's worldline and A's clock readout updates
- **WHEN** the following narrate beat completes typing
- **THEN** playback pauses at checkpoint with the ring held at the A-reception radius until the user continues

#### Scenario: Wavefront continues to C and pauses for narrative

- **WHEN** the user continues playback after the A-reception pause
- **AND** the timeline runs the second wavefront animate segment (`wavefront.radius` from the A radius to the physics-derived radius at C)
- **THEN** the ring expands from the A milestone until it reaches C's worldline
- **AND** a reception marker appears on C's worldline and C's clock readout updates
- **WHEN** the following narrate beat completes typing
- **THEN** playback pauses at checkpoint with the ring held at the C-reception radius until the user continues

#### Scenario: Clock readouts differ at C reception

- **WHEN** both A and C have received the single pulse
- **THEN** A's and C's FactLine clock values differ
- **AND** values match physics helpers for the step's default layout

#### Scenario: Predictions gate forward transport to Chapter 3

- **WHEN** the timeline is complete and both predictions are selected
- **THEN** the forward transport control is enabled at the last checkpoint with a "next chapter" boundary hint
- **AND** pressing it navigates to Chapter 3 Step 1

#### Scenario: Closing narration tees up the next chapter

- **WHEN** Step 3's timeline reaches its final narrate beat after both predictions are selected
- **THEN** narration explicitly tells the reader that **the next chapter will explore this further** (wavefronts, signals, and the questions just posed)
- **AND** narration acknowledges that this step traced only a single pulse as a preview
- **AND** narration does not reveal whether the reader's predictions were correct
- **AND** the forward transport control becomes enabled on or after this beat with a "next chapter" boundary hint

## ADDED Requirements

### Requirement: Step 3 back navigates to Step 2 via playback transport

Chapter 2 Step 3 SHALL navigate to `/ch/02/step/2` when the user presses the rewind transport control at the first checkpoint.

#### Scenario: Rewind from Step 3 returns to Step 2

- **WHEN** the user is at the first checkpoint of Chapter 2 Step 3
- **AND** presses the rewind transport control
- **THEN** the router navigates to `/ch/02/step/2`
