## Context

Chapters 1–2 are built on the Epstein-style spacetime diagram (vertical = at rest, horizontal = light, every object at $c$ through spacetime). Chapter 3 is about how **information** travels — wavefronts arriving at observers, simultaneity, and the spatial intuition behind Special Relativity's most famous puzzles. After exploring conventions, the project decided **Chapter 3 will not use a spacetime diagram at all**: the visuals are spatial (top-down 2-D space), the same convention readers' everyday intuition already uses. The Epstein diagram returns intact in Chapter 6 when we start folding it into curved 3-D surfaces.

The Chapter 2 bridge step (`/ch/02/step/3`) was rewritten to set up this camera switch with a closing beat ("we are stepping out of the diagram"). Chapter 3 picks up the camera in Step 1.

## Goals / Non-Goals

**Goals:**
- A reusable, focused 2-D primitive (`lm-light-scene`) that any chapter can use to show wavefronts, observers, sources, and arrivals in space.
- Five Chapter 3 steps that build from "one source, one observer" up to "relativity of simultaneity" without relying on any spacetime diagram.
- Pure-function physics helpers in `libs/physics/` for wavefront reception times in 2-D, including uniformly moving observers.
- Clean handoff narration in Step 1 ("we have changed cameras") so readers do not feel the convention switch is arbitrary.
- Zero impact on existing Chapter 1–2 visuals; Epstein grammar preserved.

**Non-Goals:**
- Doppler shift / pulse trains as a primary teaching beat — that is Chapter 5.
- Aberration ("rain on windshield") — Chapter 5.
- Source motion vs ether vs source-velocity-independence of light — Chapter 4.
- Acceleration animations or non-uniform motion of any observer in Chapter 3.
- Reuse of the spacetime-diagram primitive's `wavefront` variant beyond Chapter 2 Step 3.
- New timeline event types — existing `narrate` / `animate` / `wait` are sufficient.

## Decisions

### 1. Use a 2-D top-down spatial scene, not a spacetime diagram

**Decision.** Chapter 3 ships `lm-light-scene`: a top-down 2-D canvas where horizontal and vertical are both **space**, observers are dots, sources emit pulses that render as **expanding circles** at $c$. No time axis. Time is the animation variable, not a spatial dimension.

**Why.**
- Wavefront physics is inherently spatial; expanding circles are the most direct rendering.
- Avoids forcing readers to learn Minkowski (where light is at 45°) only to abandon it again in Chapters 6–8 (curved Epstein surfaces).
- Matches everyday intuition; reduces cognitive load for general-audience readers.
- Cleanly factors: spacetime diagrams own "the budget vector and proper time"; light scenes own "what arrives where and when in space."

**Alternatives considered.**
- Switch to Minkowski for Chapters 3–5 then back to Epstein for 6–8 — rejected: two convention switches, three diagrams.
- Stay on Epstein and contort signal physics into proper-time geometry — rejected: light's worldline is degenerate in Epstein, makes signal arrival visually awkward.

### 2. Primitive name and shape

**Decision.** `lm-light-scene` (kebab `light-scene`). Library at `libs/primitives/light-scene/`. SVG-based, like `spacetime-diagram` (no WebGL needed for the wavefront circles).

**Inputs (Angular `input()`s):**
- `width`, `height`, `padding`
- `observers`: array of `{ id, x, y, label, color, velocity?: { vx, vy, vOverC } }` — coordinates in normalized scene units; optional uniform velocity.
- `sources`: array of `{ id, x, y, label?, color?, emissions: { atTime: number; pulseId: string }[] }`.
- `time`: current scene time (timeline target).
- `tMax`: maximum scene time used for layout extent.
- `showGrid`, `showLabels`, `showAxes` (cosmetic — defaults to off; this is space, not a graph).
- `pulseStrokeOpacityFalloff` (cosmetic).

**Targets registered for the timeline:**
- `scene.time` — drives wavefront expansion.
- `scene.observer.<id>.x`, `scene.observer.<id>.y` — observer positions when needed (most steps will use uniform-velocity convenience).

**Reception markers.** When pulse circle from a source `S` reaches observer `O`'s position at scene time $t$ (computed from `light-scene` physics), the primitive renders a glow on `O` and emits a `(reception)` event the step component can hook for FactLine updates / counter ticks.

