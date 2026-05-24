# step-chrome Specification

## Purpose
TBD - created by archiving change chapter-01-step-01. Update Purpose after archive.
## Requirements
### Requirement: Step frame provides chapter navigation chrome

The engine SHALL provide an `LmStepFrame` component that renders the step shell from `visual-design-prototype/project/step-ui.jsx`: chapter number and title, progress dots, step counter, and footer controls.

#### Scenario: Step frame shows chapter metadata

- **WHEN** Step 1 of Chapter 1 renders inside the step frame
- **THEN** the nav displays chapter 1 title "Position, time, spacetime"
- **AND** the step counter shows "01 / 06"

#### Scenario: Progress dots reflect current step

- **WHEN** Step 1 is active in a chapter with 6 steps
- **THEN** the first progress dot is highlighted as the current step
- **AND** remaining dots are unfilled

### Requirement: Step footer provides back navigation

The step footer SHALL include a back control that navigates to the previous route (Step 1 back goes to `/`).

#### Scenario: Back from Step 1 returns home

- **WHEN** a user clicks the back control on Step 1
- **THEN** the router navigates to `/`

### Requirement: Keyboard advance and skip

The step host SHALL listen for Space and Enter key presses to trigger timeline skip/advance when the timeline is waiting for user input.

#### Scenario: Space advances at wait boundary

- **WHEN** the timeline is paused at a `userAdvance` wait
- **AND** the user presses Space
- **THEN** the timeline proceeds (or completes the step if no further events)

### Requirement: StepHost resolves step from route parameter

The engine SHALL provide an `LmStepHost` component that reads the `:step` route parameter, loads the corresponding step module, mounts visualizations, and starts the timeline runner.

#### Scenario: Route param selects step

- **WHEN** a user navigates to `/ch/01/step/1`
- **THEN** the StepHost loads Step 1's authored content and starts its timeline

#### Scenario: Visualizations remount on step change

- **WHEN** a user navigates from one step to another within the same chapter
- **THEN** previous step visualizations unmount and new step visualizations mount fresh

### Requirement: Advance control hidden when no next step exists

When the current step is the last authored step in the chapter, the footer SHALL NOT show an advance-to-next-step control.

#### Scenario: Step 1 hides advance button

- **WHEN** only Step 1 is authored in Chapter 1
- **THEN** no "next step" advance button is visible in the footer

