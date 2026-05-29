## Why

The product is called **Light Matters** — and its founder's intent is the double meaning, *light and matter*. Yet the entire journey, for all its relativity, never touches **matter, mass, or energy**, and never reaches \(E=mc^2\) — the one equation every learner already half-knows. That is both a thematic hole (the "matter" half of the title) and a missed payoff: \(E=mc^2\) is not a separate topic bolted on, it falls directly out of the speed budget and the Doppler shift the journey has already built. This change adds the capstone chapter that pays off the title and ties the whole flat-spacetime arc together — then hands off to gravity, since mass-energy is exactly what curves spacetime.

## What Changes

- **New chapter: "Mass is energy" (\(E=mc^2\))**, the SR capstone placed at the end of the flat-spacetime block, just before the gravity chapters:
  - **Hook.** Everything so far seemed unrelated to the famous equation — yet it has been hiding in plain sight. Why is \(E=mc^2\) linked to all of it?
  - **Rest energy as motion through time.** Reinterpret the Chapter 2 speed budget with *energy*: at rest you spend all of \(c\) on motion through time, and that motion *is* your rest energy \(mc^2\). Move, and part of the budget becomes kinetic energy — \(E=\gamma mc^2\). This is the intuitive bridge from the geometry already learned to the equation.
  - **Light carries momentum.** Establish the one new fact — light pushes (radiation pressure / comet tail / solar sail), so it has momentum \(p=E/c\) and behaves as if it carries mass.
  - **The photon-in-a-box (center of mass).** A photon is emitted from one wall of a floating box, the box recoils, the photon is absorbed at the far wall. Since an isolated system's center of mass cannot move, the light must have carried mass \(m=E/c^2\) across the box. This is the cleaner, interactivity-native cousin of Epstein's moving-mirror argument (Einstein 1906): one visible invariant (the center-of-mass line), one draggable (energy).
  - **Epstein's own routes, as optional asides.** His conveyor-belt "Masserator" (\(f=v\,dm/dt\) → \(E=ms^2\) → \(E=mc^2\)) and his whimsical moving-mirror derivation are offered as short, skippable "another way to see it" cards for fidelity, without carrying the spine.
  - **Payoff & bridge.** Mass is frozen energy; because \(c^2\) is enormous, a sliver of mass is a vast energy (sun, nuclear). And since mass and energy are one thing, *this* is what bends spacetime — bridge into the gravity chapters.
- **Physics helpers** in `@lm/physics`: relativistic energy \(E=\gamma mc^2\), rest energy \(mc^2\), kinetic energy \((\gamma-1)mc^2\), relativistic momentum \(\gamma m v\), photon momentum \(E/c\), and mass lost to emitted radiation \(\Delta m = E/c^2\) — pure functions with unit tests, building on `lorentz`.

## Capabilities

### New Capabilities
- `chapter-mass-energy`: The \(E=mc^2\) capstone chapter — the hook, the speed-budget energy reinterpretation, the light-carries-momentum step, the photon-in-a-box (center-of-mass) derivation, optional Epstein belt/mirror asides, and the payoff/bridge to gravity, with narration constraints, interactions, readouts, and navigation.

### Modified Capabilities
- `physics`: Add relativistic energy/momentum helpers (rest energy, total energy, kinetic energy, relativistic momentum, photon momentum, mass–energy of emitted radiation), consistent with the existing Lorentz definitions.

## Impact

- **New feature lib** `libs/features/chapter-<NN>-mass-energy`, registered in the chapter registry, `app.routes.ts`, `app.routes.server.ts`/SEO step list.
- **Reuses existing primitives:** the `spacetime-diagram` speed-budget vector (relabeled with energy) for the rest-energy step; a small step-local wireframe box + center-of-mass line for the photon-in-a-box derivation; a step-local comet/solar-sail visual for the light-momentum step. The optional two-flash Doppler aside, if built, reuses `lm-light-scene` + the relativistic Doppler helper. No hard cross-change dependency for the core spine.
- **`@lm/physics`** gains the energy/momentum helpers + tests.
- **Placement / numbering:** Chapter 9 (end of SR, before "Rolling the diagram") in the locked v1.0 map; numbering + route scheme owned by `reorder-chapters-and-route-scheme` (lands first).
- **Reference:** Epstein, *Relativity Visualized* (`docs/resources/`) for the exact derivations and figures — to be confirmed during implementation (see design Open Questions).
- **No engine/timeline-schema changes.**
