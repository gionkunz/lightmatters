## Context

Chapters 1–2 established the Epstein spacetime diagram (SVG, `lm-spacetime-diagram`). Chapters 3–5 switched to top-down `lm-light-scene`. Chapter 6 returns to the diagram and introduces the first **3-D rendering** in the product: rolling flat spacetime into a cylinder, then bending into a cone — Epstein's gravity-as-geometry visualization.

Today there is no WebGL code, no `ogl` dependency, and no `curved-surface` primitive. `/ch/06` resolves to an inline placeholder component. The visual prototype (`step-ui.jsx` `StepCone`, `BigCone`) defines the wireframe aesthetic: thin ink strokes, accent worldline with glow, meridians, rim ellipses, fading trail.

Architecture (`docs/architecture.md`) specifies: ogl for WebGL, line-art shaders (instanced quads, not raw `gl.LINES`), theme tokens as shader uniforms, per-step canvas lifecycle (mount/unmount on step entry/exit).

## Goals / Non-Goals

**Goals:**

- Establish the WebGL rendering stack: `ogl` + theme-aware line shader + Angular `lm-curved-surface` component.
- Deliver five Chapter 6 steps with a clear pedagogical ramp: flat time-only recap → cylinder orbit with trail → cone morph → geodesic insight → Newton's apple outro.
- Pure physics helpers for surface parametrization (testable without WebGL).
- Match prototype visual weight and the "cinematic" step layout (full-bleed diagram, side annotations, bottom narrator panel) for Steps 3–5.

**Non-Goals:**

- Gravity-well bezier surface (Chapter 7), light bending (Chapter 8).
- Shared WebGL context across steps — start per-canvas; consolidate only if perf demands.
- Interactive curvature/energy sliders wired through `bind`/`trigger` — use static or timeline-driven `animate` targets for now.
- Spacetime-diagram "fold" morph inside the SVG primitive — the fold lives in `lm-curved-surface`; Step 1 uses existing `time-only` variant unchanged.
- Audio, MathJax beyond existing narrator support.

## Decisions

### 1. New primitive: `libs/primitives/curved-surface/`

**Decision.** Export `LmCurvedSurfaceComponent` (`lm-curved-surface`) as the single WebGL entry point for Chapters 6–8.

**Rationale.** Architecture already names `curved-surface` for cylinder/cone/gravity-well. One primitive with parametric morph (`fold: 0→1` flat-to-cylinder, `curvature: 0→1` cylinder-to-cone) avoids a separate "cylinder-only" lib.

**API (timeline-targetable inputs):**

| Input | Range | Meaning |
|-------|-------|---------|
| `fold` | 0–1 | 0 = flat strip (time vertical), 1 = full cylinder |
| `curvature` | 0–1 | 0 = cylinder (equal radii), 1 = cone (top wide, bottom point) |
| `time` | 0–1 | Proper-time progress; drives dot position along surface geodesic |
| `trailLength` | # segments | Fading worldline history behind the dot |
| `showTrail` | boolean | Whether trail renders |
| `worldlineMode` | `'vertical' \| 'geodesic'` | Flat vertical ascent vs surface geodesic |

Camera: fixed oblique view for Steps 2–5 (matches prototype); no user orbit in v1.

### 2. WebGL stack: ogl + custom line shader

