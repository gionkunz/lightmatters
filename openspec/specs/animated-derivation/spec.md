# animated-derivation Specification

## Purpose
TBD - created by archiving change enhancements. Update Purpose after archive.
## Requirements
### Requirement: Derivation primitive renders an ordered sequence of formula frames

The design system SHALL provide an `lm-derivation` primitive that accepts an ordered array of **frames**, each a LaTeX expression, and renders the current frame as typeset math via the existing MathJax CHTML pipeline. The primitive SHALL expose a numeric playhead (a fractional frame index) so a step can drive it through the `TargetRegistry` with an ordinary `animate` event, requiring no new timeline event type.

#### Scenario: Frames render via MathJax CHTML

- **WHEN** an `lm-derivation` is given frames `['M\\cdot\\frac{EL}{Mc^2}=m\\cdot L', 'm=\\frac{E}{c^2}']` and a playhead at 0
- **THEN** the first frame typesets as inline/display CHTML
- **AND** advancing the playhead toward 1 transitions toward the second frame

#### Scenario: Driven by an animate event on a registry target

- **WHEN** a step registers a `derivation.frame` target and runs `{ type: 'animate', target: 'derivation.frame', from: 0, to: 1, duration: 2 }`
- **THEN** the primitive animates the transition between frame 0 and frame 1 over the tween
- **AND** no new timeline event type is required

### Requirement: Author-declared token identity drives token-level transitions

Animatable atoms within a frame SHALL be tagged with stable identifiers in the LaTeX (e.g. via `\cssId{tok}{...}`). Between consecutive frames the primitive SHALL treat tokens with the same identifier as the **same** token: shared tokens move from their old to new position, tokens absent from the next frame **exit**, and tokens new to the next frame **enter**. The primitive SHALL NOT infer token correspondence from glyph content.

#### Scenario: Shared token moves rather than re-renders

- **WHEN** a token tagged `E` appears in both frame N and frame N+1 at different positions
- **THEN** the rendered `E` animates from its old position to its new position during the transition

#### Scenario: Token identity is explicit, not inferred

- **WHEN** two different tokens happen to render the same glyph but carry different identifiers
- **THEN** they are treated as distinct (one may exit while the other enters), not matched together

### Requirement: Cancellation annotation provides the strike-and-fade effect

A frame transition MAY carry a `cancel` annotation listing token identifiers. Cancelled tokens SHALL animate through a distinct effect: tint to the accent-red, draw a strike-through, fade out, and collapse the surrounding gap so neighbouring tokens close in.

#### Scenario: Cancelling matching factors on both sides

- **WHEN** a transition annotates `cancel: ['M', 'L']`
- **THEN** the `M` and `L` tokens turn red, are struck through, fade out, and the remaining expression closes the gap they leave

### Requirement: Derivation exposes a skip-to-result affordance

The primitive SHALL support jumping directly to its final frame without playing intermediate transitions, so a reader who does not want the algebra still sees the result. This SHALL reuse the timeline's checkpoint-seek / skip semantics (seeking the playhead to its maximum) rather than introducing a separate control protocol.

#### Scenario: Skip lands on the final frame

- **WHEN** the reader skips or seeks the derivation playhead to its maximum
- **THEN** the final frame is shown in its resolved state
- **AND** no intermediate cancellation animation is required to have played

### Requirement: Derivation degrades gracefully during prerender

Because builds are statically prerendered without MathJax, the primitive SHALL render its first frame as static typeset-on-hydrate (mirroring the narrator's lazy-math handling) and SHALL confine token motion and cancellation animation to the client. It SHALL reserve layout space for the widest frame so transitions do not reflow surrounding content.

#### Scenario: No animation at prerender time

- **WHEN** the component is prerendered without MathJax available
- **THEN** it emits the first frame's content without error and without animation
- **AND** token motion begins only after client hydration

#### Scenario: Cancellation does not reflow the page

- **WHEN** a cancellation collapses tokens
- **THEN** the surrounding step layout does not shift, because the derivation reserves space for its widest frame

