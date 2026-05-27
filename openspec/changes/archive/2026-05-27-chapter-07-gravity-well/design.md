## Context

Chapter 6 established `lm-curved-surface` (Three.js wireframes) with cylinder/cone morph (`fold`, `curvature`), worldline dot + fading trail, camera orbit, and physics helpers in `@lm/physics/curved-surface.ts`. Step 5 bridges explicitly to composing "the full gravity well — cylinder, cone, and the weightless center of the Earth." Today `/ch/07` resolves to an inline placeholder; no gravity-well geometry, bezier profile, or energy-parameterized trajectories exist.

The founder's narrative (`docs/interview-with-the-founder.md`) and `docs/product.md` define the pedagogical target: a piecewise Epstein paper model (space cylinder → narrowing cone → flat center cylinder → widening cone → space cylinder), smoothed into one bezier well, with a particle that spirals through the weightless center and either falls back or escapes depending on initial energy. The prototype `well` mini-glyph (`primitives.jsx`) shows three nested quadratic bezier meridians — tightest at center, opening above and below.

Architecture constraints: per-step canvas mount/unmount, timeline `animate` for authored motion, component-local slider for Step 5 exploration (no `bind`/`trigger` yet), theme-aware line rendering, cinematic layout for WebGL steps.

## Goals / Non-Goals

**Goals:**

- Extend `lm-curved-surface` to render a horizontal gravity-well profile (axis = space, circular cross-sections = time) with piecewise→bezier morph.
- Add pure physics helpers for well radius profile, piecewise segment boundaries, and energy-classified trajectories (bound vs escape).
- Deliver five Chapter 7 steps with a clear ramp: tunnel + surface/center puzzle → Epstein well build (answers the puzzle) → smooth well → fall-through animation (pays off the tunnel) → interactive energy dial.
- Replace Chapter 7 placeholder routes; add Chapter 8 placeholder for Step 5 forward nav.
- Unit-test all new physics helpers without WebGL.

**Non-Goals:**

- Light bending, time-dilation readouts on trajectories, or black-hole physics (Chapter 8+).
- Full numerical GR geodesic integration — use a pedagogical parametric model tuned for visual clarity.
- `bind`/`trigger` wiring for the energy slider — Step 5 uses a glowing slider component that directly updates `surface.energy` on the step's curved-surface instance.
- Shared WebGL context across steps.
- Spacetime-diagram overlay on well steps (well is the sole visualization).

## Decisions

### 1. Well geometry as a new surface profile, not a curvature tweak

**Decision.** Add `surfaceProfile: 'cone' | 'well'` (default `'cone'` for backward compatibility). When `'well'`, ignore `fold`/`curvature` for mesh generation and instead use `wellMorph` (0–1) and `wellReveal` (0–1).

| Input | Range | Meaning |
|-------|-------|---------|
| `surfaceProfile` | `'cone' \| 'well'` | Which mesh generator runs |
| `wellReveal` | 0–1 | 0 = hidden; animates piecewise segments appearing left→center→right |
| `wellMorph` | 0–1 | 0 = discrete five-segment piecewise; 1 = smooth bezier well |
| `time` | 0–1 | Progress along current trajectory |
| `energy` | 0–1 | Trajectory class: bound oscillation ↔ escape threshold |
| `worldlineMode` | `'well-trajectory'` | New mode for well geodesic sampling |

**Rationale.** Cone params cannot express a bidirectional well with a flat center. A separate profile keeps Chapter 6 steps untouched and avoids overloading `curvature`.

**Alternatives considered:**

- Reuse `curvature > 1` as well depth — rejected; breaks existing cone semantics and timeline paths.
- Separate `lm-gravity-well` primitive — rejected; architecture names one `curved-surface` primitive for Chapters 6–8.

### 2. Piecewise model: five segments along space (x-axis)

**Decision.** Profile along x ∈ [−L, +L] with segments (matching founder interview):

| Segment | x range (normalized) | Shape | Narrative |
|---------|---------------------|-------|-----------|
| 1 | [−1, −0.55] | Cylinder (constant R_outer) | Outer space |
| 2 | [−0.55, −0.15] | Cone narrowing | Approaching surface |
| 3 | [−0.15, +0.15] | Cylinder (R_center, flat) | Weightless center |
| 4 | [+0.15, +0.55] | Cone widening | Exiting Earth |
| 5 | [+0.55, +1] | Cylinder (R_outer) | Outer space |

`wellReveal` gates segment visibility for Step 2 animation (segment 1 at 0.2, …, segment 5 at 1.0).

**Rationale.** Directly mirrors Epstein's folded-paper explanation and Chapter 6 cone vocabulary.

### 3. Bezier smoothing via radial profile interpolation

**Decision.** Define outer radius `R(x)` as:

