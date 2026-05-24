## ADDED Requirements

### Requirement: Step 2 shows advance when Step 3 exists

When Step 3 is authored in Chapter 1, Step 2 SHALL show a continue control in the footer that navigates to `/ch/01/step/3`.

#### Scenario: Continue from Step 2 reaches Step 3

- **WHEN** Step 2 is active and Step 3 is authored in Chapter 1
- **THEN** a continue control is visible in the footer
- **AND** clicking it navigates to Step 3

### Requirement: Step 3 back navigates to Step 2

When Step 3 is active, the footer back control SHALL navigate to `/ch/01/step/2`.

#### Scenario: Back from Step 3 returns to Step 2

- **WHEN** a user clicks the back control on Step 3
- **THEN** the router navigates to `/ch/01/step/2`
