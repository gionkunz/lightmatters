## 1. Spacetime diagram — time-only variant

- [x] 1.1 Extend `LmSpacetimeDiagram` variant union: `'position-only' | 'time-only'`
- [x] 1.2 Add `time` input (0–1); render vertical axis with 5 ticks, `t` label at top, point marker at normalized time
- [x] 1.3 Match visual-guidelines conventions: time vertical (bottom → top), thin strokes, theme token colors, no glow
- [x] 1.4 Unit test: `time-only` renders vertical axis + `t` label + point; point moves when `time` input changes
- [x] 1.5 Verify existing `position-only` tests still pass

## 2. Chapter 1 Step 2 content

- [x] 2.1 Author `steps/step-02-time.ts`: `Step` object with id `time-intro`, kicker `time`, layout `intro`, timeline (2 narrate beats, animate time 0 → 0.5, wait `userAdvance`)
- [x] 2.2 Create `Step02Component`: StepIntro grid — narrator top, `time-only` diagram (680×320), `LmSlider` labeled `time` at bottom
- [x] 2.3 Register `diagram.time` in `TargetRegistry`; wire slider after exploration wait; initial time 0
- [x] 2.4 Verify narration copy matches design.md beats

## 3. Step registry and routing

- [x] 3.1 Register Step 2 in `step-registry.ts` (entry for step number 2)
- [x] 3.2 Add `@case (2) { <lm-step-02 /> }` to `step-page.component.ts`
- [x] 3.3 Export `Step02Component` if needed by step page imports

## 4. Step-to-step navigation

- [x] 4.1 Step 1: set `[hasNextStep]="hasNextStep(1)"`, wire `(next)="goNextStep()"` → `/ch/01/step/2`
- [x] 4.2 Step 2: `[hasNextStep]="false"`, wire `(back)="goPrevStep()"` → `/ch/01/step/1`
- [x] 4.3 Confirm progress dots highlight step 2 when active; step counter shows `02 / 06`

## 5. Verification

- [ ] 5.1 `nx build lightmatters --tui=false` succeeds
- [x] 5.2 `nx lint spacetime-diagram feature-chapter-01-position-time --tui=false` succeeds
- [x] 5.3 `nx test spacetime-diagram --tui=false` succeeds
- [x] 5.4 Manual smoke: navigate `/ch/01/step/1` → continue → `/ch/01/step/2`; verify narration, slider moves point vertically, back returns to Step 1, theme toggle works
