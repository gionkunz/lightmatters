# chapter-03-step-04 Specification

## Purpose
TBD - created by archiving change chapter-03-light-information. Update Purpose after archive.
## Requirements
### Requirement: Step 4 — Two flashes, one witness

Chapter 3 Step 4 ("Two flashes, one witness") SHALL render two sources on a horizontal line equidistant from a midpoint observer, emit one pulse from each source at the same scene time, and demonstrate that the order of arrival at the midpoint observer depends on the observer's motion. A `LmPredictionChoice` SHALL gate continuation: the reader predicts the arrival order before the moving-observer animation plays.

#### Scenario: Both flashes simultaneous in scene frame

- **WHEN** Step 4 renders
- **THEN** the scene contains two sources `S_left` and `S_right`, equidistant from the midpoint
- **AND** both sources emit a pulse at the same scene time `t = 0` (or the same nominal flash time)

#### Scenario: Stationary midpoint observer sees simultaneous arrival

- **WHEN** the first animation segment completes with the midpoint observer stationary
- **THEN** both pulses reach the observer at the same scene time
- **AND** narration confirms simultaneous arrival

#### Scenario: Prediction gate

- **WHEN** the exploration phase begins for the prediction segment (pre-exploration narrate event starts)
- **THEN** `LmPredictionChoice` becomes visible and selectable while narrate typing may still be in progress
- **AND** the prompt offers options indicating "left first", "right first", or "both at once"
- **AND** the forward transport control remains disabled at the last checkpoint until the reader selects an option and the timeline reaches the `userAdvance` wait

#### Scenario: Moving midpoint observer sees asymmetric arrival

- **WHEN** the second animation segment plays with the midpoint observer assigned a uniform horizontal velocity
- **THEN** one pulse reaches the observer at a strictly earlier scene time than the other
- **AND** narration explicitly names the result as **relativity of simultaneity**

#### Scenario: Step routes forward only after prediction

- **WHEN** the reader has made a prediction and the timeline completes
- **THEN** the forward transport control is enabled at the last checkpoint
- **AND** pressing it routes to `/ch/03/step/5`

### Requirement: Step 4 performs the frame-switch that makes simultaneity relative

Chapter 3 Step 4 narration SHALL include a beat that switches into the moving witness's own frame: from the moving witness's point of view, the witness considers itself at rest and equidistant from the two sources, and therefore concludes the two flashes were genuinely **not simultaneous** — not merely that the witness "moved into" one flash. This distinguishes relativity of simultaneity from ordinary (Galilean) reception-order timing, and prevents the misconception that the asymmetric arrival is "just because the witness moved."

#### Scenario: Frame-switch beat present

- **WHEN** Step 4's moving-witness segment narration runs
- **THEN** a beat states that the moving witness regards itself as at rest and equidistant from both sources
- **AND** a beat states that the witness therefore concludes the flashes were not simultaneous in its own frame

#### Scenario: Misconception explicitly headed off

- **WHEN** Step 4's narrate beats are inspected
- **THEN** narration does not leave "the witness moved into the flash" as the sole takeaway
- **AND** narration makes clear that each observer is equally entitled to call itself at rest, so "when did it happen?" has no single frame-independent answer

#### Scenario: Forward reference to constancy of c

- **WHEN** Step 4 or the Chapter 3 outro narration runs
- **THEN** narration signals that *why* a moving observer cannot simply subtract out its motion — the constancy of `c` — is taken up in the chapters that follow (and, once the locked v1.0 map lands, is fully resolved by the dedicated "The same speed of light" chapter). The reference SHALL be phrased by concept, not pinned to a hard chapter number, so it survives renumbering.

