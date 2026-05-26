# chapter-03-step-01 Specification

## Purpose
TBD - created by archiving change chapter-03-light-information. Update Purpose after archive.
## Requirements
### Requirement: Step 1 — Light through space

Chapter 3 Step 1 ("Light through space") SHALL be the first step of Chapter 3 at `/ch/03/step/1`. It SHALL introduce the camera-switch from spacetime diagram to top-down 2-D space, render exactly one source and one observer in `lm-light-scene`, animate one pulse from emission to arrival at the observer, and tick the observer's counter once on arrival.

#### Scenario: Step renders the camera-switch
- **WHEN** the reader navigates to `/ch/03/step/1`
- **THEN** the step frame shows chapter title "Light and information" and step counter "01 / 5"
- **AND** the right-hand visual is a `lm-light-scene` primitive (no spacetime-diagram axes)
- **AND** the opening narrate beat explicitly states the camera has changed from the spacetime diagram to a top-down view of space

#### Scenario: Single pulse animates and reaches the observer
- **WHEN** the timeline runs the `scene.time` animate segment
- **THEN** a circle expands from the source
- **AND** when the radius reaches the observer's position, a glow appears on the observer
- **AND** the FactLine `observer · pulses received` increments from `0` to `1`

#### Scenario: Step completes with continue enabled
- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/03/step/2`

### Requirement: Step 1 narration constraints

Step 1's narration SHALL NOT introduce moving observers, multiple sources, simultaneity, Doppler effects, or aberration. The single pedagogical claim is: light expands through space at $c$ and arrives somewhere later.

#### Scenario: Forbidden topics absent
- **WHEN** Step 1's narrate beats are inspected
- **THEN** none of the beats contain words "Doppler", "redshift", "blueshift", "simultaneity", "ether", or "aberration"

