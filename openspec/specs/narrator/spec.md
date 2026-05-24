# narrator Specification

## Purpose
TBD - created by archiving change chapter-01-step-01. Update Purpose after archive.
## Requirements
### Requirement: Narrator renders progressive typewriter text

The engine SHALL provide an `LmNarrator` component that displays narrator text in EB Garamond with a typewriter reveal effect driven by timeline `narrate` events.

#### Scenario: Text reveals character by character

- **WHEN** a narrate event supplies the text "Position is a location on a line."
- **THEN** the narrator component displays characters sequentially until the full sentence is visible

#### Scenario: Narrator shows an active caret during reveal

- **WHEN** text is mid-reveal
- **THEN** a blinking caret indicator is visible at the insertion point

### Requirement: Skip completes narrator text instantly

When the timeline runner's `skip()` is invoked during a narrate reveal, the narrator SHALL display the full text of the current chunk immediately.

#### Scenario: Skip shows complete narration

- **WHEN** a narrate reveal is 60% complete and the user skips
- **THEN** the full narration chunk is visible without waiting for remaining characters

### Requirement: Narrator displays step kicker

The narrator region SHALL render an optional kicker label (IBM Plex Mono, uppercase) above the narration body when the step defines one.

#### Scenario: Kicker renders for Step 1

- **WHEN** Step 1 loads with kicker "position"
- **THEN** the kicker label "position" appears above the narration text in mono uppercase styling

### Requirement: Narrator text is accessible DOM content

Narrator text SHALL be rendered as real HTML text nodes (not canvas or SVG), readable by screen readers.

#### Scenario: Narration is in the accessibility tree

- **WHEN** Step 1 renders with active narration
- **THEN** the narration text is present as DOM text content accessible to assistive technology

