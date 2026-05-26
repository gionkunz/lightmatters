## Context

Every step uses `TimelineRunner` plus `LmPlaybackBar` inside `LmStepFrame`. Checkpoints align with `narrate` and `animate` events. Today, after narration finishes typing, the runner enters a timed **read pause** (`pauseAfter`, default 4000 ms) that auto-advances to the next event. Animate checkpoints advance immediately when the tween completes. Transport controls (⏮ ⏸ ▶ ⏭) sit inline with the progress track in a single row at `size-8` with low opacity — easy to miss.

Readers report they cannot read narration and watch diagram motion simultaneously. Slowing the read pause helped but did not fix the core issue: the timeline keeps moving unless interrupted.

## Goals / Non-Goals

**Goals:**

- Pause automatically at every narrate/animate checkpoint boundary until the user explicitly continues (Play or Next checkpoint).
- Restructure `LmPlaybackBar` into two rows: progress track on top, centered transport controls below.
- Make transport controls substantially larger and more visually prominent (hit target, icon size, contrast).
- Apply engine-level changes so all existing chapter steps inherit the behavior without per-step timeline edits.
- Preserve mid-event pause/resume (freeze typing or tween in place).
- Preserve checkpoint seek, previous/next checkpoint, and exploration `userAdvance` wait semantics.

**Non-Goals:**

- Removing `pauseAfter` from the type system (authors may still use it later; default behavior changes).
- Adding a user preference / settings toggle for auto-play vs pause-at-checkpoint.
- Changing footer back/continue navigation or step routing.
- `prefers-reduced-motion` support.
- Redesigning checkpoint dots on the progress track (only transport button row changes).

## Decisions

### 1. Replace auto read-pause with checkpoint hold

When a narrate event finishes typing (or an animate event finishes tweening), the runner enters a **checkpoint hold** instead of starting a countdown timer:

- Set `isPaused(true)` and `atCheckpointHold(true)` (rename/refocus of `atReadPause`).
- Do **not** schedule a timeout; progression waits for `resume()` or `goToNextCheckpoint()`.
- `resume()` at checkpoint hold resolves the current event promise and advances — same net effect as today's `skipReadPause()`.
- Remove reliance on `DEFAULT_NARRATE_READ_PAUSE_MS` for default progression; the hold is indefinite until user action.

**Alternative considered:** Keep the timer but default `pauseAfter` to `Infinity`. Rejected — conflates two concepts and breaks progress-bar time math.

**Alternative considered:** Auto-play mode with a settings toggle. Rejected per non-goals; can revisit if readers want both modes.

### 2. Animate events also hold at checkpoint

Today only narrate events have a post-completion hold. Animate events resolve immediately. Both are checkpoints on the progress bar, so both SHALL pause after completion for consistent "read, then continue" rhythm.

Implementation: on animate completion (`t >= 1`), call the same checkpoint-hold path before resolving the animate promise.

### 3. Keyboard Space/Enter maps to Play at checkpoint hold

Existing step components already handle Space during `atReadPause()` via `skipReadPause()`. Rename to `advanceFromCheckpointHold()` (or keep `skipReadPause` as alias) and wire the same path from Play button `resume()`.

Priority order stays: paused mid-event → resume; checkpoint hold → advance; exploration wait → advance; playing → pause; idle → next checkpoint.

### 4. Two-row playback bar layout

`LmPlaybackBarComponent` template restructure:

```
┌─────────────────────────────────────────────────────────┐
│  0:12  ═══════●═══════●══════════════  1:45             │  ← row 1: times + progress + checkpoint dots
│              ⏮    ▶/⏸    ⏭                             │  ← row 2: centered transport, larger buttons
└─────────────────────────────────────────────────────────┘
```

- Outer container: `flex flex-col` with border-bottom (unchanged placement in step frame).
- Row 1: full-width progress track (existing elapsed/total + bar + dots).
- Row 2: `flex justify-center` transport cluster with increased gap.
- Button sizing: ~`size-12` minimum hit target, higher base opacity (~0.7), Play button gets accent border (matching `LmPlaybackControlsComponent` pattern).

`LmStepFrame` grid stays `grid-rows-[auto_auto_1fr_auto]` — playback bar remains one grid row, internally two lines.

### 5. Progress bar time math without auto read pause

Schedule builder currently adds `pauseAfter` to narrate event duration for total timeline length. With indefinite holds, checkpoint segments should use **typing + animate duration only** for the progress denominator; elapsed time stops advancing during checkpoint hold (same as mid-event pause).

Update `buildTimelineSchedule` / `syncProgress` so hold time is not baked into `totalDurationMs`. Progress jumps to the checkpoint position and waits until the user continues.

### 6. Pre-exploration narrate keeps immediate advance to wait

Narrate events immediately before a `userAdvance` wait already skip read pause (`pauseAfter = 0`). They SHALL still advance directly into the exploration wait without an extra checkpoint hold — the exploration wait itself is the pause boundary.

## Risks / Trade-offs

- **[Slower default pacing]** → Users who preferred auto-play must press Play more often. Mitigation: prominent centered controls; Space/Enter still works.
- **[Progress bar total time shrinks]** → Removing baked-in read-pause duration changes elapsed/total display. Mitigation: totals reflect actual motion + typing time; holds are "free" wall-clock time.
- **[Duplicated keyboard logic in 6 step components]** → Each step copies the same `@HostListener`. Mitigation: out of scope here; consider extracting to a directive later.
- **[Tests assume timed read pause]** → `timeline-runner.spec.ts` tests need updating for hold semantics.

## Migration Plan

1. Implement engine hold semantics and update unit tests.
2. Restyle `LmPlaybackBar` two-row layout.
3. Smoke-test one Chapter 1 step and one Chapter 2 step.
4. No data migration; deploy with next release. Rollback = revert engine commit.

## Open Questions

- Should **Next checkpoint (⏭)** skip the hold and jump forward, or only work while playing? **Decision:** keep current behavior — Next from hold advances (same as Play for single-step hold).
- Icon treatment: unicode symbols vs SVG? **Decision:** keep unicode for now, scale via font-size; matches existing pattern.
