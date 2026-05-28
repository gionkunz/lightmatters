## Why

The journey teaches time dilation beautifully through Epstein's speed-budget geometry (Ch2), but it never shows the **concrete mechanism** most learners expect — the bouncing-photon **light clock** — and it is missing time dilation's inseparable partner, **length contraction**. Without length contraction the special-relativity core is half-told: it is the effect that resolves the muon puzzle and keeps the two postulates self-consistent, and it has a clean Epstein-diagram depiction. This change adds one cohesive chapter, "Clocks and rulers," that grounds the abstract speed budget in a physical clock and completes the dilation/contraction pair.

## What Changes

- **New chapter: "Clocks and rulers."** A short chapter (≈4 steps) sequenced right after the speed budget:
  - **The light clock.** Two mirrors, a photon bouncing between them; each round trip is one tick. At rest the path is vertical.
  - **A moving clock ticks slow.** Set the clock moving; the photon must trace a longer diagonal path at the same speed `c`, so each tick takes longer — time dilation, derived from the constancy of `c` with no algebra required. A slider sets `v/c`; the tick-rate readout reproduces the Lorentz factor and ties back to the Ch2 speed-budget vector.
  - **Length contraction.** The partner effect: a moving ruler is shorter along its direction of motion by the same Lorentz factor. Shown geometrically (and tied to the light clock / muon intuition).
  - **Outro.** Tie dilation and contraction together as two faces of one geometry; bridge forward.
- **New reusable primitive `lm-light-clock`** (line-art, themeable, glow on interactive controls): two mirrors + a bouncing photon, with `velocity` (v/c) and `tick` animatable properties; renders the stationary vertical bounce and the moving diagonal bounce. Reusable later (e.g. twin paradox).
- **Length-contraction visual** on the existing spacetime diagram (or a minimal step-local ruler), driven by `v/c`.
- **Physics helpers** in `@lm/physics`: `lengthContraction(properLength, vOverC)` and a light-clock tick-period helper, with unit tests. (Both reduce to the existing `lorentz` / `properTimeFraction`.)

## Capabilities

### New Capabilities
- `chapter-clocks-and-rulers`: The new chapter and its steps — light clock at rest, moving clock → time dilation, length contraction, outro — including narration constraints, interactions, readouts, and navigation.
- `light-clock`: The reusable `lm-light-clock` primitive — bouncing-photon geometry, animatable `velocity`/`tick`, line-art rendering, theme tokens, and glow-only-on-interactive behavior.

### Modified Capabilities
- `physics`: Add `lengthContraction` and a light-clock tick-period helper as pure functions, consistent with the existing Lorentz definitions.

## Impact

- **New feature lib** `libs/features/chapter-<NN>-clocks-and-rulers` (number per the placement decision in design.md), registered in the chapter registry, `app.routes.ts`, sitemap/prerender step list.
- **New primitive lib** `libs/primitives/light-clock` (`scope:primitive`), tagged and dependency-bounded per the module rules.
- **`@lm/physics`** gains two helpers + tests.
- **Placement / numbering:** Chapter 6 "Clocks & rulers" (after "The same speed of light", Chapter 5) in the locked v1.0 map; numbering + route scheme owned by `reorder-chapters-and-route-scheme` (lands first).
- **No engine or timeline-schema changes.** Uses existing `narrate` / `animate` / `wait` events and the slider control pattern.
- **Out of scope:** the relativistic Doppler fix (owned by `physics-accuracy-pass`), the twin paradox, c-invariance demo, and E=mc² (separate changes).
