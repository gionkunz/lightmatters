## ADDED Requirements

> Note: the chapter's absolute number and route prefix (`/ch/<NN>`) are fixed by the cross-change "Placement & numbering" decision in design.md. Scenarios below reference steps by their ordinal within this chapter.

### Requirement: Clocks and Rulers chapter exists as a feature lib

The workspace SHALL provide a feature library for the "Clocks and rulers" chapter, tagged `scope:feature`, exporting a `Routes` array lazy-loaded by the app shell, registered in the chapter registry and the prerender/sitemap step list. The chapter SHALL contain an ordered sequence of steps: (1) the light clock at rest, (2) a moving clock runs slow, (3) length contraction, (4) outro.

#### Scenario: Chapter route redirects to first step

- **WHEN** a user navigates to the chapter root route
- **THEN** the router redirects to the chapter's step 1

#### Scenario: Steps are registered for prerender

- **WHEN** the build enumerates prerendered routes
- **THEN** all four steps of this chapter appear in the chapter step list used for prerender and sitemap

### Requirement: Step 1 — the light clock at rest

Step 1 SHALL render the `lm-light-clock` primitive at rest: a photon bouncing straight between two mirrors, each round trip marked as one tick. Narration SHALL establish that one bounce cycle is one tick of a clock and that the photon always travels at `c`.

#### Scenario: Stationary clock ticks with a vertical bounce

- **WHEN** Step 1 renders and its timeline runs
- **THEN** the photon path between mirrors is perpendicular to the mirrors (vertical bounce)
- **AND** narration states that one round trip equals one tick and the photon moves at `c`

### Requirement: Step 2 — a moving clock runs slow

Step 2 SHALL let the user set the clock's speed via a `v / c` slider. As `v/c` increases, the photon SHALL trace a longer diagonal path between mirrors at the same speed `c`, so each tick takes longer. A readout SHALL show the tick period (or tick rate) and SHALL equal the Lorentz factor relationship `tickPeriod = restPeriod · γ(v/c)`. Narration SHALL derive time dilation from the constant-`c` path argument and tie it back to the Chapter 2 speed-budget vector.

#### Scenario: Diagonal path lengthens with speed

- **WHEN** the user increases the `v / c` slider during exploration
- **THEN** the photon's bounce path becomes a longer diagonal
- **AND** the photon speed along that path remains `c` (path gets longer, not faster)

#### Scenario: Tick readout matches Lorentz factor

- **WHEN** the clock speed is `v/c`
- **THEN** the displayed tick period equals the rest period times `γ(v/c)` within display rounding
- **AND** at `v/c = 0` the moving and rest clocks tick together

#### Scenario: Narration ties to the speed budget

- **WHEN** Step 2's narrate beats run
- **THEN** narration states the longer light path (at fixed `c`) is *why* the moving clock ticks slow
- **AND** connects this to the Chapter 2 result that motion through space steals from motion through time

### Requirement: Step 3 — length contraction

Step 3 SHALL present length contraction as the partner of time dilation: a moving object is shorter along its direction of motion by the same Lorentz factor. The contraction SHALL be driven by `v/c` (slider or continuation of the prior control) and a readout SHALL reflect `L = L₀ · √(1 − v²/c²)`. Narration SHALL connect contraction to the constancy of `c` and may use the muon as the intuition.

#### Scenario: Contracted length matches the formula

- **WHEN** the object moves at `v/c`
- **THEN** the displayed/visualized length equals `L₀ · properTimeFraction(v/c)` within display rounding
- **AND** at `v/c = 0` the length equals the proper length `L₀`

#### Scenario: Contraction is along the direction of motion only

- **WHEN** the contraction is shown
- **THEN** only the dimension along the motion is shortened
- **AND** narration frames contraction as the inseparable partner of time dilation

### Requirement: Step 4 — outro ties dilation and contraction together

Step 4 SHALL summarize that time dilation and length contraction are two faces of one geometry (constant `c`), and SHALL bridge forward in the journey. It SHALL NOT introduce gravity or E=mc².

#### Scenario: Outro unifies the two effects

- **WHEN** Step 4's narrate beats run
- **THEN** narration states dilation and contraction both follow from light's constant speed
- **AND** no beat introduces curved spacetime or mass–energy

### Requirement: Chapter navigation

The chapter's steps SHALL support forward/back transport between consecutive steps, and the chapter SHALL link to the previous and next chapters per the final journey map.

#### Scenario: Forward and back move between steps

- **WHEN** the user advances at a step's last checkpoint
- **THEN** the router navigates to the next step (or the next chapter from the final step)
- **AND** rewinding at the first checkpoint navigates to the previous step (or previous chapter from step 1)
