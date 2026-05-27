## MODIFIED Requirements

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
