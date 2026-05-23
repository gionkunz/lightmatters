## Why

The Nx workspace scaffold is in place, but the app has no routes, no design tokens, and no user-facing UI. The visual-design prototype (`visual-design-prototype/project/landing.jsx`) already defines the marketing landing page and the reusable brand components (Wordmark, Kicker, Button, ThemeToggle) that every other surface will share. Translating that reference into `libs/design` plus a lazy-loaded landing feature is the fastest path to a deployable homepage that proves the design system and the feature-lib routing pattern before engine or primitive work begins.

## What Changes

- Port design tokens (light/dark palettes) from the prototype into Tailwind v4 `@theme` declarations and CSS custom properties in `apps/lightmatters/src/styles.css`.
- Build `libs/design` as the shared component library: `ThemeService` (signal-based light/dark toggle persisted to `localStorage`), web fonts (EB Garamond, IBM Plex Mono), brand components (`LmWordmark`, `LmKicker`, `LmButton`, `LmThemeToggle`), and the `lmInteractive` glow directive for interactive elements.
- Generate `libs/features/landing` (`scope:feature`) and compose the landing page sections from the prototype: Nav, Hero, Manifesto, Chapters preview, Principles, CTA, Footer.
- Wire the app shell: root route lazy-loads the landing feature; layout applies theme class on `<html>`; fonts and meta tags in `index.html`.
- Use **static or placeholder visuals** in the Hero and chapter cards for diagram thumbnails (full `STDiagram` primitive is deferred to a later change). Buttons and nav links are present but may point to `#` or `/chapters` stub until those features exist.

This change does **not** include: the timeline engine, narrator, spacetime-diagram primitive, chapter content, chapter-index page, design-sheet route, Cloudflare deploy wiring, or `prefers-reduced-motion` support.

## Capabilities

### New Capabilities

- `design-system-foundation`: design tokens, theme service, typography, brand components, and the interactive glow contract in `libs/design`.
- `landing-page`: the `/` marketing page as a lazy-loaded feature lib, section components ported from `landing.jsx`.
- `app-shell`: minimal Angular shell — root routes, theme class binding, `<router-outlet>`, and index meta/fonts — sufficient to render the landing page.

### Modified Capabilities

<!-- None: no prior specs exist in openspec/specs/. -->

## Impact

- **Libraries:** replaces the placeholder `libs/design` stub with real tokens, services, and components; adds new `libs/features/landing` feature lib tagged `scope:feature`.
- **App:** updates `apps/lightmatters/src/styles.css` (tokens), `app.routes.ts` (lazy landing route), bootstrap/layout component, and `index.html` (fonts, meta).
- **Dependencies:** no new npm packages expected beyond font loading (Google Fonts or self-hosted `@font-face`).
- **Module boundaries:** landing feature depends on `design` only; app shell depends on `design` + dynamic import of landing routes. ESLint may need a `scope:feature` entry in `@nx/enforce-module-boundaries` if not already present from scaffold.
- **Deploy:** first meaningful static output suitable for Cloudflare Pages smoke deploy (pipeline wiring itself is out of scope).
