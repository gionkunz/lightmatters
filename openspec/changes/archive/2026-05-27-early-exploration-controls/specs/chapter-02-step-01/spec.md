## MODIFIED Requirements

### Requirement: Step 1 teaches pure time vs pure space extremes

Chapter 2 Step 1 SHALL be authored as a step module exporting a `Step` object with id `always-at-c`, layout `intro`, a `single`-variant spacetime diagram with velocity vector, a `v / c` slider control, and a timeline that narrates the two allocation extremes then waits for user exploration.

#### Scenario: Step 1 renders full step experience

- **WHEN** a user navigates to `/ch/02/step/1`
- **THEN** the step frame displays chapter 2 title "The speed budget" and step counter "01 / 11"
- **AND** the narrator, single-variant spacetime diagram, and `v / c` slider all render
- **AND** the timeline begins automatically on step entry

#### Scenario: Step 1 narration introduces the two extremes

- **WHEN** Step 1's timeline runs through its narrate events
- **THEN** the user sees narration explaining that everything moves through spacetime at exactly $c$
- **AND** narration describes pure time motion (all budget on time, vector vertical)
- **AND** narration describes pure space motion (all budget on space, vector on the light cone)
- **AND** a final narration beat invites slider exploration

#### Scenario: Entry animation sweeps vector to light cone

- **WHEN** Step 1's timeline runs the animate event targeting `diagram.velocity`
- **THEN** the velocity vector animates smoothly from vertical (v/c = 0) to the light cone (v/c = 1)
- **AND** the vector retains fixed length throughout the animation

#### Scenario: Slider controls vector angle during exploration

- **WHEN** the exploration phase begins (pre-exploration narrate event starts)
- **AND** the user moves the `v / c` slider
- **THEN** the velocity vector tilts to reflect the new v/c value
- **AND** more spatial component corresponds to less temporal component
