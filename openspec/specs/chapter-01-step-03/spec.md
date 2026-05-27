# chapter-01-step-03 Specification

## Purpose
TBD - created by archiving change chapter-01-step-3. Update Purpose after archive.
## Requirements
### Requirement: Step 3 teaches the spacetime diagram and worldlines

Chapter 1 Step 3 SHALL be authored as a step module exporting a `Step` object with id `spacetime-intro`, layout `intro`, a full two-axis spacetime diagram with worldline segment, position and time slider controls, and a timeline that narrates the combined diagram then waits for user exploration.

#### Scenario: Step 3 renders full step experience

- **WHEN** a user navigates to `/ch/01/step/3`
- **THEN** the step frame, narrator, full spacetime diagram, and dual sliders all render
- **AND** the timeline begins automatically on step entry

#### Scenario: Step 3 narration introduces worldlines

- **WHEN** Step 3's timeline runs through its narrate events
- **THEN** the user sees narration explaining that position and time are two axes of the same diagram
- **AND** a second narration beat introduces worldlines and invites slider exploration

#### Scenario: Dual sliders control point in spacetime

- **WHEN** the exploration phase begins (pre-exploration narrate event starts)
- **AND** the user moves the position or time slider
- **THEN** the point on the diagram moves to match both slider values
- **AND** the worldline segment from the origin updates to the new point

### Requirement: Step 3 uses StepIntro layout

Step 3 SHALL use the three-row grid layout from `StepIntro` in `step-ui.jsx`: narrator on top, diagram centered, slider controls at bottom.

#### Scenario: Layout matches prototype structure

- **WHEN** Step 3 renders on a desktop viewport (~1280px)
- **THEN** narration appears above the diagram
- **AND** position and time sliders appear below the diagram within a constrained max-width column

### Requirement: Step 2 advances to Step 3

When Step 3 is authored in Chapter 1, Step 2 SHALL navigate to `/ch/01/step/3` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Step 2 reaches Step 3

- **WHEN** Step 2 is at the last checkpoint or complete
- **AND** Step 3 is authored in Chapter 1
- **AND** the user presses the forward transport control
- **THEN** the router navigates to `/ch/01/step/3`

### Requirement: Step 3 back navigates to Step 2

When Step 3 is active, the rewind transport control at the first checkpoint SHALL navigate to `/ch/01/step/2`.

#### Scenario: Rewind from Step 3 returns to Step 2

- **WHEN** a user presses the rewind transport control at the first checkpoint on Step 3
- **THEN** the router navigates to `/ch/01/step/2`

