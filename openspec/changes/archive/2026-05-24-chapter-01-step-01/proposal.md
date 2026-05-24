## Why

The landing page and design system are in place, but there is no engine, no step experience, and no chapter content. Chapter 1 Step 1 ("What is position? A point on an axis.") is the smallest vertical slice that proves the core product loop: narrated text, an animated diagram, user interaction, and a routable step URL. Building it now validates the timeline engine and authoring model before investing in later chapters or WebGL primitives.

## What Changes

- Implement a **timeline engine** in `libs/engine`: `TimelineRunner` with `narrate`, `animate`, and `wait` events, plus skip-to-next-boundary for keyboard advance.
- Implement a **Narrator** component driven by the timeline — progressive typewriter reveal, skippable.
- Implement **step chrome** in `libs/engine`: step frame layout (chapter nav, progress dots, footer controls) ported from `visual-design-prototype/project/step-ui.jsx`.
- Implement the **spacetime diagram** primitive in `libs/primitives/spacetime-diagram` (SVG) in a minimal **position-only** mode: horizontal axis, tick marks, a movable point — no time axis yet (that arrives in step 2).
- Scaffold **`libs/features/chapter-01-position-time`**: chapter shell, step routing (`/ch/01/step/1`), and the authored Step 1 module with narration copy and timeline.
- Wire the app shell: lazy-load chapter 01 routes at `/ch/01`, update landing CTA / chapter card links to point at `/ch/01/step/1`.
- Add an **`LmSlider`** brand component to `libs/design` (needed for the position control in step 1).

This change delivers **one step only** (Chapter 1 · Step 1). Remaining Chapter 1 steps, chapter-index, design-sheet, WebGL, and `bind`/`trigger` timeline events are out of scope.

## Capabilities

### New Capabilities

- `timeline-engine`: declarative timeline runner, event types (`narrate`, `animate`, `wait`), skip semantics, step-scoped state reset.
- `narrator`: HTML narrator layer with typewriter reveal orchestrated by timeline `narrate` events.
- `step-chrome`: reusable step frame — chapter/step nav, progress dots, footer (back / advance), keyboard shortcuts.
- `spacetime-diagram`: SVG spacetime diagram primitive with position-only variant (x-axis + point) for Step 1.
- `chapter-01-step-01`: Chapter 1 feature lib, routing, and Step 1 authored content ("What is position?").

### Modified Capabilities

- `app-shell`: add lazy-loaded `/ch/01` route; shell layout remains wordmark + theme toggle + `<router-outlet>` (step chrome lives inside the chapter feature, not the app shell).
- `landing-page`: chapter 1 card and primary CTA link to `/ch/01/step/1` instead of `#` stubs.

## Impact

- **New libraries:** `libs/primitives/spacetime-diagram`, `libs/features/chapter-01-position-time`.
- **Engine:** replaces placeholder `libs/engine` stub with timeline runner, narrator, step-host, and step-chrome components.
- **Design:** adds `LmSlider` component; may add `@source` for new libs in `styles.css`.
- **App:** `app.routes.ts` gains `/ch/01` lazy route; landing links updated.
- **Module boundaries:** new `scope:primitive` and `scope:feature` projects; ESLint tags verified.
- **Dependencies:** no new npm packages expected.
- **Testing:** unit tests for timeline runner (event ordering, skip) and smoke test that Step 1 route renders.
