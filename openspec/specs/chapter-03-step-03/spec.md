# chapter-03-step-03 Specification

## Purpose
TBD - created by archiving change chapter-03-light-information. Update Purpose after archive.
## Requirements
### Requirement: Step 3 — One of them moves

Chapter 3 Step 3 ("One of them moves") SHALL reuse Step 2's geometry but give one observer a uniform velocity along the source-observer line at `v/c ≈ 0.4`, then animate a single pulse and show that the moving observer receives it at a different scene time than the stationary one.

#### Scenario: One observer moves uniformly
- **WHEN** Step 3 renders
- **THEN** observer `A` is stationary
- **AND** observer `B` has a velocity field with magnitude approximately `0.4` in scene units per scene-time unit, directed along the line from `B`'s start position toward the source

#### Scenario: Asymmetric arrival
- **WHEN** the pulse animation completes
- **THEN** the FactLine for `B · pulses received` ticks at a strictly earlier (or later, depending on direction) scene time than `A · pulses received`
- **AND** narration explicitly states that motion changed when the news arrived (without invoking Doppler, redshift, or blueshift terminology)

#### Scenario: Pedagogy stays scoped
- **WHEN** Step 3's narrate beats are inspected
- **THEN** none of the beats claim a frequency shift, a wavelength change, or a Doppler effect
- **AND** beats refer only to arrival time, not to pulse rhythm

#### Scenario: Step routes forward
- **WHEN** the reader advances at the final wait
- **THEN** the router navigates to `/ch/03/step/4`

