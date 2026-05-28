## ADDED Requirements

### Requirement: Step 1 — The deep well

Chapter 8 Step 1 ("The deep well") SHALL be the first step at `/ch/08/step/1`. It SHALL render `lm-curved-surface` with `surfaceProfile='well'`, `wellMorph=1`, and the deep-well depth preset (`wellDepth='deep'` or equivalent). It SHALL show a wireframe massive body at the well center. Narration SHALL bridge from Chapter 7: Earth's gravity barely bends light; this step introduces the **extreme** regime where deflection becomes visible. Step 1 SHALL NOT yet animate a light beam or ray.

#### Scenario: Step renders deep well

- **WHEN** the reader navigates to `/ch/08/step/1`
- **THEN** the step frame shows chapter title "Light bending around mass" (or equivalent from registry) and step counter "01 / 7"
- **AND** the visual is the smooth gravity bulge with deep-well depth preset
- **AND** a wireframe sphere or mass marker is visible at the well center

#### Scenario: Narration bridges from Chapter 7

- **WHEN** Step 1's timeline narrate beats run
- **THEN** an early beat references that around ordinary mass like Earth, light's bend is barely visible
- **AND** a beat introduces a deeper well where light visibly deflects

#### Scenario: No light beam on Step 1

- **WHEN** Step 1 renders at any timeline position
- **THEN** no light geodesic or beam overlay is visible

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/08/step/2`

### Requirement: Step 1 narration constraints

Step 1's narration SHALL NOT explain the path-length puzzle, gravitational time dilation on beam edges, or the synchronized-arrival resolution. It SHALL NOT claim light is "pulled" by a force.

#### Scenario: Forbidden topics absent

- **WHEN** Step 1's narrate beats are inspected
- **THEN** none of the beats resolve why inner and outer beam edges arrive together
- **AND** none describe time dilation compensating for unequal path lengths
