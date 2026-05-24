## Why

Chapter 2 Step 1 established the speed budget on a single vector — everything moves through spacetime at $c$, split between time and space. Step 2 is the first beat with **two travellers**: someone on Earth (negligible spatial motion) and someone moving at **half the speed of light** ($v/c = 0.5$). Over one shared year, the diagram shows the moving traveller ages about **0.87 years** while the Earth-bound person ages a full year — the first concrete, interactive introduction to time dilation.

This change also **unifies speed-budget math** across the app: slider $v/c$ is physical velocity, readouts use Lorentz-consistent formulas, and the circular Epstein diagram uses $\theta = \arcsin(v/c)$ for vector placement. The arc shape stays the same; only the mapping and calculations change.

## What Changes

- **Refactor `@lm/physics`:** add `lorentz`, `properTimeFraction`, and `spatialSpeedKms`; refactor `speedBudgetComponents`, `arcSpatialSpeedKms`, and tip labels to use them as the single source of truth.
- **Update diagram angle mapping:** `single` and `pair` variants use $\theta = \arcsin(v/c)$ on the budget arc (not linear $v \cdot 90°$).
- **Update Chapter 2 Step 1 copy/animation:** fifty-fifty equal split demo moves to $v/c \approx 0.71$ (45° on arc); narration no longer conflates “halfway on slider” with “half light speed.”
- Author **Chapter 2 Step 2** ("Two travellers") at `/ch/02/step/2`: chat-feed layout, twin-vector `pair` diagram, two `v / c` sliders, `FactLine` readouts, traveller at $v/c = 0.5$ (~150,000 km/s, ~0.87 yr).
- Extend **`LmSpacetimeDiagram`** with `pair` variant; add **`LmFactLine`**, **`LmLegend`**, and **chat-feed narrator**.
- Wire **step navigation:** Chapter 2 Step 1 → Step 2; Step 2 back → Step 1.
- Add smoke coverage for `/ch/02/step/2`.

Out of scope: narrating the $\gamma$ formula by name (numbers are already Lorentz-exact; naming $\gamma$ is a later beat), acceleration/twin-paradox resolution, `bind`/`trigger`, decorative vector swing, remaining Chapter 2 steps 3–11.

## Capabilities

### New Capabilities

- `physics`: Lorentz primitives and Lorentz-backed speed-budget readouts (`lorentz`, `properTimeFraction`, `spatialSpeedKms`, refactored `speedBudgetComponents`).
- `chapter-02-step-02`: Step 2 authored content ("Two travellers" — twin vectors, half-$c$ journey, Lorentz-exact readouts).

### Modified Capabilities

- `spacetime-diagram`: `pair` variant; physical $\arcsin(v/c)$ angle mapping on budget-arc variants (`single`, `pair`).
- `chapter-02-step-01`: fifty-fifty beat at $v/c \approx 0.71$ with updated narration; readouts match Lorentz mapping.
- `design-system-foundation`: `LmFactLine` and `LmLegend`.
- `narrator`: chat-feed layout variant.
- `step-chrome`: Chapter 2 Step 1 advances to Step 2; Step 2 back to Step 1.

## Impact

- **Physics:** `libs/physics` — new Lorentz module; refactored `speed-budget.ts` + tests.
- **Primitive:** `libs/primitives/spacetime-diagram` — `pair` variant; `vectorAngleRad = asin(v)` for budget-arc modes.
- **Feature:** `libs/features/chapter-02-speed-budget` — Step 1 narration/animation update; Step 2 new files; Step 1 continue button.
- **Design / engine:** `LmFactLine`, `LmLegend`, `LmNarratorChatFeed`, `layout: 'chat-feed'`.
- **Testing:** physics unit tests at $v/c = 0.5$ and $\approx 0.707$; diagram angle tests; Step 2 smoke test.
