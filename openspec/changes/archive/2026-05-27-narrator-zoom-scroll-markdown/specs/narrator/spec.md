## ADDED Requirements

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

## MODIFIED Requirements

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
