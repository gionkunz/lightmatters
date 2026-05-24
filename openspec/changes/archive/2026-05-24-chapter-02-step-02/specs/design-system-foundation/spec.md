## ADDED Requirements

### Requirement: FactLine component renders key-value readout

The `@lm/design` public API SHALL export an `LmFactLine` standalone component that renders a mono uppercase key label and a mono value string in a horizontal row, matching the prototype `FactLine` styling in `visual-design-prototype/project/step-ui.jsx`.

#### Scenario: FactLine renders key and value

- **WHEN** `LmFactLine` renders with key "traveller A" and value "v / c = 0.01"
- **THEN** the key appears in IBM Plex Mono uppercase with appropriate opacity
- **AND** the value appears in IBM Plex Mono at 12px on the opposite side of the row

#### Scenario: FactLine accepts accent color for key

- **WHEN** `LmFactLine` renders with an accent input set to accent-1
- **THEN** the key label uses the accent-1 token color at high opacity

### Requirement: Legend component renders color bar and label

The `@lm/design` public API SHALL export an `LmLegend` standalone component that renders a 16×2px color bar and an uppercase mono label, matching the prototype `Legend2` styling.

#### Scenario: Legend renders color bar and label

- **WHEN** `LmLegend` renders with color accent-2 and label "B"
- **THEN** a 16×2px bar in accent-2 appears beside an uppercase mono label "B"
