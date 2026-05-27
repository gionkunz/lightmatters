## Why

Light Matters step layouts and diagrams are authored for a desktop canvas around **1920×1080**. On smaller viewports, controls crowd, diagrams clip, and narration feels cramped — but nothing tells the reader why. A dismissible, non-blocking hint sets expectations without blocking access, and re-showing when the viewport shrinks again preserves the nudge after resize or docked windows without persisting annoyance across sessions via storage.

## What Changes

- Add a global **viewport resolution hint** overlay when `window.innerWidth < 1920` **or** `window.innerHeight < 1080`.
- Message recommends at least **1920×1080** for the best experience; copy is concise and on-brand (serif body, optional kicker).
- User can **dismiss** the hint (close control or equivalent); dismissal applies only while the viewport remains at or above both thresholds.
- When the viewport drops below either threshold again, the hint **re-appears** even if the user dismissed it earlier in the same session.
- Hint is mounted once in the **app shell** so it applies on landing, all chapter routes, and placeholders.
- No `localStorage` / `sessionStorage` for dismiss state — behavior is purely viewport-driven.
- Unit tests cover threshold detection, dismiss while large, and re-show after resize below threshold.

## Capabilities

### New Capabilities

- `viewport-resolution-hint`: Threshold detection, dismiss/re-show semantics, presentation, and accessibility of the resolution hint overlay.

### Modified Capabilities

- `app-shell`: Shell SHALL host the resolution hint so it is available on every route without per-feature wiring.

## Impact

- **`libs/design`**: New service and/or standalone component (e.g. `ViewportResolutionHintService`, `LmViewportResolutionHint`), exported from `@lm/design`.
- **`apps/lightmatters`**: `AppComponent` template includes the hint alongside `<router-outlet />`.
- **`openspec/specs/app-shell`**: Delta spec for shell hosting requirement.
- **Tests**: Jest in `libs/design` (resize/orientation simulation via `window` dimensions); optional thin app-shell smoke test.
- **E2E**: Optional Playwright check at sub-threshold viewport (can follow in a later pass if flaky in CI).
