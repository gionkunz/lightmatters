## Why

Steps that end with slider, prediction, or other exploration controls keep those controls disabled until the pre-exploration narrate beat finishes typing and the timeline reaches the `userAdvance` wait. Readers who already understand the prompt must sit through the full reveal (and sometimes a checkpoint hold on earlier beats) before they can interact. Exploration is the pedagogical payoff — it should be available as soon as the step enters its exploration segment, not after narration catches up.

## What Changes

- **Early exploration unlock:** When the timeline begins the last `narrate` or `animate` event immediately before a `userAdvance` wait, the runner SHALL set `atExplorationWait` (or equivalent) to true so bound controls become interactive while that event is still in progress.
- **Narration continues independently:** Unlocking controls does not skip narration, checkpoint holds on earlier beats, or the eventual `userAdvance` wait — only the gate on step-authored interactive widgets.
- **Step-specific interaction UIs:** Components that gate on `waitingForUser()` alone (e.g. prediction choice in Chapter 3 Step 4) SHALL switch to the shared exploration signal so they appear when exploration begins, not only after the wait event is entered.
- **Engine-wide:** Change lives in `TimelineRunner` and applies to every step using `atExplorationWait()` — no per-step timeline rewrites required beyond interaction gating fixes.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `timeline-engine`: exploration controls unlock at the start of the pre-exploration event, not at narrate completion or wait entry.
- `chapter-01-step-01`, `chapter-01-step-02`, `chapter-01-step-03`, `chapter-01-step-04`: slider scenarios updated to reflect early unlock timing.
- `chapter-02-step-01`, `chapter-02-step-02`: slider exploration scenarios updated to reflect early unlock timing.
- `chapter-03-step-04`: prediction choice becomes available when exploration begins, not only after `userAdvance` wait is entered.
- `prediction-choice`: requirement that hosting steps expose the widget during exploration phase, aligned with engine signal semantics.

## Impact

- **`libs/engine`:** `TimelineRunner` — set exploration flag in `beginNarrate` / `beginAnimate` when `isPreExplorationEvent`; update `timeline-runner.spec.ts`.
- **Chapter step components:** Replace `waitingForUser()`-only gating where it blocks exploration UI (Chapter 3 Step 4 prediction).
- **No new npm dependencies.**
