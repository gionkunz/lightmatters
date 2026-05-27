# chapter-01-step-01 Specification

## Purpose

Chapter 1 feature library: lazy-loaded routing at `/ch/01` and Step 1 ("What is position?") as the first vertical slice on the engine.
## Requirements
### Requirement: Chapter 1 feature is lazy-loaded at /ch/01

The application SHALL lazy-load `chapter01Routes` from `@lm/feature-chapter-01-position-time` at path `/ch/01`. Visiting `/ch/01` SHALL redirect to `/ch/01/step/1`.

#### Scenario: Chapter 1 route lazy-loads

- **WHEN** an operator builds the app for production
- **THEN** the chapter 1 feature produces a separate lazy chunk distinct from the landing bundle

#### Scenario: Chapter root redirects to step 1

- **WHEN** a user navigates to `/ch/01`
- **THEN** the router redirects to `/ch/01/step/1`

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

### Requirement: Step 1 uses StepIntro layout

Step 1 SHALL use the three-row grid layout from `StepIntro` in `step-ui.jsx`: narrator on top, diagram centered, slider control at bottom.

#### Scenario: Layout matches prototype structure

- **WHEN** Step 1 renders on a desktop viewport (~1280px)
- **THEN** narration appears above the diagram
- **AND** the slider appears below the diagram within a constrained max-width column

### Requirement: Invalid step numbers show fallback

When a user navigates to `/ch/01/step/:step` with a step number that has no authored content, the chapter feature SHALL display a brief not-found message with a link back to Step 1 or home.

#### Scenario: Unknown step shows fallback

- **WHEN** a user navigates to `/ch/01/step/99`
- **THEN** a not-found message is displayed
- **AND** a navigation link to `/ch/01/step/1` or `/` is available

### Requirement: Step 1 advances to Step 2 via playback transport

When Step 2 is authored, Chapter 1 Step 1 SHALL navigate to `/ch/01/step/2` when the user presses the forward transport control at the last checkpoint or step completion.

#### Scenario: Forward from Step 1 reaches Step 2

- **WHEN** the timeline is at the last checkpoint or complete on Step 1
- **AND** the user presses the forward transport control
- **THEN** the router navigates to `/ch/01/step/2`
- **AND** Step 2 mounts fresh with default parameter state

