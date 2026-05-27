## MODIFIED Requirements

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
