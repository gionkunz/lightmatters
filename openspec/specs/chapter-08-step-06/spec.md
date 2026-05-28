# chapter-08-step-06 Specification

## Purpose
TBD - created by archiving change chapter-08-light-bending. Update Purpose after archive.
## Requirements
### Requirement: Step 6 — Synchronized arrival

Chapter 8 Step 6 ("Synchronized arrival") SHALL be at `/ch/08/step/6`. It SHALL animate `lightBeamProgress` to completion so both inner and outer edges reach the target/detector together. Narration SHALL resolve the Step 4 puzzle: gravitational time dilation on the inner edge compensates for its shorter spatial path, so both edges arrive synchronized without either exceeding *c*.

#### Scenario: Both edges arrive together

- **WHEN** the timeline animates `surface.lightBeamProgress` to 1
- **THEN** inner and outer geodesics terminate at the same detector position
- **AND** both edges complete their paths in the same authored timeline beat

#### Scenario: Narration resolves the puzzle

- **WHEN** Step 6's narrate beats run
- **THEN** narration explains that the inner edge's slower clock gives it enough subjective time to cover its shorter path
- **AND** states that both edges arrive synchronized at the destination

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/08/step/7`

### Requirement: Time dilation is not narrated as the whole cause of bending

Chapter 8 Step 6 narration SHALL present gravitational time dilation as the reason the wavefront stays square and the beam bends, but SHALL NOT claim or imply that gravitational time dilation alone accounts for the **full amount** of light deflection. The phrasing "time dilation is what buys the bend" (or equivalent totalizing language) SHALL be scoped so it describes the mechanism that keeps the band square, not the complete cause of the measured deflection.

#### Scenario: Narration avoids totalizing the time-dilation cause

- **WHEN** Step 6's narrate beats run
- **THEN** narration explains that the inner edge's slower clock keeps the wavefront perpendicular and contributes to the bend
- **AND** no beat states or implies that gravitational time dilation is the entire cause of how much light bends

#### Scenario: Forward reference to the full picture

- **WHEN** Step 6's final narrate beat completes
- **THEN** narration either defers the "full amount of bending" question to Step 7 or leaves it open
- **AND** does not assert that the puzzle of deflection magnitude is fully resolved by clocks alone

