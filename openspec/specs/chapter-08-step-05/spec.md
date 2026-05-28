# chapter-08-step-05 Specification

## Purpose
TBD - created by archiving change chapter-08-light-bending. Update Purpose after archive.
## Requirements
### Requirement: Step 5 — Time runs slower inside

Chapter 8 Step 5 ("Time runs slower inside") SHALL be at `/ch/08/step/5`. It SHALL render the dual-edge beam on the deep well and display a readout or annotation comparing gravitational time-dilation factors at the inner vs outer edge positions. The inner edge (deeper in the well) SHALL show a slower clock rate than the outer edge. Narration SHALL connect this to the speed-budget / time vocabulary from Chapter 2.

#### Scenario: Dilation readout visible

- **WHEN** the reader navigates to `/ch/08/step/5`
- **THEN** a readout or annotation shows relative clock rates for inner and outer beam edges
- **AND** the inner-edge clock rate is lower (slower) than the outer-edge clock rate

#### Scenario: Narration introduces gravitational time dilation

- **WHEN** Step 5's narrate beats run
- **THEN** narration explains that deeper in the gravity well, time runs slower
- **AND** references that the inner part of the beam experiences more dilation than the outer part

#### Scenario: Puzzle not yet fully resolved

- **WHEN** Step 5's final narrate beats run
- **THEN** narration sets up but does not fully conclude the synchronized-arrival payoff (reserved for Step 6)

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/08/step/6`

### Requirement: Step 5 scopes the gravitational-time-dilation claim

Chapter 8 Step 5 narration SHALL introduce gravitational time dilation (inner edge clock slower than outer edge) as a contributing reason the beam bends, and SHALL NOT state that this clock difference is the sole or complete cause of light deflection. It connects to the Chapter 2 speed-budget vocabulary as the mechanism, while leaving the full magnitude of bending unclaimed.

#### Scenario: Clock difference framed as a contribution

- **WHEN** Step 5's narrate beats run
- **THEN** narration explains that the inner edge's clock runs slower than the outer edge's
- **AND** no beat asserts that this clock difference alone produces the entire deflection

