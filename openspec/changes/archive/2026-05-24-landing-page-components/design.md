## Context

The repository has a scaffolded Nx integrated monorepo (`apps/lightmatters`, `libs/design`, `libs/engine`, `libs/physics`) with Tailwind v4 wired but no `@theme` tokens yet. The visual-design prototype is the source of truth for visuals — specifically `theme.jsx` (palettes), `primitives.jsx` (Wordmark, Kicker, Button, Slider, Typewriter), and `landing.jsx` (page layout). Architecture docs (`docs/architecture.md` build order steps 2–4) call for design system → app shell → landing feature in sequence; this change delivers all three as one cohesive milestone so `/` renders the marketing page.

Current app state: empty `appRoutes`, placeholder `libs/design` generator stub, no feature libs.

## Goals / Non-Goals

**Goals:**

- Establish `libs/design` as the canonical home for tokens, theme state, and reusable brand components used by the app shell, landing page, and future features.
- Port the landing page layout and copy from `landing.jsx` into Angular standalone components inside `libs/features/landing`.
- Deliver a working `/` route with light/dark theme toggle that matches the prototype's look within reasonable fidelity (typography, spacing, colors, glow on interactive elements).
- Encode module-boundary tags so `scope:feature` projects can depend on `scope:design` but not on each other.

**Non-Goals:**

- Full spacetime-diagram primitive (`libs/primitives/spacetime-diagram`) — Hero and chapter cards use simplified inline SVG placeholders or static illustrations until that lib exists.
- Animated Typewriter, draggable Slider, or looping diagram animations in the Hero preview panel — static presentation is acceptable for v1.
- Chapter routes, chapter-index, design-sheet, narrator, or timeline engine.
- E2e test coverage beyond a smoke check that `/` loads (optional, not blocking).
- Self-hosting fonts (Google Fonts link tags are fine for v1).
- Responsive/mobile layout polish — desktop-first matching the prototype's ~1280px artboard; basic stacking below ~900px is nice-to-have, not required for v1.

## Decisions

### 1. Combine design system + landing + shell in one change

Architecture lists these as steps 2–4, but they are tightly coupled: landing components consume design tokens; the shell must route to landing. Shipping together avoids an intermediate state where tokens exist but nothing renders them.

**Alternative considered:** design-system-only change first. Rejected: no visual verification until landing exists; slower feedback loop.

### 2. Tokens live in CSS; ThemeService toggles a class on `<html>`

Port `lmThemes.light` / `lmThemes.dark` from `theme.jsx` into Tailwind v4 `@theme` with paired CSS custom properties (e.g. `--color-paper`, `--color-ink`, `--color-accent-1`). Light theme is the default; dark theme activates via `[data-theme="dark"]` or `.dark` on `<html>`.

`ThemeService` (in `libs/design`) exposes `theme` as a signal (`'light' | 'dark'`), `toggle()`, and `setTheme()`. On init it reads `localStorage` key `lm-theme`; on change it writes back and updates the document class. Components read tokens via Tailwind utilities (`bg-paper text-ink`) rather than injecting inline styles from a JS theme object.

**Alternative considered:** CSS-in-JS style objects like the React prototype. Rejected: conflicts with Tailwind-first architecture; harder for WebGL layers to consume later.

**Alternative considered:** Angular CDK overlay theming. Rejected: overkill for two skins.

### 3. Brand components as standalone Angular components with Tailwind + SCSS where needed

Each brand component is a standalone Angular component exported from `@lightmatters/design`:

| Component       | Prototype source | Notes                                              |
|-----------------|------------------|----------------------------------------------------|
| `LmWordmark`    | `Wordmark`       | `size` input, accent dot                           |
| `LmKicker`      | `Kicker`         | uppercase mono label                               |
| `LmButton`      | `Button`         | `primary` input; uses `lmInteractive`              |
| `LmThemeToggle` | `ThemeToggle`    | injects `ThemeService`                             |
| `LmSectionRule` | `SectionRule`    | optional; used in chapter-index later              |

Interactive glow (box-shadow halo on hover) is centralized in an `lmInteractive` **attribute directive** applied to buttons, the theme toggle, and future controls. Non-interactive diagram linework never gets the directive — matching the prototype contract.

