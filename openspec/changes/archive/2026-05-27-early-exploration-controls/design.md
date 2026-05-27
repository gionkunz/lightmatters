## Context

Every exploration step ends its timeline with `{ type: 'wait', for: 'userAdvance' }`. Step components bind sliders and other widgets with `[disabled]="!runner.atExplorationWait()"`. Today `TimelineRunner` sets `atExplorationWait` only when:

1. The pre-exploration `narrate` event **finishes typing** (`continueNarrate`, via `isPreExplorationEvent`), or
2. The runner **enters** the `userAdvance` wait (`handleWait`).

Readers on long steps (e.g. Chapter 2 Step 1 with seven narrate beats before the slider prompt) must wait through all prior beats, their checkpoint holds, and the final narrate typing before the slider glows. Chapter 3 Step 4 gates `LmPredictionChoice` on `waitingForUser()`, which is even stricter — the widget appears only after the pre-exploration narrate completes **and** the wait event is entered.

The engine already knows which event precedes `userAdvance` via `isPreExplorationEvent(eventIndex)`.

## Goals / Non-Goals

**Goals:**

- Set `atExplorationWait(true)` when the runner **starts** the pre-exploration event (last `narrate` or `animate` before `userAdvance`), not when it completes.
- Keep narration, animate tweens, checkpoint holds, and `userAdvance` semantics unchanged — only the control-enable gate moves earlier.
- Align step-specific UIs (prediction choice) with the same exploration signal.
- Cover multi-segment timelines (Chapter 3 Step 4 has two `userAdvance` waits) by resetting `atExplorationWait` when leaving an exploration segment and re-arming on the next pre-exploration event.

**Non-Goals:**

- Enabling controls before the exploration segment (e.g. during Chapter 2 Step 1's first six narrate beats).
- Auto-advancing the timeline when the user interacts with controls.
- Adding a new timeline event type or step-authoring flag.
- Extracting shared keyboard handling from step components.

## Decisions

### 1. Unlock at event start via existing `isPreExplorationEvent`

In `runEvent()` (or at the top of `beginNarrate` / `beginAnimate`), when `isPreExplorationEvent(this.index)` is true, call `this.atExplorationWait.set(true)`.

Remove the duplicate set in `continueNarrate` on narrate completion (keep the set in `handleWait` for animate-only pre-exploration tails where beginAnimate already fired).

**Alternative considered:** New signal `explorationPhaseActive` with a different name. Rejected — `atExplorationWait` is already wired in six step components; renaming adds churn without benefit.

### 2. Reset exploration flag when advancing past `userAdvance`

When `advance()` resolves a `userAdvance` wait, set `atExplorationWait(false)` before continuing the timeline so a second exploration segment in the same step (Chapter 3 Step 4) can re-arm cleanly.

Verify `goToCheckpoint()` / `reset()` paths also clear and re-derive the flag from the seek target index.

### 3. Animate-only pre-exploration tails

If the last event before `userAdvance` is an `animate` (no trailing narrate), unlock at `beginAnimate` when `isPreExplorationEvent` — same code path as narrate.

### 4. Step-specific prediction gating

Chapter 3 Step 4 `showPrediction` computed SHALL use `runner.atExplorationWait()` (plus existing phase guards) instead of `runner.waitingForUser()`.

Continue-button disable logic stays tied to `waitingForUser()` at the wait boundary — only the prediction widget moves earlier.

### 5. Handler guards stay defensive

Step `onSliderChange` handlers that check `atExplorationWait()` remain — they prevent stale drags during seek/reset edge cases.

## Risks / Trade-offs

- **[User interacts before reading prompt]** → Narration still types the invitation; user may drag early. Mitigation: acceptable — exploration is optional until they advance; pedagogy assumes curious readers.
- **[Slider changes during entry animation]** → Pre-exploration animate may still be running (uncommon pattern). Mitigation: user override via slider is intentional; registry `set` overwrites animated value.
- **[Checkpoint seek rewinds exploration state]** → Seeking before exploration segment must clear `atExplorationWait`. Mitigation: `reset()` / seek helpers already zero signals; add test coverage.
- **[Dual userAdvance in one step]** → Flag must re-arm per segment. Mitigation: clear on `advance()` from wait; re-set on next pre-exploration start.

## Migration Plan

1. Update `TimelineRunner` unlock timing and tests.
2. Update Chapter 3 Step 4 prediction gating.
3. Smoke-test Chapter 1 Step 3 (narrate-before-wait), Chapter 2 Step 1 (long preamble), Chapter 3 Step 4 (dual wait).
4. No data migration; deploy with next release. Rollback = revert engine commit.

## Open Questions

- Should `atExplorationWait` be renamed to `controlsEnabled` in a follow-up? **Decision:** out of scope; keep existing name.
