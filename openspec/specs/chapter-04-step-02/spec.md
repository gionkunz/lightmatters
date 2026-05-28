# chapter-04-step-02 Specification

## Purpose
TBD - created by archiving change ch04-ether-vector-field. Update Purpose after archive.
## Requirements
### Requirement: Step 2 route and frame

Chapter 4 Step 2 ("Michelson–Morley") SHALL remain at `/ch/04/step/2` with step counter "02 / 5". The right-hand visual SHALL NOT render a Michelson–Morley apparatus schematic. It SHALL render an ether vector-field scene component driven by the step timeline.

#### Scenario: Step loads without apparatus schematic

- **WHEN** the reader navigates to `/ch/04/step/2`
- **THEN** the step frame shows step counter "02 / 5"
- **AND** the visual is an ether-field scene (not an interferometer bench diagram)
- **AND** `LmMichelsonMorleySchematicComponent` is not used

#### Scenario: Step advances to Step 3

- **WHEN** the timeline reaches its final wait and the reader advances
- **THEN** navigation routes to `/ch/04/step/3`

### Requirement: Phase 0 — at rest in the ether

During the opening phase, the ether field SHALL display stationary markers (dots) at grid sample points, indicating zero ether wind relative to the reference frame.

#### Scenario: Rest frame shows dot grid

- **WHEN** the timeline is in phase 0 (at rest in the ether)
- **THEN** grid sample points render as dots without directional arrows
- **AND** narration establishes that the reference frame and ether share the same rest state

### Requirement: Phase 1 — linear ether wind

When the reference frame moves through the ether, the field SHALL display arrows pointing opposite the frame's velocity vector (ether wind / resistive medium).

#### Scenario: Forward motion produces headwind arrows

- **WHEN** the timeline animates frame velocity from rest to a non-zero forward value
- **THEN** grid arrows point opposite the frame velocity direction
- **AND** arrow length scales with speed magnitude (non-zero velocity produces visible arrows, not dots)

### Requirement: Phase 2 — circular motion and local ether wind

A red observer dot (accent-1) SHALL travel on a circular path. At each instant, local ether field arrows SHALL point opposite the dot's instantaneous velocity (opposing the direction of motion along the circle).

#### Scenario: Circular orbit with opposing local wind

- **WHEN** the timeline runs the circular-motion segment
- **THEN** a red dot traverses a circular path
- **AND** ether field arrows at grid points oppose the dot's instantaneous velocity tangent
- **AND** the red dot uses accent-1 styling with interactive glow per visual guidelines

### Requirement: Phase 3 — ether-dragged light prediction

The scene SHALL emit light pulses near the moving red dot. Under the **ether-wind** prediction, pulse wavefronts SHALL be carried by the moving medium (drift in the direction of the ether wind / the apparatus's motion through the medium), visually conveying that, **if** an ether existed, light would be displaced by the wind. This phase SHALL depict a property of the **medium**, NOT light inheriting the source's velocity (that ballistic/emission idea belongs to Step 4).

#### Scenario: Wavefronts are carried by the ether wind

- **WHEN** the timeline runs the dragged-light segment
- **THEN** pulses emit near the moving red dot
- **AND** each pulse's expansion is visibly biased in the direction of the ether wind / motion through the medium (the medium carries the wavefront)
- **AND** narration frames this as the ether's prediction (a medium effect), not established fact

#### Scenario: Ether-wind drift is attributed to the medium, not the source

- **WHEN** Step 2's dragged-light phase narration runs
- **THEN** narration attributes the drift to the ether wind / the medium moving relative to the apparatus
- **AND** narration does NOT claim that light inherits the source's velocity or is "flung forward" by the source

#### Scenario: Dragged-light phase is distinct from Step 4

- **WHEN** Step 2's dragged-light phase is active
- **THEN** the visual does not use `lm-light-scene` emission-at-birth-point rendering
- **AND** the kicker or narration identifies this as the ether (medium) picture, distinct from Step 4's moving-source test

### Requirement: Phase 4 — Michelson–Morley null result without apparatus

The final visual phase SHALL convey the Michelson–Morley null result abstractly: Earth at distinct orbital positions where ether-wind components along and across motion should differ, an expected interference-fringe shift, and the observed null (no shift). It SHALL NOT depict interferometer hardware (beam splitter, mirrors, bench).

#### Scenario: Orbital positions show varying ether-wind expectation

- **WHEN** the timeline enters the null-result phase
- **THEN** the visual shows Earth at multiple orbital positions (at least four) with velocity or ether-wind direction indicated
- **AND** narration explains that along-motion vs across-motion paths should yield different travel times / fringe patterns at different seasons

#### Scenario: Expected shift vs observed null

- **WHEN** the null-result phase is displayed
- **THEN** an abstract fringe readout shows an expected shift (ghost or labeled expectation) and an observed null (fringes unchanged)
- **AND** no L-shaped interferometer bench or mirror arms are rendered

### Requirement: Step 2 narration arc

Step 2 narration SHALL follow this pedagogical sequence: (1) ether as stationary medium, (2) ether wind when moving, (3) circular motion with opposing wind, (4) ether-wind effect on light (the medium carries the wavefront), (5) Michelson–Morley expected signal from Earth's orbital motion through the medium, (6) null result. Narration SHALL NOT require the reader to interpret apparatus hardware labels to understand the argument. Narration SHALL NOT attribute the idea that light inherits its source's velocity to the ether (that ballistic/emission idea is introduced and refuted in Step 4).

#### Scenario: Narration matches visual phases

- **WHEN** Step 2's narrate beats are listed in timeline order
- **THEN** at least one beat precedes each visual phase (0–4)
- **AND** a beat states that Michelson and Morley saw no fringe shift despite Earth's motion through the ether
- **AND** no beat relies on "beam splitter", "mirror arm", or "detector" as the primary explanation

#### Scenario: Ether is not conflated with emission theory

- **WHEN** Step 2's narrate beats are inspected
- **THEN** no beat states that the ether predicts light "inherits", "is dragged forward with", or "leans into the motion of" its source
- **AND** the ether prediction is described as light moving at `c` relative to the medium (so a wind would displace it), tested by Earth's motion through that medium

#### Scenario: Bridge to Step 3

- **WHEN** Step 2's final narrate beat completes
- **THEN** the text poses or implies the question of how light travels without a medium (setting up Step 3's light-scene baseline)

