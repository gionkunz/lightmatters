## Context

Chapter 1 establishes the vocabulary (position, time, the spacetime diagram). Chapter 2 ("The speed budget") then asserts that *everything moves through spacetime at the speed of light* — but `c` itself has never been introduced: not its magnitude, not why it is a hard limit, not what light physically is. The product principle is "intuition before formalism, show don't tell," yet `c` arrives as a bare premise.

This chapter is the missing on-ramp. It sits between Ch1 and the speed budget so that by the time the learner meets the normalized velocity vector, they already (a) have a felt sense of how fast `c` is, (b) understand it as the limit of causality, (c) have heard that light is timeless, and (d) believe the number because they have seen it measured two independent ways. It reuses primitives that already exist — `lm-light-scene` (expanding pulse) and `spacetime-diagram` (light cone) — and introduces one new step-local visual (the oscillating E/B field wave).

The v1.0 map is currently "locked" at 12 chapters in `chapter-routing`. Inserting here is a deliberate, user-approved change to that lock; the renumber is mechanical because route numbers are already decoupled from feature-lib folder names.

## Goals / Non-Goals

**Goals:**
- Make `c` *tangible* with everyday comparisons (Earth laps/second, Earth→Moon, Sun→Earth) rather than a bare "300,000 km/s".
- Frame `c` as the **causal** speed limit (speed of information / cause-and-effect), using the light cone as the boundary of influence.
- Plant the "light has no time" intuition qualitatively, set up for the speed budget's geometric derivation.
- Show `c` is real via **two independent measurements**: a hands-on flash-and-detect experiment, and Maxwell's `c = 1/√(ε₀μ₀)`.
- Explain what light *is* — a self-propagating EM wave (perpendicular, phase-locked E and B fields).
- Keep new physics in `@lm/physics` as pure, unit-tested functions.

**Non-Goals:**
- No relativity of `c` (every observer measures the same `c`) — that is Chapter "The same speed of light".
- No ether history / Michelson–Morley — that stays in "The ether was wrong".
- No geometric derivation of light's timelessness — the speed budget owns that; here it is narrated intuition.
- No engine/timeline-schema changes; no full Maxwell-equation algebra on screen.

## Decisions

### D1 — Placement: new Chapter 2 (user-approved)
Insert "The speed of light" between "Position, time, spacetime" (1) and "The speed budget" (now 3). Rationale: `c` is the premise the speed budget rests on; tangible-`c` uses the position+time axes just learned; the light cone introduced here (causal limit) bridges Ch1's diagram into the speed-budget vector. *Alternatives considered:* (a) make it Chapter 1 — rejected, Ch1 is the deliberate gentle vocabulary opener and `c` reads better once "position" and "time" exist; (b) fold beats into existing chapters — rejected, they form one coherent arc and dilute their hosts.

### D2 — Renumber cascade (13-chapter map)
Inserting at 2 shifts every later chapter +1:

| New # | Chapter | Old # |
|------|---------|-------|
| 1 | Position, time, spacetime | 1 |
| **2** | **The speed of light** | **(new)** |
| 3 | The speed budget | 2 |
| 4 | Light and information | 3 |
| 5 | The ether was wrong | 4 |
| 6 | The same speed of light | 5 |
| 7 | Clocks & rulers | 6 |
| 8 | Doppler and seeing motion | 7 |
| 9 | The twin paradox | 8 |
| 10 | Mass is energy (E=mc²) | 9 |
| 11 | Rolling the diagram | 10 |
| 12 | The center of the Earth | 11 |
| 13 | Light bending around mass | 12 |

SR block = 1–10, GR block = 11–13. Implementation is a single edit pass over `app.routes.ts` (mount paths) and `site-routes.ts` (`CHAPTER_STEP_ROUTES`), plus the chapter-13 placeholder → 14. **Feature-lib folder names do not change** — the route→lib decoupling is already established (`chapter-05-doppler-seeing-motion` mounts at `/chapter/7`). The new lib folder is `chapter-02-speed-of-light` (numeric collision with `chapter-02-speed-budget` is fine and matches the existing dual `chapter-05-*`/`chapter-06-*`/`chapter-08-*` folders, disambiguated by slug). *Alternative considered:* renaming every lib folder to match — rejected as churny and contrary to the established convention.

