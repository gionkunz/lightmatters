## ADDED Requirements

### Requirement: Step 3 — Widen the beam

Chapter 8 Step 3 ("Widen the beam") SHALL be at `/ch/08/step/3`. It SHALL render the deep well with `lightBeamMode='dual'` (inner and outer edges). The timeline SHALL animate `lightBeamProgress` from 0 to 1 so both edges travel together, showing the whole beam bending as a band. Inner edge SHALL use accent1; outer edge SHALL use accent2 per the two-accent color grammar.

#### Scenario: Step renders dual-edge beam

- **WHEN** the reader navigates to `/ch/08/step/3`
- **THEN** two accent geodesics (inner and outer beam edges) are visible on the well surface
- **AND** the inner edge passes closer to the mass than the outer edge

#### Scenario: Beam animates as a unit

- **WHEN** the timeline animates `surface.lightBeamProgress` from 0 to 1
- **THEN** both edges advance in lockstep
- **AND** the band between them visibly curves around the mass

#### Scenario: Narration widens from ray to beam

- **WHEN** Step 3's narrate beats run
- **THEN** narration references widening from a single ray to a wide laser beam or band
- **AND** states that the whole beam bends, not just one line

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/08/step/4`
