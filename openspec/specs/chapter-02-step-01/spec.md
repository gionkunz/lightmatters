# chapter-02-step-01 Specification

## Purpose

Chapter 2 feature library: lazy-loaded routing at `/ch/02` and Step 1 ("Always at c") introducing the speed budget on the spacetime diagram arc.
## Requirements
### Requirement: Chapter 2 feature lib provides lazy-loaded routing

The workspace SHALL provide a feature library `libs/features/chapter-02-speed-budget` tagged `scope:feature` that exports `chapter02Routes` for lazy loading at `/ch/02`.

#### Scenario: Chapter 2 routes redirect to Step 1

- **WHEN** a user navigates to `/ch/02`
- **THEN** the router redirects to `/ch/02/step/1`

#### Scenario: Step route resolves step page

- **WHEN** a user navigates to `/ch/02/step/1`
- **THEN** the chapter 2 step page component loads and renders Step 1 content

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

### Requirement: Step 1 uses StepIntro layout

Step 1 SHALL use the three-row grid layout from `StepIntro` in `step-ui.jsx`: narrator on top, diagram centered, single slider control at bottom.

#### Scenario: Layout matches prototype structure

- **WHEN** Step 1 renders on a desktop viewport (~1280px)
- **THEN** narration appears above the diagram
- **AND** a single `v / c` slider appears below the diagram within a constrained max-width column

### Requirement: Step 1 back navigates to Chapter 1 Step 4

Chapter 2 Step 1 SHALL navigate to `/ch/01/step/4` when the user presses the rewind transport control at the first checkpoint.

#### Scenario: Rewind from Step 1 returns to Chapter 1 Step 4

- **WHEN** the user is at the first checkpoint of Chapter 2 Step 1
- **AND** presses the rewind transport control
- **THEN** the router navigates to `/ch/01/step/4`

### Requirement: Step 1 hides advance when no Step 2 exists

When Chapter 2 Step 1 is the only authored step in the chapter, the forward transport control SHALL be disabled at the last checkpoint or step completion.

#### Scenario: Forward disabled on lone Step 1

- **WHEN** Chapter 2 Step 1 is the only authored step in the chapter
- **AND** the timeline is at the last checkpoint or complete
- **THEN** the forward transport control is disabled
- **AND** no navigation to a next step occurs

### Requirement: Step 1 fifty-fifty demo uses equal-split velocity on arc

Chapter 2 Step 1 SHALL animate the velocity vector to $v/c = \sin(45°) \approx 0.707$ (45° on the budget arc, equal time and space components) for its fifty-fifty split beat — not $v/c = 0.5$.

#### Scenario: Fifty-fifty animation targets equal split on arc

- **WHEN** Step 1's timeline runs the animate event before the fifty-fifty narrate beat
- **THEN** the animate target ends at $v/c \approx 0.707$
- **AND** the velocity vector tip lies at 45° on the budget arc

#### Scenario: Fifty-fifty readouts match Lorentz at equal split

- **WHEN** Step 1's velocity is $v/c \approx 0.707$ after the fifty-fifty animation
- **THEN** the tip readout shows approximately 0.71 years time elapsed for one coordinate year
- **AND** the spatial speed readout shows approximately 212,000 km/s

### Requirement: Step 1 narration distinguishes equal split from half light speed

Step 1 narration for the fifty-fifty beat SHALL describe equal time and space components at 45° on the arc (~71% of $c$ through space) and SHALL NOT describe $v/c = 0.5$ as a fifty-fifty split.

#### Scenario: Narration describes forty-five degree equal split

- **WHEN** Step 1's timeline runs the fifty-fifty narrate beat
- **THEN** the narration refers to the vector bisecting the angle on the arc (45°) with equal time and space shares
- **AND** the narration does not equate half light speed ($v/c = 0.5$) with the fifty-fifty split

### Requirement: Step 1 advances to Step 2 via playback transport

When Step 2 is authored, Chapter 2 Step 1 SHALL navigate to `/ch/02/step/2` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Step 1 reaches Step 2

- **WHEN** the timeline is at the last checkpoint or complete on Chapter 2 Step 1
- **AND** Step 2 is authored
- **AND** the user presses the forward transport control
- **THEN** the router navigates to `/ch/02/step/2`

