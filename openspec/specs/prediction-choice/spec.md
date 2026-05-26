# prediction-choice Specification

## Purpose
TBD - created by archiving change chapter-02-bridge-chapter-3. Update Purpose after archive.
## Requirements
### Requirement: LmPredictionChoice renders a question with selectable options

The design system SHALL provide `LmPredictionChoice`, a standalone Angular component that displays a question prompt and a vertical list of selectable options. Each option SHALL use the interactive glow contract from `docs/visual-guidelines.md` §4: idle `1px solid ink-faint` border, hover accent halo, selected state with accent border and persistent glow.

#### Scenario: Options render with glow contract

- **WHEN** `LmPredictionChoice` renders with two or more options
- **THEN** each option is a clickable control with idle ink-faint border
- **AND** hovering an unselected option shows an accent glow halo
- **AND** the selected option shows a persistent accent border and glow

#### Scenario: Selection emits chosen option id

- **WHEN** a user clicks an option
- **THEN** the component emits the selected option's id
- **AND** the clicked option renders in selected state
- **AND** previously selected option (if any) returns to idle state

#### Scenario: Question prompt uses brand typography

- **WHEN** `LmPredictionChoice` renders with a question string
- **THEN** the question uses serif body typography
- **AND** an optional kicker label (if provided) uses IBM Plex Mono uppercase styling

### Requirement: LmPredictionChoice is exported from libs/design

The `@lm/design` public API SHALL export `LmPredictionChoice`.

#### Scenario: Feature libs import prediction choice from design package

- **WHEN** a chapter step component imports `LmPredictionChoice` from `@lm/design`
- **THEN** the import resolves without reaching into internal library paths

