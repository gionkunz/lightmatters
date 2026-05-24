## Why

Chapter 1 Steps 1–4 established position, time, worldlines, and a teaser of the speed-budget idea (single velocity vector at `/ch/01/step/4`). Chapter 2 is the dedicated home for that thesis: you always move through spacetime at $c$, allocating between space and time. Step 1 opens the chapter with a focused beat on the **two extremes** — pure time motion and pure space motion — reusing the existing `single` diagram variant while scaffolding the new chapter feature lib and cross-chapter routing.

## What Changes

- Scaffold **`libs/features/chapter-02-speed-budget`**: chapter shell, step routing (`/ch/02/step/1`), step registry, and public API (`chapter02Routes`).
- Author **Chapter 2 Step 1** ("Always at c") at `/ch/02/step/1`: StepIntro layout, `single`-variant diagram, `v / c` slider, narration exploring pure time (v = 0) vs light-speed spatial motion (v → 1).
- Wire **app shell**: lazy-load `/ch/02` route in `app.routes.ts`.
- Enable **cross-chapter navigation**: Chapter 1 Step 4 footer advances to `/ch/02/step/1`; Chapter 2 Step 1 back navigates to `/ch/01/step/4`.
- Update **landing page**: Chapter 2 preview card links to `/ch/02/step/1`.
- Add smoke coverage that Step 1 route renders and step counter shows `01 / 11`.

Out of scope: twin-vector `pair` variant, chat-feed layout, Lorentz/time-dilation formulas, FactLine readout, `bind`/`trigger` timeline events, chapter-index route, remaining Chapter 2 steps 2–11, Chapter 1 steps 5–6.

## Capabilities

### New Capabilities

- `chapter-02-step-01`: Chapter 2 feature lib scaffold, routing at `/ch/02/step/1`, and Step 1 authored content ("Always at c" — pure time vs pure space extremes).

### Modified Capabilities

- `app-shell`: add lazy-loaded `/ch/02` route for the chapter 2 feature.
- `landing-page`: Chapter 2 preview card links to `/ch/02/step/1`.
- `step-chrome`: Chapter 1 Step 4 advances to Chapter 2 Step 1; Chapter 2 Step 1 back navigates to Chapter 1 Step 4.

## Impact

- **New library:** `libs/features/chapter-02-speed-budget` (`scope:feature`, tagged `feature-chapter-02-speed-budget`).
- **App:** `app.routes.ts` gains `/ch/02` lazy route; `@source` for new lib in `styles.css` if needed.
- **Chapter 1 feature:** Step 4 footer navigation updated to cross-chapter advance.
- **Landing:** Chapter 2 card `routerLink` updated from stub to `/ch/02/step/1`.
- **No primitive or engine changes.** Reuses existing `single` variant, timeline runner, narrator, and step chrome.
- **Testing:** smoke test that `/ch/02/step/1` renders; lint/build verification for new feature lib.
