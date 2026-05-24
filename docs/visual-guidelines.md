# Light Matters — Visual Guidelines

This document is the **visual source of truth** for Light Matters. It compiles the concrete design decisions established in the visual-design prototype so engineers, future designers, and AI agents can implement, extend, or audit the visual system without needing to reverse-engineer the prototype each time.

**Authoritative prototype:** [`visual-design-prototype/`](../visual-design-prototype/). The prototype is React/JSX; we implement in Angular. When this document and the prototype disagree, **the prototype wins** — update this document. Specific files referenced throughout:

- `project/theme.jsx` — palette tokens, theme store, toggle.
- `project/brand-sheet.jsx` — the consolidated identity sheet.
- `project/primitives.jsx` — every shared visual component.
- `project/landing.jsx` — marketing landing page.
- `project/step-ui.jsx` — three step layouts (intro / speed-budget / cone).
- `project/chapter-index.jsx` — the journey map / table of contents.

For visual decisions not yet documented here, **read the prototype source directly** rather than guessing.

---

## 1. Two themes, one product

Both light and dark themes are first-class. The user can toggle freely; both must be visually polished. The two themes share every other design decision (typography, layout, motion, primitives) — they differ only in token values.

| Token | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#f6f5f1` | `#0a0c11` | Page background. Warm paper / deep night. |
| `paperAlt` | `#eeede8` | `#10131a` | Inset panels (chapter cards, diagram frames). |
| `surface` | `#ecebe5` | `#13161f` | Raised cards. Used for the overlay narrator panel as `surface + 'ee'` with backdrop-blur. |
| `surfaceSunken` | `#e3e1da` | `#0f1118` | Recessed regions. |
| `ink` | `#14141a` | `#ece4d6` | All lines, all primary type. |
| `inkSoft` | `#54545e` | `#a39a8b` | Secondary text. |
| `inkMid` | 55% ink | 55% ink | Tertiary text, faint axes, the "current beat" accent rule in chat-feed narration. |
| `inkFaint` | 14% ink | 13% ink | Hairline rules, dividers, idle interactive borders. |
| `inkVeryFaint` | 7% ink | 6% ink | Background grid, swatch outlines. |
| `accent1` | `oklch(.5 .18 28)` | `oklch(.76 .13 28)` | Body / vector / traveller **A**. Red family. Also: wordmark dot, current-step marker. |
| `accent2` | `oklch(.46 .16 252)` | `oklch(.78 .08 220)` | Body / vector / traveller **B**. Blue family. |
| `glow1` | `accent1 / 0.28` | `accent1 / 0.55` | Hover halo using accent 1. |
| `glow2` | `accent2 / 0.28` | `accent2 / 0.5` | Hover halo using accent 2. |
| `glowInk` | `ink / 0.16` | `ink / 0.22` | Neutral halo. |

Theme transitions: when the user toggles, `background` and `color` animate over **0.4s**. Theme tokens must be exposed both as **CSS custom properties** (for HTML/SVG layers) and as **TypeScript constants** (so WebGL shaders can receive them as uniforms and update on theme change).

---

## 2. Typography

Two families. No sans-serif. Ever.

### Families

- **Serif — EB Garamond.** Fallback: `'Iowan Old Style', serif`. Used for **all narration, body, headings, buttons, taglines**.
- **Mono — IBM Plex Mono.** Fallback: `ui-monospace, monospace`. Used **only** for the small uppercase "Kicker" labels: axis ticks, chapter/step marks, control names, keyboard hints.

### Type roles

