## ADDED Requirements

### Requirement: Step 3 — Fall on folded paper

Chapter 7 Step 3 ("Fall on folded paper") SHALL be at `/ch/07/step/3`. It SHALL render the fully revealed piecewise bulge (`wellReveal = 1`, `wellMorph = 0`) with `worldlineMode='well-trajectory'`. The timeline SHALL animate `time` from 0 to 1 so a particle falls from the near cone through the wide center to the far cone. After the fall, the timeline SHALL animate `wellUnfold` from 0 to 1, flattening the four piecewise segments (two outer cylinders + two cones + center cylinder) into a flat 2D paper layout where the worldline appears as a piecewise-straight line. Narration SHALL deliver the Epstein punchline: free-fall is a straight line on the unrolled paper.

#### Scenario: Step renders piecewise fall

- **WHEN** the reader navigates to `/ch/07/step/3`
- **THEN** the step frame shows step counter "03 / 6"
- **AND** the visual is the piecewise bulge from Step 2 (`wellMorph = 0`)
- **AND** an accent dot with a fading trail is positioned at the near-cone turning point

#### Scenario: Particle falls through the piecewise bulge

- **WHEN** the timeline animates `surface.time` from 0 to 1
- **THEN** the dot moves from the near cone, through the wide flat center, to the far cone
- **AND** the worldline trail traces the path on the piecewise surface

#### Scenario: Bulge unrolls to flat paper

- **WHEN** the timeline animates `surface.wellUnfold` from 0 to 1
- **THEN** the four piecewise segments lay out flat in 2D (cylinders as rectangles, cones as circular sectors)
- **AND** the worldline appears as a straight line (or piecewise-straight where segments join)
- **AND** the accent dot remains on the worldline throughout the morph

#### Scenario: Narration delivers the straight-line punchline

- **WHEN** the unfold completes
- **THEN** at least one narrate beat states that free-fall is a straight line on the unrolled paper
- **AND** narration connects this to the cone-unroll move from Chapter 6

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait with `wellUnfold = 1`
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/07/step/4`

### Requirement: Step 3 narration constraints

Step 3's narration SHALL NOT introduce the smooth bezier bulge as already-established geometry, the energy dial, escape velocity as an interactive control, or light bending. It SHALL frame the unrolled paper as the answer to "what does the fall actually look like, geometrically?"

#### Scenario: Forbidden topics absent

- **WHEN** Step 3's narrate beats are inspected
- **THEN** none of the beats contain "smooth bezier", "escape velocity", "energy dial", or "light bend"
