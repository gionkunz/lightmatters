# step-chrome Specification

## Purpose

Reusable step shell: chapter nav, progress dots, top playback bar, footer controls, and step routing host.
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

The step footer SHALL include a back control. Step 1 back navigates to `/`. Subsequent steps back-navigate to the previous step in the chapter.

#### Scenario: Back from Step 1 returns home

- **WHEN** a user clicks the back control on Step 1
- **THEN** the router navigates to `/`

#### Scenario: Back from Step 2 returns to Step 1

- **WHEN** a user clicks the back control on Step 2
- **THEN** the router navigates to `/ch/01/step/1`

### Requirement: Keyboard advance and skip

The step host SHALL listen for Space and Enter key presses to trigger timeline skip/advance when the timeline is waiting for user input.

#### Scenario: Space advances at wait boundary

- **WHEN** the timeline is paused at a `userAdvance` wait
- **AND** the user presses Space
- **THEN** the timeline proceeds (or completes the step if no further events)

### Requirement: Step frame provides playback transport

The step frame SHALL render an `LmPlaybackBar` below the nav with a progress track on the first row and rewind / play / pause / fast-forward transport controls centered on a second row below the track, wired to the timeline runner. Transport controls SHALL be visually prominent (large hit targets, readable icons, clear active/disabled states).

#### Scenario: Playback bar shows progress during narration

- **WHEN** Step 1's timeline is playing through narrate events
- **THEN** the playback bar progress indicator advances
- **AND** checkpoint markers are visible on the progress track

#### Scenario: Transport controls on second row

- **WHEN** a step with a timeline is active
- **THEN** the progress track and elapsed/total times appear on the top row of the playback bar
- **AND** rewind, play/pause, and forward controls appear centered on a separate row below the track

#### Scenario: Prominent transport controls

- **WHEN** the playback bar is visible
- **THEN** each transport control has a hit target of at least 48×48 CSS pixels
- **AND** the play control is visually emphasized relative to rewind and forward

#### Scenario: Play visible at checkpoint hold

- **WHEN** the timeline is paused at a checkpoint hold
- **THEN** the Play control is shown
- **AND** the Pause control is hidden

#### Scenario: Pause visible during active playback

- **WHEN** the timeline is actively playing (typing, tweening)
- **THEN** the Pause control is shown
- **AND** the Play control is hidden

### Requirement: StepHost resolves step from route parameter

The chapter feature SHALL provide a step page component that reads the `:step` route parameter, loads the corresponding step module, mounts visualizations, and starts the timeline runner.

#### Scenario: Route param selects step

- **WHEN** a user navigates to `/ch/01/step/1`
- **THEN** the StepHost loads Step 1's authored content and starts its timeline

#### Scenario: Visualizations remount on step change

- **WHEN** a user navigates from one step to another within the same chapter
- **THEN** previous step visualizations unmount and new step visualizations mount fresh

### Requirement: Advance control hidden when no next step exists

When the current step is the last authored step in the chapter, the footer SHALL NOT show an advance-to-next-step control. When a next step is authored, the footer SHALL show a continue control.

#### Scenario: Last authored step hides advance button

- **WHEN** the current step is the last authored step in the chapter
- **THEN** no "next step" advance button is visible in the footer

#### Scenario: Step 1 shows advance when Step 2 exists

- **WHEN** Step 1 is active and Step 2 is authored in Chapter 1
- **THEN** a continue control is visible in the footer
- **AND** clicking it navigates to Step 2

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

