# chapter-06-step-04 Specification

## Purpose
TBD - created by archiving change chapter-06-folded-spacetime. Update Purpose after archive.
## Requirements
### Requirement: Step 4 — Gravity as geometry

Chapter 6 Step 4 ("Gravity as geometry") SHALL be at `/ch/06/step/4`. It SHALL render a straight worldline on the cone surface (geodesic mode) and demonstrate that this straight surface path curves spatially when conceptually unrolled — gravity is geodesic motion on warped spacetime, not a force.

#### Scenario: Step renders geodesic worldline

- **WHEN** the reader navigates to `/ch/06/step/4`
- **THEN** the step frame shows step counter "04 / 5"
- **AND** an accent worldline is drawn on the cone surface from rim toward the narrow end
- **AND** the dot animates along this geodesic path

#### Scenario: Narration explains unrolled curvature

- **WHEN** the timeline narrates the geodesic insight
- **THEN** a narrate beat states that a straight line on the cone becomes a spatial curve when the paper is unrolled
- **AND** the beat explicitly frames this as gravity without invoking a force

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/06/step/5`

### Requirement: Step 4 narration constraints

Step 4's narration SHALL NOT introduce the gravity-well bezier (Chapter 7), escape velocity, or light bending.

#### Scenario: Forbidden topics absent

- **WHEN** Step 4's narrate beats are inspected
- **THEN** none of the beats contain "gravity well", "escape velocity", or "light bend"

