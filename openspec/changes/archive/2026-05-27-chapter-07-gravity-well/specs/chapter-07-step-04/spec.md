## ADDED Requirements

### Requirement: Step 4 — Smooth the shape

Chapter 7 Step 4 ("Smooth the shape") SHALL be at `/ch/07/step/4`. It SHALL start from the fully revealed piecewise bulge (`wellReveal = 1`, `wellMorph = 0`, `wellUnfold = 0`) and animate `wellMorph` from 0 to 1, morphing the discrete five-segment profile into a single continuous bulge matching the prototype `well` mini-glyph aesthetic (widest at center, narrow at outer rims). Narration SHALL acknowledge that the smooth bulge cannot lay perfectly flat the way the piecewise paper did, but the same straight-line truth still applies.

#### Scenario: Step renders bulge morph

- **WHEN** the reader navigates to `/ch/07/step/4`
- **THEN** the step frame shows step counter "04 / 6"
- **AND** the visual begins as the piecewise bulge from Step 3

#### Scenario: Piecewise morphs to smooth bulge

- **WHEN** the timeline animates `surface.wellMorph` from 0 to 1
- **THEN** the surface transitions smoothly from discrete segments to a continuous curved profile
- **AND** the center remains the widest region of the bulge

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait with `wellMorph = 1`
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/07/step/5`

### Requirement: Step 4 narration constraints

Step 4's narration SHALL NOT introduce the energy dial, escape velocity as an interactive control, or light bending.

#### Scenario: Forbidden topics absent

- **WHEN** Step 4's narrate beats are inspected
- **THEN** none of the beats contain "escape velocity", "energy dial", or "light bend"
