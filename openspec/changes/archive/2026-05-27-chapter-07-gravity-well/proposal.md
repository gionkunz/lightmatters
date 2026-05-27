## Why

Chapter 6 ends with Newton's apple on the cone rim and a bridge promise: compose the full gravity well with a weightless center. Readers who followed the cone metaphor still lack answers to two linked puzzles — the vivid tunnel-through-Earth thought experiment (what if you jumped into a bore straight through the planet?) and the deeper question behind it: why is gravity strongest on the surface, not at the center, and why are you weightless there? Chapter 7 opens with that hook, then answers both by building the Epstein gravity-well model piece by piece, dropping a particle through it, and making escape velocity a visible energy threshold rather than a formula. Chapter 6 deliberately deferred the bezier well, trajectory energy dial, and pass-through-the-center animation; this change delivers them.

## What Changes

- Extend **`@lm/physics`** with gravity-well surface parametrization: piecewise cylinder/cone segments, bezier-smoothed bulge profile, energy-parameterized harmonic trajectory sampling, and **piecewise unroll helpers** that lay the bulge flat in 2D and define the worldline as a piecewise-straight line on the unrolled paper (pure functions, unit-tested).
- Extend **`lm-curved-surface`** with a `well` surface mode: render the composed piecewise shape, morph to a smooth bulge, animate a worldline dot with fading trail along well trajectories, accept an `energy` input for trajectory shape, and add a **`wellUnfold` (0–1)** input that flattens the piecewise bulge into 2D paper.
- Add feature lib **`@lm/feature-chapter-07-gravity-well`** with **six** authored steps at `/ch/07/step/{1..6}`.
- Replace the `/ch/07` placeholder with lazy-loaded Chapter 7 routes; add a `/ch/08/step/1` placeholder for Step 6 forward nav (same pattern as Ch 6→7).
- Update `docs/product.md` with the canonical Chapter 7 step list.

**Pedagogical arc (six steps):**

1. **Step 1 — The puzzle.** Narrative hook: the tunnel-through-Earth jump — then the linked questions (strongest gravity on the surface? weightless at the center?). Recap the cone from Chapter 6; defer answers until the Epstein bulge is built.
2. **Step 2 — Build the bulge.** Frame the piecewise model as the tool to answer Step 1's questions. Animate: outer space cylinder → expanding cone (approach) → wide center cylinder (Earth, weightless) → contracting cone (exit) → outer cylinder.
3. **Step 3 — Fall on folded paper.** Drop a particle on the *piecewise* paper bulge; it falls from the near cone through the wide center to the far cone. At the end of the step, animate `wellUnfold` from 0 to 1: the four piecewise segments lay flat into 2D paper and the worldline reveals itself as a piecewise-straight line. The Epstein punchline: free-fall is a straight line on the unrolled paper.
4. **Step 4 — Smooth the shape.** Morph the piecewise sections into one continuous smooth bulge; narrate that the smooth surface cannot lay perfectly flat the way the piecewise paper did, but the same straight-line truth still applies.
5. **Step 5 — Fall through Earth.** Pay off the tunnel thought experiment on the smooth bulge: drop a particle, fall through the weightless center, climb the far side — full trajectory trace; recall the straight-line worldline shown unrolled in Step 3.
6. **Step 6 — Escape velocity.** Interactive energy dial: low energy → oscillate through the center; high energy → escape to the outer cylinder. Outro bridges to Chapter 8 (light bending).

**Non-goals for this change:** light bending (Chapter 8), black-hole horizons, time-dilation readouts on trajectories, `bind`/`trigger` timeline wiring for the energy slider (use component-local control + timeline handoff), shared WebGL context across steps, MathJax beyond existing narrator support.

## Capabilities

### New Capabilities

- `chapter-07-step-01`: The puzzle — tunnel-through-Earth hook, surface-vs-center questions; cone recap; no bulge geometry or answers yet.
- `chapter-07-step-02`: Piecewise bulge composition — Epstein model to answer Step 1; five-segment cylinder/cone/cylinder animation on `lm-curved-surface`.
- `chapter-07-step-03`: Fall on folded paper — particle falls through the piecewise bulge, then the surface unrolls to flat 2D paper revealing the worldline as a piecewise-straight line (Epstein punchline).
- `chapter-07-step-04`: Smooth bulge morph — continuous bulge from piecewise sections; narration acknowledges the smooth bulge can't fully lay flat.
- `chapter-07-step-05`: Fall-through trajectory on smooth bulge — timeline-animated particle with fading trail through the weightless center.
- `chapter-07-step-06`: Escape velocity dial — interactive energy control; trapped vs escaping trajectories; bridge to Chapter 8.

### Modified Capabilities

- `curved-surface`: Add gravity-well surface mode (`wellShape`, piecewise→bezier morph, **piecewise unroll via `wellUnfold`**, energy-driven trajectory, well-specific camera framing).
- `physics`: Add gravity-well profile helpers, piecewise segment sampling, bezier bulge radius function, energy-parameterized harmonic trajectory sampling, and **piecewise unroll helpers** (segment layout + unrolled surface points + morphed trajectory).

## Impact

- **Updated library:** `libs/physics/` — new `gravity-well.ts` (or extend `curved-surface.ts`) helpers + tests.
- **Updated primitive:** `libs/primitives/curved-surface/` — well mesh generation, new timeline targets, energy input.
- **New feature lib:** `libs/features/chapter-07-gravity-well/`.
- **Routing:** `apps/lightmatters/src/app/app.routes.ts` — lazy-load Chapter 7 feature; delete `Chapter07PlaceholderComponent`; add Chapter 8 placeholder route.
- **Landing data:** `chapterFirstStepHref` already covers chapter 7; no registry change needed until chapter is live.
- **Docs:** `docs/product.md` Chapter 7 step breakdown; `docs/architecture.md` build-order tick for Chapter 7.