| Role | Family | Size | Weight | Style | Line-height | Letter-spacing | Notes |
|---|---|---|---|---|---|---|---|
| Hero display | Serif | 84px | 500 | normal (italic for emphasis) | 0.98 | -0.018em | `text-wrap: balance`. |
| Section display | Serif | 76px | 500 | normal | 1.02 | -0.015em | CTA blocks. |
| Heading | Serif | 30–32px | 500 | italic for chapter titles | 1.1–1.4 | normal | |
| Body large | Serif | 22–28px | 500 | normal | 1.4–1.55 | normal | Hero subhead, narration. |
| Body | Serif | 17.5–20px | 400–500 | normal | 1.5–1.55 | normal | `text-wrap: pretty`. |
| Body small | Serif | 14–16px | 400 | normal | 1.5 | normal | Card blurbs, fine print. |
| Italic accent | Serif | inherits | inherits | italic | inherits | normal | Taglines, chapter titles, "you are here" emphasis. |
| Wordmark | Serif | 18–84px | 500 | normal | 0.95 | -0.015em | See §6. |
| Kicker | Mono | 10–11px | 500 | normal, **uppercase** | 1 | **0.22em** (range 0.18–0.28em depending on emphasis) | The signature mono label style. |
| Mono value | Mono | 11–13px | 400–500 | normal | 1 | 0.06–0.14em | Numeric values (`v/c = 0.62`). |
| Mono key | Mono | 11px | inherits | normal | inherits | normal | Keyboard hint chips (`←`, `↩`, `m`). |

### Italic usage

Italics carry weight. They're used for:

- Chapter titles in navigation and the journey map.
- Taglines and emphasis within body text (e.g. *"the geometry of relativity, by hand."*, "It is the geometry.").
- The "current beat" stat in the chapter index ("you are here").
- Button labels (all buttons use italic serif).

### Body-text accent inlining

When the narrator refers to an entity that has a vector or body color on the diagram, the **name inlines that color** with `fontStyle: 'normal'` even inside italic body text. Example: "**A** chooses to spend most of its budget on time" where `A` is rendered in `accent1`. This is the bridge between text and diagram and is part of the two-color grammar (§4).

---

## 3. Color grammar

Beyond ink-on-paper, only two accents — and they are **semantic, never decorative**.

- **Accent 1 (red family)** = Body A, Vector A, Traveller A, the wordmark signal dot, the "you are here" highlight, the primary glow.
- **Accent 2 (blue family)** = Body B, Vector B, Traveller B, the secondary glow.

Rules:

- If a diagram needs to distinguish two things, A is red, B is blue. Always.
- Never use an accent purely for branding flourish, decoration, or chrome.
- The wordmark's colored period is the **only** exception — there, accent1 serves as a permanent signal mark, not a semantic role.
- Single-vector diagrams use ink only. The accent appears only when there is something to contrast against.

---

## 4. Interactive elements glow

Foundational UX rule: **only things you can press, drag, or touch emit a halo.** Diagrams stay quiet linework.

Implementation:

- **Idle interactive element** — `1px solid inkFaint` border, no shadow.
- **Hover** — border transitions to `1px solid ink`, plus `box-shadow: 0 0 0 4px glow1`. The "glow" is a four-pixel ring of accent-tinted halo.
- **Slider thumb** — `box-shadow: 0 0 8px accent55` idle, `0 0 14px accent55` on hover, plus an inset `0 0 0 3px accent` core.
- **Current step / chapter** — the same glow language is used to mark *position*, not just hover. The current chapter card carries `box-shadow: 0 0 0 4px glow1` permanently with a `1px solid accent1` border. The current step dot carries `box-shadow: 0 0 8px glow1`.
- **Hover transitions** — `box-shadow` 0.2s, `transform` 0.2s, `border-color` 0.2s.
- **Card hover micro-motion** — non-current chapter cards translate `translateY(-2px)` on hover.

Diagrams, narrator text, and structural rules **never glow**. The presence of a halo is the contract that says "you can interact with this."

The Angular implementation should expose an `interactive` directive or mixin so every interactive component picks up the same idle/hover/active treatment consistently.

---

## 5. Layout & spacing

The prototype uses absolute pixel values rather than a strict spacing scale, but the values cluster into recognizable steps. Documented for consistency:

