## ADDED Requirements

### Requirement: Step 2 — Roll the paper

Chapter 6 Step 2 ("Roll the paper") SHALL be at `/ch/06/step/2`. It SHALL render `lm-curved-surface`, animate `fold` from 0 to 1 to morph the flat time axis into a cylinder, then animate `time` so the accent dot travels one full loop around the cylinder surface leaving a fading trail.

#### Scenario: Step renders curved surface

- **WHEN** the reader navigates to `/ch/06/step/2`
- **THEN** the step frame shows step counter "02 / 5"
- **AND** the visual is `lm-curved-surface` (WebGL canvas)
- **AND** the opening narrate beat states the same vertical worldline is being rolled into a cylinder

#### Scenario: Fold morph animates flat to cylinder

- **WHEN** the timeline runs the `surface.fold` animate segment from 0 to 1
- **THEN** the surface morphs from a flat vertical strip to a closed cylinder

#### Scenario: Dot orbits with fading trail

- **WHEN** the timeline runs `surface.time` from 0 to 1 with `showTrail = true`
- **THEN** the accent dot completes one revolution around the cylinder surface
- **AND** a fading trail of past positions remains visible behind the dot

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/06/step/3`

### Requirement: Step 2 narration constraints

Step 2's narration SHALL NOT introduce cone curvature, gravity, or geodesic/unrolled comparisons. The pedagogical claim is: rolling the time axis into a circle means moving through time is moving around the cylinder.

#### Scenario: Forbidden topics absent

- **WHEN** Step 2's narrate beats are inspected
- **THEN** none of the beats contain "gravity", "geodesic", "cone", or "Newton"
