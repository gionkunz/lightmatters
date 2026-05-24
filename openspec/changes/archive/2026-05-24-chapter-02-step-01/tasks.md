## 1. Scaffold chapter 2 feature lib

- [x] 1.1 Generate `libs/features/chapter-02-speed-budget` with Nx Angular library generator, tagged `scope:feature`
- [x] 1.2 Add `@lm/feature-chapter-02-speed-budget` path alias in `tsconfig.base.json` if not auto-generated
- [x] 1.3 Create `chapter02.routes.ts`, `chapter-shell.component.ts`, `step-page.component.ts`, `step-registry.ts` mirroring Chapter 1 structure (`CHAPTER_02_TOTAL_STEPS = 11`, title "The speed budget")
- [x] 1.4 Export `chapter02Routes` from `src/index.ts`
- [x] 1.5 Add `@source` for new lib in `apps/lightmatters/src/styles.css` if needed

## 2. App shell and landing wiring

- [x] 2.1 Add lazy route `{ path: 'ch/02', loadChildren: ... chapter02Routes }` in `app.routes.ts`
- [x] 2.2 Update `landing-chapters.component.ts`: Chapter 2 card (`chapter.n === 2`) becomes `<a routerLink="/ch/02/step/1">`

## 3. Chapter 2 Step 1 content

- [x] 3.1 Author `steps/step-01-always-at-c.ts`: `Step` object with id `always-at-c`, kicker `always at c`, layout `intro`, timeline (4 narrate beats, animate velocity 0→1, wait `userAdvance`)
- [x] 3.2 Create `Step01Component`: StepIntro grid — narrator top, `single` diagram (680×460), single `LmSlider` labeled `v / c` at bottom
- [x] 3.3 Register `diagram.velocity` in `TargetRegistry`; wire slider after exploration wait; initial value 0
- [x] 3.4 Verify narration copy matches design.md beats (inline `$c$` math)

## 4. Step registry and routing

- [x] 4.1 Register Step 1 in `step-registry.ts`
- [x] 4.2 Add `@case (1) { <lm-step-01 /> }` to `step-page.component.ts`

## 5. Cross-chapter navigation

- [x] 5.1 Chapter 1 Step 4: set `[hasNextStep]="true"`, wire `(next)` → `/ch/02/step/1`
- [x] 5.2 Chapter 2 Step 1: `[hasNextStep]="false"`, wire `(back)` → `/ch/01/step/4`
- [x] 5.3 Confirm progress dots highlight step 1 when active; step counter shows `01 / 11`

## 6. Verification

- [x] 6.1 `nx build lightmatters --tui=false` succeeds
- [x] 6.2 `nx lint feature-chapter-02-speed-budget feature-chapter-01-position-time --tui=false` succeeds
- [x] 6.3 Manual smoke: `/ch/01/step/4` → continue → `/ch/02/step/1`; verify narration, entry animation sweeps vector 0→1, slider tilts vector, back returns to `/ch/01/step/4`, landing Chapter 2 card navigates to Step 1, theme toggle works