### D3 — Reuse primitives; one new step-local visual
- **Step 1 (tangible `c`)** and **Step 4 (flash experiment)** reuse `lm-light-scene`: an expanding pulse / a pulse travelling between two stations.
- **Step 2 (causal limit)** reuses `spacetime-diagram`: the light cone as the boundary of reachable events; worldlines steeper than the cone are forbidden.
- **Step 5 (EM wave)** introduces a new **step-local** visual: two perpendicular, phase-locked sinusoids (E in one plane, B in the orthogonal plane) propagating along an axis, with the "changing E → B → E" induction narrated. Built step-local first (like the Michelson–Morley schematic). If a later chapter reuses it, promote to an `em-wave` primitive. *Alternative considered:* building a full `em-wave` primitive now — deferred (YAGNI; one consumer).

### D4 — Tangible-`c` numbers and physics helpers
All numbers derive from `c ≈ 299,792.458 km/s` (define a single `SPEED_OF_LIGHT_KMS` constant; reuse the existing value behind `spatialSpeedKms` if present). Add pure helpers:
- `lightTravelTimeSeconds(distanceKm)` → `distanceKm / c`. Drives Earth→Moon (≈384,400 km ≈ 1.28 s) and Sun→Earth (≈149.6e6 km ≈ 499 s ≈ 8 min 19 s) readouts.
- `earthLapsPerSecond()` → `c / earthCircumferenceKm` (≈7.48). Drives the "7.5 laps a second" beat.
- `speedFromFlight(distanceKm, seconds)` → `distanceKm / seconds`. The flash-experiment relation (Step 4); feeding 1 km and the measured Δt returns ≈`c`.
- `cFromMaxwellConstants(epsilon0, mu0)` → `1 / Math.sqrt(epsilon0 * mu0)`. With SI `ε₀`, `μ₀` returns ≈`2.998e8 m/s`; convert to km/s to compare with Step 4. Default constants exported so narration and the readout share one source.

Narration may show `$c = 1/\sqrt{\varepsilon_0 \mu_0}$` and `$c = d/t$` as inline LaTeX (MathJax) layered on the visual, per the product's "formula after the picture" rule.

### D5 — Step 3 intuition without contradicting the speed budget
"Light has no time" is stated as a *consequence to come*: light spends 100% of its spacetime speed on space, so zero on time; therefore a photon's emission and absorption — however many billions of years apart in our frame — are one instant in its own. Narrate it as a teaser the speed budget will *prove*, so the two chapters reinforce rather than duplicate. Avoid asserting a photon "has a valid rest frame" (it does not); phrase as the `v→c` limit of proper time → 0.

### D6 — Navigation wiring
Forward/back transport per the renumbered map: Ch1 final step → Ch2 step 1; Ch2 outro (step 6) → Ch3 (speed budget) step 1; Ch3 step 1 back → Ch2 step 6. All other adjacent links shift with the renumber. Use the existing chapter step-page/registry pattern (`chapter-steps.ts`, `chapterNN.routes.ts`, `step-registry.ts`).

## Risks / Trade-offs

- **[Breaking the "locked" 12-chapter map mid-flight]** → User-approved; capture the full new ordering in `chapter-routing` (single source of truth) and the docs in the same change so nothing drifts. The renumber is mechanical and covered by existing routing scenarios.
- **[Renumber misses a reference]** → `site-routes.ts` + `app.routes.ts` are the only numbered route sources; the registry and SEO read from `site-routes.ts`. Grep for `/chapter/` literals and run the build's prerender enumeration to confirm 13 chapters resolve.
- **[Step 3 mis-teaching "photon rest frame"]** → Frame strictly as the `v→c` proper-time limit and a teaser for the speed budget; no claim of a physical photon frame.
- **[EM-wave visual scope creep]** → Keep it step-local and qualitative (two phase-locked sinusoids + induction narration); resist building a general field primitive until a second consumer exists.
- **[Overlap with Ch4 "Light and information" / Ch5 "ether"]** → This chapter owns *what light is* (EM wave) and *how fast / how measured*; the ether chapter keeps the *history*; "Light and information" keeps wavefronts-as-news. Narration cross-references rather than repeats.

## Open Questions

- Should Step 5's EM-wave be 2D SVG (cheaper, matches linework) or a small Three.js scene (true 3D perpendicularity)? Lean 2D SVG first; decide in implementation.
- Exact tangible comparisons to feature in Step 1 (Earth laps + Moon + Sun are locked; "across a room in ~nanoseconds" optional) — finalize during authoring.
