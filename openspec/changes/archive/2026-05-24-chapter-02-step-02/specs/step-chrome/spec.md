## ADDED Requirements

### Requirement: Chapter 2 Step 1 advances to Chapter 2 Step 2

When Chapter 2 Step 2 is authored, Chapter 2 Step 1 SHALL show a continue control in the footer that navigates to `/ch/02/step/2`.

#### Scenario: Continue from Chapter 2 Step 1 reaches Step 2

- **WHEN** a user clicks continue on Chapter 2 Step 1
- **THEN** the router navigates to `/ch/02/step/2`
- **AND** Chapter 2 Step 2 mounts fresh with default parameter state

### Requirement: Chapter 2 Step 2 back navigates to Chapter 2 Step 1

When Chapter 2 Step 2 is active, the footer back control SHALL navigate to `/ch/02/step/1`.

#### Scenario: Back from Chapter 2 Step 2 returns to Step 1

- **WHEN** a user clicks the back control on Chapter 2 Step 2
- **THEN** the router navigates to `/ch/02/step/1`
