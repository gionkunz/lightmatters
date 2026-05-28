## Context

Chapter 7 established `lm-curved-surface` in `well` profile mode: piecewise→bezier morph, energy-parameterized particle trajectories, piecewise unroll, and physics helpers in `@lm/physics/gravity-well.ts`. Step 6 bridges explicitly to Chapter 8 — Earth's shallow well barely bends light; only **extreme** gravity makes deflection visible. Today `/ch/08` resolves to an inline placeholder; no light geodesics, beam edges, path-length comparison, or gravitational time-dilation readouts exist on the well.

The founder's narrative (`docs/interview-with-the-founder.md`) and `docs/product.md` define the pedagogical target: a **wide beam** skimming a massive body; outer edge travels a longer spatial path than the inner edge; both arrive **synchronized** because the inner edge, deeper in the well, experiences more gravitational time dilation. The prototype `bend` mini-glyph (`primitives.jsx`) shows a wireframe sphere with two accent arcs (inner/outer beam edges) curving around it.

Architecture constraints: per-step canvas mount/unmount, timeline `animate` for authored motion, component-local slider for Step 7 exploration (no `bind`/`trigger` yet), theme-aware line rendering (accent1 = body A / inner edge, accent2 = body B / outer edge), cinematic layout for WebGL steps.

## Goals / Non-Goals

**Goals:**

- Extend `@lm/physics` with pedagogical light-geodesic sampling on the well surface: single-ray path, dual beam edges, arc-length comparison, gravitational time-dilation factor vs well depth.
- Extend `lm-curved-surface` to render light beams on the well (one or two accent geodesics, optional translucent fill band between edges) with a **deep-well** depth preset visually distinct from Chapter 7's Earth-scale bulge.
- Deliver seven Chapter 8 steps with a clear ramp: regime shift → single ray → wide beam → path puzzle → time dilation → synchronized arrival → geodesic payoff.
- Replace Chapter 8 placeholder routes; add next-chapter placeholder for Step 7 forward nav.
- Unit-test all new physics helpers without WebGL.

**Non-Goals:**

- Full numerical GR null-geodesic integration or Einstein deflection-angle formulas — use a pedagogical parametric model tuned for visual clarity (matching prototype bend arcs).
- Black-hole event horizons, photon spheres, or gravitational lensing rings.
- `bind`/`trigger` wiring for exploration sliders — Step 7 uses a glowing slider that directly updates beam parameters on the step's curved-surface instance.
- Shared WebGL context across steps.
- Spacetime-diagram overlay as the primary visualization (well + beam geodesics are the hero; a small readout label for dilation is acceptable).

## Decisions

### 1. Reuse well profile with a deep-well params preset

**Decision.** Do not add a third `surfaceProfile`. Chapter 8 uses `surfaceProfile='well'` with `wellMorph=1` (smooth bulge) and a new exported params preset `DEEP_WELL_PARAMS` (or `wellDepth: 'earth' | 'deep'` input mapping to params) that narrows the outer rims and deepens the center relative to `DEFAULT_WELL_PARAMS`, making deflection visually obvious.

| Preset | Narrative | Visual |
|--------|-----------|--------|
| `DEFAULT_WELL_PARAMS` | Earth-scale (Ch 7) | Shallow bulge |
| `DEEP_WELL_PARAMS` | Massive star / extreme gravity (Ch 8) | Tight center, steep approach cones |

**Rationale.** One primitive for Chapters 6–8 per architecture. Depth is a params tweak, not a new mesh generator.

**Alternatives considered:**

- Separate `surfaceProfile='lens'` — rejected; duplicates well mesh code.
- Reuse Earth well and exaggerate camera — rejected; deflection still too subtle for the narrative.

### 2. Light geodesics as surface paths, not particle trajectories

**Decision.** Add `@lm/physics/light-bending.ts`:

- `lightGeodesicPoint(missDistance, edge, progress, wellMorph, params)` → `{ x, y, z }` on well surface
  - `missDistance` ∈ [0, 1]: how close the ray skims the mass (0 = grazing, 1 = far miss)
  - `edge`: `'center' | 'inner' | 'outer'` — single ray uses `'center'`; beam uses `'inner'` / `'outer'` offset by `beamHalfWidth`
  - `progress` ∈ [0, 1]: param along the ray from source to detector
- `lightGeodesicSamples(missDistance, edge, segmentCount, wellMorph, params)` → polyline array
- `lightGeodesicArcLength(missDistance, edge, wellMorph, params)` → scalar spatial path length (pedagogical arc-length integral along samples)
- `gravitationalTimeDilationFactor(xNorm, wellMorph, params)` → factor in (0, 1] — slower clock deeper in well; derived from well radius / depth, not Schwarzschild exact
- `DEEP_WELL_PARAMS`, `DEFAULT_BEAM_HALF_WIDTH` — exported constants

**Trajectory shape (pedagogical):**

- Rays enter from left outer cylinder at fixed θ, travel through space-x with deflection peaking near x ≈ 0 (deepest part of well), exit to right outer cylinder.
- Inner edge passes closer to x = 0 than outer edge → shorter spatial path but higher dilation.
- Deflection magnitude scales with `(1 - missDistance)` and well depth.