- **Page padding** — `40px–64px` horizontal, `36px–88px` vertical depending on section weight.
- **Section vertical rhythm** — `88px` top / `96px` bottom is the standard "marketing section" gap. Step UIs are tighter (`40–64px`).
- **Section dividers** — `1px solid inkFaint`, no margin (the borders sit directly on adjacent padding).
- **Column gaps** — `24px` (cards), `28px` (twin sliders), `32–56px` (major content gutters).
- **Row gaps** — small `8–14px` for tight stacks, `18–28px` for narration beats, `36–56px` for sections.
- **Card padding** — `20–22px` internal.
- **Button padding** — `10px 22px`.
- **Slider track** — `1px` height, with `5` ticks across by default, thumb `18×18` circle.
- **Hairlines** — `1px` solid lines; opacity comes from `inkFaint` / `inkVeryFaint` rather than thinning the stroke.

Layout grids seen in the prototype:

- Landing hero — 2 columns `1fr 1fr` with `56px` column gap.
- Chapter preview grid — 4 columns, `24px` column gap, `32px` row gap.
- Step intro layout — single column, max-width `1100px`, narrator stacked above diagram stacked above slider.
- Step speed-budget layout — 2 columns `1fr 1.15fr` with chat-feed left, diagram + twin sliders right.
- Step cone layout — full-bleed diagram with absolutely-positioned annotations and a floating bottom narrator panel.
- Chapter index — 4×2 boustrophedon grid of `350×320` chapter cards connected by a worldline path.

---

## 6. Brand marks

### Wordmark — full

"Light Matters" set in EB Garamond, weight 500, normal style, letter-spacing `-0.015em`, line-height `0.95`. Followed immediately by a period (`.`) colored in `accent1`. The period **is** the signal mark.

The wordmark scales from `18px` (nav, footer) through `22px` (condensed) through `32px` (chapter index header) to `84px` (brand-sheet hero).

### Wordmark — condensed

Same construction at small sizes. Used in compact contexts.

### Monogram

`L` + italic `m` + colored mid-dot (`·` in `accent1`), all serif. For favicons and square contexts.

### Tagline

> *the geometry of relativity, by hand.*

Lowercase, italic serif. Used as a sub-wordmark in the brand sheet and in the footer of the landing page (where it appears as "a paper companion to Epstein's *Relativity Visualized*").

### Marketing hero copy

- Hero h2 (current): *Relativity, the way it should have clicked the first time.* — note the inline italic emphasis on "should have" and the colored period.
- CTA h2: *Light is not metaphor. It is the geometry.* — italic emphasis on "It is the geometry."
- Hero subhead: *A guided journey of small interactive experiments — paper, vectors, light cones, gravity wells — that build intuition for spacetime before you ever see an equation.*
- Marketing metadata kicker: *~ 90 min · 8 chapters · no prior physics*

---

## 7. Visual primitives (component inventory)

Every primitive defined in `primitives.jsx`. Each must exist in the Angular port; names below are suggestions for the Angular components.

| Prototype | Angular suggestion | Purpose |
|---|---|---|
| `Typewriter` | `lm-narrator` | One-shot text reveal: letters fade in sequentially (`~28ms/char` typing speed from the timeline). Words are grouped to avoid mid-word line breaks. No blinking caret. After reveal, a read pause (`pauseAfter`, default `2400ms`) holds before the timeline advances. |
| `SectionRule` | `lm-section-rule` | Numbered section divider: mono Roman numeral + italic serif title + flex-growing hairline. |
| `Stamp` | `lm-stamp` | Page stamp — `"01 / 08"` mono kicker over italic serif name. |
| `Wordmark` | `lm-wordmark` | See §6. Sized via input. |
| `Swatch` | `lm-swatch` | `56×56` color block with italic name + mono code. |
| `TypeSpecimen` | `lm-type-specimen` | Brand-sheet typography demo. |
| `Kicker` | `lm-kicker` | The defining mono uppercase label, 10–11px, 0.22em tracking. Used everywhere. |
| `Button` | `lm-button` | Primary (filled ink) / secondary (outline). Italic serif label. Glow on hover. |
| `Slider` | `lm-slider` | Mono label + value, `1px` track, ticks, draggable accent-glowing thumb. Accepts `accent` color. |
| `STDiagram` | `lm-spacetime-diagram` | The recurring spacetime diagram. Variants: `position-only` (Ch 1 Step 1), `single`, `pair`, `wavefront`, `cone`. |
| `STMini` | (variant of above) | Tiny thumbnail variants for chapter cards: `axes`, `vector`, `pair`, `cone`, `wavefront`, `well`, `doppler`, `bend`. |
| `ConeShape` / `BigCone` | (variant of curved-surface) | Wireframe cone with rims, meridians, cross-section ellipses, and an optional worldline path. |
| `ThemeToggle` | `lm-theme-toggle` | Outlined mono pill with an accent dot. Glows on hover. |
| `ProgressDots` | `lm-progress-dots` | Step indicator strip. Current dot is wider (12×5) and accent-colored; completed dots are ink-filled `5×5`; upcoming dots are hollow `5×5` with `inkFaint` border. |
| `KeyHint` | `lm-key-hint` | Outlined mono key chip + kicker label. Used in the step footer. |
| `Annotation` | `lm-annotation` | Italic serif label + kicker subtext + optional hairline pointer. Used for diagram side-labels in the cone step. |
| `FactLine` | `lm-fact-line` | Mono key + mono value pair, used in the speed-budget step's reading mini-map. |
| `Legend2` | `lm-legend` | `16×2` color bar + uppercase mono label. Two-color diagram key. |

