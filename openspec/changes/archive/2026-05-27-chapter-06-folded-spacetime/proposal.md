## Why

Chapter 5 closes with a bridge: leave flat spacetime and roll the diagram into curved geometry. Chapters 3–5 used the top-down `lm-light-scene` camera; the Epstein spacetime diagram from Chapters 1–2 returns here. Readers need a gentle re-entry — a point aging through time on a flat diagram — before the fold into 3-D. This change also establishes the project's first **WebGL** rendering path (`ogl`, line-art wireframes, theme-aware uniforms), which every curved-spacetime chapter (6–8) depends on.

## What Changes

- Add **`ogl`** dependency and a new primitive **`lm-curved-surface`**: WebGL wireframe cylinder (and later cone) with a worldline dot and fading trail on the surface.
- Add shared helpers in **`@lm/physics`** for cylinder/cone surface parametrization and worldline positions (pure functions, unit-tested).
- Replace the `/ch/06` placeholder with feature lib **`@lm/feature-chapter-06-rolling-diagram`** and authored steps.
- Wire lazy routes `/ch/06/step/{1..5}`; Step 5 bridges toward Chapter 7 (gravity well).
- Update `docs/product.md` with the canonical Chapter 6 step list.

**Pedagogical arc (five steps):**

1. **Step 1 — A point in time.** Flat `time-only` spacetime diagram recap: a body at rest in space moves only through time. Reconnects memory from Chapter 1.
2. **Step 2 — Roll the paper.** The same worldline folds into a **cylinder**; the dot travels along the surface, completes a loop, and leaves a **fading trace** behind it. First WebGL step.
3. **Step 3 — Bend into a cone.** Morph cylinder → cone; wide end = strong gravity, point = weak gravity. Annotations match prototype `StepCone` layout.
4. **Step 4 — Gravity as geometry.** A straight worldline drawn on the cone surface curves spatially when unrolled — geodesics, not a force.
5. **Step 5 — Newton's apple.** Tiny house on the rim; apple worldline falls the same way regardless of position on the cone. Outro bridges to Chapter 7.

**Non-goals for this change:** full gravity-well bezier (Chapter 7), light bending (Chapter 8), interactive energy dial on trajectories, `bind`/`trigger` timeline events, shared WebGL context across steps (start per-canvas).

## Capabilities

### New Capabilities

- `curved-surface`: WebGL wireframe parametric surface (cylinder → cone morph), theme token uniforms, worldline dot with fading trail, timeline-driven `fold`, `curvature`, `time`, and camera targets.
- `chapter-06-step-01`: Flat time-only recap — point aging through time on `lm-spacetime-diagram`.
- `chapter-06-step-02`: Cylinder fold — flat-to-cylinder transition; dot orbits surface with fading trail.
- `chapter-06-step-03`: Cone morph — cylinder bends to cone; gravity-strength annotations.
- `chapter-06-step-04`: Geodesics on the cone — straight surface worldline vs curved unrolled view.
- `chapter-06-step-05`: Newton's apple outro — rim placement invariance; bridge to Chapter 7.

### Modified Capabilities

- `physics`: cylinder/cone surface parametrization and worldline-at-proper-time helpers.
- `app-shell`: Chapter 6 routes resolve to real components; remove inline placeholder.

## Impact

- **New dependency:** `ogl` in root `package.json`.
- **New library:** `libs/primitives/curved-surface/` (WebGL + Angular wrapper component).
- **Updated library:** `libs/physics/` — `curved-surface.ts` helpers + tests.
- **New feature lib:** `libs/features/chapter-06-rolling-diagram/`.
- **Routing:** `apps/lightmatters/src/app/app.routes.ts` — lazy-load Chapter 6 feature; delete `Chapter06PlaceholderComponent`.
- **Design tokens:** WebGL shaders bind `ink`, `paper`, `accent-1` from `ThemeService`.
- **Docs:** `docs/product.md` Chapter 6 step breakdown; `docs/architecture.md` build-order tick for WebGL + Chapter 6.
