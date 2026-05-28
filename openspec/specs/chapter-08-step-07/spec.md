# chapter-08-step-07 Specification

## Purpose
TBD - created by archiving change chapter-08-light-bending. Update Purpose after archive.
## Requirements
### Requirement: Step 7 — Straight lines, curved canvas

Chapter 8 Step 7 ("Straight lines, curved canvas") SHALL be at `/ch/08/step/7`. It SHALL render the dual-edge beam on the deep well and deliver the chapter payoff: light is not yanked by a force — it follows straight geodesics on curved spacetime. It SHALL provide an interactive control (glowing slider or equivalent) mapped to `lightBeamMissDistance` or `lightBeamHalfWidth` so the reader can explore how skim distance or beam width affects deflection. An outro SHALL open toward future topics (e.g. black holes, horizons) without implementing them.

#### Scenario: Step renders exploration control

- **WHEN** the reader navigates to `/ch/08/step/7`
- **THEN** the dual-edge beam renders on the deep well
- **AND** a glowing interactive control is visible that adjusts beam or skim parameters

#### Scenario: Interactive control updates beam

- **WHEN** the reader adjusts the exploration control
- **THEN** the light geodesics update in real time on the well surface
- **AND** timeline playback is not required for the visual to respond

#### Scenario: Narration delivers geodesic payoff

- **WHEN** Step 7's narrate beats run
- **THEN** narration states that light follows straight lines through curved spacetime, not a force
- **AND** does not describe gravity as a pull on photons

#### Scenario: Outro opens future chapters

- **WHEN** Step 7's final narrate beats run
- **THEN** narration references extreme gravity regimes beyond this chapter (e.g. black holes) as future territory

#### Scenario: Forward nav resolves to next placeholder

- **WHEN** the reader completes Step 7 and advances forward
- **THEN** the router navigates to the next-chapter placeholder route without error

### Requirement: Step 7 acknowledges spatial curvature as the other half of deflection

Chapter 8 Step 7 narration SHALL include a brief, honest acknowledgment that gravitational time dilation accounts for only part of light's deflection, and that the curvature of **space** itself supplies a comparable remaining part — so the full bending requires both. The acknowledgment SHALL be lightweight (one to two sentences), framed as opening toward deeper geometry rather than as a correction or formula, consistent with "intuition before formalism."

#### Scenario: Both-halves acknowledgment present

- **WHEN** Step 7's narrate beats run
- **THEN** at least one beat states that the clock effect (time dilation) is not the whole story
- **AND** a beat attributes the remaining deflection to the curvature of space, so that both together give the observed bend

#### Scenario: Acknowledgment stays intuitive

- **WHEN** the both-halves beat is inspected
- **THEN** it does not present a quantitative deflection formula or numeric factor as required content
- **AND** it remains consistent with the geodesic payoff that light follows straight lines on curved spacetime, not a force