---

## 8. Spacetime diagram conventions

The spacetime diagram is the most-reused primitive. Lock these conventions:

- **Full diagram** — time vertical (up), space horizontal (right). `1px` stroke, `ink` color. Origin at bottom-left of the diagram area.
- **Position-only variant (Ch 1 Step 1)** — horizontal spatial axis only: tick marks, `x` label, movable point at normalized position 0–1. No time axis yet.
- **Ticks** — 5 tick marks per axis, `5px` long, perpendicular outward.
- **Axis labels** — `t` and `x` in mono, italic serif `c` for the light-cone line. Small (10–11px), `~0.65` opacity.
- **Light cone** — dashed diagonal line (`stroke-dasharray: 3 4`, opacity `~0.55`) at 45°, from origin upward and to the right.
- **Vector** — `2.2–2.6px` stroke, round line caps, arrowhead drawn as a 3-point polyline. Animated to swing on a loop (~6.4s, cubic-bezier `.6,.05,.4,.95`) when used decoratively.
- **Twin vectors** — A in `accent1`, B in `accent2`, slightly thicker stroke (`+0.2`), each with its own out-of-phase swing animation.
- **Wavefront** — emitter dot (4px accent1 fill) at a point; 4 concentric rings expand from `r=0` outward (`4.2s ease-out`, staggered `1.05s` between rings), 1.4px stroke. Observer stick figure (small circle + line + base) drawn in accent2 at the receiving side.
- **Cone** — rendered as: top ellipse (rx=`topR`, ry=`14–28`), bottom ellipse (rx=`botR`, ry=`8–14`), two slanted side lines, 5–7 meridian lines at `~0.35–0.45` opacity, optional horizontal cross-section ellipses at `~0.18` opacity, and an accent worldline curving on the surface with `drop-shadow(0 0 4px glow1)`. A small wireframe "house" (triangle + square) may sit on the rim.
- **Dot trace** — when `dotTrace` is enabled, the tip of the vector is marked with a small filled circle.

### Mini variants for thumbnails

The chapter index cards use stripped-down 180×100 versions: just axes plus the chapter's signature shape (a vector, twin vectors, mini cone, wavefront, gravity well, doppler ripple, or bending beam). These should be authored once per chapter as small, recognizable glyphs — they double as the chapter's visual identity.

---

## 9. Page layouts (the three demonstrated)

The prototype demonstrates the **range** of layouts the engine must support. New steps will mostly remix these.

### Step layout A — "intro" (Ch 1 style)

Single column, centered, max-width `1100px`. Top to bottom:

1. Kicker label ("a worldline").
2. Large narrator text (30px serif, min-height 90px to prevent layout shifts as letters fade in).
3. A single full-width diagram, centered.
4. One slim slider centered below.

