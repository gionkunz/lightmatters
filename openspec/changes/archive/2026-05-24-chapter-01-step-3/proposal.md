## Why

Chapter 1 Steps 1 and 2 established position and time as separate axes. The next beat in the chapter arc (`docs/product.md`: _"The spacetime diagram: space on one axis, time on the other. Things trace lines through it."_) merges those axes into the full diagram and introduces **worldlines** — the core visual vocabulary for every later chapter. Step 3 is the payoff of the first two steps and validates that the spacetime diagram primitive can grow beyond single-axis modes without engine changes.

## What Changes

- Add a **`full`** variant to `LmSpacetimeDiagram`: horizontal space axis, vertical time axis, tick marks, `x`/`t` labels, optional dashed light-cone line, and a point marker at normalized `(position, time)`.
- Add a **worldline segment** to the full variant: a line from the diagram origin to the current point, visually connecting the two axes into a path through spacetime.
- Author **Chapter 1 Step 3** ("The spacetime diagram") at `/ch/01/step/3`: StepIntro layout, dual sliders (position + time), narration timeline, exploration wait — extending the interaction pattern from Steps 1–2.
- Register Step 3 in the chapter step registry and wire a `Step03Component` host.
- **Enable step-to-step navigation:** Step 2 footer shows advance to `/ch/01/step/3`; Step 3 back navigates to Step 2.
- Add unit tests for the `full` diagram variant and smoke coverage that Step 3 route renders.

Out of scope: velocity vectors, `v / c` slider, twin-vector `pair` variant, animated worldline trail / fading trace, `bind`/`trigger` timeline events, chapter-index, design-sheet.

## Capabilities

### New Capabilities

- `chapter-01-step-03`: Chapter 1 Step 3 authored content ("The spacetime diagram / worldlines"), routing at `/ch/01/step/3`, and step-to-step navigation from Step 2.

### Modified Capabilities

- `spacetime-diagram`: add `full` variant with both axes, light-cone dashed line, worldline segment, and animatable `position` + `time` inputs.
- `step-chrome`: Step 2 SHALL show advance-to-next-step when Step 3 exists; Step 3 back navigates to Step 2.

## Impact

- **Primitive:** `libs/primitives/spacetime-diagram` — new variant, worldline rendering, tests.
- **Feature:** `libs/features/chapter-01-position-time` — new step module + component, registry update, Step 2 navigation tweak.
- **Specs:** new `chapter-01-step-03` spec; delta updates to `spacetime-diagram` and `step-chrome`.
- **No new libraries or npm packages.** Engine, narrator, and timeline APIs unchanged.