- **Piecewise (`wellMorph = 0`):** exact segment table above.
- **Smooth (`wellMorph = 1`):** single even profile `R(x) = R_outer · (a + (1−a) · |x/L|^p)` with tuned `a` (floor at center ≈ R_center/R_outer) and exponent `p ≈ 2` — visually matches prototype nested quadratics.

Intermediate morph: `R_morph = lerp(R_piecewise, R_bezier, wellMorph)`.

Mesh: for each x station, draw a circle/ellipse cross-section at radius `R(x)`; connect with meridians and horizontal rings at reduced opacity (~0.18–0.35), same as cone.

**Alternatives considered:**

- True cubic-bezier spline through control points — acceptable v2 polish; start with closed-form profile for testability.
- Lathe a 2-D SVG path from prototype — rejected for v1; harder to parametrize trajectories.

### 4. Trajectory model: pedagogical energy classes

**Decision.** Add `@lm/physics/gravity-well.ts`:

- `wellRadiusAt(x, wellMorph, params)` → radius at space coordinate
- `wellSurfacePoint(theta, x, wellMorph, params)` → `{ x, y, z }` on well surface
- `wellTrajectoryPoint(energy, properTime, wellMorph, params)` → surface point for dot
- `wellTrajectorySamples(energy, segmentCount, wellMorph, params)` → trail array
- `isEscapeTrajectory(energy, params)` → boolean (energy ≥ threshold)
- `WELL_ESCAPE_ENERGY_THRESHOLD` — exported constant (~0.72, tuned visually)

**Trajectory shape (bound, energy below threshold):**

- properTime 0→0.35: spiral down left cone from outer rim toward center (decreasing |x|, increasing θ)
- 0.35→0.65: traverse flat center cylinder (|x| small, θ advances)
- 0.65→1.0: climb right cone toward outer rim; at end, if bound, reverse phase implied by looping Step 4 timeline (single pass-through, not infinite oscillation in Step 4)

**Trajectory shape (escape, energy ≥ threshold):**

- Same entry through center, but sufficient "spatial" component to reach and remain on outer right cylinder (x → +L, θ continues)

Energy maps linearly to radial launch angle on the left cone: low energy = mostly time-like (falls back); high energy = more space-like (climbs out).

**Rationale.** Full geodesic math is out of scope; the founder cares about *seeing* pass-through vs escape, not computing Christoffel symbols. Pure functions remain unit-testable (center passage at x≈0, escape reaches |x| > 0.55).

### 5. Renderer changes in `curved-surface-renderer.ts`

**Decision.**

- Branch mesh builder on `surfaceProfile`.
- Well camera: oblique side view centered on x=0, similar to `CAMERA_CYLINDER` but pulled back (`CAMERA_WELL ≈ (0, 0.35, 4.8)`) so full well visible.
- Reuse existing trail ring buffer, dot accent, theme uniforms, orbit + reset.
- Step 2 annotations: side `lm-annotation` labels ("outer space", "approaching surface", "weightless center") positioned at segment boundaries — cinematic layout per `visual-guidelines.md`.

### 6. Feature lib layout

**Decision.** Mirror Chapter 6:

```
libs/features/chapter-07-gravity-well/
  src/lib/
    step-registry.ts          # CHAPTER_07_TOTAL_STEPS = 5
    step-page.component.ts
    chapter07.routes.ts
    steps/
      step-01.component.ts + step-01-puzzle.ts
      step-02.component.ts + step-02-piecewise.ts
      step-03.component.ts + step-03-smooth.ts
      step-04.component.ts + step-04-fall-through.ts
      step-05.component.ts + step-05-escape.ts
```

Lazy-load at `ch/07`; delete `Chapter07PlaceholderComponent`; add `Chapter08PlaceholderComponent` at `/ch/08/step/:step`.

### 7. Step 5 interactive energy control

**Decision.** Render an `lm-slider` (or existing design-system range input with `lmInteractive` glow) below the well. Slider value 0–1 maps to `energy` on the curved-surface component. On change, reset `time` to 0 and replay trajectory from entry (either auto-animate via short timeline restart or direct `time` RAF loop — prefer re-triggering a short local timeline segment for consistency).

Narration first demonstrates bound vs escape at two fixed energy values via timeline `animate`, then hands control to the slider.

**Non-goal alignment:** no engine `bind` event — slider uses Angular signal/effect to push `energy` into component state.

### 8. Step 1 narrative: tunnel hook, then the deeper puzzle

**Decision.** Step 1 renders `lm-curved-surface` with `surfaceProfile='cone'`, `curvature=1`, static dot on rim — visual callback to Chapter 6 without introducing well geometry. Narration opens with the tunnel-through-Earth thought experiment ("what if you jumped into a straight bore through the planet?"), then widens to the linked questions: why is gravity strongest on the surface rather than at the center, and why are you weightless at the center? Step 1 SHALL NOT answer either question; it SHALL promise that the Epstein gravity-well model in the steps ahead will make both clear.

