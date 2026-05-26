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
- **WHEN** the timeline reaches the prediction prompt
- **THEN** the continue button SHALL be disabled until the reader selects an arrival-order option
- **AND** the prompt offers options indicating "left first", "right first", or "both at once"

#### Scenario: Moving midpoint observer sees asymmetric arrival
- **WHEN** the second animation segment plays with the midpoint observer assigned a uniform horizontal velocity
- **THEN** one pulse reaches the observer at a strictly earlier scene time than the other
- **AND** narration explicitly names the result as **relativity of simultaneity**

#### Scenario: Step routes forward only after prediction
- **WHEN** the reader has made a prediction and the timeline completes
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/03/step/5`

