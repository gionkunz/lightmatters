# chapter-06-step-01 Specification

## Purpose
TBD - created by archiving change chapter-06-folded-spacetime. Update Purpose after archive.
## Requirements
### Requirement: Step 1 — A point in time

Chapter 6 Step 1 ("A point in time") SHALL be the first step at `/ch/06/step/1`. It SHALL render `lm-spacetime-diagram` with `variant="time-only"`, animate a point rising along the vertical time axis, and narrate that a body at rest in space moves only through time — reconnecting memory from Chapter 1 Step 2.

#### Scenario: Step renders time-only recap

- **WHEN** the reader navigates to `/ch/06/step/1`
- **THEN** the step frame shows chapter title "Rolling the diagram: gravity as geometry" and step counter "01 / 5"
- **AND** the visual is `lm-spacetime-diagram` with `variant="time-only"` (no space axis)
- **AND** no WebGL canvas is present on this step

#### Scenario: Point ages through time

- **WHEN** the timeline runs the `diagram.time` animate segment
- **THEN** the point marker rises smoothly along the vertical time axis from bottom toward top

#### Scenario: Step completes with continue enabled

- **WHEN** the timeline reaches its final wait
- **THEN** the continue button is enabled
- **AND** advancing routes to `/ch/06/step/2`

### Requirement: Step 1 narration constraints

Step 1's narration SHALL NOT introduce cylinder folding, cones, gravity, or WebGL. The single pedagogical claim is: at rest in space, you move only through time — the worldline is a vertical line.

#### Scenario: Forbidden topics absent

- **WHEN** Step 1's narrate beats are inspected
- **THEN** none of the beats contain "cylinder", "cone", "gravity", "fold", or "WebGL"

