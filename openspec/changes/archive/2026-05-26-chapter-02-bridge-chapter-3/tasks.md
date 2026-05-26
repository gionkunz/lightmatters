## 1. Physics — signal reception and milestones

- [x] 1.1 Add `signal-reception.ts`: reception times, `properTimeAtReception`, `wavefrontRadiusAtObserver(layout, 'a' | 'c')`
- [x] 1.2 Export Step 3 layout constants + milestone radii; unit tests for default A-left / C-right geometry

## 2. Spacetime diagram — wavefront variant

- [x] 2.1 Add `variant: 'wavefront'`: A/B/C worldlines, single `wavefrontRadius` input, stroke-only ring from B
- [x] 2.2 Reception markers at A/C when radius crosses milestones; markers persist while radius held
- [x] 2.3 Register `wavefront.radius` as timeline target; unit tests for milestone intersection + hold-at-radius

## 3. Design system — prediction choice

- [x] 3.1 Create `LmPredictionChoiceComponent`; export from `@lm/design` + unit test

## 4. Step frame — continue gating

- [x] 4.1 Add `continueDisabled` input to `LmStepFrameComponent`

## 5. Chapter 2 Step 3 — staged single-pulse timeline

- [x] 5.1 Author `step-03-bridge-to-light.ts`: **one pulse**, two animate segments (`0 → r_A`, `r_A → r_C`) each followed by narrate checkpoint pause; predictions; **closing narrate** that we will explore this more in the next chapter (see design.md beat 9)
- [x] 5.2 Create `Step03Component`: wavefront diagram, A/C clocks updated at milestones, predictions gate continue
- [x] 5.3 Verify playback checkpoints seek correctly to A-arrival and C-arrival beats

## 6. Registry, routing, navigation

- [x] 6.1 Register Step 3; Step 2 `(next)` → `/ch/02/step/3`; Step 3 `(next)` → `/ch/03/step/1` with `[nextChapter]="true"`
- [x] 6.2 Chapter 3 stub route if missing

## 7. Verification

- [x] 7.1 `nx test physics spacetime-diagram design --tui=false` passes
- [ ] 7.2 `nx build lightmatters --tui=false` succeeds
- [ ] 7.3 Manual smoke: one pulse only; pauses at A then C with narration; clocks differ; predictions → next chapter

## 8. Product doc (optional)

- [x] 8.1 Update `docs/product.md` bridge beat: single-pulse preview; full wavefronts in Chapter 3
