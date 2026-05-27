## MODIFIED Requirements

### Requirement: Step 3 advances to Step 4

When Step 4 is authored in Chapter 1, Step 3 SHALL navigate to `/ch/01/step/4` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Step 3 reaches Step 4

- **WHEN** Step 3 is at the last checkpoint or complete
- **AND** Step 4 is authored in Chapter 1
- **AND** the user presses the forward transport control
- **THEN** the router navigates to `/ch/01/step/4`
- **AND** Step 4 mounts fresh with default parameter state (`velocity=0`)

### Requirement: Step 4 back navigates to Step 3

When Step 4 is active, the rewind transport control at the first checkpoint SHALL navigate to `/ch/01/step/3`.

#### Scenario: Rewind from Step 4 returns to Step 3

- **WHEN** a user presses the rewind transport control at the first checkpoint on Step 4
- **THEN** the router navigates to `/ch/01/step/3`

## ADDED Requirements

### Requirement: Chapter 1 Step 4 advances to Chapter 2 Step 1

When Chapter 2 Step 1 is authored, Chapter 1 Step 4 SHALL navigate to `/ch/02/step/1` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Chapter 1 Step 4 reaches Chapter 2 Step 1

- **WHEN** the user is at the last checkpoint or complete on Chapter 1 Step 4
- **AND** presses the forward transport control
- **THEN** the router navigates to `/ch/02/step/1`
- **AND** Chapter 2 Step 1 mounts fresh with default parameter state