**Rationale.** Particle `wellTrajectoryPoint` models timelike worldlines with energy classes; light is null-like — always "spatial" at c — and needs a separate parametrization. Pure functions remain unit-testable (inner arc shorter than outer, dilation lower at outer x, both edges same progress endpoint).

### 3. Renderer: beam overlay lines on well profile

**Decision.** Extend `curved-surface-renderer.ts`:

| Input | Range | Meaning |
|-------|-------|---------|
| `showLightBeam` | boolean | Enable beam rendering |
| `lightBeamProgress` | 0–1 | How far along geodesics the visible portion extends |
| `lightBeamMissDistance` | 0–1 | Skim distance from mass |
| `lightBeamHalfWidth` | 0–1 | Half-width of beam (inner/outer edge offset) |
| `lightBeamMode` | `'single' \| 'dual' \| 'filled'` | One ray, two edges, or filled band |
| `wellDepth` | `'earth' \| 'deep'` | Params preset selector |

- **Single ray:** one `WidePolylineOverlay` in accent1.
- **Dual edges:** inner = accent1, outer = accent2 (matches two-accent grammar).
- **Filled band:** optional low-opacity `TranslucentSurface` strip or triangle strip between edge polylines (only when both edges visible).
- Reuse `showEarthSphere` or add `showMassSphere` wireframe at well center (prototype: circle/sphere at bulge minimum).
- Register timeline targets: `surface.lightBeamProgress`, `surface.lightBeamMissDistance`, `surface.lightBeamHalfWidth`, `surface.wellDepth`.

**Camera:** reuse `CAMERA_WELL` with slight pull-back for deep preset so full deflection arc is visible.

**Alternatives considered:**

- SVG overlay for beam — rejected; must sit on the 3D surface for orbit consistency.
- `lm-light-scene` top-down 2D — rejected; Chapter 8's pedagogy is the curved canvas from Ch 6–7.

### 4. Path-length and dilation readouts

**Decision.** Step 4 highlights arc lengths via narration + optional on-canvas `lm-annotation` labels at beam midpoint ("outer: longer path", "inner: shorter path"). Step 5 adds a compact readout component (`lm-readout` or inline annotation) showing relative clock rates: `gravitationalTimeDilationFactor` at inner vs outer edge x positions, formatted as "inner clock: 0.72×" / "outer clock: 0.95×" (values illustrative, monotonic with depth).

**Rationale.** Avoids a full spacetime-diagram detour while connecting to Ch 2 time vocabulary.

### 5. Feature lib layout

**Decision.** Mirror Chapter 7:

```
libs/features/chapter-08-light-bending/
  src/lib/chapter08.routes.ts
  src/lib/step-page.component.ts
  src/lib/step-registry.ts   # CHAPTER_08_TOTAL_STEPS = 7
  src/lib/steps/
    step-01-deep-well.ts / step-01.component.ts
    … step-07-straight-lines.ts / step-07.component.ts
```

Each step: timeline module + thin component hosting `lm-curved-surface` (cinematic layout), `LmStepChromeComponent`, narrator panel. Step 7 adds glowing slider for `lightBeamMissDistance` or `lightBeamHalfWidth`.

### 6. Routing and placeholders

**Decision.**

- Lazy-load `@lm/feature-chapter-08-light-bending` at `ch/08/step/:step`.
- Delete `Chapter08PlaceholderComponent`.
- Step 7 `nextStepUrl` → placeholder for chapter 9 (inline component: "More chapters coming").
- Add `@source` for chapter-08 in `styles.css`.

## Risks / Trade-offs

- **[Risk] Pedagogical geodesics may not match GR deflection angle** → Mitigation: document as visualization-first; tune `DEEP_WELL_PARAMS` and deflection curve so inner/outer ordering and synchronization story are correct, not the exact 1.75″ arcsecond value.
- **[Risk] Beam fill band adds renderer complexity** → Mitigation: ship Steps 1–6 with dual-edge lines only; add fill in Step 3+ if straightforward, otherwise narrate "band" via two edges.
- **[Risk] Seven steps feels long** → Mitigation: Steps 1–2 are short bridges; prototype chapter-index already specifies 7 steps.
- **[Risk] Dilation factor formula arbitrary** → Mitigation: monotonic with depth, capped at 1 at outer rim; unit tests lock relative ordering, not physical exactness.

## Migration Plan

1. Land physics helpers + tests first (no UI dependency).
2. Extend curved-surface renderer + component inputs; smoke test in isolation.
3. Scaffold feature lib; wire routes; remove placeholder.
4. Author steps 1→7 sequentially; tune deep-well params during Step 2 playback.
5. Update `docs/product.md`, `AGENTS.md`; lint/test/build affected projects.

Rollback: revert route to `Chapter08PlaceholderComponent` if feature lib incomplete.

## Open Questions

- **Chapter 9 placeholder title:** use generic "More chapters coming" until product defines next chapter.
- **Mass sphere:** reuse `showEarthSphere` wireframe with neutral label vs new `showMassSphere` — lean toward reusing wireframe sphere at well center with narration calling it "a massive star."
- **Step 7 interactivity:** miss distance vs beam width — default to miss distance slider (changes deflection visibly); beam width can stay fixed at `DEFAULT_BEAM_HALF_WIDTH` unless playtesting suggests otherwise.
