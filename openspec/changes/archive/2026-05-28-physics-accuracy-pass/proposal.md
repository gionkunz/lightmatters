## Why

The journey is reaching a first stable state, but a review of the narration against Einstein and Epstein turned up several places where the physics, as currently narrated, is either **quantitatively wrong** or **conceptually misleading** — the kind of error a curious reader can later discover and feel betrayed by. The product's promise is "intuition before formalism," not "a clean story that happens to be false." This change is a focused accuracy pass on the existing eight chapters: fix the genuinely-misleading beats, remove a redundant introduction, and resolve the special-relativity logical-spine ordering — **without** adding new primitives, engine features, or chapters (those are deferred to follow-up changes).

The guiding rule for this pass: make a beat unambiguously correct only where the current framing is *truly false*; elsewhere prefer the lightest reframing that removes the false implication while keeping the intuition.

## What Changes

- **Chapter 8 (light bending) — the factor-of-2.** Today the narration says *"time dilation is what buys the bend"* and resolves the path-puzzle entirely with clocks. That reproduces Einstein's 1911 calculation, which gives **half** the measured deflection; the other half comes from the curvature of **space**. Reframe so the app never claims gravitational time dilation accounts for the *whole* bend — present it as "why light bends at all / part of the story," and add one beat acknowledging that the full deflection also requires space curvature.
- **Chapter 4 (the ether) — untangle ether theory from emission theory.** The narration attributes *"light inherits the source's speed, dragged forward with it"* to the ether picture; that is **emission (ballistic) theory**, not the ether. A stationary ether predicts light expands at `c` from its emission point regardless of source motion — which is exactly what the moving-source demo shows, so that demo refutes emission theory, **not** the ether. Correct the attribution and stop claiming the moving-source pulse is "why Michelson–Morley saw nothing." (The real c-invariance demonstration is deferred to a later change.)
- **Chapter 3 Step 4 (relativity of simultaneity) — close the misconception gap.** The moving-witness demo currently shows *arrival order*, which alone is ordinary signal timing ("the witness moved"). Add the frame-switch beat: from the moving witness's own point of view they are at rest and equidistant, so they conclude the flashes were genuinely **not simultaneous**. Without this, the demo teaches the classic wrong lesson.
- **Chapter 5 (Doppler) — relativistic, not classical.** The narration ties the rhythm change to time dilation, but the pulse-train must use the source's **proper** (γ-dilated) emission interval, not equal coordinate-time intervals, or it only shows the classical `(1+β)` light-travel effect and the time-dilation claim is unsupported. Make the physics helpers and Ch5 steps relativistically correct.
- **Chapter 7 Step 2 (the bulge) — fix the contradictory wording.** *"Gravity pulls where the paper is widest"* contradicts Step 4's correct claim that the wide, flat center is **weightless**. Reword so felt gravity is tied to the **slope/gradient** of the surface, not its width.
- **Chapters 1 & 2 — de-duplicate the speed budget.** Chapter 1 Step 4 and Chapter 2 Step 1 both fully introduce the speed budget. Make Ch1 S4 a light foreshadowing teaser; let Ch2 S1 own the canonical introduction.
- **SR-spine ordering decision.** Evaluate whether c-invariance (Ch4) should precede relativity of simultaneity (Ch3). Recommended outcome (to be confirmed in design): **keep the current order** for v1.0 to avoid breaking deep links and many cross-references, and instead close the logical gap with the Ch3 Step 4 frame-switch above plus a forward-reference; document the decision.
- **Chapter 6 numbering check.** Confirm/resolve the `chapter-06-step-02` mismatch (URL step 2 is served by `step-03-cone.ts`; a `chapter-06-step-02` spec exists with no matching definition file).

## Capabilities

### New Capabilities
- `chapter-04-step-04`: Introduce the missing spec for the moving-source step, capturing corrected requirements — the birth-point-anchored pulse refutes emission theory (light does not inherit source velocity) and must NOT be narrated as disproving a stationary ether or as the explanation for the Michelson–Morley null result.

### Modified Capabilities
- `chapter-01-step-04`: Reduce the full speed-budget treatment to a foreshadowing teaser to remove duplication with Chapter 2.
- `chapter-02-step-01`: Own the canonical speed-budget introduction (de-duplicated against Ch1 S4).
- `chapter-03-step-04`: Add a frame-switch requirement so the step teaches relativity of simultaneity (moving observer considers itself at rest and equidistant), not mere reception order.
- `chapter-04-step-02`: Correct the ether framing — distinguish a light-bearing medium (light at `c` relative to the ether) from emission theory; Michelson–Morley tests motion *through* the medium.
- `chapter-07-step-02`: Reword so felt gravity is tied to surface slope, not width, eliminating the contradiction with the weightless wide center.
- `chapter-08-step-05`: Scope the gravitational-time-dilation claim as the clock contribution to bending, not the whole effect.
- `chapter-08-step-06`: Correct "time dilation is what buys the bend" to acknowledge spatial curvature supplies the other half of the deflection (1911 vs 1915 factor-of-2).
- `chapter-08-step-07`: Align the closing payoff with the both-halves picture and the deferred quantitative caveat.
- `physics`: Doppler / pulse-train helpers SHALL model relativistic emission intervals (source proper time, γ-dilated into the scene frame), so observed tick spacing reflects time dilation, not only classical light-travel-time.

## Impact

- **Content (narration) edits** in step-definition files for Ch1 S4, Ch2 S1, Ch3 S4, Ch4 S2 & S4, Ch5 S1–S4, Ch7 S2, Ch8 S5–S7. No route, primitive, or engine changes.
- **Physics library:** `libs/physics/src/lib/light-scene.ts` (and/or a new helper) for γ-dilated pulse-train intervals; possible small touch to Ch5 step components that build emissions. Unit tests updated accordingly.
- **No breaking changes** to URLs, the timeline schema, or public primitive APIs. Visual primitives and the engine are untouched.
- **Specs:** one new step spec (`chapter-04-step-04`) and delta updates to the modified specs listed above.
- **Out of scope (deferred to later changes):** the photon/light-clock step, length contraction, a demonstrated c-invariance step, the twin-paradox payoff, and the matter / E=mc² capstone chapter.
