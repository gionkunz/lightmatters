## MODIFIED Requirements

### Requirement: Step 1 back navigates to Chapter 1 Step 4

Chapter 2 Step 1 SHALL navigate to `/ch/01/step/4` when the user presses the rewind transport control at the first checkpoint.

#### Scenario: Rewind from Step 1 returns to Chapter 1 Step 4

- **WHEN** the user is at the first checkpoint of Chapter 2 Step 1
- **AND** presses the rewind transport control
- **THEN** the router navigates to `/ch/01/step/4`

### Requirement: Step 1 hides advance when no Step 2 exists

When Chapter 2 Step 1 is the only authored step in the chapter, the forward transport control SHALL be disabled at the last checkpoint or step completion.

#### Scenario: Forward disabled on lone Step 1

- **WHEN** Chapter 2 Step 1 is the only authored step in the chapter
- **AND** the timeline is at the last checkpoint or complete
- **THEN** the forward transport control is disabled
- **AND** no navigation to a next step occurs

## ADDED Requirements

### Requirement: Step 1 advances to Step 2 via playback transport

When Step 2 is authored, Chapter 2 Step 1 SHALL navigate to `/ch/02/step/2` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Step 1 reaches Step 2

- **WHEN** the timeline is at the last checkpoint or complete on Chapter 2 Step 1
- **AND** Step 2 is authored
- **AND** the user presses the forward transport control
- **THEN** the router navigates to `/ch/02/step/2`
