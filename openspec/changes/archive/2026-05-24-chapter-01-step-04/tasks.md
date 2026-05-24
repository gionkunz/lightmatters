## 1. Spacetime diagram — single variant

- [x] 1.1 Extend `LmSpacetimeDiagram` variant union: `'position-only' | 'time-only' | 'full' | 'single'`
- [x] 1.2 Reuse `full` layout constants for axes, ticks, `x`/`t` labels, and dashed light-cone diagonal
- [x] 1.3 Add `velocity` input (0–1, v/c), `showDot` (default true), `vectorStroke` (default 2.4)
- [x] 1.4 Render fixed-length velocity vector from origin with arrowhead polyline and optional dot at tip; angle maps linearly from vertical (v=0) to light cone (v=1)
- [x] 1.5 No decorative CSS swing animation — angle driven only by `velocity` input
- [x] 1.6 Unit test: `single` renders axes, labels, light cone, vector with arrowhead; vector vertical at v=0, aligns with light cone at v=1; angle updates when input changes
- [x] 1.7 Verify existing `position-only`, `time-only`, and `full` tests still pass

## 2. Chapter 1 Step 4 content

- [x] 2.1 Author `steps/step-04-moving-spacetime.ts`: `Step` object with id `moving-spacetime`, kicker `the speed budget`, layout `intro`, timeline (4 narrate beats, animate velocity 0→0.15, wait `userAdvance`)
- [x] 2.2 Create `Step04Component`: StepIntro grid — narrator top, `single` diagram (680×460), single `LmSlider` labeled `v / c` at bottom
- [x] 2.3 Register `diagram.velocity` in `TargetRegistry`; wire slider after exploration wait; initial value 0
- [x] 2.4 Verify narration copy matches design.md beats

## 3. Step registry and routing

- [x] 3.1 Register Step 4 in `step-registry.ts` (entry for step number 4)
- [x] 3.2 Add `@case (4) { <lm-step-04 /> }` to `step-page.component.ts`
- [x] 3.3 Export `Step04Component` if needed by step page imports

## 4. Step-to-step navigation

- [x] 4.1 Step 3: set `[hasNextStep]="hasNextStep(3)"`, wire `(next)="goNextStep()"` → `/ch/01/step/4`
- [x] 4.2 Step 4: `[hasNextStep]="false"`, wire `(back)="goPrevStep()"` → `/ch/01/step/3`
- [x] 4.3 Confirm progress dots highlight step 4 when active; step counter shows `04 / 06`

## 5. Verification

- [x] 5.1 `nx build lightmatters --tui=false` succeeds
- [x] 5.2 `nx lint spacetime-diagram feature-chapter-01-position-time --tui=false` succeeds
- [x] 5.3 `nx test spacetime-diagram --tui=false` succeeds
- [x] 5.4 Manual smoke: navigate `/ch/01/step/3` → continue → `/ch/01/step/4`; verify narration, entry animation tilts vector, slider tilts vector toward light cone, back returns to Step 3, theme toggle works
