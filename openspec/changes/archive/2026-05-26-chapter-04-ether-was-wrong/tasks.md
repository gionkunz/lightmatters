## 1. Physics + light-scene — moving sources

- [x] 1.1 Add `sourcePositionAt` to `libs/physics/src/lib/light-scene.ts` + tests
- [x] 1.2 Extend `LightSceneSource` with optional `velocity`; pulse circles use emission position
- [x] 1.3 Update reception math to use emission position for moving sources
- [x] 1.4 Unit tests for moving-source pulse center vs source dot position

## 2. Chapter 4 feature scaffold

- [x] 2.1 Generate `libs/features/chapter-04-ether-was-wrong/` (mirror chapter-03 layout)
- [x] 2.2 Add `@lm/feature-chapter-04-ether-was-wrong` to `tsconfig.base.json`
- [x] 2.3 `step-registry.ts`, `step-page.component.ts`, `chapter04.routes.ts`

## 3. Steps 1–5

- [x] 3.1 Step 1 — The ether (narration-led intro)
- [x] 3.2 Step 2 — Michelson–Morley (step-local schematic SVG)
- [x] 3.3 Step 3 — Source at rest (light-scene baseline)
- [x] 3.4 Step 4 — Moving source (centerpiece; emission-origin pulse)
- [x] 3.5 Step 5 — Outro (bridge to Chapter 5)

## 4. Routing + docs

- [x] 4.1 Lazy-load ch/04 feature; remove inline placeholder; add ch/05 placeholder
- [x] 4.2 Update `docs/product.md` Chapter 4 step list
- [x] 4.3 Lint + test affected projects