**Suggested beat order:**

1. Tunnel hook — invite the reader to picture the jump (no animation of the fall yet).
2. Surface-vs-center puzzle — the founder's childhood confusion; gravity feels strongest where we stand.
3. Cone recap — we already know gravity as geometry on a cone; the full well is next.
4. Forward look — the well model will answer both the tunnel and the weightless-center questions.

**Rationale.** The tunnel question is viscerally engaging and naturally leads to "you'd pass through the center" — which only makes sense once the flat, weightless center exists in the model. Opening with it gives Step 4 a clear payoff. Reuses existing cone mesh with zero new renderer work for Step 1.

### 9. Narrative payoffs in Steps 2 and 4

**Decision.** Step 2 opening narration SHALL explicitly frame the piecewise well as the Epstein diagram that answers Step 1's questions. When the center cylinder segment appears, narration SHALL connect it to weightlessness at Earth's core. Step 4 SHALL tie the animated fall-through trajectory back to the tunnel thought experiment — you are not trapped at the center; momentum carries you through to the other side.

**Rationale.** Keeps the chapter arc coherent: question (Step 1) → model that explains (Steps 2–3) → visceral demonstration (Step 4) → explore energy (Step 5).

### 10. Piecewise unroll (`wellUnfold`) — the "fall on folded paper" payoff

**Context.** The chapter's pedagogical climax is the Epstein move: free-fall is a *straight line* on the unrolled paper. Without showing this, the bulge geometry remains a metaphor — the unroll makes it a proof. Originally we shipped this as narration only; we're now adding it as a real geometric morph.

**Decision.** Add a `wellUnfold` (0–1) input on `lm-curved-surface` and a new Step 3 ("Fall on folded paper") between the existing build (Step 2) and smoothing (now Step 4) steps. The unroll is **piecewise-only** — `wellUnfold` is ignored (or clamped to 0) when `wellMorph > 0`, because the smooth bezier bulge is not developable (Theorema Egregium). The pedagogical sequence:

1. Step 3 opens at `wellMorph = 0`, `wellUnfold = 0` (rolled piecewise paper from Step 2).
2. Drop a particle: `time` 0→1 with `worldlineMode='well-trajectory'`. Falls from near cone, through the wide center, to the far cone.
3. Unroll: `wellUnfold` 0→1 over ~1.5–2 s. Camera reframes to a top-down (or oblique) flat layout.
4. The trail morphs in lockstep and reveals itself as a piecewise-straight line — straight within each piecewise region, with direction changes only at the segment joins (cylinder↔cone↔cylinder).
5. Narration: *"on the paper, free-fall is a straight line."*

**Unroll geometry (per segment):**

| # | Segment | Rolled | Unrolled |
|---|---------|--------|----------|
| 1 | Outer cylinder (left) | radius `R_outer`, axis x | rectangle width `Δx`, height `2π·R_outer` |
| 2 | Expanding cone | radii `R_outer → R_center` along x | circular sector with arc length `2π·R(x)` at each x |
| 3 | Center cylinder | radius `R_center` (wide), axis x | rectangle width `Δx`, height `2π·R_center` |
| 4 | Contracting cone | radii `R_center → R_outer` along x | mirror of segment 2 |
| 5 | Outer cylinder (right) | radius `R_outer`, axis x | rectangle width `Δx`, height `2π·R_outer` |

The five segments lay out side-by-side in 2D paper coordinates `(u, v)` with `u` along the bulge's space axis and `v` for the unrolled circumference. The flat layout uses the same `(x_world, y_world)` scene coordinates with `z = 0`, so the existing camera + orbit work; we just reframe `CAMERA_WELL` toward a top-down view as `wellUnfold → 1`.

**Worldline rework.** Today's worldline is harmonic in 3D space (`xNorm = -A·cos(πt)`) with linear theta. For the unrolled trail to be piecewise-straight, the worldline must be **defined in unrolled paper coordinates** as a straight line per piecewise region, then forward-mapped to the 3D bulge for the rolled view. Concretely:

1. Choose a slope `(α, β)` in unrolled `(u, v)` space based on energy (`α/β` ratio determines climb vs spin balance — the Epstein "speed budget").
2. Sample `(u(t), v(t)) = (u₀ + α·t, v₀ + β·t)` clipped to each piecewise segment in turn.
3. At piecewise boundaries, refract the line angle by the boundary's intrinsic curvature mismatch (cone's apex-angle change = direction change in 2D paper).
4. For the rolled view, invert: take `(u, v)` and map back to `(theta, x)` using the segment's unroll formula, then to 3D via `wellSurfacePoint`.

