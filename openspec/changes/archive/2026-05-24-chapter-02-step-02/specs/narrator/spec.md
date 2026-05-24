## ADDED Requirements

### Requirement: Chat-feed narrator renders stacked beats

The engine SHALL provide an `LmNarratorChatFeed` component that renders a kicker label, a vertical stack of past narration beats at reduced opacity, and a current beat with a left accent border — driven by timeline `narrate` events.

#### Scenario: Past beats render faded below current beat

- **WHEN** the timeline completes two narrate events and is revealing a third
- **THEN** the first two beats appear as static text at 19px serif and opacity 0.45
- **AND** the third beat appears as the current beat at 24px serif with a 2px solid inkMid left border

#### Scenario: Current beat uses progressive letter reveal

- **WHEN** a narrate event is actively revealing text in chat-feed layout
- **THEN** the current beat displays characters sequentially with fade-in animation
- **AND** inline LaTeX in the current beat renders via MathJax consistent with `LmNarrator`

#### Scenario: Chat-feed narrator displays step kicker

- **WHEN** Step 2 loads with kicker "two travellers"
- **THEN** the kicker label appears above the beat stack in mono uppercase styling

### Requirement: Timeline runner exposes completed narrate texts for chat-feed

The `TimelineRunner` SHALL expose the list of fully completed narrate event texts so chat-feed layout components can render them as past beats without re-animating.

#### Scenario: Completed narrate texts accumulate

- **WHEN** the timeline finishes narrate event at index 0 and begins narrate event at index 1
- **THEN** the runner exposes the text of event 0 as a completed beat
- **AND** event 1 is the active current beat
