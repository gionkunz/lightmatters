## 1. Physics — pulse trains

- [x] 1.1 Add `buildPeriodicEmissions`, `pulseArrivalSceneTime(s)`, `meanPulseInterval` to `libs/physics/src/lib/light-scene.ts` + tests

## 2. Chapter 5 feature scaffold

- [x] 2.1 Generate `libs/features/chapter-05-doppler-seeing-motion/` (mirror chapter-04 layout)
- [x] 2.2 Add `@lm/feature-chapter-05-doppler-seeing-motion` to `tsconfig.base.json`
- [x] 2.3 `step-registry.ts`, `step-page.component.ts`, `chapter05.routes.ts`

## 3. Steps 1–5

- [x] 3.1 Step 1 — Each pulse is a tick (stationary baseline + tick counter)
- [x] 3.2 Step 2 — Receding redshift ($0.5\,c$ away; mean interval FactLine)
- [x] 3.3 Step 3 — Approaching blueshift ($0.5\,c$ toward)
- [x] 3.4 Step 4 — Extreme recession ($0.9\,c$ away; since-last-tick readout)
- [x] 3.5 Step 5 — Outro (bridge to Chapter 6)

## 4. Routing + docs

- [x] 4.1 Lazy-load ch/05 feature; remove inline placeholder; add ch/06 placeholder
- [x] 4.2 Add `@source` for chapter-05 in `styles.css`
- [x] 4.3 Update `docs/product.md` and `AGENTS.md`
- [x] 4.4 Lint + test affected projects
