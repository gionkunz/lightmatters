# chapter-01-step-04 Specification

## Purpose
TBD - created by archiving change chapter-01-step-04. Update Purpose after archive.
## Requirements
### Requirement: Step 4 teaches motion through spacetime at c

Chapter 1 Step 4 SHALL be authored as a step module exporting a `Step` object with id `moving-spacetime`, layout `intro`, a `single`-variant spacetime diagram with velocity vector, a `v / c` slider control, and a timeline that narrates the speed-budget concept then waits for user exploration.

#### Scenario: Step 4 renders full step experience

- **WHEN** a user navigates to `/ch/01/step/4`
- **THEN** the step frame, narrator, single-variant spacetime diagram, and `v / c` slider all render
- **AND** the timeline begins automatically on step entry

#### Scenario: Step 4 narration introduces the speed budget

- **WHEN** Step 4's timeline runs through its narrate events
- **THEN** the user sees narration explaining that everything moves through spacetime at c
- **AND** narration describes the fixed speed budget between space and time
- **AND** a final narration beat invites slider exploration

#### Scenario: Entry animation tilts vector slightly

- **WHEN** Step 4's timeline runs the animate event targeting `diagram.velocity`
- **THEN** the velocity vector tilts smoothly from vertical (pure time) toward a small angle (~v/c = 0.15)
- **AND** the vector retains fixed length throughout the animation

#### Scenario: Slider controls vector angle during exploration

- **WHEN** the exploration phase begins (pre-exploration narrate event starts)
- **AND** the user moves the `v / c` slider
- **THEN** the velocity vector tilts to reflect the new v/c value
- **AND** more spatial component corresponds to less temporal component (vector tilts toward the light cone)

### Requirement: Step 4 uses StepIntro layout

Step 4 SHALL use the three-row grid layout from `StepIntro` in `step-ui.jsx`: narrator on top, diagram centered, single slider control at bottom.

#### Scenario: Layout matches prototype structure

- **WHEN** Step 4 renders on a desktop viewport (~1280px)
- **THEN** narration appears above the diagram
- **AND** a single `v / c` slider appears below the diagram within a constrained max-width column

### Requirement: Step 3 advances to Step 4

When Step 4 is authored in Chapter 1, Step 3 SHALL navigate to `/ch/01/step/4` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Step 3 reaches Step 4

- **WHEN** Step 3 is at the last checkpoint or complete
- **AND** Step 4 is authored in Chapter 1
- **AND** the user presses the forward transport control
- **THEN** the router navigates to `/ch/01/step/4`
- **AND** Step 4 mounts fresh with default parameter state (`velocity=0`)

### Requirement: Step 4 back navigates to Step 3

When Step 4 is active, the rewind transport control at the first checkpoint SHALL navigate to `/ch/01/step/3`.

#### Scenario: Rewind from Step 4 returns to Step 3

- **WHEN** a user presses the rewind transport control at the first checkpoint on Step 4
- **THEN** the router navigates to `/ch/01/step/3`

### Requirement: Chapter 1 Step 4 advances to Chapter 2 Step 1

When Chapter 2 Step 1 is authored, Chapter 1 Step 4 SHALL navigate to `/ch/02/step/1` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Chapter 1 Step 4 reaches Chapter 2 Step 1

- **WHEN** the user is at the last checkpoint or complete on Chapter 1 Step 4
- **AND** presses the forward transport control
- **THEN** the router navigates to `/ch/02/step/1`
- **AND** Chapter 2 Step 1 mounts fresh with default parameter state

