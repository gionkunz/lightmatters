# chapter-mass-energy Specification

## Purpose

Chapter 9 "Mass is energy (E=mc²)" — the flat-spacetime capstone before the gravity block. It reframes the Chapter 2 speed budget as energy, establishes that light carries momentum, derives \(E=mc^2\) via the photon-in-a-box thought experiment (center-of-mass puzzle, then see-saw moment balance), and bridges forward: mass-energy is what curves spacetime. Numbering and routes (`/chapter/:chapter/step/:step`) are owned by `reorder-chapters-and-route-scheme`; scenarios reference steps by ordinal within this chapter.

## Requirements

> Note: this chapter is **Chapter 9** in the locked v1.0 map (end of the flat-spacetime block, before "Rolling the diagram"); its route follows the `/chapter/:chapter/step/:step` scheme. Numbering and routes are owned by `reorder-chapters-and-route-scheme`. Scenarios reference steps by ordinal within this chapter.

### Requirement: Mass–Energy chapter exists as a feature lib

The workspace SHALL provide a feature library for the "Mass is energy" (\(E=mc^2\)) chapter, tagged `scope:feature`, exporting lazy-loaded routes, registered in the chapter registry and prerender/sitemap step list. Steps: (1) hook, (2) rest energy as motion through time, (3) light carries momentum, (4) setting the trap (photon-in-a-box: emit, recoil, cross, shift — the center-of-mass puzzle), (5) balancing the see-saw (the moment-balance algebra that yields \(m = E/c^2\)), (6) payoff and bridge to gravity. An optional Epstein aside (belt and/or mirror) MAY be added as an extra step or inline card.

#### Scenario: Chapter route redirects to first step

- **WHEN** a user navigates to the chapter root route
- **THEN** the router redirects to the chapter's step 1

#### Scenario: Steps registered for prerender

- **WHEN** the build enumerates prerendered routes
- **THEN** all steps of this chapter appear in the chapter step list used for prerender and sitemap

### Requirement: Hook frames E=mc² as already implied

Step 1 narration SHALL pose that the journey so far seemed unrelated to \(E=mc^2\), yet the equation follows from what was already learned, and SHALL set up that this chapter reveals the link.

#### Scenario: Hook poses the question

- **WHEN** Step 1's narrate beats run
- **THEN** narration acknowledges \(E=mc^2\) as the famous equation everyone knows
- **AND** states it is connected to the speed budget / relativity already covered, to be shown in this chapter

### Requirement: Rest energy as motion through time

Step 2 SHALL reinterpret the Chapter 2 speed-budget vector in terms of energy: at rest, all of \(c\) is spent on motion through time, which is the rest energy \(mc^2\); motion converts part of the budget into kinetic energy, giving total \(E=\gamma mc^2\). It SHALL reuse the spacetime-diagram speed-budget vector with an energy readout.

#### Scenario: Rest energy shown as pure time-motion

- **WHEN** Step 2 renders at rest (`v/c = 0`)
- **THEN** the budget vector is vertical (all motion through time)
- **AND** narration/readout identifies this state's energy as the rest energy \(mc^2\)

#### Scenario: Total energy grows with speed

- **WHEN** the user increases `v/c`
- **THEN** the readout shows total energy increasing as \(\gamma mc^2\)
- **AND** narration identifies the increase over \(mc^2\) as kinetic energy

### Requirement: Light carries momentum

Step 3 SHALL establish that light carries momentum \(p = E/c\) (and behaves as if carrying mass), motivated by radiation pressure (comet tail / solar sail) — the one new fact the derivation needs. Narration SHALL connect this to light already seen in the journey (wavefronts carrying energy at \(c\)).

#### Scenario: Light pushes matter

- **WHEN** Step 3's visual and narrate beats run
- **THEN** a visual shows light exerting a push on matter (e.g. a comet tail / solar sail)
- **AND** narration states that light therefore carries momentum \(p = E/c\)

### Requirement: Photon-in-a-box setup (the center-of-mass puzzle)

