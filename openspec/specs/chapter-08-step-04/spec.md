# chapter-08-step-04 Specification

## Purpose
TBD - created by archiving change chapter-08-light-bending. Update Purpose after archive.
## Requirements
### Requirement: Step 4 — The path puzzle

Chapter 8 Step 4 ("The path puzzle") SHALL be at `/ch/08/step/4`. It SHALL render the dual-edge beam (full or near-full progress) on the deep well. Narration and/or on-canvas annotations SHALL compare spatial path lengths: the outer edge travels a **longer** path than the inner edge. The step SHALL pose the puzzle — how can both edges arrive at the same time without the outer edge exceeding the speed of light — and SHALL NOT resolve it.

#### Scenario: Step highlights unequal path lengths

- **WHEN** the reader navigates to `/ch/08/step/4`
- **THEN** inner and outer beam edges are visible on the deep well
- **AND** narration or annotations indicate the outer edge's spatial path is longer than the inner edge's

#### Scenario: Puzzle posed without resolution

- **WHEN** Step 4's narrate beats run
- **THEN** at least one beat asks how both edges can arrive synchronized
- **AND** no beat explains gravitational time dilation as the answer

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/08/step/5`

### Requirement: Step 4 narration constraints

Step 4's narration SHALL NOT state that the inner edge runs slow due to time dilation or that dilation compensates for path length. It SHALL NOT claim light is pulled by a gravitational force.

#### Scenario: Forbidden resolution absent

- **WHEN** Step 4's narrate beats are inspected
- **THEN** none of the beats contain a settled explanation for synchronized arrival

