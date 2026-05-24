## Why

Chapter 1 Step 1 established position as a location on a line. The next beat in the chapter arc (`docs/product.md`: _"What is time? Another axis."_) introduces time with the same pedagogical pattern before the two axes merge into a spacetime diagram in Step 3. Step 2 is the natural continuation of the engine vertical slice: it validates that step-to-step navigation, diagram variant extension, and authored timeline content scale without engine changes.

## What Changes

- Add a **`time-only`** variant to `LmSpacetimeDiagram`: vertical time axis, tick marks, `t` label, movable point at normalized time (0–1). Mirrors the existing `position-only` variant from Step 1.
- Author **Chapter 1 Step 2** ("What is time?") at `/ch/01/step/2`: StepIntro layout, time slider, narration timeline, exploration wait — same interaction pattern as Step 1.
- Register Step 2 in the chapter step registry and wire a `Step02Component` host.
- **Enable step-to-step navigation:** Step 1 footer shows an advance control routing to `/ch/01/step/2`; Step 2 back navigates to Step 1.
- Add unit tests for the `time-only` diagram variant and smoke coverage that Step 2 route renders.

Out of scope: combined spacetime diagram (Step 3), worldlines, light cone, `bind`/`trigger` timeline events, chapter-index, design-sheet.

## Capabilities

### New Capabilities

- `chapter-01-step-02`: Chapter 1 Step 2 authored content ("What is time?"), routing at `/ch/01/step/2`, and step-to-step navigation from Step 1.

### Modified Capabilities

- `spacetime-diagram`: add `time-only` variant with vertical axis, `t` label, and animatable `time` input.
- `step-chrome`: Step 1 SHALL show advance-to-next-step when Step 2 exists; Step 2 back navigates to previous step within the chapter.

## Impact

- **Primitive:** `libs/primitives/spacetime-diagram` — new variant, new input, tests.
- **Feature:** `libs/features/chapter-01-position-time` — new step module + component, registry update, Step 1 navigation tweak.
- **Specs:** new `chapter-01-step-02` spec; delta updates to `spacetime-diagram` and `step-chrome`.
- **No new libraries or npm packages.** Engine, narrator, and timeline APIs unchanged.
