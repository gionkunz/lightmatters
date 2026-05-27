## 1. TimelineRunner exploration unlock

- [x] 1.1 Set `atExplorationWait(true)` at the start of `beginNarrate` / `beginAnimate` when `isPreExplorationEvent(this.index)`; remove duplicate set on narrate completion in `continueNarrate`
- [x] 1.2 Clear `atExplorationWait(false)` when advancing past a `userAdvance` wait; verify `reset()`, `goToCheckpoint()`, and seek paths re-derive the flag correctly
- [x] 1.3 Add unit tests: unlock on pre-exploration narrate start (typing in progress), unlock on pre-exploration animate start, clear after advance, re-arm on second exploration segment

## 2. Step component gating fixes

- [x] 2.1 Update Chapter 3 Step 4 `showPrediction` to use `runner.atExplorationWait()` (keep phase guards); confirm selection still calls `advance()` at the wait boundary
- [x] 2.2 Audit other steps for `waitingForUser()`-only exploration gating; fix any that block controls beyond the engine signal

## 3. Verification

- [x] 3.1 Run `nx test engine --tui=false` and fix any failing timeline-runner specs
- [x] 3.2 Manual QA: `/ch/01/step/3` (slider unlocks while final narrate types), `/ch/02/step/1` (long preamble), `/ch/03/step/4` (prediction appears early)
