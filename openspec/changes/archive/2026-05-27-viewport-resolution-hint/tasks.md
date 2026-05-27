## 1. Design library — detection and state

- [x] 1.1 Add `ViewportResolutionHintService` in `libs/design` with undersized detection (`innerWidth < 1920 || innerHeight < 1080`), resize listener with debounce, and episode-based `dismissedForEpisode` cleared when viewport meets both minimums
- [x] 1.2 Expose a `visible` (or equivalent) computed signal: show when undersized and not dismissed for current episode
- [x] 1.3 Unit-test service: undersized at 1919×1080, sufficient at 1920×1080, dismiss while undersized, clear episode on grow, re-show after shrink

## 2. Design library — presentation

- [x] 2.1 Add standalone `LmViewportResolutionHintComponent` using design tokens, serif body copy recommending 1920×1080, optional `LmKicker`, dismiss control with accessible label
- [x] 2.2 Wire component to service (`visible`, `dismiss()`); fixed bottom banner layout, no blocking backdrop
- [x] 2.3 Export service and component from `libs/design` public API (`index.ts`)

## 3. App shell integration

- [x] 3.1 Import and render `<lm-viewport-resolution-hint />` in `AppComponent` alongside `<router-outlet />`
- [x] 3.2 Smoke-test or extend `app.spec.ts` that the hint host is present in the root template

## 4. Verification

- [x] 4.1 Run `nx test design --tui=false` and `nx test lightmatters --tui=false`
- [x] 4.2 Run `nx lint design lightmatters --tui=false`
- [x] 4.3 Manual check: resize below 1920×1080 → hint appears; dismiss → hidden; resize above → hidden; resize below again → hint returns
