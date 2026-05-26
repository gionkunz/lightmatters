## Why

Steps auto-advance through narrate and animate checkpoints after a timed read pause, but readers often cannot absorb narration and watch the diagram at the same time. Even with longer pauses, the timeline keeps moving unless the user actively interrupts it. Pausing by default at each checkpoint gives readers time to read and look before choosing to continue.

## What Changes

- **Default pause at checkpoints:** After each narrate or animate checkpoint completes, the timeline SHALL pause and wait for the user to press Play (or Next) before advancing — replacing the current auto-advancing read-pause countdown as the default progression mode.
- **Playback bar layout:** Split the top playback area into two rows: progress track with elapsed/total time on the first row; rewind / play / pause / forward transport controls centered on a second row below.
- **Prominent transport controls:** Enlarge checkpoint transport buttons (icon size, hit target, visual weight) so they read as the primary way to advance through a step.
- **Engine-wide:** Changes live in `libs/engine` (`TimelineRunner`, `LmPlaybackBar`) and apply automatically to every chapter step that uses the shared step frame — no per-chapter timeline rewrites required.
- Per-step `pauseAfter` overrides may remain for authors who want a timed hold before the checkpoint pause, but the default is user-driven advance.

## Capabilities

### New Capabilities

_(none — behavior changes are covered by existing engine and step-chrome capabilities)_

### Modified Capabilities

- `timeline-engine`: checkpoint completion pauses playback by default instead of auto-advancing after read pause; play/resume and next-checkpoint advance from the paused state.
- `step-chrome`: playback bar layout places transport controls on a centered second row below the progress track; controls are visually larger and more prominent.

## Impact

- **`libs/engine`:** `TimelineRunner` checkpoint / read-pause semantics; `LmPlaybackBarComponent` template and styling; unit tests in `timeline-runner.spec.ts`.
- **`libs/engine`:** `LmStepFrameComponent` grid rows may gain an extra auto row for the two-line playback bar (currently one playback row).
- **All chapter steps** (Chapter 1 steps 1–4, Chapter 2 steps 1–2): inherit new behavior via shared engine components — no step-authored timeline file changes expected unless tests or copy reference auto-advance timing.
- **E2E / keyboard hints:** Footer key hint "pause / skip" may need wording aligned with checkpoint-pause semantics.
- **No new npm dependencies.**
