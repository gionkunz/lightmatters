## MODIFIED Requirements

### Requirement: Step 2 advances to Step 3

When Step 3 is authored in Chapter 1, Step 2 SHALL navigate to `/ch/01/step/3` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Step 2 reaches Step 3

- **WHEN** Step 2 is at the last checkpoint or complete
- **AND** Step 3 is authored in Chapter 1
- **AND** the user presses the forward transport control
- **THEN** the router navigates to `/ch/01/step/3`

### Requirement: Step 3 back navigates to Step 2

When Step 3 is active, the rewind transport control at the first checkpoint SHALL navigate to `/ch/01/step/2`.

#### Scenario: Rewind from Step 3 returns to Step 2

- **WHEN** a user presses the rewind transport control at the first checkpoint on Step 3
- **THEN** the router navigates to `/ch/01/step/2`
