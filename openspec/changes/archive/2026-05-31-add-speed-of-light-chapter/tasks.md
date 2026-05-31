## 1. Placement & renumber

- [x] 1.1 Confirm placement: "The speed of light" = Chapter 2 (after "Position, time, spacetime", before "The speed budget"); SR block becomes 1–10, GR 11–13.
- [x] 1.2 Renumber route mounts in `apps/lightmatters/src/app/app.routes.ts`: shift existing `/chapter/N` (N≥2) up by one (speed budget → `/chapter/3`, … light bending → `/chapter/13`, chapter-13 placeholder → `/chapter/14`); add `/chapter/2` → speed-of-light lib.
- [x] 1.3 Renumber `CHAPTER_STEP_ROUTES` in `apps/lightmatters/src/app/site-routes.ts` to the 13-chapter map and add the new chapter at position 2 (`CHAPTER_02_SPEED_OF_LIGHT_STEPS`); move the placeholder to chapter 14.
- [x] 1.4 Grep for `/chapter/` literals and chapter-number references (redirects, `_redirects`, tests, landing/chapter-index lists) and update to the new numbering.

## 2. Physics helpers

- [x] 2.1 Add `SPEED_OF_LIGHT_KMS` constant to `@lm/physics` (reuse/align with the value behind `spatialSpeedKms`) and export it.
- [x] 2.2 Add `lightTravelTimeSeconds(distanceKm)` and `earthLapsPerSecond()`; export them.
- [x] 2.3 Add `speedFromFlight(distanceKm, seconds)` for the flash experiment; export it.
- [x] 2.4 Add `cFromMaxwellConstants(epsilon0, mu0)` plus default SI `ε₀`/`μ₀` constants; export them.
- [x] 2.5 Unit tests: Earth→Moon ≈1.28 s; Sun→Earth ≈499 s; ≈7.5 Earth laps/s; 1 km baseline returns `c`; Maxwell constants return ≈`c` and agree with `SPEED_OF_LIGHT_KMS`.

## 3. Chapter scaffold

- [x] 3.1 Scaffold `libs/features/chapter-02-speed-of-light` (feature lib, `scope:feature` tag) via the chapter generator/pattern; export `chapter02SpeedOfLightRoutes` and `CHAPTER_02_SPEED_OF_LIGHT_STEPS` from `src/index.ts`.
- [x] 3.2 Add `chapter-steps.ts`, `chapter02.routes.ts`, `step-registry.ts`, and `step-page.component.ts` mirroring an existing chapter (e.g. chapter-04).
- [x] 3.3 Register the chapter in the chapter registry and the landing/chapter-index journey list at position 2.

## 4. Steps

- [x] 4.1 Step 1 — How fast is light? `lm-light-scene` pulse; narration with tangible comparisons (7.5 Earth laps/s, ≈1.3 s Earth→Moon, ≈8 min 20 s Sun→Earth) driven by the physics helpers.
- [x] 4.2 Step 2 — The cosmic speed limit. `spacetime-diagram` light cone as the causal boundary; narration: nothing outruns `c`; the speed of information / cause and effect.
- [x] 4.3 Step 3 — Light has no time. Narrate the `v→c` proper-time→0 teaser (photon born/absorbed 13.8 Gyr apart = one instant); no rest-frame claim; flag the speed budget will prove it geometrically.
- [x] 4.4 Step 4 — Measuring `c` by hand. Two stations 1 km apart on `lm-light-scene`; pulse travels, detector stops clock; `speedFromFlight` shows ≈300,000 km/s; show `$c = d/t$`.
- [x] 4.5 Step 5 — What light is. Step-local EM-wave visual: perpendicular, phase-locked E and B sinusoids propagating along the axis; narrate mutual induction (changing E → B → E).
- [x] 4.6 Step 6 — Measuring `c` from Maxwell + outro. `cFromMaxwellConstants` shows `$c = 1/\sqrt{\varepsilon_0\mu_0}$` ≈ measured `c`; outro frames `c` as the speed the speed budget builds on; no gravity/contraction/E=mc².
- [x] 4.7 Wire navigation: Ch1 final step → Ch2 step 1; Ch2 step 6 → Ch3 (speed budget) step 1; Ch3 step 1 back → Ch2 step 6.

## 5. Integration & verification

- [x] 5.1 Update `docs/product.md` and `docs/architecture.md` journey-map sections to the 13-chapter order (SR 1–10, GR 11–13).
- [x] 5.2 Update sitemap/prerender enumeration; confirm 13 chapters + new step paths resolve.
- [x] 5.3 Run `nx affected -t lint test build --tui=false`; fix failures (Node ≥22).
- [ ] 5.4 Manually walk the chapter (light/dark); sign off on tangible-`c` clarity, the causal-limit framing, and the two-roads-one-number payoff.
- [x] 5.5 `openspec validate add-speed-of-light-chapter --strict` → "Change is valid".
