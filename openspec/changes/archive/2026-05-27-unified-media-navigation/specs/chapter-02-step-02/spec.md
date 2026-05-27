## ADDED Requirements

### Requirement: Step 2 back navigates to Step 1 via playback transport

Chapter 2 Step 2 SHALL navigate to `/ch/02/step/1` when the user presses the rewind transport control at the first checkpoint.

#### Scenario: Rewind from Step 2 returns to Step 1

- **WHEN** the user is at the first checkpoint of Chapter 2 Step 2
- **AND** presses the rewind transport control
- **THEN** the router navigates to `/ch/02/step/1`

### Requirement: Step 2 advances to Step 3 via playback transport

When Step 3 is authored, Chapter 2 Step 2 SHALL navigate to `/ch/02/step/3` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Step 2 reaches Step 3

- **WHEN** the timeline is at the last checkpoint or complete on Chapter 2 Step 2
- **AND** Step 3 is authored
- **AND** the user presses the forward transport control
- **THEN** the router navigates to `/ch/02/step/3`
