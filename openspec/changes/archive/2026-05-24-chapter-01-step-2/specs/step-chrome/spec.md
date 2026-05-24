## MODIFIED Requirements

### Requirement: Advance control hidden when no next step exists

When the current step is the last authored step in the chapter, the footer SHALL NOT show an advance-to-next-step control. When a next step is authored, the footer SHALL show a continue control.

#### Scenario: Last authored step hides advance button

- **WHEN** the current step is the last authored step in the chapter
- **THEN** no "next step" advance button is visible in the footer

#### Scenario: Step 1 shows advance when Step 2 exists

- **WHEN** Step 1 is active and Step 2 is authored in Chapter 1
- **THEN** a continue control is visible in the footer
- **AND** clicking it navigates to Step 2

### Requirement: Step footer provides back navigation

The step footer SHALL include a back control. Step 1 back navigates to `/`. Subsequent steps back-navigate to the previous step in the chapter.

#### Scenario: Back from Step 1 returns home

- **WHEN** a user clicks the back control on Step 1
- **THEN** the router navigates to `/`

#### Scenario: Back from Step 2 returns to Step 1

- **WHEN** a user clicks the back control on Step 2
- **THEN** the router navigates to `/ch/01/step/1`
