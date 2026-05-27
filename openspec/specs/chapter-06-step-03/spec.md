# chapter-06-step-03 Specification

## Purpose
TBD - created by archiving change chapter-06-folded-spacetime. Update Purpose after archive.
## Requirements
### Requirement: Step 3 — Bend into a cone

Chapter 6 Step 3 ("Bend into a cone") SHALL be at `/ch/06/step/3`. It SHALL use the cinematic step layout (full-bleed diagram, side annotations, bottom narrator panel). It SHALL animate `curvature` from 0 toward ~0.65 to bend the cylinder into a cone and display annotations: "strong gravity" at the wide end and "weak gravity" at the point.

#### Scenario: Step uses cinematic layout

- **WHEN** the reader navigates to `/ch/06/step/3`
- **THEN** the step frame shows step counter "03 / 5"
- **AND** the curved surface fills the main visual area
- **AND** side annotations label the wide end "strong gravity" and the point "weak gravity"
- **AND** a bottom narrator panel overlays the diagram

#### Scenario: Cone morph animates

- **WHEN** the timeline runs `surface.curvature` from 0 to approximately 0.65
- **THEN** the wireframe morphs from equal-rim cylinder to a cone with a wider top and narrower bottom

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/06/step/4`

### Requirement: Step 3 narration constraints

Step 3's narration SHALL introduce the cone as rolled spacetime with gravity strength tied to rim width, but SHALL NOT yet claim that straight surface lines curve when unrolled.

#### Scenario: Forbidden topics absent

- **WHEN** Step 3's narrate beats are inspected
- **THEN** none of the beats contain "geodesic", "unroll", or "Newton's apple"

