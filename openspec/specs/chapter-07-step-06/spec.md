# chapter-07-step-06 Specification

## Purpose
TBD - created by archiving change chapter-07-gravity-well. Update Purpose after archive.
## Requirements
### Requirement: Step 6 — Escape velocity

Chapter 7 Step 6 ("Escape velocity") SHALL be at `/ch/07/step/6`. It SHALL render the smooth gravity bulge (`wellMorph = 1`, `wellUnfold = 0`) with an interactive energy control (slider or equivalent glowing control) mapped to `surface.energy` (0–1). Low energy SHALL produce a bound trajectory that oscillates through the center; energy at or above the escape threshold SHALL produce a trajectory that reaches and remains on the outer space cylinder.

#### Scenario: Step renders energy dial

- **WHEN** the reader navigates to `/ch/07/step/6`
- **THEN** the step frame shows step counter "06 / 6"
- **AND** an interactive energy control with `lmInteractive` glow treatment is visible
- **AND** the smooth gravity bulge renders with trajectory driven by the current energy value

#### Scenario: Low energy produces bound motion

- **WHEN** energy is below the escape threshold and the trajectory plays
- **THEN** the dot falls through the center and does not remain on the outer right cylinder

#### Scenario: High energy produces escape

- **WHEN** energy is at or above the escape threshold and the trajectory plays
- **THEN** the dot passes through the center and reaches the outer space region on the far side

#### Scenario: Outro bridges to Chapter 8

- **WHEN** Step 6's final narrate beats run
- **THEN** narration references light bending around mass as the next topic (Chapter 8)

#### Scenario: Forward nav resolves to Chapter 8 placeholder

- **WHEN** the reader completes Step 6 and advances past the chapter end
- **THEN** the router navigates to `/ch/08/step/1` without error

### Requirement: Step 6 narration constraints

Step 6's narration SHALL frame escape velocity as a visible energy threshold, not as a formula to memorize.

#### Scenario: Intuition-first framing

- **WHEN** Step 6's narrate beats are inspected
- **THEN** at least one beat describes escape as having enough spatial motion to climb out of the bulge geometry
- **AND** no beat requires the reader to compute a numeric escape speed

