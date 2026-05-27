# chapter-06-step-05 Specification

## Purpose
TBD - created by archiving change chapter-06-folded-spacetime. Update Purpose after archive.
## Requirements
### Requirement: Step 5 — Newton's apple

Chapter 6 Step 5 ("Newton's apple") SHALL be at `/ch/06/step/5`. It SHALL place a tiny wireframe house marker on the cone rim, animate an apple's worldline falling along the surface geodesic, and narrate that gravity is the geometry — the apple falls the same way regardless of where on the rim the house sits. Step 5 SHALL bridge to Chapter 7 (gravity well).

#### Scenario: Step renders house and falling worldline

- **WHEN** the reader navigates to `/ch/06/step/5`
- **THEN** the step frame shows step counter "05 / 5"
- **AND** a small wireframe house icon sits on the cone rim
- **AND** an accent worldline descends from the rim along the cone surface

#### Scenario: Cross-chapter forward navigation

- **WHEN** the reader clicks continue on Step 5 with next-chapter navigation enabled
- **THEN** the router navigates to `/ch/07/step/1` without error

#### Scenario: Outro bridges to gravity well

- **WHEN** the final narrate beat plays
- **THEN** the narration references composing the full gravity well in the next chapter

### Requirement: Step 5 narration constraints

Step 5's narration SHALL recap gravity-as-geometry from Steps 3–4 and SHALL NOT derive quantitative GR formulas.

#### Scenario: Forbidden topics absent

- **WHEN** Step 5's narrate beats are inspected
- **THEN** none of the beats contain "Schwarzschild", "Einstein field", or "tensor"

