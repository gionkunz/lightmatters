## ADDED Requirements

### Requirement: In-narration chapter references resolve to live route numbers

Every reference of the form "Chapter N" that appears in narrate `text` and other reader-visible step copy SHALL name the **live route number** of the chapter it refers to, per the current journey map (`/chapter/1` … `/chapter/13`). References to a topic SHALL point at the chapter that actually teaches that topic.

#### Scenario: Backward reference points at the right chapter

- **WHEN** a beat references the speed budget introduced earlier
- **THEN** it names Chapter 3 (the speed-budget chapter), not a pre-reorder number

#### Scenario: Forward "next chapter" reference is correct

- **WHEN** a chapter's outro previews the next chapter
- **THEN** the named chapter number equals the actual next route (e.g. the rolling-diagram outro points at Chapter 12, not Chapter 11)

#### Scenario: Cone / bulge references match the gravity chapters

- **WHEN** narration references where the paper was bent into a cone
- **THEN** it names Chapter 11 (rolling the diagram), and references to the Epstein bulge name Chapter 12

### Requirement: Automated guard prevents cross-reference regression

The test suite SHALL include a guard that scans narration `text` fields for "Chapter N" references and fails when a number falls outside the valid route range (1–13) or, where a reference is associated with a known topic, when it does not match that topic's live route. The valid mapping SHALL derive from a single source of truth (the route/chapter registry constants), not a number duplicated in the test.

#### Scenario: Out-of-range reference fails the build

- **WHEN** a narrate string references "Chapter 14" or higher (or 0)
- **THEN** the guard test fails

#### Scenario: Topic/route mismatch fails the build

- **WHEN** a narrate string references a known topic with the wrong chapter number after a future reorder
- **THEN** the guard test fails, pointing at the offending file and string
