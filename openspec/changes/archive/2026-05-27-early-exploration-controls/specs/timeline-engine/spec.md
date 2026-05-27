## ADDED Requirements

### Requirement: Exploration controls unlock at pre-exploration event start

When the timeline begins the last `narrate` or `animate` event immediately before a `{ wait: { for: 'userAdvance' } }` event, the runner SHALL set `atExplorationWait` to true so step-authored interactive controls become enabled while that event is still in progress (including during narrate typing or an in-flight animate tween).

#### Scenario: Slider unlocks when pre-exploration narrate starts

- **WHEN** the runner begins a `narrate` event that is immediately followed by `{ wait: { for: 'userAdvance' } }`
- **THEN** `atExplorationWait` reads true before narrate typing completes
- **AND** step components bound to `atExplorationWait` enable interactive controls

#### Scenario: Controls unlock when pre-exploration animate starts

- **WHEN** the runner begins an `animate` event that is immediately followed by `{ wait: { for: 'userAdvance' } }`
- **THEN** `atExplorationWait` reads true while the tween is in progress

#### Scenario: Exploration flag clears after userAdvance

- **WHEN** the user advances past a `{ wait: { for: 'userAdvance' } }` event
- **THEN** `atExplorationWait` reads false until the next pre-exploration event begins

#### Scenario: Narration continues while controls are unlocked

- **WHEN** `atExplorationWait` is true during an in-progress pre-exploration narrate event
- **THEN** narrate typing continues until completion
- **AND** the timeline still enters the `userAdvance` wait after the pre-exploration event completes