**Decision.** Add `ogl` to root dependencies. Render wireframe as **indexed line segments drawn via instanced quads** (or ogl's line helper if quality suffices on target hardware).

**Alternatives considered:**

- **Three.js** — rejected; architecture locks ogl for shader-first control and bundle size.
- **Raw WebGL2** — rejected for v1; ogl reduces boilerplate while staying swappable at the engine boundary.
- **SVG faux-3D (prototype `BigCone`)** — acceptable for static mockups but insufficient for the cylinder orbit + morph animation; real WebGL required.

**Theme binding.** Component injects `ThemeService`; on init and theme change, push `ink`, `paper`, `accent1`, `glow1` as shader uniforms from `@lm/design` tokens.

### 3. Physics helpers in `@lm/physics/curved-surface.ts`

**Decision.** Pure functions, no WebGL imports:

- `cylinderSurfacePoint(θ, z, radius)` → `{ x, y, z }`
- `coneSurfacePoint(θ, t, topRadius, bottomRadius, height)` → `{ x, y, z }`
- `morphSurfacePoint(fold, curvature, θ, properTime)` — interpolates flat vertical line → cylinder helix → cone geodesic
- `worldlineTrailSamples(...)` — returns N past positions for trail rendering

**Rationale.** Keeps geometry testable in Jest; component maps 3-D points to clip space.

### 4. Pedagogical step sequencing

**Decision.** Five steps, two renderers:

| Step | Renderer | Key beat |
|------|----------|----------|
| 1 | `lm-spacetime-diagram` `time-only` | Memory: at rest in space, aging through time |
| 2 | `lm-curved-surface` `fold: 0→1` | Roll paper; dot loops cylinder; fading trail |
| 3 | `lm-curved-surface` `curvature: 0→0.65` | Cone morph; strong/weak gravity labels |
| 4 | `lm-curved-surface` geodesic mode | Straight on surface, curved unrolled — split or overlay |
| 5 | `lm-curved-surface` + rim markers | House + apple; bridge to Ch 7 |

Step 1 deliberately **does not** introduce WebGL — lowers cognitive load before the fold.

Step 2 is the **WebGL proof-of-concept**: if cylinder + trail works, cone morph is incremental.

### 5. Feature lib layout

**Decision.** Mirror Chapter 5 structure:

```
libs/features/chapter-06-rolling-diagram/
  src/lib/
    step-registry.ts          # CHAPTER_06_TOTAL_STEPS = 5
    step-page.component.ts
    chapter06.routes.ts
    steps/
      step-01.component.ts + step-01-time-only.ts (timeline)
      step-02.component.ts + step-02-cylinder.ts
      ...
```

Lazy-load at `ch/06`; delete `Chapter06PlaceholderComponent`.

### 6. Trail rendering

**Decision.** Ring buffer of the last N surface positions; each segment opacity = `age / trailLength` (newest = full ink/accent, oldest = transparent). Accent color for the dot; trail uses ink at decreasing opacity.

**Prototype reference.** `lmConeFall` 5.5s loop, `cubic-bezier(.55,0,.45,1)` — reuse easing in timeline `animate` for dot motion.

### 7. Step chrome layout

**Decision.**

- Steps 1–2: standard split layout (narrator left, diagram right) — same as Chapter 1 Step 2.
- Steps 3–5: cinematic layout (full-bleed diagram, floating narrator panel, side `lm-annotation` labels) per `visual-guidelines.md` § Step layout C.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| WebGL line quality (jagged `gl.LINES`) | Prototype line shader on cylinder first; fall back to instanced quads if needed |
| Bundle size from ogl | Lazy-load curved-surface chunk with Chapter 6 feature only |
| Context loss on step navigation | Per-step mount/unmount is intentional; recreate context each entry |
| Flat→cylinder morph may confuse readers | Step 1 establishes flat diagram; Step 2 narrates "same line, rolled" with synchronized `fold` animate |
| Geodesic vs unrolled view in Step 4 is abstract | Show cone with accent geodesic + optional inset unrolled strip (SVG overlay or second panel) |
| Low-end GPU perf | Cap trail segments (~64); single draw call for wireframe mesh |

## Migration Plan

1. Add `ogl` dependency; scaffold `curved-surface` lib via Nx generator.
2. Implement physics helpers + unit tests (no UI).
3. Build `lm-curved-surface` with cylinder wireframe + dot + trail; verify in isolation (design-sheet or dev harness).
4. Scaffold Chapter 6 feature; wire routes; remove placeholder.
5. Author steps 1→5 sequentially; Step 2 gates on WebGL primitive readiness.

Rollback: revert feature lib + routes to placeholder; curved-surface lib can remain unused without breaking other chapters.

## Open Questions

- **Step 4 dual view:** side-by-side cone + unrolled strip, or sequential reveal (animate unroll)? → Prefer sequential reveal in timeline unless user feedback says otherwise.
- **Chapter 7 placeholder:** Step 5 forward nav needs `/ch/07/step/1` placeholder (same pattern as Ch 5→6).
- **Exact cone proportions:** match prototype `BigCone` (topR=280, botR=90) scaled to component viewport.
