# chapter-twin-paradox Specification

## Purpose

Chapter 8 "The twin paradox" — the worldline payoff of flat spacetime, placed immediately after Doppler (Chapter 7). It draws both twins' worldlines on the spacetime diagram, states the apparent paradox, resolves it via the asymmetry of the turnaround (the straight worldline accumulates the most proper time), and offers a Doppler-counting view. Numbering and routes (`/chapter/:chapter/step/:step`) are owned by `reorder-chapters-and-route-scheme`; scenarios reference steps by ordinal within this chapter.
## Requirements
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

### Requirement: Turnaround speed is interactive with live proper-time readout

The chapter SHALL provide a guided-exploration control (a glowing slider bound through the `TargetRegistry`) that lets the reader vary the traveller's speed and watch the two twins' accumulated proper times — and the Doppler pulse counts — update live. The stay-at-home total, the traveller total, and the age difference SHALL reflect the chosen speed in real time, turning the stated "8 vs 10 years" into a discovered result.

#### Scenario: Dragging speed updates both proper-time totals

- **WHEN** the reader drags the traveller-speed slider
- **THEN** the traveller's accumulated proper time decreases relative to the stay-at-home's as speed increases
- **AND** the age-difference readout updates in real time without requiring playback

#### Scenario: Pulse counts track the proper-time totals

- **WHEN** the Doppler-counting view is active and the reader changes the speed
- **THEN** the received-pulse counts for each twin stay consistent with the displayed proper-time totals

### Requirement: The Minkowski diagram convention is distinguished from the speed-budget diagram

When the worldline (Minkowski) diagram is used — where light is a 45° line — the chapter SHALL include a brief beat acknowledging that this differs from the Epstein speed-budget diagram (where light lies flat along the space axis) taught earlier, so the reader is not silently confused by light appearing at a different angle.

#### Scenario: Convention shift is acknowledged

- **WHEN** the 45° light pulses first appear on the worldline diagram
- **THEN** a beat notes that this diagram plots coordinate time and space (light at 45°), distinct from the earlier speed-budget picture where light lay along the space axis
- **AND** the acknowledgment is brief and does not derive the difference formally

