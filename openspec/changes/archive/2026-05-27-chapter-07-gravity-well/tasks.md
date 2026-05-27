## 1. Physics helpers

- [x] 1.1 Add `gravity-well.ts` to `libs/physics/` — `wellRadiusAt`, `wellSurfacePoint`, `wellTrajectoryPoint`, `wellTrajectorySamples`, `isEscapeTrajectory`, `WELL_ESCAPE_ENERGY_THRESHOLD`, `DEFAULT_WELL_PARAMS` + unit tests
- [x] 1.2 Export new helpers from `libs/physics/src/index.ts`; extend `WorldlineMode` with `'well-trajectory'`

## 2. Curved-surface well profile

- [x] 2.1 Add `surfaceProfile`, `wellReveal`, `wellMorph`, and `energy` inputs to `LmCurvedSurfaceComponent` and `CurvedSurfaceState`
- [x] 2.2 Implement well wireframe mesh generator in `curved-surface-renderer.ts` (piecewise segments, bezier morph, meridians + cross-section rings)
- [x] 2.3 Wire `worldlineMode='well-trajectory'` dot + fading trail using `wellTrajectoryPoint` / `wellTrajectorySamples`
- [x] 2.4 Add well camera framing (`CAMERA_WELL`); verify orbit + reset with well profile
- [x] 2.5 Extend component spec for well profile smoke test

## 3. Chapter 7 feature scaffold

- [x] 3.1 Generate `libs/features/chapter-07-gravity-well/` (mirror chapter-06 layout)
- [x] 3.2 Add `@lm/feature-chapter-07-gravity-well` to `tsconfig.base.json`
- [x] 3.3 `step-registry.ts`, `step-page.component.ts`, `chapter07.routes.ts` — `CHAPTER_07_TOTAL_STEPS = 5`

## 4. Steps 1–2 (puzzle + piecewise build)

- [x] 4.1 Step 1 — The puzzle (tunnel-through-Earth hook → surface/center questions → cone recap; defer answers to well model; cinematic layout)
- [x] 4.2 Step 2 — Build the well (frame as Epstein answer to Step 1; `wellReveal` 0→1, segment annotations, weightless-center payoff)

## 5. Steps 3–5 (smooth well + trajectories)

- [x] 5.1 Step 3 — Smooth the shape (`wellMorph` 0→1 on fully revealed piecewise well)
- [x] 5.2 Step 4 — Fall through Earth (pay off tunnel hook; `well-trajectory`, bound energy, `time` 0→1 with trail)
- [x] 5.3 Step 5 — Escape velocity (interactive energy slider, bound vs escape demo, bridge to Ch 8)

## 6. Routing, placeholders, and docs

- [x] 6.1 Lazy-load ch/07 feature; remove `Chapter07PlaceholderComponent`; add ch/08 placeholder for chapter-end forward nav
- [x] 6.2 Add `@source` for chapter-07-gravity-well in `styles.css`
- [x] 6.3 Update `docs/product.md` Chapter 7 step list and `AGENTS.md` project state
- [x] 6.4 Lint + test + build affected projects (`physics`, `curved-surface`, `chapter-07-gravity-well`, `lightmatters`)

## 7. Piecewise unroll — physics helpers

- [x] 7.1 Add `wellUnrollSegmentLayout(params)` to `gravity-well.ts` returning per-segment 2D bounds (rectangles for cylinders, sectors for cones) + unit tests
- [x] 7.2 Add `wellSurfacePointUnrolled(theta, x, params)` mapping piecewise (theta, x) to flat 2D paper + unit tests
- [x] 7.3 Add `wellTrajectoryPointMorphed(energy, properTime, wellMorph, wellUnfold, params)` interpolating rolled and unrolled points; redefine the worldline so the unrolled trail is piecewise-straight + unit tests
- [x] 7.4 Export new helpers from `libs/physics/src/index.ts`

## 8. Piecewise unroll — renderer + component

- [x] 8.1 Add `wellUnfold` (0–1) to `LmCurvedSurfaceComponent` inputs and `CurvedSurfaceState`; register `surface.wellUnfold` engine target
- [x] 8.2 Extend well mesh + wireframe builders in `curved-surface-renderer.ts` to morph from rolled bulge to flat piecewise paper using `wellUnrollSegmentLayout`; clamp `wellUnfold` to 0 when `wellMorph > 0`
- [x] 8.3 Update worldline dot + trail to use `wellTrajectoryPointMorphed` so it tracks geometry through the unfold morph
- [x] 8.4 Update well camera/framing so the unrolled flat layout fits the canvas
- [x] 8.5 Extend `lm-curved-surface` spec with a `wellUnfold` smoke test

## 9. Step renumbering + new Step 3

- [x] 9.1 Update `step-registry.ts` — `CHAPTER_07_TOTAL_STEPS = 6`
- [x] 9.2 Renumber existing step modules (`step-03` → `step-04`, `step-04` → `step-05`, `step-05` → `step-06`); update routes, prev/next URLs, and step counters
- [x] 9.3 Author new Step 3 — Fall on folded paper (piecewise bulge, fall-through trajectory, then `wellUnfold 0→1` reveal; narration delivers the straight-line punchline)
- [x] 9.4 Update Step 4 (smooth) narration to acknowledge "smooth bulge can't lay perfectly flat — but the straight-line truth from Step 3 still holds"
- [x] 9.5 Update Step 5 (fall through) narration to recall the unrolled straight line from Step 3
- [x] 9.6 Update routing in `app.routes.ts` + chapter-07 routes for the six-step layout

## 10. Docs + verification

- [x] 10.1 Update `docs/product.md` Chapter 7 step list to six steps
- [x] 10.2 Update `AGENTS.md` if Chapter 7 step count is referenced
- [x] 10.3 Lint + test affected projects (`physics`, `curved-surface`, `chapter-07-gravity-well`)
- [ ] 10.4 Manual smoke check: `/ch/07/step/{1..6}` all render; unfold morph in Step 3 reads as straight-line worldline
