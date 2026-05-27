## ADDED Requirements

### Requirement: Step 1 advances to Step 2 via playback transport

When Step 2 is authored, Chapter 1 Step 1 SHALL navigate to `/ch/01/step/2` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Step 1 reaches Step 2

- **WHEN** the timeline is at the last checkpoint or complete on Step 1
- **AND** the user presses the forward transport control
- **THEN** the router navigates to `/ch/01/step/2`
- **AND** Step 2 mounts fresh with default parameter state