For steps where the diagram and one parameter are enough.

### Step layout B — "chat feed" (Ch 2 / speed-budget style)

Two columns, narrator left (`1fr`) + diagram right (`1.15fr`). The narrator column shows multiple beats stacked vertically:

- **Past beats** — faded to `opacity 0.45`, normal serif at 19px.
- **Current beat** — sharp at 24px serif with a `2px solid inkMid` left border and `18px` left padding. This is the distinguishing visual of the chat-feed.
- **Reading mini-map** — `1px solid inkFaint` top divider below the beats, then a 2-column grid of `FactLine`s showing live values.

The diagram column is wrapped in a `paperAlt` panel with a header strip (Kicker label + 2-color `Legend2`s) and trailing twin sliders. Use this when narration and parameters are both rich.

### Step layout C — "cinematic" (Ch 3 / cone style)

Full-bleed diagram absolutely centered, with:

- A side-mounted kicker + italic serif title at top-left.
- 1–2 `Annotation` callouts pointing at specific regions of the diagram with hairline pointers.
- A floating narrator panel pinned to the bottom: `surface + 'ee'` background, `backdrop-filter: blur(8px)`, `1px solid inkFaint` border, `padding: 22px 28px`. The panel contains the narrator on the left and a single slider on the right.

Use this for the "wow" moments — when the diagram itself should fill the visual field.

### Step chrome (shared by all step layouts)

- **Playback bar (top, full width)** — music-player-style progress with beat markers, plus rewind / pause / fast-forward transport. Sits above the step nav.
- **Nav (20×40px padding)** — `Wordmark size={20}` + chapter kicker + chapter title (italic serif) + `ProgressDots` + step counter kicker + `ThemeToggle`. Border-bottom `1px inkFaint`.
- **Footer (18×40px padding)** — keyboard hints on the left (`← back`, `space skip`, `pause / skip`), Previous + Continue buttons on the right. Border-top `1px inkFaint`.

### Landing layout

Sections in order: Nav → Hero (split 1fr/1fr) → Manifesto (Roman-numeral kicker column + statement) → Chapter previews (4-up grid) → Principles (numbered list with italic headings) → CTA (centered) → Footer (3-column).

### Chapter-index layout

Header strip (Wordmark + 3 `ProgressStat`s separated by hairlines) → Journey map (boustrophedon path through 8 chapter cards) → Footer (legend on left, Restart/Resume buttons on right).

### Brand-sheet layout

Reference page documenting the design system itself. Two-column body: Wordmark / Palette / Type on the left, Diagram primitives / Interactive elements / Aesthetic notes on the right. Should be ported as an internal `/design-sheet` route for visual regression review.

---

## 10. Narration patterns

The narrator is more than just text — it is a UI pattern with specific styles per layout:

- **Single-beat (layout A)** — one large 30px line with per-letter fade-in. Use a `min-height` matching ~3 lines to prevent layout shift.
- **Chat-feed (layout B)** — vertical stack. Past beats fade to `opacity 0.45`. Current beat (the one currently revealing) is larger (24px) and carries a `2px solid inkMid` left accent.
- **Floating panel (layout C)** — narrator inside a `surface + 'ee'` blurred panel.
- **Inline color** — when the narration names a labeled entity (vector A, traveller B), wrap the name in `<em style="color: accent; font-style: normal">`. The semantic accent grammar (§4) extends into prose.
- **Reveal spec** — `~28ms` per character (timeline `speed`), each letter fades in over `~450ms ease-out`. Words are wrapped in `nowrap` spans so line breaks fall between words, not mid-word. No blinking caret. After the full chunk is visible, a **read pause** (`pauseAfter`, default `2400ms`) holds before the timeline advances; Space skips the hold.

---

## 11. Motion

Animation pacing is part of the brand. Unhurried, never showy.

