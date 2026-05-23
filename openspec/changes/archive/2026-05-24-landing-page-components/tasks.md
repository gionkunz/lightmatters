## 1. Module boundaries and library scaffolding

- [x] 1.1 Add `scope:feature` to `@nx/enforce-module-boundaries` in `eslint.config.mjs` per `design.md` (may depend on `design`, `engine`, `primitives`, `physics`; not other features)
- [x] 1.2 Generate `libs/features/landing` with `NX_TUI=false nx g @nx/angular:library --name=feature-landing --directory=libs/features/landing --tags=scope:feature --style=scss --skipModule=true --unitTestRunner=jest`
- [x] 1.3 Register the `@lightmatters/feature-landing` path alias in `tsconfig.base.json` if the generator does not
- [x] 1.4 Add `@source` directive for `libs/features/landing/src` in `apps/lightmatters/src/styles.css` so Tailwind scans landing components

## 2. Design tokens and typography

- [x] 2.1 Port light/dark palette values from `visual-design-prototype/project/theme.jsx` into `@theme` blocks in `apps/lightmatters/src/styles.css`, with dark overrides under `[data-theme="dark"]` on `:root`
- [x] 2.2 Define `--font-serif` (EB Garamond) and `--font-mono` (IBM Plex Mono) in `@theme` and map to Tailwind `font-serif` / `font-mono` utilities
- [x] 2.3 Add Google Fonts `<link>` tags for EB Garamond and IBM Plex Mono in `apps/lightmatters/src/index.html`
- [x] 2.4 Add global base styles: `body { background: paper; color: ink; font-family: serif }` and smooth theme transition on background/color

## 3. ThemeService

- [x] 3.1 Create `ThemeService` in `libs/design` with signal-based `theme`, `toggle()`, `setTheme()`, `localStorage` persistence (`lm-theme`), and document root `[data-theme]` binding
- [x] 3.2 Provide `ThemeService` at app root in `app.config.ts`
- [x] 3.3 Inject `ThemeService` in `AppComponent` to initialize theme on bootstrap
- [x] 3.4 Unit-test `ThemeService`: default light, toggle, persistence read/write

## 4. Brand components (libs/design)

- [x] 4.1 Create `LmInteractiveDirective` — hover glow using `glow-1` token; export from `@lightmatters/design`
- [x] 4.2 Create `LmWordmark` — `size` input, accent dot; match prototype typography
- [x] 4.3 Create `LmKicker` — uppercase mono label with configurable opacity
- [x] 4.4 Create `LmButton` — `primary` input, serif italic label, `lmInteractive` applied
- [x] 4.5 Create `LmThemeToggle` — injects `ThemeService`, accent dot, `lmInteractive` applied
- [x] 4.6 Update `libs/design/src/index.ts` to export all public API symbols; remove placeholder generator stub component
- [x] 4.7 Add minimal unit tests for `LmWordmark` and `LmButton` (render + primary class)

## 5. Landing feature — structure and routing

- [x] 5.1 Create `landing.routes.ts` exporting `landingRoutes` with `{ path: '', component: LandingPageComponent }`
- [x] 5.2 Create `LandingPageComponent` composing all section components
- [x] 5.3 Wire `app.routes.ts`: lazy `loadChildren` for landing at `''`, wildcard redirect to `''`
- [x] 5.4 Export `landingRoutes` from `libs/features/landing/src/index.ts`

## 6. Landing feature — section components

- [x] 6.1 `LandingNavComponent` — grid layout, `LmWordmark`, nav links (Chapters/About/Notes → `#` for v1), `LmThemeToggle`
- [x] 6.2 `LandingHeroComponent` — two-column layout, kicker, headline with accent period, body copy, two `LmButton`s, metadata line, preview panel with kickers + static narration + placeholder + static slider chrome
- [x] 6.3 `LandingManifestoComponent` — "I · why" kicker, manifesto paragraph, three-column feature grid
- [x] 6.4 `chapters.data.ts` — static array of 8 chapters from prototype
- [x] 6.5 `LmDiagramPlaceholderComponent` — `variant` input, minimal static SVG per variant (`single`, `axes`, `pair`, `cone`, `well`, `wavefront`, `doppler`, `bend`)
- [x] 6.6 `LandingChaptersComponent` — section header with kicker + title + rule, 4×2 grid of chapter cards with hover state
- [x] 6.7 `LandingPrinciplesComponent` — "III · how" kicker, four principle rows with numbered kickers
- [x] 6.8 `LandingCtaComponent` — centered closing headline, body, two buttons
- [x] 6.9 `LandingFooterComponent` — wordmark, Epstein attribution, copyright year

## 7. Verification

- [x] 7.1 `nx build lightmatters --tui=false` succeeds
- [x] 7.2 `nx lint design feature-landing lightmatters --tui=false` succeeds
- [x] 7.3 `nx test design --tui=false` succeeds
- [x] 7.4 Manual smoke check: `nx serve lightmatters --tui=false`, verify `/` renders all sections in light and dark theme; theme persists on reload
