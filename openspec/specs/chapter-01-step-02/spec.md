# chapter-01-step-02 Specification

## Purpose
TBD - created by archiving change chapter-01-step-2. Update Purpose after archive.
## Requirements
### Requirement: Step 2 teaches time on an axis

Chapter 1 Step 2 SHALL be authored as a step module exporting a `Step` object with id `time-intro`, layout `intro`, a time-only spacetime diagram, a time slider control, and a timeline that narrates the concept of time then waits for user exploration.

#### Scenario: Step 2 renders full step experience

- **WHEN** a user navigates to `/ch/01/step/2`
- **THEN** the step frame, narrator, time axis diagram, and time slider all render
- **AND** the timeline begins automatically on step entry

#### Scenario: Step 2 narration introduces time

- **WHEN** Step 2's timeline runs through its narrate events
- **THEN** the user sees narration explaining that time is a dimension things move through
- **AND** a second narration beat invites the user to move the slider

#### Scenario: Slider controls diagram point on time axis

- **WHEN** the exploration phase begins (pre-exploration narrate event starts)
- **AND** the user moves the time slider
- **THEN** the point on the diagram moves vertically to match the slider value

### Requirement: Step 2 uses StepIntro layout

Step 2 SHALL use the three-row grid layout from `StepIntro` in `step-ui.jsx`: narrator on top, diagram centered, slider control at bottom.

#### Scenario: Layout matches prototype structure

- **WHEN** Step 2 renders on a desktop viewport (~1280px)
- **THEN** narration appears above the diagram
- **AND** the slider appears below the diagram within a constrained max-width column

### Requirement: Step 1 advances to Step 2

When Step 2 is authored, Chapter 1 Step 1 SHALL show a continue control in the step footer that navigates to `/ch/01/step/2`.

#### Scenario: Continue from Step 1 reaches Step 2

- **WHEN** a user clicks continue on Step 1
- **THEN** the router navigates to `/ch/01/step/2`
- **AND** Step 2 mounts fresh with default parameter state

### Requirement: Step 2 back navigates to Step 1

Chapter 1 Step 2 SHALL navigate to `/ch/01/step/1` when the user clicks the footer back control.

#### Scenario: Back from Step 2 returns to Step 1

- **WHEN** a user clicks the back control on Step 2
- **THEN** the router navigates to `/ch/01/step/1`

