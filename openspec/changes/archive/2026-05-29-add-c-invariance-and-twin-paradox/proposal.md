## Why

Two of special relativity's most important beats are still missing. First, the **constancy of `c`** — the postulate everything else rests on — is currently *asserted* ("c is the same for everyone because that's how light is born") but never *demonstrated*, which violates the product's own "show, don't tell" principle. Second, the **twin paradox** — the single most famous SR payoff — is ~80% set up already by the two-travellers step but never delivered. This change adds the demonstration that makes the postulate believable and the capstone that pays off the whole flat-spacetime arc.

## What Changes

- **New chapter: "The same speed of light"** (≈4 steps, Chapter 5) — a *demonstrated* constancy of `c`, placed to resolve the simultaneity puzzle planted in "Light and information":
  - Recall that `c` was asserted; now show it can genuinely be the same for everyone.
  - A flash where two observers momentarily coincide. In the ground frame the wavefront is a circle centered on the emission point; the moving observer drifts off-center — so surely *they* measure a different speed?
  - **Switch into the moving observer's frame:** the wavefront is centered on *them* too, still expanding at `c`. The only way both can be true is that space and time themselves adjust — this *forces* clocks to run slow and rulers to shrink, the dilation and contraction the light clock makes concrete in the next chapter. This is the light-sphere argument.
  - Outro: `c`-invariance is the rock; dilation, contraction, and simultaneity all spring from it.
- **New chapter: "The twin paradox"** (≈4–5 steps) — the worldline payoff, placed after Doppler:
  - Two twins; one travels out and back at high `v`. Draw both worldlines on the spacetime diagram.
  - The apparent paradox: each sees the other's clock run slow — who is younger on reunion?
  - Resolution: the journey is **not symmetric** — the traveller turns around (a corner in the worldline / a frame change). The stay-at-home's straight worldline has the **longest proper time**; the traveller returns younger.
  - Doppler-counting view: count the light pulses each twin receives (reusing Chapter 7 Doppler and the light clock) — the turnaround asymmetry in *when* the shift is seen makes the result concrete and quantitative.
  - Outro: proper time is path-dependent; "straightest = oldest."
- **Physics helpers** in `@lm/physics`: proper time accumulated along a piecewise-constant-velocity worldline, and twin-readout formatting; reuse the relativistic Doppler helper (from `physics-accuracy-pass`) for the pulse-counting view.

## Capabilities

### New Capabilities
- `chapter-constant-c`: The demonstrated-`c`-invariance chapter — light-sphere argument, the frame switch, narration constraints, interactions, and navigation.
- `chapter-twin-paradox`: The twin-paradox chapter — worldlines, the apparent paradox, the asymmetry/turnaround resolution, the Doppler-counting view, readouts, and navigation.

### Modified Capabilities
- `physics`: Add a proper-time-along-worldline helper (sum of `Δt·√(1−v²/c²)` over segments) and twin-readout formatting; both pure functions with unit tests.

## Impact

- **Two new feature libs** (`chapter-<NN>-constant-c`, `chapter-<NN>-twin-paradox`), registered in the chapter registry, `app.routes.ts`, `app.routes.server.ts`/SEO step list.
- **Reuses existing primitives:** `lm-light-scene` (expanding wavefront, with a frame-switch / re-center for the light-sphere step) for "The same speed of light"; the `spacetime-diagram` (worldlines) and `lm-light-clock` (from the light-clock change) for the twin paradox. The light-scene frame-switch is expected to be handled by re-deriving the scene in the moving frame; if it needs a primitive-level option, that is a small additive change noted in design.
- **`@lm/physics`** gains the worldline proper-time helper + tests; depends on the relativistic Doppler helper landing in `physics-accuracy-pass`.
- **Placement / numbering:** "The same speed of light" = Chapter 5 (after the ether chapter, resolving the Chapter 3 simultaneity puzzle); "The twin paradox" = Chapter 8 (after Doppler) in the locked v1.0 map; numbering + route scheme owned by `reorder-chapters-and-route-scheme` (lands first).
- **No engine/timeline-schema changes.**
- **Out of scope:** length contraction & light clock (separate change, but this change *depends on* the light clock for the twin Doppler view), and E=mc² (separate change).
