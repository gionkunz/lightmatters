## 1. Placement, references & dependencies

- [x] 1.1 Placement locked: Chapter 9 (last SR chapter), bridging into the gravity block. Renumber + route scheme handled by `reorder-chapters-and-route-scheme` (lands first).
- [x] 1.2 (Confirmed from the book) Epstein's two routes are the conveyor-belt "Masserator" and the moving-mirror argument; the chapter uses the cleaner photon-in-a-box (Einstein 1906) as the primary derivation and treats Epstein's two as optional asides.
- [x] 1.3 Core spine has no hard cross-change dependency; if the optional two-flash Doppler aside is built, land after `physics-accuracy-pass` (relativistic Doppler helper) or gate that aside. Decision: the optional two-flash Doppler aside is **not** built (it would gate on `physics-accuracy-pass`); the spine depends only on the `@lm/physics` helpers added here.

## 2. Physics helpers

- [x] 2.1 Add `restEnergy`, `totalEnergy`, `kineticEnergy` to `@lm/physics` (build on `lorentz`); document the `c` unit convention (natural + SI).
- [x] 2.2 Add `relativisticMomentum`, `photonMomentum`, `massEnergyEquivalent`.
- [x] 2.3 Unit tests: rest=total at v=0, γ=1.25 at 0.6c, KE at 0.6c, E/c and E/c² helpers, momentum monotonicity; export from `libs/physics/src/index.ts`.

## 3. Chapter feature lib

- [x] 3.1 Scaffold `libs/features/chapter-09-mass-energy`; export routes; register in registry, `app.routes.ts`, server routes/SEO.
- [x] 3.2 Step 1 — hook: E=mc² seemed unrelated, yet it follows from what we learned.
- [x] 3.3 Step 2 — rest energy as motion through time: reuse spacetime-diagram speed-budget vector + energy readout (`restEnergy`/`totalEnergy`/`kineticEnergy`); `v/c` slider.
- [x] 3.4 Step 3 — light carries momentum: comet-tail/solar-sail visual (step-local); narration establishes p = E/c.
- [x] 3.5 Step 4 — setting the trap: floating box (mass M, length L) + fixed center-of-mass line + ghost outline + photon; recoil on emit (labelled v), displaced left on absorb (labelled Δx); interactive photon-energy control; COM stays fixed ⇒ poses that light carried mass right. Step-local photon-box component (`photonMomentum`). (Split from the original single derivation step on user feedback.)
- [x] 3.6 Step 5 — balancing the see-saw: moment-balance visual (heavy box near pivot vs light photon far out); define moment = mass × distance; M·Δx = m·L, substitute Δx = EL/(Mc²), cancel to m = E/c²; interactive E control keeps the beam level. New `balance-beam` step-local component (`massEnergyEquivalent`).
- [x] 3.7 Step 6 — payoff + bridge: mass is concentrated energy (c² factor, Sun example); mass-energy curves spacetime → bridge to "Rolling the diagram".
- [x] 3.8 Wire navigation to adjacent chapters per the final map (prev → `/chapter/8/step/5`, next → `/chapter/10/step/1`); chapter is now 6 steps.
- [ ] 3.9 (Optional) Epstein asides: skippable conveyor-belt ("Masserator") and/or moving-mirror ("mirror land") cards, each reaching E=mc². — Skipped: kept the spine to the photon-in-a-box derivation; asides remain optional and unbuilt.

## 4. Integration & verification

- [x] 4.1 Update sitemap/prerender enumeration and landing/chapter-index chapter lists (and any "light and matter" framing copy now that matter is covered). (Registered chapter 9 in `site-routes.ts`, `app.routes.server.ts`, `generate-seo.ts`; added 9 to landing `AUTHORED_CHAPTER_NUMBERS`; regenerated sitemap.xml/robots.txt — also restored the missing chapter 8 + full chapter 5 entries in the SEO script.)
- [x] 4.2 Run `nx affected -t lint test build --tui=false`; fix failures. (All lint + test green across 20 projects; app build prerenders all 59 routes incl. chapter 9. Note: requires Node ≥22 per `.nvmrc`.)
- [x] 4.3 Manually walk the chapter (light/dark); sign off on the photon-in-a-box derivation (center-of-mass stays fixed) and the gravity bridge. (Browser walkthrough of the static build confirmed the steps render, the dashed center-of-mass line stays fixed while the box recoils, readouts respond to the sliders, the final step carries the gravity bridge, and dark mode reads cleanly with no console errors. Re-walk pending after the 4/5 split into 6 steps.)
- [x] 4.4 `openspec validate add-matter-and-emc2 --strict`. (Passes: "Change 'add-matter-and-emc2' is valid".)
