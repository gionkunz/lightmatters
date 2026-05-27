# narrator Specification

## Purpose

Progressive narration UI driven by timeline `narrate` events. Renders step kickers and body text as accessible DOM content in the step frame.
## Requirements
### Requirement: Narrator renders progressive letter reveal

The engine SHALL provide an `LmNarrator` component that displays narrator text in EB Garamond with a sequential letter reveal driven by timeline `narrate` events. Each letter fades in (`~450ms ease-out`) as it appears. Words SHALL be grouped so line breaks do not split words mid-token. No blinking caret.

#### Scenario: Text reveals character by character

- **WHEN** a narrate event supplies the text "Position is a location on a line."
- **THEN** the narrator component displays characters sequentially until the full sentence is visible
- **AND** each visible letter uses a fade-in animation

#### Scenario: Words do not break mid-token

- **WHEN** narration wraps across lines on a narrow viewport
- **THEN** line breaks occur between words, not within a word

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

### Requirement: Chat-feed narrator renders stacked beats

The engine SHALL provide an `LmNarratorChatFeed` component that renders a kicker label, a vertically scrollable stack of past narration beats at reduced opacity, and a current beat with a left accent border — driven by timeline `narrate` events.

#### Scenario: Past beats render faded below current beat

- **WHEN** the timeline completes two narrate events and is revealing a third
- **THEN** the first two beats appear as static text at 19px serif and opacity 0.45
- **AND** the third beat appears as the current beat at 24px serif with a 2px solid inkMid left border

#### Scenario: Current beat uses progressive letter reveal

- **WHEN** a narrate event is actively revealing text in chat-feed layout
- **THEN** the current beat displays characters sequentially with fade-in animation
- **AND** inline LaTeX in the current beat renders via MathJax consistent with `LmNarrator`
- **AND** inline Markdown emphasis in the current beat renders with bold/italic styling consistent with `LmNarrator`

#### Scenario: Chat-feed narrator displays step kicker

- **WHEN** Step 2 loads with kicker "two travellers"
- **THEN** the kicker label appears above the beat stack in mono uppercase styling

### Requirement: Timeline runner exposes completed narrate texts for chat-feed

The `TimelineRunner` SHALL expose the list of fully completed narrate event texts so chat-feed layout components can render them as past beats without re-animating.

#### Scenario: Completed narrate texts accumulate

- **WHEN** the timeline finishes narrate event at index 0 and begins narrate event at index 1
- **THEN** the runner exposes the text of event 0 as a completed beat
- **AND** event 1 is the active current beat

### Requirement: Chat-feed narrator column scrolls when beats overflow

`LmNarratorChatFeed` SHALL constrain its beat stack to the available height of the narrator column and provide vertical scrolling when past + current beats exceed that height. When a new beat becomes current, the feed SHALL scroll so the current beat remains visible without manual intervention.

#### Scenario: Long beat history scrolls inside the column

- **WHEN** a chat-feed step accumulates more narration beats than fit in the left column viewport
- **THEN** the beat stack scrolls vertically within the narrator column
- **AND** diagram and slider content in sibling columns remain visible

#### Scenario: Current beat scrolls into view

- **WHEN** the timeline advances to a new narrate event in chat-feed layout
- **THEN** the current beat scrolls into the visible region of the feed
- **AND** past beats remain accessible by scrolling upward

### Requirement: Narrator renders inline Markdown emphasis

Narrate text in `LmNarrator` and `LmNarratorChatFeed` SHALL render common inline Markdown emphasis: `**text**` as bold and `*text*` as italic. Markup delimiter characters SHALL NOT appear in the rendered output. Emphasis SHALL participate in the existing letter-by-letter typewriter reveal (delimiters are not typed; emphasized characters reveal like plain text).

#### Scenario: Bold emphasis renders

- **WHEN** a narrate string contains `This is **important** news.`
- **AND** the typewriter has revealed through `important`
- **THEN** the word `important` appears bold (strong emphasis)
- **AND** no `*` characters are visible

#### Scenario: Italic emphasis renders

- **WHEN** a narrate string contains `An *ether* medium.`
- **AND** the typewriter has revealed through `ether`
- **THEN** the word `ether` appears italic
- **AND** no surrounding `*` characters are visible

#### Scenario: Emphasis in chat-feed past beats

- **WHEN** a completed narrate beat contained `**geodesic**`
- **THEN** the past beat renders `geodesic` in bold at past-beat opacity styling
- **AND** does not re-animate the typewriter

