## Requirements
### Requirement: Landing page is served at the root route

The application SHALL lazy-load a landing feature library at path `/` that renders the marketing landing page. Unknown paths that are not matched by a defined feature route SHALL redirect to `/`.

#### Scenario: Root URL renders landing page

- **WHEN** a user navigates to `/`
- **THEN** the landing page component renders without a full-page reload of the Angular app shell

#### Scenario: Unknown route redirects home

- **WHEN** a user navigates to a path that is not defined (e.g. `/unknown`)
- **THEN** the router redirects to `/`

### Requirement: Landing page includes all prototype sections

The landing page SHALL compose the following sections in order, matching the structure of `visual-design-prototype/project/landing.jsx`: Nav, Hero, Manifesto ("I · why"), Chapters preview ("II · the journey"), Principles ("III · how"), Closing CTA, and Footer.

#### Scenario: All sections render on the landing page

- **WHEN** the landing page loads
- **THEN** each of the seven sections is present in the DOM in the specified order

#### Scenario: Manifesto displays three principle columns

- **WHEN** the Manifesto section renders
- **THEN** three columns appear with headings "intuition first", "a journey, paced", and "no prior math"

### Requirement: Chapter preview grid lists eight chapters

The Chapters section SHALL display a grid of eight chapter cards with number, title, blurb, and a diagram placeholder, using the chapter data from the prototype (`landing.jsx` chapters array).

#### Scenario: Eight chapter cards render

- **WHEN** the Chapters section renders
- **THEN** exactly eight chapter cards are visible
- **AND** chapter 1 is titled "Position, time, spacetime"

#### Scenario: Chapter card shows hover affordance

- **WHEN** a user hovers a chapter card
- **THEN** the card shows a visible hover state (border/glow lift matching prototype intent)

### Requirement: Hero section matches prototype copy and layout

The Hero section SHALL use a two-column layout: left column with kicker, headline, body copy, CTA buttons, and duration metadata; right column with a preview panel showing chapter/step kickers, sample narration text, a diagram placeholder, and a static slider chrome (non-interactive for v1).

#### Scenario: Hero headline renders with accent period

- **WHEN** the Hero section renders
- **THEN** the headline includes italic emphasis on "should have"
- **AND** the sentence ends with an accent-colored period

#### Scenario: Hero preview panel shows sample narration

- **WHEN** the Hero section renders
- **THEN** the preview panel displays the typewriter sample text about moving through spacetime at the speed of light (static text acceptable for v1)

### Requirement: Landing nav includes wordmark, links, and theme toggle

The Nav section SHALL display `LmWordmark`, navigation links (Chapters, About, Notes), and `LmThemeToggle`.

#### Scenario: Nav links are present

- **WHEN** the landing Nav renders
- **THEN** links labeled "Chapters", "About", and "Notes" are visible

### Requirement: Landing page respects active theme

All landing sections SHALL use design tokens so that toggling theme updates background, text, and border colors without a full page reload.

#### Scenario: Dark theme updates landing backgrounds

- **WHEN** a user toggles to dark theme on the landing page
- **THEN** section backgrounds switch from light paper tones to dark paper tones
- **AND** text color switches to the dark-theme ink token

### Requirement: Diagram placeholders stand in for STDiagram primitive

Hero and chapter cards SHALL use a placeholder diagram component rather than the full spacetime-diagram primitive. Each placeholder SHALL accept a `variant` input and render a minimal static SVG sufficient to hold layout space.

#### Scenario: Chapter card renders diagram placeholder

- **WHEN** a chapter card for chapter 2 renders
- **THEN** a diagram placeholder with variant appropriate to that chapter occupies the thumbnail area (~180×100px equivalent)

#### Scenario: Placeholder does not animate

- **WHEN** the Hero preview diagram placeholder renders
- **THEN** no CSS animation loops run on the placeholder SVG (static v1)

### Requirement: Chapter 1 entry points link to Step 1

The landing page Hero primary CTA and Chapter 1 preview card SHALL link to `/ch/01/step/1`.

#### Scenario: Hero begin button navigates to Step 1

- **WHEN** a user clicks the Hero primary CTA ("begin chapter 1" or equivalent)
- **THEN** the router navigates to `/ch/01/step/1`

#### Scenario: Chapter 1 card navigates to Step 1

- **WHEN** a user clicks the Chapter 1 preview card
- **THEN** the router navigates to `/ch/01/step/1`

### Requirement: Chapter 2 entry point links to Step 1

The landing page Chapter 2 preview card SHALL link to `/ch/02/step/1`.

#### Scenario: Chapter 2 card navigates to Step 1

- **WHEN** a user clicks the Chapter 2 preview card ("The speed budget")
- **THEN** the router navigates to `/ch/02/step/1`

