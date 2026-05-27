## Context

The app shell (`AppComponent`) is a thin router outlet with theme initialized via `ThemeService`. Step layouts and WebGL/SVG diagrams assume a large desktop canvas; there is no responsive breakpoint messaging today. Design tokens and components (`LmButton`, `LmKicker`, surface colors) live in `@lm/design`. Theme preference persists in `localStorage`; this hint intentionally does **not**.

## Goals / Non-Goals

**Goals:**

- Show a non-modal, dismissible hint when viewport is smaller than **1920×1080** (either dimension below threshold triggers it).
- Allow dismiss while viewport stays large enough; re-show whenever viewport drops below threshold again in the same session.
- Mount globally from the app shell on all routes.
- Match visual guidelines: serif body, design tokens, light/dark themes, subtle surface panel (not a blocking modal).
- Testable via `ResizeObserver` / `window` resize with mocked dimensions in Jest.

**Non-Goals:**

- Blocking the app or preventing interaction below threshold.
- Persisting dismiss across page reloads or sessions.
- CSS `zoom` / scaling the app to fit small screens.
- `prefers-reduced-motion` handling (project-wide policy: motion is pedagogical; this hint is static).
- Mobile-specific layouts or reflow of step chrome.

## Decisions

### 1. Threshold: `innerWidth < 1920 || innerHeight < 1080`

Use `window.innerWidth` and `window.innerHeight` (CSS pixels, includes zoom). Either dimension below minimum triggers the hint — a 1920×900 window is “too small” even though width is fine.

**Alternative:** `matchMedia('(min-width: 1920px) and (min-height: 1080px)')` — equivalent; service can wrap both for testability.

### 2. Dismiss state: in-memory only, tied to “currently undersized” episode

`ViewportResolutionHintService` holds:

- `undersized` — derived from resize listener
- `dismissedForEpisode` — set `true` on dismiss; cleared when `undersized` becomes `false` (viewport grew to meet both mins), then set `true` again only if user dismisses after next undersized transition

Visible when: `undersized && !dismissedForEpisode`.

**Alternative:** `sessionStorage` — rejected; proposal requires re-show on every new undersized episode without cross-reload persistence.

### 3. Placement: `libs/design` component + service, shell hosts component

- `ViewportResolutionHintService` — listens to `resize` (and initial read), exposes `visible` signal/computed.
- `LmViewportResolutionHintComponent` — presentational overlay; calls `dismiss()` on close.
- `AppComponent` imports component from `@lm/design` beside `<router-outlet />`.

Keeps feature libs free of duplicate wiring and respects Nx boundaries (app → design).

**Alternative:** inline in `apps/lightmatters` only — rejected; harder to unit test and reuse on design-sheet route later.

### 4. UI pattern: bottom or top banner, not full-screen modal

Fixed-position bar (e.g. bottom center) with `surface` background, `ink-faint` border, body-small serif copy, `LmKicker` label “Display”, text like “For the best experience, use a window at least 1920×1080.”, dismiss as `LmButton` outline or an icon button with `aria-label="Dismiss"`. `z-index` above step chrome but below nothing critical — use a token class e.g. `z-50`. Pointer events on banner only; no backdrop scrim.

**Alternative:** centered dialog — feels too heavy for advisory copy.

### 5. Resize listening

`fromEvent(window, 'resize')` with `debounceTime(100)` or `auditTime` to avoid thrash during drag-resize; initial check in service constructor/`inject` after `DOCUMENT` defaultView available. Use `DestroyRef` + `takeUntilDestroyed` for cleanup.

SSR: not applicable (Cloudflare Pages SPA); guard if `typeof window === 'undefined'`.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Users on laptops with effective resolution &lt; 1920 due to OS scaling see hint often | Copy is advisory; dismiss works; no storage spam |
| `innerHeight` excludes browser UI chrome | Acceptable — matches “window size” user perception |
| Hint overlaps step footer controls on short viewports | Bottom banner with safe padding; max-width ~40rem centered |
| Resize storms during window drag | Debounce resize handler |

## Migration Plan

Ship in one PR: design lib + app shell template. No data migration. Rollback: remove component from shell and delete design exports.

## Open Questions

- Exact copy and kicker label — implement with product tone; can tweak without spec change if meaning unchanged.
- Whether to use top vs bottom placement — default **bottom** unless step chrome overlap in manual QA suggests top.
