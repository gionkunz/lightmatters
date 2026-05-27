## 1. Playback bar — boundary hints

- [x] 1.1 Add `previousHint` and `nextHint` optional inputs to `LmPlaybackBarComponent`
- [x] 1.2 Render kicker labels beside ⏮ / ⏭ when hints are non-empty (import `LmKickerComponent`)
- [x] 1.3 Update `lm-playback-bar.component` unit tests for hint visibility and layout

## 2. Step frame — remove footer, orchestrate transport

- [x] 2.1 Remove footer row from `LmStepFrameComponent` template and adjust grid to three rows
- [x] 2.2 Remove `back`, `next` outputs and footer-related template bindings
- [x] 2.3 Add inputs: `prevStepUrl`, `nextStepUrl`, `hasNextStep`, `nextChapter`, `advanceDisabled`
- [x] 2.4 Inject `Router`; implement internal dispatch on `(goPrevious)` / `(goNext)`: checkpoint first, then boundary navigation
- [x] 2.5 Compute `previousHint` / `nextHint` from step/chapter context and pass to playback bar
- [x] 2.6 Expand `canGoPrevious` / `canGoNext` passed to playback bar per design (boundary-aware)
- [x] 2.7 Add `LmStepFrameComponent` unit tests for dispatch logic, hints, and disabled advance gating

## 3. Reference step migration (Chapter 1 Step 2)

- [x] 3.1 Migrate `step-02.component.ts`: replace `(back)`/`(next)` with URL inputs; remove manual transport wiring duplication where frame handles it
- [x] 3.2 Add ArrowLeft / ArrowRight to keydown handler mirroring transport dispatch
- [x] 3.3 Manually verify: intra-step checkpoints, rewind to Step 1, forward to Step 3, hints at boundaries

## 4. Mechanical step migration (remaining chapters)

- [x] 4.1 Migrate Chapter 1 steps 1, 3, 4
- [x] 4.2 Migrate Chapter 2 steps 1–3 (include `advanceDisabled` on Step 3 prediction gate)
- [x] 4.3 Migrate Chapter 3 steps 1–5 (include `advanceDisabled` on Step 4 prediction gate)
- [x] 4.4 Migrate Chapter 4 steps 1–5
- [x] 4.5 Migrate Chapter 5 steps 1–5
- [x] 4.6 Migrate Chapter 6 steps 1–5
- [x] 4.7 For each last-step-with-next-chapter: pass `nextChapter` and correct `nextStepUrl`
- [x] 4.8 For Chapter 1 Step 1: `prevStepUrl` unset or maps to `/` for rewind-at-start

## 5. Verification

- [x] 5.1 Run `nx test engine --tui=false` and fix any failures
- [ ] 5.2 Run `nx build lightmatters --tui=false` (blocked: ESM require error in Angular compiler CLI — unrelated to this change; `tsc --noEmit` passes)
- [x] 5.3 Spot-check cross-chapter navigation (Ch 1 Step 4 → Ch 2 Step 1, Ch 2 Step 3 → Ch 3 Step 1)
- [x] 5.4 Update any E2E tests referencing footer back/continue selectors
