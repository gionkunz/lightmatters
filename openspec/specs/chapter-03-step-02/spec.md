# chapter-03-step-02 Specification

## Purpose
TBD - created by archiving change chapter-03-light-information. Update Purpose after archive.
## Requirements
### Requirement: Step 2 — Two listeners

Chapter 3 Step 2 ("Two listeners") SHALL render one source between two stationary observers placed at equal distance from the source, animate a single pulse, and demonstrate that both observers' counters tick at the same scene time.

#### Scenario: Symmetric stationary observers
- **WHEN** Step 2 renders
- **THEN** the scene contains exactly one source and two observers labeled `A` and `B`
- **AND** `|A − S| = |B − S|` to within layout tolerance
- **AND** neither observer has a velocity field set

#### Scenario: Simultaneous arrival
- **WHEN** the pulse animation completes
- **THEN** both observers receive the pulse at the same scene time
- **AND** both FactLines tick from `0` to `1` at that instant

#### Scenario: Step routes forward
- **WHEN** the reader advances at the final wait
- **THEN** the router navigates to `/ch/03/step/3`

