## ADDED Requirements

### Requirement: Step frame supports disabled continue control

`LmStepFrame` SHALL accept an optional `continueDisabled` input. When `continueDisabled` is true and a next step or chapter exists, the footer continue button SHALL render in a disabled state and SHALL NOT emit navigation on click.

#### Scenario: Disabled continue ignores clicks

- **WHEN** `continueDisabled` is true
- **AND** the user clicks the continue button
- **THEN** no navigation occurs

#### Scenario: Enabled continue navigates normally

- **WHEN** `continueDisabled` is false or unset
- **AND** the user clicks the continue button
- **THEN** the step emits its `next` output as today

### Requirement: Chapter 2 Step 2 advances to Chapter 2 Step 3

When Chapter 2 Step 3 is authored, Chapter 2 Step 2 SHALL show a continue control in the footer that navigates to `/ch/02/step/3`.

#### Scenario: Continue from Chapter 2 Step 2 reaches Step 3

- **WHEN** a user clicks continue on Chapter 2 Step 2
- **THEN** the router navigates to `/ch/02/step/3`
- **AND** Chapter 2 Step 3 mounts fresh with default parameter state

### Requirement: Chapter 2 Step 3 back navigates to Chapter 2 Step 2

When Chapter 2 Step 3 is active, the footer back control SHALL navigate to `/ch/02/step/2`.

#### Scenario: Back from Chapter 2 Step 3 returns to Step 2

- **WHEN** a user clicks the back control on Chapter 2 Step 3
- **THEN** the router navigates to `/ch/02/step/2`

### Requirement: Chapter 2 Step 3 advances to Chapter 3 Step 1

When Chapter 3 Step 1 is routed, Chapter 2 Step 3 SHALL show a continue control labeled for the next chapter that navigates to `/ch/03/step/1`. The continue control SHALL remain disabled until the step's prediction gate is satisfied.

#### Scenario: Continue from Chapter 2 Step 3 reaches Chapter 3 Step 1

- **WHEN** a user has selected both predictions on Chapter 2 Step 3
- **AND** clicks the enabled continue control
- **THEN** the router navigates to `/ch/03/step/1`
