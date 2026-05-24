## ADDED Requirements

### Requirement: Chapter 1 Step 4 advances to Chapter 2 Step 1

When Chapter 2 Step 1 is authored, Chapter 1 Step 4 SHALL show a continue control in the footer that navigates to `/ch/02/step/1`.

#### Scenario: Continue from Chapter 1 Step 4 reaches Chapter 2 Step 1

- **WHEN** a user clicks continue on Chapter 1 Step 4
- **THEN** the router navigates to `/ch/02/step/1`
- **AND** Chapter 2 Step 1 mounts fresh with default parameter state (`velocity=0`)

### Requirement: Chapter 2 Step 1 back navigates to Chapter 1 Step 4

When Chapter 2 Step 1 is active, the footer back control SHALL navigate to `/ch/01/step/4`.

#### Scenario: Back from Chapter 2 Step 1 returns to Chapter 1 Step 4

- **WHEN** a user clicks the back control on Chapter 2 Step 1
- **THEN** the router navigates to `/ch/01/step/4`
