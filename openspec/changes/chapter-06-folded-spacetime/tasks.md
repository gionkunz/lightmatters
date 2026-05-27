## 1. Dependencies and physics helpers

- [x] 1.1 Add `ogl` to root `package.json` and install
- [x] 1.2 Add `curved-surface.ts` to `libs/physics/` — `cylinderSurfacePoint`, `coneSurfacePoint`, `morphSurfacePoint`, `worldlineTrailSamples` + unit tests

## 2. Curved-surface WebGL primitive

- [x] 2.1 Generate `libs/primitives/curved-surface/` Nx library; add `@lm/primitives-curved-surface` to `tsconfig.base.json`
- [x] 2.2 Implement ogl renderer: wireframe mesh (rims, meridians, cross-sections), theme token uniforms via `ThemeService`
- [x] 2.3 Implement `LmCurvedSurfaceComponent` — `fold`, `curvature`, `time`, `showTrail`, `trailLength` inputs; dispose on destroy
- [x] 2.4 Implement accent dot + fading trail on surface using physics helpers
- [x] 2.5 Add component spec / smoke test; verify cylinder orbit + trail in isolation

## 3. Chapter 6 feature scaffold

- [x] 3.1 Generate `libs/features/chapter-06-rolling-diagram/` (mirror chapter-05 layout)
- [x] 3.2 Add `@lm/feature-chapter-06-rolling-diagram` to `tsconfig.base.json`
- [x] 3.3 `step-registry.ts`, `step-page.component.ts`, `chapter06.routes.ts` — `CHAPTER_06_TOTAL_STEPS = 5`

## 4. Steps 1–2 (memory + cylinder fold)

- [x] 4.1 Step 1 — A point in time (`time-only` diagram recap, vertical worldline animate)
- [x] 4.2 Step 2 — Roll the paper (`fold` morph 0→1, dot orbit with fading trail)

## 5. Steps 3–5 (cone + gravity as geometry)

- [x] 5.1 Step 3 — Bend into a cone (cinematic layout, `curvature` morph, strong/weak gravity annotations)
- [x] 5.2 Step 4 — Gravity as geometry (geodesic worldline on cone, unrolled-curvature narration)
- [x] 5.3 Step 5 — Newton's apple (rim house marker, falling geodesic, bridge to Ch 7)

## 6. Routing, placeholders, and docs

- [x] 6.1 Lazy-load ch/06 feature; remove `Chapter06PlaceholderComponent`; add ch/07 placeholder for Step 5 forward nav
- [x] 6.2 Add `@source` for chapter-06 and curved-surface in `styles.css`
- [x] 6.3 Update `docs/product.md` Chapter 6 step list and `AGENTS.md` project state
- [x] 6.4 Lint + test + build affected projects (`curved-surface`, `physics`, `chapter-06-rolling-diagram`, `lightmatters`)
