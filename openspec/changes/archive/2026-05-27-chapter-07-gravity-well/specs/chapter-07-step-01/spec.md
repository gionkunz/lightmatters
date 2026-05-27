## ADDED Requirements

### Requirement: Step 1 — The puzzle

Chapter 7 Step 1 ("The puzzle") SHALL be the first step at `/ch/07/step/1`. It SHALL render `lm-curved-surface` in cone mode (`surfaceProfile='cone'`, full curvature) as a visual callback to Chapter 6, with a static or minimally animated rim marker. Narration SHALL open with the tunnel-through-Earth thought experiment — what would happen if you jumped into a straight bore through the planet — then widen to the linked questions: why is gravity strongest on Earth's surface rather than at the center, and why are you weightless at the center? Step 1 SHALL NOT answer those questions; it SHALL state that the Epstein gravity-well model built in the steps ahead will make both clear.

#### Scenario: Step renders cone recap

- **WHEN** the reader navigates to `/ch/07/step/1`
- **THEN** the step frame shows chapter title "The center of the Earth" (or equivalent from registry) and step counter "01 / 5"
- **AND** the visual is `lm-curved-surface` in cone profile mode
- **AND** no gravity-well piecewise geometry is visible

#### Scenario: Narration opens with tunnel thought experiment

- **WHEN** Step 1's timeline narrate beats run
- **THEN** an early beat invites the reader to imagine a straight tunnel through Earth and jumping in
- **AND** no beat animates or resolves the fall-through trajectory on this step

#### Scenario: Narration poses surface-vs-center questions

- **WHEN** Step 1's timeline narrate beats run
- **THEN** at least one beat asks why gravity is strongest on the surface rather than at the center
- **AND** at least one beat asks why the center would be weightless
- **AND** no beat states that the center is weightless as a settled fact

#### Scenario: Narration defers answers to the well model

- **WHEN** Step 1's final narrate beats run
- **THEN** narration references building the Epstein gravity-well diagram as the way to answer the tunnel and weightless-center questions

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/07/step/2`

### Requirement: Step 1 narration constraints

Step 1's narration SHALL NOT introduce the piecewise well, bezier smoothing, particle trajectories, escape velocity, or light bending. It SHALL NOT resolve the tunnel fall or explain weightlessness at the center.

#### Scenario: Forbidden topics absent

- **WHEN** Step 1's narrate beats are inspected
- **THEN** none of the beats contain "gravity well" as an already-built model, "weightless center" as the answer, "bezier", "escape velocity", or "light bend"
