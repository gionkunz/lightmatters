## 1. Physics — 2-D pulse reception helpers

- [x] 1.1 Add `libs/physics/src/lib/light-scene.ts` with `pulseReachesStationary`, `pulseReachesMoving`, `lightCircleRadius`, and a small `Vec2` helper
- [x] 1.2 Export new helpers from `libs/physics/src/index.ts`
- [x] 1.3 Unit tests: stationary reception, moving reception, never-catches-up returns null, |v| ≥ c returns null

## 2. New primitive — `lm-light-scene`

- [x] 2.1 Generate library: `NX_TUI=false nx g @nx/angular:library --name=light-scene --directory=libs/primitives/light-scene --tags=scope:primitive --prefix=lm`
- [x] 2.2 Add to `tsconfig.base.json` paths under `@lm/light-scene`
- [x] 2.3 Implement `LmLightSceneComponent`: SVG canvas, observer dots (with uniform velocity rendering), source dots, expanding pulse circles
- [x] 2.4 Reception markers + glow drop-shadow on dots when pulses arrive; emit Angular `(reception)` output once per first crossing per pulse
- [x] 2.5 Register `scene.time` and per-observer `scene.observer.<id>.x` / `.y` targets via a small helper that step components can call
- [x] 2.6 Unit tests: structure (correct number of circles, dots), reception event firing at expected times for stationary and moving observers, no spacetime-diagram artifacts (axis ticks/worldlines absent)
- [x] 2.7 Lint passes for the new project

## 3. Chapter 3 feature — replace placeholder

- [x] 3.1 Remove `step-placeholder.component.ts`; create `step-registry.ts` mirroring `chapter-02-speed-budget` (title, total = 5, registry map)
- [x] 3.2 Create per-step files (timeline + component) for steps 1–5 under `libs/features/chapter-03-light-information/src/lib/steps/`
- [x] 3.3 Wire chapter routes in `chapter03.routes.ts` to the new component map; lazy-load the feature in `app.routes.ts` if not already

## 4. Step 1 — Light through space

- [x] 4.1 Author `step-01-light-through-space.ts`: opening camera-switch beat, single emission, single observer, one `animate` of `scene.time`, closing wait
- [x] 4.2 Implement `Step01Component`: scene + narrator chat-feed + FactLine for `observer · pulses received`
- [x] 4.3 Hook `(reception)` event to increment a counter signal feeding the FactLine

## 5. Step 2 — Two listeners

- [x] 5.1 Author `step-02-two-listeners.ts`: one source, two equidistant stationary observers, one emission, single `animate`
- [x] 5.2 Implement `Step02Component`: two FactLines (`A` / `B`), assertion in tests that both arrive at same `scene.time`

## 6. Step 3 — One of them moves

- [x] 6.1 Author `step-03-one-of-them-moves.ts`: same observers as Step 2, B has uniform velocity ≈ 0.4 c toward source
- [x] 6.2 Implement `Step03Component`: FactLines (`A · arrives at`, `B · arrives at`) showing scene-time of arrival
- [x] 6.3 Verify narration contains no Doppler / redshift / blueshift terminology (lint or unit test on step text)

## 7. Step 4 — Two flashes, one witness

- [x] 7.1 Author `step-04-two-flashes-one-witness.ts`: two sources, midpoint observer, two animate segments separated by a `wait` for prediction
- [x] 7.2 Implement `Step04Component`: `LmPredictionChoice` between segments; scene re-runs with observer velocity for the second segment
- [x] 7.3 Tests: prediction gate disables continue; arrival order differs in the second segment

## 8. Step 5 — Outro

- [x] 8.1 Author `step-05-outro.ts`: narration-only timeline (no `animate`), references Chapter 2 clocks and forward chapters
- [x] 8.2 Implement `Step05Component`: still scene from Step 4 (or quiet placeholder), forward navigation to `/ch/04/step/1`

## 9. Chapter 4 placeholder

- [x] 9.1 Add `libs/features/chapter-04-ether-was-wrong/` placeholder library if not already present (or reuse a generic placeholder route)
- [x] 9.2 Wire `/ch/04/step/1` to the placeholder; verify Step 5 forward navigation succeeds

## 10. Docs and verification

- [x] 10.1 Update `docs/product.md` Chapter 3 section to describe spatial-scene framing
- [x] 10.2 Tick Chapter 3 in `docs/architecture.md` build order
- [x] 10.3 `nx run-many -t test lint -p physics light-scene feature-chapter-03-light-information --tui=false` passes
- [ ] 10.4 Manual smoke walkthrough of Steps 1–5; bridge from Ch 2 Step 3 still works