| Element | Duration | Easing | Notes |
|---|---|---|---|
| Theme toggle | 0.4s | default | Both `background` and `color`. |
| Hover (border, glow, transform) | 0.2s | default | Cards, buttons, sliders. |
| Slider thumb hover glow | 0.2s | default | Box-shadow only. |
| Vector swing (decorative) | 6.4s loop | `cubic-bezier(.6,.05,.4,.95)` | Both single and pair variants. |
| Wavefront ring expansion | 4.2s loop | `ease-out` | 1.05s stagger between successive rings. |
| Wavefront emitter pulse | 1.4s loop | `ease-in-out` | Subtle scale on the source dot. |
| Cone-fall (worldline trace) | 5.5s loop | `cubic-bezier(.55,0,.45,1)` | Dot rides an SVG `animateMotion` path. |
| Narration letter fade-in | 0.45s | `ease-out` | Per character, as each letter appears. |
| Narration typing interval | ~28ms each | linear | Timeline `speed`; range 26–30ms in different contexts. |
| Read pause after narration | 2400ms default | — | Configurable via `pauseAfter` on narrate events. Skippable. |
| Section-card hover translate | 0.2s | default | `translateY(-2px)`. |

**No `prefers-reduced-motion` concession.** Motion in Light Matters is pedagogy, not decoration — narration reveals, diagram animations, and transport controls all participate in the explanation. See `docs/architecture.md` § Accessibility.

---

## 12. State language

A small system for marking position in a sequence (chapters or steps):

- **Done** — ink-filled solid mark. Opacity 1. No glow.
- **Current** — `accent1`-colored, *wider* than other marks (12×5 dots, 14×6 chapter step dots, 350×320 chapter card with accent1 border), `box-shadow` glow halo. Italic emphasis if textual.
- **Upcoming** — hollow with `inkFaint` border. Opacity reduced (`~0.5–0.55`) for surrounding type. Worldline path drawn dashed (`stroke-dasharray: 3 5`, opacity `~0.18`).

`StatusPill` variants: `read` (outlined kicker), `step X / Y` (filled accent1 with glow), `upcoming` (outlined kicker, dimmed).

---

## 13. Keyboard model

Visible in the step footer; bind these in the engine:

- `←` — previous step.
- `→` or `Enter` — next step / continue.
- `↩` — skip the current narration reveal (fast-forward to the next wait boundary).
- `m` — open the journey map (chapter index).
- `t` — toggle theme.

All keyboard actions should mirror equivalent clickable controls. Use `KeyHint` chips to make keys visible in-context.

---

## 14. Notes for the Angular port

The prototype is React/JSX with inline CSS-in-JS and a `useTheme` hook backed by a tiny pub/sub store. The Angular port should:

- **Translate the look, not the code.** Don't copy component file boundaries. Re-decompose into Angular components and directives that fit the Angular idioms.
- **`useTheme` → `ThemeService`** exposing a signal for the active theme + a `toggle()` method. Persist to `localStorage`. Default to `light`.
- **Tokens** live in `src/app/design/tokens.ts` as a typed object, and are projected onto `<html>` as CSS custom properties whenever the theme changes. The same object is the source for shader uniforms in WebGL primitives.
- **CSS variables** — name them `--lm-paper`, `--lm-ink`, `--lm-accent-1`, etc. (prefix to avoid collisions with downstream embeds).
- **Mono and serif** — load as web fonts with `font-display: swap`. Test both `Iowan Old Style` and `ui-monospace` fallbacks on hot reload by temporarily disabling the network fonts.
- **The `interactive` treatment** — implement once as a directive (`[lmInteractive]`) or shared host-class. Every button, slider, draggable handle, chapter card, key chip, and theme toggle uses it.
- **Diagram primitives** — pure components that take props (`variant`, `width`, `height`, etc.) and render SVG. They subscribe to the theme to recolor.
- **WebGL primitives** (when we build them) — receive `ink` and `paper` as uniforms and re-bind on theme change. Line shaders must match the SVG visual weight at common viewport sizes.
- **Brand sheet as a route** — port `brand-sheet.jsx` to a `/design-sheet` route (dev-only or always-available). It's the canary for visual regressions.

When in doubt about a specific value, **open the prototype source** rather than approximating. Visual fidelity matters here more than it does in most products.
