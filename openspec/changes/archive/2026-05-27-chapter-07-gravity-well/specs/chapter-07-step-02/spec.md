## ADDED Requirements

### Requirement: Step 2 — Build the well

Chapter 7 Step 2 ("Build the well") SHALL be at `/ch/07/step/2`. It SHALL render `lm-curved-surface` with `surfaceProfile='well'` and animate `wellReveal` from 0 to 1 to sequentially reveal the five piecewise segments: outer space cylinder → narrowing cone → flat center cylinder → widening cone → outer space cylinder. Opening narration SHALL frame this piecewise Epstein model as the tool to answer Step 1's tunnel and surface-vs-center questions.

#### Scenario: Step renders piecewise well build

- **WHEN** the reader navigates to `/ch/07/step/2`
- **THEN** the step frame shows step counter "02 / 5"
- **AND** the visual is `lm-curved-surface` in well profile mode with `wellMorph = 0` (piecewise)

#### Scenario: Segments appear in narrative order

- **WHEN** the timeline animates `surface.wellReveal` from 0 to 1
- **THEN** outer space segments appear before the center cylinder
- **AND** the center flat cylinder becomes visible before the exit cone and far outer cylinder

#### Scenario: Narration connects well build to Step 1 puzzle

- **WHEN** Step 2's opening narrate beats run
- **THEN** narration references Step 1's tunnel and surface-vs-center questions
- **AND** states that the Epstein well model will answer them

#### Scenario: Strongest gravity at surface is narrated

- **WHEN** the narrowing cone segment (approaching Earth's surface) is revealed
- **THEN** narration connects the steepest slope of the well to gravity feeling strongest on the surface — not at the center — answering Step 1's surface question

#### Scenario: Weightless center is narrated

- **WHEN** the center cylinder segment is revealed
- **THEN** narration states that there is no gravitational slope at the center — no curvature pulling in any direction
- **AND** narration connects this flat region to weightlessness at Earth's core (answering Step 1's center question)

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait with `wellReveal = 1`
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/07/step/3`

### Requirement: Step 2 narration constraints

Step 2's narration SHALL NOT introduce bezier smoothing, particle drop trajectories, escape velocity, or light bending.

#### Scenario: Forbidden topics absent

- **WHEN** Step 2's narrate beats are inspected
- **THEN** none of the beats contain "bezier", "escape velocity", or "light bend"
