## ADDED Requirements

> Note: this chapter is **Chapter 2 "The speed of light"** in the updated journey map — after "Position, time, spacetime" (1) and before "The speed budget" (3). Numbering and routes (`/chapter/:chapter/step/:step`) are owned by `chapter-routing`. Scenarios reference steps by ordinal within this chapter.

### Requirement: The Speed of Light chapter exists as a feature lib

The workspace SHALL provide a feature library for "The speed of light" chapter, tagged `scope:feature`, exporting lazy-loaded routes and a prerender step list (`CHAPTER_02_SPEED_OF_LIGHT_STEPS`), registered in the chapter registry, `app.routes.ts`, `site-routes.ts`, and the prerender/sitemap enumeration. The chapter SHALL have six steps: (1) how fast is light, (2) the cosmic speed limit, (3) light has no time, (4) measuring c by hand, (5) what light is — a self-propagating wave, (6) measuring c from Maxwell + outro.

#### Scenario: Chapter route redirects to first step

- **WHEN** a user navigates to the chapter root route
- **THEN** the router redirects to the chapter's step 1

#### Scenario: Chapter is prerendered and listed

- **WHEN** the build enumerates routes for prerender and sitemap generation
- **THEN** each of the chapter's six steps emits a `/chapter/2/step/<s>` path
- **AND** the chapter appears in the landing/chapter-index journey list at position 2

### Requirement: The speed of light is made tangible

Step 1 SHALL present the magnitude of `c` through everyday comparisons rather than only an abstract figure, using values derived from a single speed-of-light constant via `@lm/physics` helpers.

#### Scenario: Tangible comparisons are shown

- **WHEN** Step 1 runs
- **THEN** narration states `c ≈ 300,000 km/s`
- **AND** it expresses `c` as roughly 7.5 laps around the Earth each second, ≈1.3 s from Earth to the Moon, and ≈8 minutes 20 seconds from the Sun to the Earth
- **AND** these figures are computed from the shared speed-of-light constant, not hard-coded independently

### Requirement: c is presented as the limit of causality

Step 2 SHALL frame `c` as the universal speed limit of cause and effect — the speed of information — not merely the speed of light, using the light cone as the boundary of which events can influence which.

#### Scenario: The causal limit is shown on the light cone

- **WHEN** Step 2 runs
- **THEN** it shows the light cone as the boundary between reachable (causally connectable) and unreachable events
- **AND** narration states that no object, signal, or influence can travel faster than `c`
- **AND** it connects this limit to the propagation of information / cause and effect

### Requirement: Light's timelessness is introduced as a teaser

Step 3 SHALL convey that light spends its entire spacetime speed on space and therefore none on time, so that from a photon's perspective emission and absorption are a single instant — framed as the `v→c` limit of proper time and as a result the speed budget chapter will derive, not as a claim that a photon has a physical rest frame.

#### Scenario: Photon timelessness narrated without a rest-frame claim

- **WHEN** Step 3 runs
- **THEN** narration states that a photon emitted and absorbed billions of years apart in our frame experiences a single instant
- **AND** it attributes this to light spending all of its speed on space (none on time), i.e. proper time → 0 as `v → c`
- **AND** it does not assert that a photon has a valid inertial rest frame
- **AND** it flags that the speed budget chapter will make this geometric

### Requirement: c is measured by a direct flash-and-detect experiment

Step 4 SHALL present a concrete measurement: two stations a known distance apart with synchronized clocks, one emitting a flash and the other detecting it, with `c` computed as distance divided by elapsed time using a `@lm/physics` helper.

#### Scenario: Flash experiment yields c from distance and time

- **WHEN** Step 4 runs the two-station experiment over a known baseline (e.g. 1 km)
- **THEN** a pulse travels from the emitter station to the detector station
- **AND** the detector stops its clock on arrival
- **AND** `c` is computed as distance ÷ elapsed time and presented as ≈300,000 km/s

### Requirement: Light is shown to be a self-propagating electromagnetic wave

Step 5 SHALL depict light as an electromagnetic wave: perpendicular, phase-locked oscillating electric and magnetic fields, with narration explaining that a changing electric field induces a magnetic field and a changing magnetic field induces an electric field, so the wave carries itself forward.

#### Scenario: Perpendicular phase-locked E and B fields with induction narrative

- **WHEN** Step 5 runs
- **THEN** it shows an electric field oscillation and a magnetic field oscillation that are perpendicular to each other and in phase, propagating along the travel axis
- **AND** narration explains the mutual induction (changing E → B, changing B → E) that sustains propagation

### Requirement: c is derived from Maxwell's electromagnetic constants and matches the experiment

Step 6 SHALL show that the self-propagating wave's speed follows from the electric and magnetic constants as `c = 1/√(ε₀μ₀)`, computed via a `@lm/physics` helper, and that this value matches the figure measured by the flash experiment in Step 4.

#### Scenario: Maxwell c equals the measured c

- **WHEN** Step 6 evaluates `c = 1/√(ε₀μ₀)` from the electromagnetic constants
- **THEN** the result is ≈300,000 km/s
- **AND** narration notes it is the same speed obtained by the direct flash measurement — two independent roads to one number

### Requirement: Outro bridges to the speed budget

The final step's outro SHALL position `c` as the universal speed that the speed budget builds on, and bridge to the next chapter ("The speed budget"). It SHALL NOT introduce gravity, length contraction, or `E=mc²`.

#### Scenario: Outro hands off to the speed budget

- **WHEN** the final step's narrate beats run
- **THEN** narration frames `c` as the speed everything shares through spacetime, setting up the speed budget
- **AND** no beat introduces curved spacetime, length contraction, or mass–energy

### Requirement: Chapter navigation

The chapter SHALL support forward/back transport between consecutive steps and link to the adjacent chapters per the updated journey map.

#### Scenario: Forward and back move between steps and chapters

- **WHEN** the user advances at a step's last checkpoint
- **THEN** the router navigates to the next step (or to "The speed budget" step 1 from the final step)
- **AND** rewinding at the first checkpoint navigates to the previous step (or to "Position, time, spacetime" from step 1)
