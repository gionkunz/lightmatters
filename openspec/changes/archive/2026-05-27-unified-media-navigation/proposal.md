## Why

The step shell currently presents two overlapping navigation surfaces: a media-player-style playback bar at the top (checkpoint rewind / play / forward) and a footer with back / continue buttons plus keyboard hints. Both advance or retreat through the lesson, but they operate at different granularities without a clear hierarchy. Consolidating into a single transport control reduces cognitive load and makes the experience feel like one continuous playback through animations, steps, and chapters.

## What Changes

- **Remove the step footer entirely** — no back / continue buttons, no keyboard hint strip at the bottom. The main content area expands to use the reclaimed vertical space.
- **Extend playback transport to cross step and chapter boundaries** — when the user is at the first checkpoint of a step, ⏮ navigates to the previous step (or home from Chapter 1 Step 1). When at the last checkpoint or step completion, ⏭ navigates to the next step or chapter (respecting existing gates such as `continueDisabled`).
- **Boundary hints on transport buttons** — when ⏮ or ⏭ would leave the current step or chapter, show a short kicker label beside the button (e.g. "step 2", "next chapter").
- **Keyboard shortcuts preserved** — Space / Enter continue to drive play / pause / advance within the timeline; arrow keys (or equivalent) MAY drive prev / next checkpoint and step boundaries via the same logic as the transport buttons.
- **BREAKING:** `LmStepFrame` drops `back`, `next`, `hasNextStep`, `nextChapter`, and `continueDisabled` footer inputs/outputs. Step components wire navigation into playback transport instead.

## Capabilities

### New Capabilities

_(none — behavior extends existing step chrome and playback transport)_

### Modified Capabilities

- `step-chrome`: remove footer navigation; playback bar becomes sole transport; add boundary hints; grid layout loses footer row.
- `timeline-engine`: playback transport requirements extended to include step/chapter boundary navigation semantics (when invoked at first/last checkpoint).
- `chapter-01-step-01`, `chapter-01-step-02`, `chapter-01-step-03`, `chapter-01-step-04`: footer navigation scenarios replaced with playback-transport boundary scenarios.
- `chapter-02-step-01`, `chapter-02-step-02`, `chapter-02-step-03`: same footer → transport migration.
- `chapter-03-step-04`: continue gating moves from footer to transport next button.

## Impact

- **`libs/engine`:** `LmStepFrameComponent`, `LmPlaybackBarComponent` — remove footer; add boundary hint inputs and cross-step navigation outputs; possibly a small navigation helper or service for prev/next step URLs.
- **All chapter step components:** replace `(back)` / `(next)` footer wiring with unified transport handlers; migrate `continueDisabled` to transport `canGoNext` gating.
- **`openspec/specs/step-chrome/spec.md`:** large delta — footer requirements removed, transport extended.
- **Chapter step specs:** footer references updated to transport control references.
- **E2E tests:** any selectors or flows targeting footer buttons need updating.
- **No new npm dependencies.**
