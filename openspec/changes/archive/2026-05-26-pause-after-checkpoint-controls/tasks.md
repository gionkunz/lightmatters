## 1. TimelineRunner checkpoint hold

- [x] 1.1 Replace timed read-pause auto-advance with indefinite checkpoint hold after narrate typing completes (skip hold when next event is exploration `userAdvance`)
- [x] 1.2 Add checkpoint hold after animate tween completion (same advance path as narrate)
- [x] 1.3 Rename or alias `atReadPause` → `atCheckpointHold`; wire `resume()` and `skipReadPause()` (or renamed `advanceFromCheckpointHold()`) to resolve hold and advance
- [x] 1.4 Update `buildTimelineSchedule` and `syncProgress` so hold time is not included in `totalDurationMs`; progress stops at checkpoint position during hold
- [x] 1.5 Update `timeline-runner.spec.ts`: replace timed read-pause tests with checkpoint-hold tests; add animate-hold test

## 2. Playback bar layout and styling

- [x] 2.1 Restructure `LmPlaybackBarComponent` template: row 1 = elapsed + progress track + checkpoint dots + total; row 2 = centered transport controls
- [x] 2.2 Enlarge transport buttons (≥48×48 hit target, higher opacity, accent on Play) per step-chrome spec
- [x] 2.3 Verify `LmStepFrameComponent` wiring: `showPlay`/`showPause` reflect checkpoint hold vs active playback

## 3. Step keyboard handlers

- [x] 3.1 Update Space/Enter handlers in all six step components to use checkpoint-hold advance path (Chapter 1 steps 1–4, Chapter 2 steps 1–2)
- [x] 3.2 Align footer key hint copy if it still references timed auto-advance ("pause / skip")

## 4. Verification

- [x] 4.1 Run `nx test engine --tui=false` and fix any failures
- [x] 4.2 Run `nx lint engine --tui=false`
- [x] 4.3 Manual smoke: Chapter 1 Step 1 and Chapter 2 Step 2 — confirm pause after each checkpoint, Play/Space advances, two-row centered controls render correctly
