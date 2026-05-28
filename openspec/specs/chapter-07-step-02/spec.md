# chapter-07-step-02 Specification

## Purpose
TBD - created by archiving change chapter-07-gravity-well. Update Purpose after archive.
## Requirements
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

### Requirement: Felt gravity is tied to slope, never to width

Chapter 7 Step 2 narration SHALL tie the *felt* strength of gravity to the **slope (gradient)** of the bulge surface — steepest on the cone flanks near the surface, zero in the flat regions — and SHALL NOT state or imply that gravity "pulls where the paper is widest." The widest region is the flat center, which Step 2 and Step 4 correctly describe as weightless; the narration must be internally consistent with that.

#### Scenario: No "widest = gravity" phrasing

- **WHEN** Step 2's narrate beats are inspected
- **THEN** no beat states that gravity is strongest, or "pulls", where the paper/surface is widest
- **AND** felt gravity is associated with the steepness/slope of the cone segments

#### Scenario: Wide center remains weightless and consistent

- **WHEN** the center cylinder segment narration runs
- **THEN** narration states the wide flat center has no slope and is weightless
- **AND** this does not contradict any earlier beat about where gravity is felt