This replaces the current `wellTrajectoryPoint` for the piecewise case. The smooth-bulge trajectory remains harmonic-cosine (Step 5 / Step 6 unchanged in feel), but Steps 3–4 use the new piecewise-straight worldline so the unroll demo is honest.

**Rationale.** Mirrors `coneFromUnrolledPoint` from Chapter 6 (`libs/physics/src/lib/curved-surface.ts`). Keeps "straight on paper, curved on bulge" as a pure-function invariant testable in unit tests (`wellTrajectoryPointMorphed` collapses to the unrolled straight line at `wellUnfold = 1`, `wellMorph = 0`).

**Visual transition smoothing.** The morph from rolled to unrolled is a per-vertex lerp between the two parameterizations. To avoid a "wobble" mid-morph, ease the lerp with `smoothstep(wellUnfold)`. Trail samples re-evaluate the parametric mapping each frame (no precomputed cache).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Pedagogical trajectory ≠ true GR geodesic | Narration uses geometry language, not "exact orbit"; document as visual model in step narration constraints |
| Well mesh complexity (many x stations) | Cap meridians/rings (~24×12); single draw call pattern from cone renderer |
| Bezier morph may look kinked at segment joins | Tune `wellMorph` easing; add invisible control-point blend if needed in polish pass |
| Energy threshold feels arbitrary | Calibrate `WELL_ESCAPE_ENERGY_THRESHOLD` against visual escape; expose as named constant |
| Step 5 slider + timeline race | Debounce slider; pause timeline during user drag; resume on release |
| Long well may clip on narrow viewports | Reuse viewport-resolution hint; well camera FOV slightly wider than cone |
| Smooth bulge cannot lay flat (positive Gaussian curvature) | `wellUnfold` is gated to `wellMorph = 0`; Step 4 narration acknowledges the constraint and frames Step 3 as the truth |
| Worldline rework changes Step 5 / Step 6 motion feel | Keep harmonic-cosine for smooth bulge; piecewise-straight only for `wellMorph = 0`; tests cover both regimes |
| Camera reframe during unfold | Lerp `CAMERA_WELL` toward top-down `(0, 5, 0.001)` over the same duration as `wellUnfold` |

## Migration Plan

**Phase 1 — five-step chapter (shipped):**

1. Add physics helpers + unit tests (no UI).
2. Extend `curved-surface-renderer` with well profile mesh + `well-trajectory` worldline mode.
3. Scaffold Chapter 7 feature lib; wire routes; swap placeholder for feature; add Ch 8 placeholder.
4. Author Steps 1–5 (puzzle, build, smooth, fall through, escape).
5. Update `docs/product.md` step list.

**Phase 2 — six-step chapter with paper unfold (this amendment):**

6. Add piecewise unroll helpers in `@lm/physics` (`wellUnrollSegmentLayout`, `wellSurfacePointUnrolled`, `wellTrajectoryPointMorphed`); rework worldline so it's straight on unrolled paper.
7. Extend renderer + component with `wellUnfold` (clamped to 0 for `wellMorph > 0`); update camera reframe.
8. Renumber existing Steps 3–5 to 4–6; insert new Step 3 ("Fall on folded paper").
9. Update narration in Steps 4 and 5 to reference the unroll truth from Step 3.
10. Update `docs/product.md` and `AGENTS.md` to six-step chapter.

Rollback: revert routes to Chapter 7 placeholder; well code paths dormant when `surfaceProfile='cone'`. Phase-2 rollback: clamp `wellUnfold` to 0 globally and remove Step 3 from registry — Steps 1, 2, 4, 5, 6 still ship.

## Open Questions

- **Step 1 renderer:** cone recap only vs narrator-only with no WebGL — prefer cone recap for continuity; confirm during Step 1 authoring.
- **Step 5 oscillation (was Step 4):** single pass-through vs visible bounce-back loop — prefer single pass-through in timeline; Step 6 slider can show repeated oscillation for low energy.
- **Exact bulge proportions:** tune against prototype `well` mini-glyph (nested quadratics); adjust `R_outer`, `R_center`, segment boundaries in `DEFAULT_WELL_PARAMS`.
- **Chapter 8 placeholder copy:** mirror Chapter 7 placeholder pattern ("Light bending — coming next").
- **Step 3 unroll camera angle:** top-down vs oblique flat layout — prefer top-down at `wellUnfold = 1` for clearest "straight line on paper" reading; verify legibility of long horizontal layout against the 560×380 viewport.
- **Worldline slope mapping:** how energy maps to the unrolled-paper slope `(α, β)` — calibrate so the rolled view at `wellUnfold = 0` still reads as "harmonic-like fall" and the unrolled view reads as a clearly straight line; revisit during Step 3 authoring.
