## MODIFIED Requirements

### Requirement: Chapter 2 Step 2 teaches twin-traveller time dilation

Chapter 2 Step 2 SHALL be authored as a step module exporting a `Step` object with id `two-travellers`, layout `chat-feed`, a `pair`-variant spacetime diagram, two velocity sliders (Earth traveller A near rest, space traveller B), a chat-feed narrator, a reading mini-map of four `FactLine` readouts, and a timeline that narrates the one-year journey story then waits for user exploration.

#### Scenario: Step 2 renders full chat-feed experience

- **WHEN** a user navigates to `/ch/02/step/2`
- **THEN** the step frame displays chapter 2 title "The speed budget" and step counter "02 / 11"
- **AND** the chat-feed narrator, pair-variant spacetime diagram, twin sliders, and FactLine mini-map all render
- **AND** the timeline begins automatically on step entry

#### Scenario: Step 2 narration tells the one-year journey story

- **WHEN** Step 2's timeline runs through its narrate events
- **THEN** the user sees narration introducing two people travelling for one year each
- **AND** narration describes one person on Earth with negligible spatial motion
- **AND** narration describes the other travelling at half the speed of light ($v/c = 0.5$)
- **AND** narration invites the user to compare elapsed time via the geometry

#### Scenario: Entry animation sets traveller to half light speed

- **WHEN** Step 2's timeline runs the animate event targeting `diagram.velocityB`
- **THEN** traveller B's velocity vector animates smoothly from $v/c = 0$ to $v/c = 0.5$
- **AND** the vector tip moves to $30°$ on the budget arc
- **AND** both vectors retain fixed length throughout the animation

#### Scenario: Readouts show Lorentz time dilation at vOverC equals 0.5

- **WHEN** traveller B's velocity is $0.5$ and the shared coordinate-time budget is one year
- **THEN** the Earth traveller FactLine shows approximately 1 year elapsed
- **AND** the space traveller FactLine shows approximately 0.87 years elapsed
- **AND** the space traveller spatial speed readout shows approximately 150,000 km/s

#### Scenario: Exploration adjusts traveller velocity

- **WHEN** the exploration phase begins (pre-exploration narrate event starts)
- **AND** the user drags traveller B's slider
- **THEN** traveller B's vector tilts to the arcsin-mapped angle for the slider value
- **AND** the FactLine readouts update live using Lorentz-backed helpers