**Alternative considered:** pure Tailwind `hover:shadow-*` on each component. Rejected: duplicates glow logic; directive keeps the contract in one place.

### 4. Landing feature lib structure

Generate with Nx Angular library generator under `libs/features/landing`, tag `scope:feature`. Public API exports `landingRoutes`.

Internal folder layout:

```
libs/features/landing/src/lib/
  landing-page.component.ts          ← composes sections
  sections/
    landing-nav.component.ts
    landing-hero.component.ts
    landing-manifesto.component.ts
    landing-chapters.component.ts
    landing-principles.component.ts
    landing-cta.component.ts
    landing-footer.component.ts
  data/
    chapters.data.ts                 ← static chapter list from prototype
  placeholders/
    diagram-placeholder.component.ts ← minimal SVG stub per mini variant
  landing.routes.ts
```

Section components are presentational: they import from `@lightmatters/design` and use Tailwind utility classes mapped to design tokens. Copy and structure mirror `landing.jsx` verbatim where possible.

**Alternative considered:** one monolithic landing component. Rejected: harder to maintain; sections map 1:1 to prototype and future Storybook/design-sheet entries.

### 5. Diagram placeholders instead of full primitive

Hero preview and chapter cards reference diagram variants (`single`, `mini-axes`, `mini-pair`, etc.). For v1, `LmDiagramPlaceholder` renders a minimal static SVG (axes + one line or a labeled box) keyed by `variant` input. Visual fidelity is lower than the prototype's animated `STDiagram`, but layout and spacing match.

When `libs/primitives/spacetime-diagram` lands, landing swaps placeholders for the real component with no section layout changes.

**Alternative considered:** port the full `STDiagram` JSX into landing now. Rejected: violates primitive/engine layering; duplicates work; animation CSS would live in the wrong lib.

### 6. App shell stays minimal

`AppComponent` template: `<router-outlet />` only. Landing page owns its own Nav (including Wordmark + ThemeToggle) per the prototype — the shell does not duplicate chrome. `app.routes.ts`:

```ts
{ path: '', loadChildren: () => import('@lightmatters/feature-landing').then(m => m.landingRoutes) },
{ path: '**', redirectTo: '' },
```

Theme class binding happens in `AppComponent` constructor/effect via `ThemeService` injecting `DOCUMENT`.

**Alternative considered:** persistent shell nav wrapping all routes. Rejected: prototype landing has its own nav; chapter shell will differ.

### 7. Module boundary tag for features

Add `scope:feature` to `@nx/enforce-module-boundaries`:

| Tag             | May depend on                                              |
|-----------------|------------------------------------------------------------|
| `scope:feature` | `scope:design`, `scope:engine`, `scope:primitives`, `scope:physics` |

Features must not depend on other features.

### 8. Font loading via `<link>` in `index.html`

Load EB Garamond and IBM Plex Mono from Google Fonts with `display=swap`. Tailwind `@theme` sets `--font-serif` and `--font-mono` to match prototype stacks.

## Risks / Trade-offs

- **[Hero fidelity gap]** Placeholder diagrams look simpler than the prototype → Mitigation: accept for v1; track swap to real primitive as a follow-up task.
- **[Token drift from prototype]** Manual port of oklch/rgba values may drift → Mitigation: copy hex/oklch literals directly from `theme.jsx`; add `/design-sheet` in a later change as visual regression canary.
- **[No mobile layout]** Prototype is desktop artboard → Mitigation: document as non-goal; add responsive pass when analytics show mobile traffic.
- **[Feature tag not in ESLint yet]** Lint may not enforce feature boundaries → Mitigation: add `scope:feature` rule in same change before generating landing lib.
- **[Static CTAs]** "Begin chapter 1" buttons don't navigate yet → Mitigation: wire `routerLink` to `/ch/01` only when that route exists; use `#` or disabled state until then.

## Migration Plan

Greenfield — no migration. Rollout: merge → `nx build lightmatters --tui=false` → manual visual check at `/` in light and dark modes.

## Open Questions

- Should v1 CTAs link to `/chapters` stub or remain inert `#`? **Recommendation:** inert `#` with `aria-disabled` until chapter-index exists.
- Self-host fonts for offline/perf? **Defer** to a later perf pass.
