## MODIFIED Requirements

### Requirement: Step 1 advances to Step 2

When Step 2 is authored, Chapter 1 Step 1 SHALL navigate to `/ch/01/step/2` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Step 1 reaches Step 2

- **WHEN** the timeline is at the last checkpoint or complete on Step 1
- **AND** the user presses the forward transport control
- **THEN** the router navigates to `/ch/01/step/2`
- **AND** Step 2 mounts fresh with default parameter state

### Requirement: Step 2 back navigates to Step 1

Chapter 1 Step 2 SHALL navigate to `/ch/01/step/1` when the user presses the rewind transport control at the first checkpoint.

#### Scenario: Rewind from Step 2 returns to Step 1

- **WHEN** the user is at the first checkpoint of Step 2
- **AND** presses the rewind transport control
- **THEN** the router navigates to `/ch/01/step/1`
