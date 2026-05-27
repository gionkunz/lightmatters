## ADDED Requirements

### Requirement: Step 5 — Fall through Earth

Chapter 7 Step 5 ("Fall through Earth") SHALL be at `/ch/07/step/5`. It SHALL render the smooth gravity bulge (`wellMorph = 1`, `wellUnfold = 0`) with `worldlineMode='well-trajectory'` and animate `time` from 0 to 1 so a particle falls from the near cone, passes through the weightless center, and climbs the far cone — with a fading accent trail (`showTrail = true`). Narration SHALL pay off Step 1's tunnel-through-Earth thought experiment by showing this fall-through on the smooth bulge, recalling the straight-line truth established in Step 3.

#### Scenario: Step renders fall-through animation

- **WHEN** the reader navigates to `/ch/07/step/5`
- **THEN** the step frame shows step counter "05 / 6"
- **AND** the visual is the smooth gravity bulge with an accent dot and fading trail

#### Scenario: Narration callbacks to tunnel thought experiment

- **WHEN** Step 5's opening narrate beats run
- **THEN** narration references the tunnel-through-Earth jump posed in Step 1
- **AND** narration recalls the straight-line worldline shown unrolled in Step 3

#### Scenario: Particle passes through weightless center

- **WHEN** the timeline animates `surface.time` through the middle of the trajectory
- **THEN** the dot traverses the wide center region of the bulge
- **AND** narration states the particle is not trapped — momentum carries it through to the other side

#### Scenario: Trail follows dot

- **WHEN** `showTrail = true` and `time` is advancing
- **THEN** a fading trail of past positions follows the dot along the bulge surface

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/07/step/6`

### Requirement: Step 5 narration constraints

Step 5's narration SHALL use fixed bound energy and SHALL NOT introduce the interactive energy dial or light bending.

#### Scenario: Forbidden topics absent

- **WHEN** Step 5's narrate beats are inspected
- **THEN** none of the beats reference an interactive slider or "light bend"
