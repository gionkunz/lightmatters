# design-system-foundation Specification

## Purpose

Design tokens, typography, theme service, and reusable brand components (`LmWordmark`, `LmKicker`, `LmButton`, etc.) for Light Matters.

## Requirements

### Requirement: Design tokens define light and dark palettes

The design system SHALL expose semantic color tokens for both light and dark themes, matching the palettes in `visual-design-prototype/project/theme.jsx`. Tokens SHALL include at minimum: `paper`, `paper-alt`, `surface`, `surface-sunken`, `ink`, `ink-soft`, `ink-mid`, `ink-faint`, `ink-very-faint`, `accent-1`, `accent-2`, `glow-1`, `glow-2`, and `glow-ink`.

#### Scenario: Light theme tokens are available as CSS custom properties

- **WHEN** the document is in light theme (default)
- **THEN** `--color-paper` resolves to `#f6f5f1`
- **AND** `--color-ink` resolves to `#14141a`
- **AND** accent colors use the light-theme oklch values from the prototype

#### Scenario: Dark theme tokens override light values

- **WHEN** the document root has the dark-theme class or attribute applied by `ThemeService`
- **THEN** `--color-paper` resolves to `#0a0c11`
- **AND** `--color-ink` resolves to `#ece4d6`
- **AND** accent colors use the dark-theme oklch values from the prototype

### Requirement: Typography tokens match the brand

The design system SHALL configure EB Garamond as the serif (body and display) typeface and IBM Plex Mono as the monospace (kicker/label) typeface. Both SHALL be loaded in the app and exposed as Tailwind font utilities.

#### Scenario: Serif text renders in EB Garamond

- **WHEN** an element uses the serif font utility
- **THEN** computed `font-family` includes `'EB Garamond'`

#### Scenario: Kicker labels render in IBM Plex Mono uppercase

- **WHEN** an `LmKicker` component renders
- **THEN** its text uses IBM Plex Mono, uppercase, with letter-spacing matching the prototype (~0.22em)

### Requirement: ThemeService manages theme preference

`ThemeService` in `libs/design` SHALL provide a reactive theme signal (`'light' | 'dark'`), a `toggle()` method, and a `setTheme(name)` method. The active theme SHALL persist in `localStorage` under the key `lm-theme` and SHALL apply the corresponding class or data attribute on the document root element.

#### Scenario: Theme persists across reload

- **WHEN** a user toggles to dark theme
- **AND** reloads the page
- **THEN** dark theme is restored from `localStorage`
- **AND** the document root reflects dark theme on first paint after service init

#### Scenario: Toggle switches between light and dark

- **WHEN** `toggle()` is called while theme is `light`
- **THEN** theme becomes `dark`
- **AND** CSS custom properties update to dark palette values

### Requirement: Brand components are exported from libs/design

The `@lm/design` public API SHALL export standalone Angular components: `LmWordmark`, `LmKicker`, `LmButton`, and `LmThemeToggle`. Each component SHALL read design tokens via Tailwind/CSS (not hard-coded hex in component TS).

#### Scenario: LmWordmark renders with accent dot

- **WHEN** `LmWordmark` renders with default inputs
- **THEN** it displays the text "Light Matters" in serif type
- **AND** the trailing period uses `accent-1` color

#### Scenario: LmButton primary variant inverts ink and paper

- **WHEN** `LmButton` renders with `primary` true
- **THEN** background uses `ink` token and foreground uses `paper` token

#### Scenario: LmThemeToggle invokes ThemeService

- **WHEN** a user clicks `LmThemeToggle`
- **THEN** `ThemeService.toggle()` is called
- **AND** the toggle label reflects the current theme name

### Requirement: Interactive elements use the glow contract

An `lmInteractive` attribute directive SHALL apply the prototype's hover glow (soft accent box-shadow) to interactive elements. The directive SHALL be used on `LmButton`, `LmThemeToggle`, and other controls marked interactive. Non-interactive diagram and text elements SHALL NOT use the directive.

#### Scenario: Button glows on hover

- **WHEN** a user hovers an `LmButton` with `lmInteractive` applied
- **THEN** a visible accent glow (box-shadow using `glow-1`) appears around the control

#### Scenario: Static text does not glow

- **WHEN** a paragraph of body copy renders on the landing page
- **THEN** it has no hover glow effect

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
