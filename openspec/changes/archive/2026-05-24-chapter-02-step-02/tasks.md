## 1. Lorentz physics foundation

- [x] 1.1 Add `libs/physics/src/lib/lorentz.ts`: `lorentz(vOverC)`, `properTimeFraction(vOverC)`, `spatialSpeedKms(vOverC)`; export from `@lm/physics`
- [x] 1.2 Refactor `speedBudgetComponents`, `arcSpatialSpeedKms`, `speedBudgetTipLabel` to use Lorentz helpers; `vOverC` is physical $v/c$
- [x] 1.3 Update `speed-budget.spec.ts`: $v/c = 0.5$ → time $\approx 0.866$ yr, speed $= 0.5c$; $v/c = \mathrm{SQRT1\_2}$ → time $\approx 0.707$ yr, equal split
- [x] 1.4 Add `travellerReadout(vOverC, coordinateYears)` for Step 2 FactLine strings

## 2. Diagram physical angle mapping

- [x] 2.1 Change `vectorAngleRad` to `Math.asin(min(1, velocity))` for budget-arc `single` variant; update existing single-variant tests
- [x] 2.2 Add `velocityA` / `velocityB` inputs and `pair` variant branch (shared axes, budget arc, twin accent vectors, no swing)
- [x] 2.3 Verify at $v/c = 0.5$ vector sits at 30° (not 45°); at $v/c \approx 0.707$ vector at 45°
- [x] 2.4 Add pair-variant unit tests; timeline-targetable `diagram.velocityA` / `diagram.velocityB`

## 3. Design components

- [x] 3.1 Create `LmFactLine` (key, value, optional accent)
- [x] 3.2 Create `LmLegend` (color, label) — prototype `Legend2`
- [x] 3.3 Export both from `@lm/design`

## 4. Chat-feed narrator

- [x] 4.1 Extend `Step.layout` with `'chat-feed'`
- [x] 4.2 Expose `completedNarrateTexts()` from `TimelineRunner`
- [x] 4.3 Create `LmNarratorChatFeedComponent`; export from `@lm/engine`

## 5. Chapter 2 Step 1 alignment

- [x] 5.1 Update `step-01-always-at-c.ts`: animate fifty-fifty beat to `Math.SQRT1_2` (~0.707); rewrite narration for 45° equal split at ~0.71$c$
- [x] 5.2 Manual QA `/ch/02/step/1`: readouts and vector angle match Lorentz at exploration values

## 6. Chapter 2 Step 2 content

- [x] 6.1 Author `step-02-two-travellers.ts`: layout `chat-feed`, timeline per design.md (animate `velocityB` 0→0.5)
- [x] 6.2 Create `Step02Component`: chat-feed grid, pair diagram 560×460, legends, four FactLines, sliders (A fixed ~0.01, B interactive)
- [x] 6.3 Register `diagram.velocityA` / `diagram.velocityB`; bind FactLines to `travellerReadout()`

## 7. Registry, routing, navigation

- [x] 7.1 Register Step 2 in `step-registry.ts`; `@case (2)` in step page
- [x] 7.2 Step 1: `[hasNextStep]="true"`, `(next)` → `/ch/02/step/2`
- [x] 7.3 Step 2: `(back)` → `/ch/02/step/1`; counter `02 / 11`

## 8. Verification

- [x] 8.1 `nx test physics spacetime-diagram --tui=false` passes
- [x] 8.2 `nx build lightmatters --tui=false` succeeds
- [x] 8.3 `nx lint feature-chapter-02-speed-budget design engine physics --tui=false` succeeds
- [x] 8.4 Manual smoke: Step 1 fifty-fifty at ~0.71$c$ / 45°; Step 2 half-$c$ → ~150,000 km/s, ~0.87 yr vs 1 yr on Earth; B slider updates readouts
