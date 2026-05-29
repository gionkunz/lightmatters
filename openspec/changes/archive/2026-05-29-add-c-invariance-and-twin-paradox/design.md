## Context

Time dilation is introduced geometrically in Ch2 (the speed budget), and Ch3 ("Light and information") plants the relativity-of-simultaneity puzzle (sharpened by `physics-accuracy-pass`). But the *foundation* — that every inertial observer measures light at the same `c` — is only asserted, and the *capstone* — the twin paradox — is unbuilt. "The same speed of light" (Ch5) makes c-invariance the explicit foundation: it resolves the Ch3 simultaneity puzzle and *forces* the dilation/contraction that the light clock (Ch6) then makes concrete. These are the two beats most expected of any relativity course and the two with the cleanest geometric demonstrations.

## Goals / Non-Goals

**Goals:**
- *Demonstrate* (not assert) that `c` is the same in every inertial frame, via the light-sphere / frame-switch argument — and show that this *forces* time dilation and length contraction (made concrete by the light clock in the next chapter).
- Deliver the twin paradox as a worldline payoff, with the asymmetry resolution and a concrete Doppler-counting view.
- Add a reusable proper-time-along-worldline helper.

**Non-Goals:**
- No Lorentz-transformation algebra on screen; the demonstration is geometric and visual.
- No length-contraction/light-clock build here (separate change; this one depends on it for the twin Doppler view).
- No engine/timeline changes; no E=mc².

## Decisions

### D1 — "The same speed of light": the light-sphere frame switch
Use Einstein's light-sphere argument. A flash occurs when observer A (ground) and observer B (moving at `v`) coincide. Step through:
1. Ground frame: wavefront is a circle centered on the emission point; A is at its center, B drifts off-center.
2. Pose the puzzle: B seems off-center, so shouldn't B measure a different speed in different directions?
3. Switch to B's frame (re-derive the scene with B at rest): the wavefront is centered on B too, expanding at `c`. The only way both centerings can hold is if space and time re-slice for B — moving clocks run slow, moving rulers shrink, and "now" differs. The chapter *forces* these consequences (resolving the Ch3 simultaneity puzzle) and hands off to the light clock (next chapter) to make them concrete.

Reuse `lm-light-scene` for the expanding wavefront. The frame switch is implemented by **re-deriving the scene in B's frame** (recompute positions/times), not by a literal Lorentz-boost animation — keep it a clean cut or a guided morph with narration. If a primitive-level "observer frame" option helps, add it additively to `light-scene`; otherwise keep it in the step component.
*Alternative considered:* a full animated Lorentz boost of the grid — rejected as too abstract/algebraic for the audience.

### D2 — Twin paradox: worldlines first, Doppler counting second
On the `spacetime-diagram`, draw the stay-at-home twin's straight (vertical) worldline and the traveller's out-and-back bent worldline. Make the **bend** (turnaround) the visual crux of the asymmetry. Show proper time accumulating along each path; the straight path accumulates the most ("straightest = oldest"). Then add the **Doppler-counting** view (reuse the relativistic Doppler helper and the light clock): each twin sends regular pulses; counting received pulses, and noting that the traveller *sees* the stay-at-home's rate change at turnaround while the stay-at-home sees the change only much later (light delay), resolves who-ages-less concretely.
*Alternative considered:* invoking acceleration/GR as "the resolution" — rejected; the honest SR resolution is the path-dependence of proper time (the turnaround breaks symmetry without needing GR).

### D3 — Proper-time-along-worldline helper
`properTimeAlongWorldline(segments)` where each segment carries a coordinate-time duration and a `v/c`; returns `Σ Δt · √(1 − v²/c²)`. Pure, unit-tested. The straight (v=0) worldline returns the full coordinate time; any bent path with motion returns less, demonstrating the twin result numerically. Reuse `properTimeFraction`.

### D4 — Placement & numbering (locked)
In the locked v1.0 map (Option C; see `reorder-chapters-and-route-scheme`): **"The same speed of light" is Chapter 5** and **"The twin paradox" is Chapter 8**. C-invariance (5) sits after "Light & information" (3) and "The ether was wrong" (4) — it needs the expanding-light-circle primitive from Chapter 3 — and immediately before "Clocks & rulers" (6), whose light-clock derivation depends on it. Rather than placing c-invariance *before* the simultaneity material (the earlier draft, to satisfy `physics-accuracy-pass` D7), Chapter 5 now *resolves* the simultaneity puzzle planted in Chapter 3 (show-the-phenomenon-then-explain). "The twin paradox" (8) sits immediately after Doppler (7), reusing its pulse-counting. Renumbering and the route scheme are handled by `reorder-chapters-and-route-scheme`, which lands first.

### D5 — Dependency on the light-clock change
The twin Doppler-counting view reuses `lm-light-clock` and the relativistic Doppler helper. Recommended landing order: `physics-accuracy-pass` → light-clock change → this change. If this lands first, the Doppler-counting view degrades gracefully to a worldline-only resolution until the helper exists.

## Risks / Trade-offs

- **[Frame switch can feel like a magic cut]** → Narrate the switch explicitly and lean on the just-learned dilation/contraction so the re-centering reads as a consequence, not a trick. Consider a brief morph rather than a hard cut.
- **[Twin paradox commonly mis-taught as "acceleration causes it"]** → Center the resolution on path-dependence of proper time (the bend breaks symmetry); mention acceleration only as what makes the traveller's frame non-inertial, not as a mystical cause.
- **[Cross-change dependency/renumber coordination]** → Land in the recommended order; do one renumber pass; gate the Doppler-counting view on the helper's presence.

## Open Questions

- Positions locked: "The same speed of light" = Chapter 5, "The twin paradox" = Chapter 8 (see `reorder-chapters-and-route-scheme`).
- Should the frame switch be a hard cut or a guided morph? Decide in implementation/user testing.
- Is one combined change acceptable, or would the user prefer "The same speed of light" and "The twin paradox" as two separate changes? (They are independent enough to split if desired.)
