## Why

Chapter 1 Steps 1–3 established position, time, and worldlines on the full spacetime diagram. Step 4 is the pivot beat: reframing worldlines as **velocity through spacetime at c**, with motion allocated between space and time. This is the geometric seed for time dilation (`docs/product.md` Chapter 2 thesis) and validates that the spacetime diagram primitive can render the prototype's `single` variant with a timeline- and slider-controlled velocity vector — without engine changes.

## What Changes

- Add a **`single`** variant to `LmSpacetimeDiagram`: full two-axis layout (reuse `full` axes, ticks, light cone, labels) plus a fixed-length velocity vector from the origin, arrowhead polyline, optional dot at tip.
- Add animatable **`velocity`** input (0–1, representing v/c): 0 = pure time (vertical), 1 = along light cone (max spatial component at c). Vector angle driven by slider and timeline; no decorative swing animation.
- Author **Chapter 1 Step 4** ("Moving in spacetime") at `/ch/01/step/4`: StepIntro layout, single `v / c` slider, four-beat narration timeline, exploration wait.
- Register Step 4 in the chapter step registry and wire a `Step04Component` host.
- **Enable step-to-step navigation:** Step 3 footer shows advance to `/ch/01/step/4`; Step 4 back navigates to Step 3.
- Add unit tests for the `single` diagram variant and smoke coverage that Step 4 route renders.

Out of scope: twin-vector `pair` variant, chat-feed layout, time dilation formulas, `bind`/`trigger` timeline events, decorative vector swing loop, FactLine readout, Legend2, new chapter lib.

## Capabilities

### New Capabilities

- `chapter-01-step-04`: Chapter 1 Step 4 authored content ("Moving in spacetime / the speed budget"), routing at `/ch/01/step/4`, and step-to-step navigation from Step 3.

### Modified Capabilities

- `spacetime-diagram`: add `single` variant with full axes, light cone, velocity vector, and animatable `velocity` input.
- `step-chrome`: Step 3 SHALL show advance-to-next-step when Step 4 exists; Step 4 back navigates to Step 3.

## Impact

- **Primitive:** `libs/primitives/spacetime-diagram` — new variant, velocity vector rendering, tests.
- **Feature:** `libs/features/chapter-01-position-time` — new step module + component, registry update, Step 3 navigation tweak.
- **Specs:** new `chapter-01-step-04` spec; delta updates to `spacetime-diagram` and `step-chrome`.
- **No new libraries or npm packages.** Engine, narrator, and timeline APIs unchanged.
