# chapter-03-step-05 Specification

## Purpose
TBD - created by archiving change chapter-03-light-information. Update Purpose after archive.
## Requirements
### Requirement: Step 5 — Outro

Chapter 3 Step 5 SHALL be a short narration-only outro that connects Chapter 3's spatial story back to Chapter 2's clocks, names what is coming in Chapters 4–5 (ether, source motion, Doppler, aberration), and routes the reader to Chapter 4 (or its placeholder).

#### Scenario: Outro is narration-only
- **WHEN** Step 5 renders
- **THEN** the right-hand visual is a final still of the Step 4 scene (or a quiet placeholder), with no new animation
- **AND** the timeline contains only `narrate` and `wait` events (no `animate`)

#### Scenario: Connects back and forward
- **WHEN** the reader reads the narration in order
- **THEN** at least one beat references Chapter 2's clocks
- **AND** at least one beat names topics deferred to later chapters (Doppler, aberration, ether — at least one of these names appears)

#### Scenario: Step routes to Chapter 4
- **WHEN** the reader advances at the final wait
- **THEN** the router navigates to `/ch/04/step/1`
- **AND** the chapter-04 route resolves to at least a placeholder component

