## ADDED Requirements

> Note: this chapter is **Chapter 8 "The twin paradox"** in the locked v1.0 map (immediately after Doppler, Chapter 7). Numbering and routes (`/chapter/:chapter/step/:step`) are owned by `reorder-chapters-and-route-scheme`. Scenarios reference steps by ordinal within this chapter.

### Requirement: Twin Paradox chapter exists as a feature lib

The workspace SHALL provide a feature library for "The twin paradox" chapter, tagged `scope:feature`, exporting lazy-loaded routes, registered in the chapter registry and prerender/sitemap step list. Steps: (1) setup with both worldlines, (2) the apparent paradox, (3) the asymmetry/turnaround resolution, (4) the Doppler-counting view, (5) outro.

#### Scenario: Chapter route redirects to first step

- **WHEN** a user navigates to the chapter root route
- **THEN** the router redirects to the chapter's step 1

### Requirement: Twin worldlines on the spacetime diagram

The chapter SHALL render, on the `spacetime-diagram` (time vertical), the stay-at-home twin's straight worldline and the traveller twin's out-and-back bent worldline, with the turnaround shown as a corner. The two accents (A/B) SHALL follow the semantic color grammar.

#### Scenario: Both worldlines drawn with the turnaround visible

- **WHEN** Step 1 renders
- **THEN** the stay-at-home worldline is straight (vertical) and the traveller worldline goes out and returns with a visible bend at turnaround
- **AND** the two twins use the A/B accent colors per the visual grammar

### Requirement: Apparent paradox then asymmetry resolution

Narration SHALL state the apparent paradox (each sees the other's clock run slow) and then resolve it via the **asymmetry** of the paths: the traveller turns around (a frame change / worldline corner) while the stay-at-home does not, so the situation is not symmetric. The chapter SHALL show that the straight worldline accumulates the **most proper time**, so the traveller returns younger. Resolution SHALL NOT attribute the effect to gravity.

#### Scenario: Paradox is stated

- **WHEN** Step 2's narrate beats run
- **THEN** narration states that, naively, each twin sees the other's clock run slow

#### Scenario: Asymmetry resolves the paradox

- **WHEN** Step 3 runs
- **THEN** narration identifies the traveller's turnaround as what breaks the symmetry
- **AND** the visualization/readout shows the straight (stay-at-home) worldline has the greater accumulated proper time
- **AND** the traveller is younger on reunion
- **AND** no beat claims gravity or acceleration "magic" is the cause beyond making the traveller's frame non-inertial

### Requirement: Doppler-counting view makes the result concrete

The chapter SHALL include a view where each twin emits regular light pulses and the other counts them, reusing the relativistic Doppler helper and the light clock. It SHALL show that the traveller sees the stay-at-home's pulse rate switch from red- to blue-shifted at turnaround, while the stay-at-home sees the switch only much later (light-travel delay) — accounting for the unequal totals and matching the proper-time result.

#### Scenario: Pulse counts match the proper-time result

- **WHEN** the Doppler-counting view runs
- **THEN** the traveller's received-pulse rate changes at its turnaround, and the stay-at-home's changes later
- **AND** the total counts are consistent with the traveller having aged less
- **AND** the pulse spacing uses the relativistic Doppler factor (not classical only)

#### Scenario: Doppler view degrades gracefully without the helper

- **WHEN** the relativistic Doppler helper or light clock is not yet available
- **THEN** the chapter still delivers the worldline/proper-time resolution
- **AND** the Doppler-counting view is gated until its dependencies exist

### Requirement: Outro — proper time is path-dependent

The outro SHALL state that proper time depends on the path through spacetime — the straightest worldline ages the most — and bridge forward. It SHALL NOT introduce E=mc² or curved spacetime as resolved topics.

#### Scenario: Outro states straightest = oldest

- **WHEN** the final step's narrate beats run
- **THEN** narration states proper time is path-dependent and the straight worldline accumulates the most
