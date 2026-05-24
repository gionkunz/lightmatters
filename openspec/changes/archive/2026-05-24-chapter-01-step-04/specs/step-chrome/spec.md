## ADDED Requirements

### Requirement: Step 3 shows advance when Step 4 exists

When Step 4 is authored in Chapter 1, Step 3 SHALL show a continue control in the footer that navigates to `/ch/01/step/4`.

#### Scenario: Continue from Step 3 reaches Step 4

- **WHEN** Step 3 is active and Step 4 is authored in Chapter 1
- **THEN** a continue control is visible in the footer
- **AND** clicking it navigates to Step 4

### Requirement: Step 4 back navigates to Step 3

When Step 4 is active, the footer back control SHALL navigate to `/ch/01/step/3`.

#### Scenario: Back from Step 4 returns to Step 3

- **WHEN** a user clicks the back control on Step 4
- **THEN** the router navigates to `/ch/01/step/3`
