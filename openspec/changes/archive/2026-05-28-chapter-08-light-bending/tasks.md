## 1. Physics helpers

- [x] 1.1 Add `light-bending.ts` to `libs/physics/` — `DEEP_WELL_PARAMS`, `DEFAULT_BEAM_HALF_WIDTH`, `lightGeodesicPoint`, `lightGeodesicSamples`, `lightGeodesicArcLength`, `gravitationalTimeDilationFactor` + unit tests
- [x] 1.2 Export new helpers from `libs/physics/src/index.ts`

## 2. Curved-surface light beam

- [x] 2.1 Add `wellDepth`, `showLightBeam`, `lightBeamProgress`, `lightBeamMissDistance`, `lightBeamHalfWidth`, and `lightBeamMode` inputs to `LmCurvedSurfaceComponent` and `CurvedSurfaceState`
- [x] 2.2 Implement light geodesic overlay rendering in `curved-surface-renderer.ts` (single, dual, optional fill; accent1/accent2 edges)
- [x] 2.3 Register timeline targets: `surface.lightBeamProgress`, `surface.lightBeamMissDistance`, `surface.lightBeamHalfWidth`, `surface.wellDepth`
- [x] 2.4 Wire deep-well params preset; verify mass sphere at well center; extend component spec with light-beam smoke test

## 3. Chapter 8 feature scaffold

- [x] 3.1 Generate `libs/features/chapter-08-light-bending/` (mirror chapter-07 layout)
- [x] 3.2 Add `@lm/feature-chapter-08-light-bending` to `tsconfig.base.json`
- [x] 3.3 `step-registry.ts`, `step-page.component.ts`, `chapter08.routes.ts` — `CHAPTER_08_TOTAL_STEPS = 7`

## 4. Steps 1–3 (deep well + single ray + wide beam)

- [x] 4.1 Step 1 — The deep well (Ch 7 bridge, deep preset, mass sphere; no beam yet; cinematic layout)
- [x] 4.2 Step 2 — One ray (`lightBeamMode='single'`, animate `lightBeamProgress` 0→1)
- [x] 4.3 Step 3 — Widen the beam (`lightBeamMode='dual'`, inner/outer accent edges)

## 5. Steps 4–6 (puzzle + dilation + arrival)

- [x] 5.1 Step 4 — The path puzzle (arc-length annotations, pose synchronization question, no resolution)
- [x] 5.2 Step 5 — Time runs slower inside (dilation readout inner vs outer; Ch 2 vocabulary)
- [x] 5.3 Step 6 — Synchronized arrival (both edges reach detector; narration resolves puzzle)

## 6. Step 7 + routing

- [x] 6.1 Step 7 — Straight lines, curved canvas (geodesic payoff, interactive miss-distance or beam-width slider, outro to future chapters)
- [x] 6.2 Lazy-load ch/08 feature; remove `Chapter08PlaceholderComponent`; add next-chapter placeholder for Step 7 forward nav
- [x] 6.3 Add `@source` for chapter-08-light-bending in `styles.css`

## 7. Docs + verification

- [x] 7.1 Update `docs/product.md` Chapter 8 step list and `AGENTS.md` project state
- [x] 7.2 Lint + test affected projects (`physics`, `curved-surface`, `chapter-08-light-bending`); `lightmatters` build blocked by pre-existing ESM compiler-cli error in this environment
- [ ] 7.3 Manual smoke check: `/ch/08/step/{1..7}` all render; Step 7 slider updates beam in real time
