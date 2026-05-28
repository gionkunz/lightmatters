## Context

Chapter 2 derives time dilation from Epstein's speed-budget geometry — elegant but abstract. The canonical, concrete derivation (the light clock) and the partner effect (length contraction) are absent. Both follow directly from the single fact that light moves at `c` for everyone, and both reduce to the existing `lorentz(v/c)` already in `@lm/physics`. The engine, narrator, slider control, and spacetime-diagram primitive already support everything needed; the only genuinely new asset is a bouncing-photon visual.

## Goals / Non-Goals

**Goals:**
- Give the speed budget a concrete physical anchor (the light clock) so "moving clocks run slow" is *derived*, not asserted.
- Complete the SR core by adding length contraction with a clean geometric depiction.
- Produce a reusable `lm-light-clock` primitive (the twin-paradox chapter will reuse it).

**Non-Goals:**
- No relativistic-Doppler work (owned by `physics-accuracy-pass`).
- No twin paradox, c-invariance demo, or E=mc² (separate changes).
- No new engine/timeline events; no GSAP-style external animation.

## Decisions

### D1 — One chapter, four steps
Light clock at rest → moving clock (time dilation, `v/c` slider) → length contraction → outro. Keeping the light clock and length contraction in one chapter makes the "two faces of one geometry" point land and keeps v1.0 lean.

### D2 — `lm-light-clock` is a reusable primitive, not step-local
A new `libs/primitives/light-clock` with animatable `velocity` (v/c) and `tick`/`progress`, rendering the vertical bounce at rest and the diagonal bounce when moving, in the project line-art style with theme tokens and glow only on interactive controls. Rationale: the twin-paradox chapter will reuse a moving clock; building it as a primitive now avoids a later rewrite.
*Alternative:* step-local component — rejected for the reuse reason.

### D3 — Length contraction reuses the spacetime diagram
Show contraction geometrically rather than as a literal shrinking stick: a moving object's two edge-worldlines, with the measured length being the spatial slice in the chosen frame — the same projection idea that produces the speed-budget vector. If the existing `spacetime-diagram` variants cannot express this cleanly, add a minimal `length-contraction` variant or a small step-local ruler driven by `v/c`. Decide during implementation against the primitive's current API; prefer reuse.
*Alternative:* a standalone ruler primitive — deferred unless the diagram proves awkward.

### D4 — Physics helpers reduce to existing Lorentz
`lengthContraction(properLength, vOverC) = properLength * properTimeFraction(vOverC)` (i.e. `L₀/γ`), and a light-clock tick-period helper `tickPeriod(restPeriod, vOverC) = restPeriod * lorentz(vOverC)`. Pure functions, unit-tested, no new physics — just named, reusable, and consistent with `lorentz`/`properTimeFraction`.

### D5 — Placement & numbering (locked)
This chapter is **Chapter 6 "Clocks & rulers"** in the locked v1.0 map (Option C; see `reorder-chapters-and-route-scheme` for the full map and route scheme). It sits immediately after **Chapter 5 "The same speed of light"** — the light-clock derivation needs c-invariance as its premise — and delivers the concrete mechanism behind the Chapter 2 speed-budget vector. Earlier drafts placed it at position 3 (right after the speed budget); that was rejected because it would derive the light clock before c-invariance is established. Renumbering of existing chapters and the `/chapter/:chapter/step/:step` route scheme are handled by `reorder-chapters-and-route-scheme`, which lands first; this change then inserts at position 6 without touching numbering.

## Risks / Trade-offs

- **[Light clock looks redundant with the speed budget]** → Frame it as the *concrete mechanism* behind the abstract vector and have the readout reproduce the same Lorentz number, reinforcing rather than repeating.
- **[Renumbering breaks deep links and many cross-references]** → Acceptable pre-launch; do it as a single coordinated pass; update registry, `app.routes.ts`, `app.routes.server.ts`, sitemap/SEO, and inter-chapter narration references together.
- **[Length-contraction-on-diagram may be hard to read]** → Fall back to a small explicit ruler if the diagram projection is unclear in user testing.

## Open Questions

- Placement is locked: Chapter 6 (see `reorder-chapters-and-route-scheme`).
- Does length contraction read better on the spacetime diagram or as a literal contracting ruler? Resolve during implementation/user testing.
