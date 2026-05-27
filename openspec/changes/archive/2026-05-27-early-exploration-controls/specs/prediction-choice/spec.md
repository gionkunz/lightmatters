## ADDED Requirements

### Requirement: Hosting steps expose prediction during exploration phase

Steps that embed `LmPredictionChoice` SHALL show the widget when the timeline runner's exploration signal (`atExplorationWait` or equivalent) becomes true for the prediction segment — not only after the `userAdvance` wait is entered.

#### Scenario: Prediction visible during pre-exploration narrate

- **WHEN** a step's timeline begins the narrate event immediately before a prediction-gated `userAdvance` wait
- **THEN** `LmPredictionChoice` is visible and accepts selection
- **AND** narrate typing for that beat may still be in progress

#### Scenario: Selection during exploration phase advances wait

- **WHEN** the user selects a prediction option while `atExplorationWait` is true at the prediction `userAdvance` wait
- **THEN** the step component calls `TimelineRunner.advance()` to unblock the wait