Step 4 SHALL motivate the experiment ("what if we could prove energy has mass just by measuring how a box shifts?") and animate a floating, isolated box (mass \(M\), length \(L\)) at rest with its center of mass marked by a fixed reference line and its starting outline shown as a ghost. A photon (energy \(E\), momentum \(E/c\)) emitted from one wall SHALL make the box recoil leftward at speed \(v\) (labelled), and on absorption at the far wall the box SHALL come to rest displaced left by \(\Delta x\) (labelled). The step SHALL pose the puzzle: the box moved but the center of mass did not, so the light must have carried mass to the right. An interactive control SHALL let the reader vary the photon energy and observe the recoil and shift while the center-of-mass reference stays fixed.

#### Scenario: Center of mass stays fixed while the box recoils

- **WHEN** Step 4's timeline runs
- **THEN** the box recoils on emission and stops, displaced left, on absorption
- **AND** the marked center-of-mass reference does not move at any point
- **AND** narration poses that the light must have transported mass to keep the center of mass fixed

#### Scenario: Energy control scales recoil and shift

- **WHEN** the reader varies the photon energy \(E\)
- **THEN** the box recoil (\(v\)) and shift (\(\Delta x\)) scale with \(E\)
- **AND** the center-of-mass reference remains fixed for every value

### Requirement: See-saw moment-balance derivation

Step 5 SHALL complete the derivation using a see-saw (moment-balance) visual: the heavy box close to the pivot (small arm \(\Delta x\)) balances the light photon far out (long arm \(L\)). It SHALL define a moment as mass × distance (units kg·m, not energy), set the two moments equal (\(M\,\Delta x = m\,L\)), substitute \(\Delta x = EL/(Mc^2)\) (from \(v = E/(Mc)\) and crossing time \(t = L/c\)), and cancel to \(m = E/c^2\), explaining that the two factors of \(c\) (push and crossing time) are why it is \(c\) squared. An interactive control SHALL let the reader vary \(E\) and observe both moments grow together while the beam stays level.

#### Scenario: Moments balance for every energy

- **WHEN** Step 5's see-saw visual runs and the reader varies \(E\)
- **THEN** the box moment \(M\,\Delta x\) and light moment \(m\,L\) grow together and remain equal
- **AND** narration cancels the balance to \(m = E/c^2\), attributing the squared \(c\) to the push (\(E/c\)) and the crossing time (\(L/c\))

### Requirement: Optional Epstein derivation asides

The chapter MAY include short "another way to see it" asides presenting Epstein's conveyor-belt and/or moving-mirror derivations. If included, each aside SHALL be clearly optional (skippable, not gating forward progress) and SHALL reach the same result \(E = mc^2\).

#### Scenario: Aside is optional and consistent

- **WHEN** an Epstein-derivation aside is present
- **THEN** it does not gate forward navigation
- **AND** it concludes with \(E = mc^2\), consistent with the photon-in-a-box result

### Requirement: Payoff and bridge to gravity

Step 6 SHALL state that mass is concentrated energy (with \(c^2\) as the large conversion factor, illustrated by a balanced example such as the Sun), and SHALL bridge to the gravity chapters by noting that mass-energy is what curves spacetime.

#### Scenario: Payoff and bridge present

- **WHEN** Step 6's narrate beats run
- **THEN** narration states mass and energy are the same thing, scaled by \(c^2\)
- **AND** a beat bridges forward: mass-energy curves spacetime (leading into the gravity chapters)

### Requirement: Chapter navigation

The chapter SHALL support forward/back transport between consecutive steps and link to the adjacent chapters per the final journey map (previous: the last SR chapter; next: "Rolling the diagram").

#### Scenario: Forward and back move between steps

- **WHEN** the user advances at a step's last checkpoint
- **THEN** the router navigates to the next step (or the gravity chapter from the final step)
- **AND** rewinding at the first checkpoint navigates to the previous step (or previous chapter from step 1)
