# viewport-resolution-hint Specification

## Purpose

Advisory overlay when the browser window is smaller than the recommended 1920×1080 canvas. Dismissible per undersized episode; re-shows when the viewport shrinks again after meeting the minimum.

## Requirements

### Requirement: Undersized viewport is detected at 1920 by 1080

The viewport resolution hint system SHALL treat the viewport as undersized when `window.innerWidth` is strictly less than **1920** OR `window.innerHeight` is strictly less than **1080**. Detection SHALL run on initial load and on every window resize until the service is destroyed.

#### Scenario: Width below minimum triggers undersized

- **WHEN** `window.innerWidth` is 1919 and `window.innerHeight` is 1080
- **THEN** the viewport is considered undersized

#### Scenario: Height below minimum triggers undersized

- **WHEN** `window.innerWidth` is 1920 and `window.innerHeight` is 1079
- **THEN** the viewport is considered undersized

#### Scenario: Both dimensions at minimum are sufficient

- **WHEN** `window.innerWidth` is 1920 and `window.innerHeight` is 1080
- **THEN** the viewport is not considered undersized

### Requirement: Hint recommends 1920 by 1080 and is dismissible

When the viewport is undersized and the hint is visible, the UI SHALL display advisory copy stating that a window size of at least **1920×1080** is recommended for the best experience. The user SHALL be able to dismiss the hint via an explicit control (button or close affordance) with an accessible name.

#### Scenario: Hint visible on undersized viewport

- **WHEN** the viewport is undersized
- **AND** the user has not dismissed the hint for the current undersized episode
- **THEN** the resolution hint overlay is shown
- **AND** the message mentions 1920×1080 (or equivalent wording)

#### Scenario: User dismisses hint

- **WHEN** the viewport is undersized
- **AND** the user activates the dismiss control
- **THEN** the resolution hint overlay is hidden
- **AND** the app remains fully interactive (no modal blocking layer)

### Requirement: Dismiss does not persist; hint returns when viewport shrinks again

Dismissal state SHALL NOT be written to `localStorage`, `sessionStorage`, or cookies. Dismissal SHALL only suppress the hint for the current continuous undersized period. When the viewport later meets both minimum dimensions and subsequently becomes undersized again, the hint SHALL be shown again regardless of prior dismissals in the same session.

#### Scenario: Dismiss hides until viewport grows

- **WHEN** the viewport is undersized and the user dismisses the hint
- **AND** the viewport remains undersized
- **THEN** the hint stays hidden

#### Scenario: Growing viewport clears dismiss episode

- **WHEN** the user dismissed the hint while undersized
- **AND** the viewport resizes to at least 1920×1080
- **THEN** the dismiss episode ends

#### Scenario: Shrinking viewport shows hint again

- **WHEN** the user previously dismissed the hint while undersized
- **AND** the viewport grew to at least 1920×1080
- **AND** the viewport becomes undersized again
- **THEN** the resolution hint overlay is shown again

### Requirement: Hint uses design system tokens and both themes

The resolution hint overlay SHALL use semantic design tokens (surface, ink, ink-soft, borders) and SHALL remain readable in both light and dark themes. Typography SHALL use the serif family for body copy; an optional kicker MAY use IBM Plex Mono per brand rules.

#### Scenario: Hint readable in dark theme

- **WHEN** the document is in dark theme
- **AND** the hint is visible
- **THEN** hint text and background use dark-theme token values
- **AND** contrast is sufficient for body-small copy

### Requirement: Viewport hint is exported from design library

`@lm/design` SHALL export `LmViewportResolutionHintComponent` and `ViewportResolutionHintService` (or equivalent public names) for use by the application shell.

#### Scenario: App imports hint from design package

- **WHEN** the application shell wires the resolution hint
- **THEN** it imports the component and service from `@lm/design`
- **AND** no duplicate threshold logic exists in feature libraries
