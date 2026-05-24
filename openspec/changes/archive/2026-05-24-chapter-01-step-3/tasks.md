## 1. Spacetime diagram — full variant

- [x] 1.1 Extend `LmSpacetimeDiagram` variant union: `'position-only' | 'time-only' | 'full'`
- [x] 1.2 Render horizontal space axis + vertical time axis with 5 ticks each, `x`/`t` labels, origin at bottom-left
- [x] 1.3 Add dashed light-cone diagonal from origin (45°, `stroke-dasharray: 3 4`, opacity ~0.55)
- [x] 1.4 Add worldline segment from origin to point at `(position, time)`; point marker at tip
- [x] 1.5 Add optional `showLightCone` and `showWorldline` inputs (default true); match visual-guidelines conventions
- [x] 1.6 Unit test: `full` renders both axes, labels, light cone, worldline, point; point and worldline update when inputs change
- [x] 1.7 Verify existing `position-only` and `time-only` tests still pass

## 2. Chapter 1 Step 3 content

- [x] 2.1 Author `steps/step-03-spacetime.ts`: `Step` object with id `spacetime-intro`, kicker `a worldline`, layout `intro`, timeline (2 narrate beats, animate position 0→0.4 + time 0→0.5, wait `userAdvance`)
- [x] 2.2 Create `Step03Component`: StepIntro grid — narrator top, `full` diagram (680×460), dual `LmSlider` controls labeled `position` and `time` at bottom
- [x] 2.3 Register `diagram.position` and `diagram.time` in `TargetRegistry`; wire sliders after exploration wait; initial values 0, 0
- [x] 2.4 Verify narration copy matches design.md beats

## 3. Step registry and routing

- [x] 3.1 Register Step 3 in `step-registry.ts` (entry for step number 3)
- [x] 3.2 Add `@case (3) { <lm-step-03 /> }` to `step-page.component.ts`
- [x] 3.3 Export `Step03Component` if needed by step page imports

## 4. Step-to-step navigation

- [x] 4.1 Step 2: set `[hasNextStep]="hasNextStep(2)"`, wire `(next)="goNextStep()"` → `/ch/01/step/3`
- [x] 4.2 Step 3: `[hasNextStep]="false"`, wire `(back)="goPrevStep()"` → `/ch/01/step/2`
- [x] 4.3 Confirm progress dots highlight step 3 when active; step counter shows `03 / 06`

## 5. Verification

- [x] 5.1 `nx build lightmatters --tui=false` succeeds
- [x] 5.2 `nx lint spacetime-diagram feature-chapter-01-position-time --tui=false` succeeds
- [x] 5.3 `nx test spacetime-diagram --tui=false` succeeds
- [x] 5.4 Manual smoke: navigate `/ch/01/step/2` → continue → `/ch/01/step/3`; verify narration, dual sliders move point and worldline, back returns to Step 2, theme toggle works
