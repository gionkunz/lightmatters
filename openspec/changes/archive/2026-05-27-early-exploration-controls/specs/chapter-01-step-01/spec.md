## MODIFIED Requirements

### Requirement: Step 1 teaches position on an axis

Chapter 1 Step 1 SHALL be authored as a step module exporting a `Step` object with id `position-intro`, layout `intro`, a position-only spacetime diagram, a position slider control, and a timeline that narrates the concept of position then waits for user exploration.

#### Scenario: Step 1 renders full step experience

- **WHEN** a user navigates to `/ch/01/step/1`
- **THEN** the step frame, narrator, position axis diagram, and position slider all render
- **AND** the timeline begins automatically on step entry

#### Scenario: Step 1 narration introduces position

- **WHEN** Step 1's timeline runs through its narrate events
- **THEN** the user sees narration explaining that position is a location on a line
- **AND** a second narration beat invites the user to move the slider

#### Scenario: Slider controls diagram point

- **WHEN** the exploration phase begins (pre-exploration narrate event starts)
- **AND** the user moves the position slider
- **THEN** the point on the diagram moves to match the slider value
