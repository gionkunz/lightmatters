## ADDED Requirements

### Requirement: Step 2 — One ray

Chapter 8 Step 2 ("One ray") SHALL be at `/ch/08/step/2`. It SHALL render the deep smooth well with `showLightBeam=true` and `lightBeamMode='single'`. The timeline SHALL animate `lightBeamProgress` from 0 to 1 so a single accent light geodesic travels from the left outer region, skims past the massive body, and exits to the right with visible deflection.

#### Scenario: Step renders single light ray

- **WHEN** the reader navigates to `/ch/08/step/2`
- **THEN** the deep well and mass sphere render as in Step 1
- **AND** a single accent geodesic line is visible on the well surface

#### Scenario: Ray animates with visible deflection

- **WHEN** the timeline animates `surface.lightBeamProgress` from 0 to 1
- **THEN** the light geodesic grows from source to detector
- **AND** the path curves around the mass rather than passing in a straight spatial line

#### Scenario: Narration introduces one-ray deflection

- **WHEN** Step 2's narrate beats run during or after the ray animation
- **THEN** narration describes a single light ray bending around the massive body

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/08/step/3`