### 3. Physics helpers (pure functions in `@lm/physics`)

New file `light-scene.ts`:
- `pulseReachesStationary({ source, observer, c }) → time` — `|O − S| / c`.
- `pulseReachesMoving({ source, observerStart, observerVelocity, c }) → time | null` — solves `|O₀ + v·t − S| = c·t` for the smallest positive `t`; returns null if signal never catches the observer.
- `lightCircleRadius(emitTime, currentTime, c)` — `max(0, c · (currentTime − emitTime))`.
- 2-D scaffolding: `Vec2` interface, distance helper.

These are pure and unit-testable. The primitive consumes them.

### 4. Step structure mirrors Chapter 2

Each step is a `Step` object + an Angular component, mirroring `libs/features/chapter-02-speed-budget/`:
- `libs/features/chapter-03-light-information/src/lib/steps/step-NN-<slug>.ts` — timeline.
- `libs/features/chapter-03-light-information/src/lib/steps/step-NN.component.ts` — Angular component wiring the scene + narrator + FactLines.
- A `step-registry.ts` like Chapter 2's, with `CHAPTER_03_TITLE = 'Light and information'`, `CHAPTER_03_TOTAL_STEPS = 5`.

### 5. Step content (canonical wording deferred to specs)

1. **Step 1 — Light through space.** Camera-switch beat → one source, one observer; pulse expands as a ring; arrives; counter ticks once.
2. **Step 2 — Two listeners.** Source between two stationary observers (equidistant); the ring touches both at the same instant; both counters tick simultaneously. Establish symmetric stationary baseline.
3. **Step 3 — One of them moves.** Same scene; one observer slides along the line (toward source) at $v/c \approx 0.4$ from `t = 0`. Asymmetric arrival; counters tick at different times; explicit narration "motion changed when the news arrived" (no Doppler claims yet).
4. **Step 4 — Two flashes, one witness.** Two sources on a horizontal line, equidistant from a midpoint. Both flash at the same scene time. Stationary middle observer: both rings reach simultaneously. Then move the middle observer; the two rings reach at different instants → relativity of simultaneity. Narration emphasizes "what counts as 'now' depends on motion."
5. **Step 5 — Outro.** Connect back to Chapter 2 clocks: motion → different elapsed time, different arrival times, different "nows." Forward-look: Chapter 4 (ether) and Chapter 5 (Doppler / aberration).

### 6. Continue gating

- Step 1–3, 5: continue when timeline complete.
- Step 4: gated by a single `LmPredictionChoice` (arrival order question), reusing the existing component from `@lm/design`. No additional design work needed for the prediction component itself.

### 7. Routing and registry

`apps/lightmatters/src/app/app.routes.ts`: replace the placeholder route to load the chapter-03 component map. Steps wired in registry, navigation: Ch 2 Step 3 → Ch 3 Step 1; Ch 3 Step N → Step N+1; Ch 3 Step 5 → Chapter 4 placeholder route (same pattern Chapter 2 used to bridge to Chapter 3).

## Risks / Trade-offs

- **Two visual conventions in the journey** — Risk: readers get mildly disoriented at the camera switch. Mitigation: explicit narration in Ch 2 Step 3 closing beat (already shipped) and Ch 3 Step 1 opening beat. Both call out the change.
- **`lm-light-scene` could grow into a pile of options** — Risk: feature creep across Chapters 3–5. Mitigation: keep this change scoped to Chapter 3 needs only; defer Doppler-emitter mode and aberration-starfield mode to later changes.
- **Coordinate convention drift** — Risk: SVG `y` increases downward, but readers expect "up"; if we add labels they need careful orientation. Mitigation: this is space-only with no axes — the visual is symmetric enough that orientation is not pedagogically loaded.
- **Performance with many concurrent rings** — N/A in Chapter 3 (max 2 rings on screen simultaneously, Step 4). Defer ring-pooling/perf work to Chapter 5 if needed.
- **Test coverage for the primitive** — Risk: hard to assert against floating-point ring radii in DOM. Mitigation: rely on physics unit tests for reception math; primitive component tests assert structure (correct number of circles, observer dots present, reception events emitted at expected times).
