## Context

`E=mc^2` is the most recognizable result in physics and the payoff of the product's name, yet it is absent. Crucially, it is *not* a new topic — it follows from machinery the journey already builds: the speed budget (Ch2) gives rest energy as "motion through time." Epstein presents two derivations — a conveyor-belt "Masserator" and a moving-mirror radiation-pressure argument — but both are confirmed (see the book in `docs/resources/`) to be either mechanical algebra or whimsical bookkeeping. This chapter adapts their shared core (light carries momentum, therefore mass) into a cleaner interactive derivation, so `E=mc^2` feels inevitable rather than introduced.

## Goals / Non-Goals

**Goals:**
- Pay off the "matter" half of *Light Matters* with an intuitive `E=mc^2`.
- Show it as a *consequence* of the already-learned speed budget plus one new fact (light carries momentum), not a new axiom.
- Derive `E=mc^2` with a single clean interactive argument (photon-in-a-box), honoring Epstein's two routes as optional asides.
- Bridge naturally into the gravity chapters (mass-energy curves spacetime).

**Non-Goals:**
- No heavy algebra on screen; derivations are geometric/animated with optional inline formulas.
- No particle-physics or nuclear-engineering detail beyond an intuition-level "tiny mass, huge energy."
- No new engine/timeline events.

## Decisions

### D1 — Lead with the speed-budget energy reinterpretation
Open by reinterpreting the Chapter 2 vector with energy: at rest, all of `c` is spent on motion through time, and *that* is rest energy `mc²`; moving shifts budget into kinetic energy, giving total `E = γmc²`. This is the bridge that makes the equation feel like a relabeling of something already understood — the *why* mass and energy share a currency — before the concrete derivation supplies the `c²`.

### D2 — Primary derivation: the photon-in-a-box (center of mass)
Epstein gives two derivations — the conveyor-belt "Masserator" (`f = v·dm/dt`; sand piling on a constant-speed belt gives `E = ms²`, and for light, speed is locked at `c`, so `E = mc²`) and the moving-mirror radiation-pressure argument ("mirror land", momentum ledger `f·t = Mc+Mc+mc`, yielding `E = mc²`). Both are faithful, but the mirror's imaginary-light-behind-the-glass model and momentum bookkeeping are more likely to muddle than click, and neither is uniquely served by an interactive canvas.

**Decision:** the primary on-screen derivation is the **photon-in-a-box / center-of-mass** argument (Einstein 1906) — the rigorous, cleaner cousin that captures the exact truth Epstein's mirror is groping at (light carries momentum, therefore mass) without the crutch. A wireframe box floats at rest with its center of mass marked by a fixed dashed line; the left wall flashes a photon (momentum `E/c`) so the box recoils; the photon is absorbed at the right wall and the box stops, displaced. Since an isolated system's center of mass cannot move, the light must have carried mass `m = E/c²` across the box to keep the line fixed. One visible invariant (the COM line), one draggable (photon energy), no ledger.

This needs one prerequisite fact — **light carries momentum** — established first via radiation pressure (comet tail / solar sail), which is also how Epstein motivates the mirror.
*Alternatives considered:* Epstein's mirror — faithful but convoluted; Epstein's belt — genuinely intuitive and retained as an optional "another way to see it" aside; the two-flash Doppler argument (Einstein 1905, reuses our Ch5 Doppler) — also a good optional aside, but not one of Epstein's and not needed for the spine.

### D3 — Visuals
- Speed-budget energy step: reuse the `spacetime-diagram` vector with energy labels/readouts.
- Light-has-momentum step: a small line-art comet/solar-sail visual (step-local) showing light pushing matter — motivates `p = E/c`.
- Photon-in-a-box: a wireframe box + photon + a fixed dashed center-of-mass line and recoil offset, with a photon-energy control. Likely a small step-local component (it could borrow `lm-light-clock`'s photon, but the box + COM invariant is specific); decide in implementation.
- Optional Epstein asides: step-local conveyor/sand (belt) and/or a "mirror land" card if included.

### D4 — Physics helpers
Add to `@lm/physics`, all building on `lorentz`: `restEnergy(mass)` = `mc²` (with `c` in chosen units), `totalEnergy(mass, vOverC)` = `γmc²`, `kineticEnergy(mass, vOverC)` = `(γ−1)mc²`, `relativisticMomentum(mass, vOverC)` = `γmv`, `photonMomentum(energy)` = `E/c`, `massEnergyEquivalent(energy)` = `E/c²`. Unit-tested, with a documented unit convention (natural units `c=1` for diagram math; SI helper for "tiny mass, huge energy" readouts).

### D5 — Placement & bridge (locked)
**Chapter 9 "Mass is energy (E=mc²)"** in the locked v1.0 map (Option C; see `reorder-chapters-and-route-scheme`) — the last flat-spacetime chapter, immediately after "The twin paradox" (8) and before "Rolling the diagram" (10). The outro bridges to GR: mass and energy are one thing, and that is what curves spacetime, making `E=mc²` the hinge between the SR and GR halves of the journey. Renumbering and the route scheme are handled by `reorder-chapters-and-route-scheme`, which lands first.

### D6 — Dependencies
The core spine (speed budget → light momentum → photon-in-a-box) depends only on the `@lm/physics` helpers added in this change (`photonMomentum`, `massEnergyEquivalent`, the energy helpers). There is **no hard dependency** on the other new-chapter changes. The optional two-flash Doppler aside, if built, reuses the relativistic Doppler helper from `physics-accuracy-pass`.

## Risks / Trade-offs

- **[Derivations can slip into algebra]** → Keep each to a guided animation with at most one or two inline formulas; the speed-budget framing carries the intuition.
- **[Center-of-mass argument is subtle]** → Use the box visual to make "the light moved mass across" literal; narrate the COM-stays-put constraint plainly.
- **["Tiny mass, huge energy" can mislead toward bombs-only]** → Frame `c²` as a conversion factor and give a balanced example (the Sun shining) alongside any nuclear mention.
- **[Exact Epstein derivation details]** → Verify figures/steps against `docs/resources/` during implementation.

## Open Questions

- Epstein's two derivations are now confirmed from the book (conveyor belt + moving mirror). Decision: feature the cleaner photon-in-a-box as the primary derivation; confirm whether to also include the belt and/or mirror as optional asides for Epstein fidelity.
- Placement is locked: Chapter 9 (see `reorder-chapters-and-route-scheme`).
- How much, if any, inline math to show versus pure animation — settle in implementation/user testing.
