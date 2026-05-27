## MODIFIED Requirements

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
