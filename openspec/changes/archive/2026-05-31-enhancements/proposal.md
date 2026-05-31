## Why

A content review of the thirteen-chapter journey (conducted against the live routes, not the docs map) surfaced a cluster of improvements that share one theme: the **conceptual keystones of the journey are under-served relative to the easier ideas**. The two hardest-to-believe results — *the same flash is a sphere centered on every observer* (Ch 6) and *the travelling twin is genuinely younger* (Ch 9) — are delivered as passive movies, while the app's own principle is "show, **then let them play**." The single most mathematically dense beat (the photon-in-a-box derivation, Ch 10) presents finished algebra rather than *animating* the manipulation, which is exactly where this product should shine. And the chapter reorder left every in-narration "Chapter N" cross-reference pointing at the **wrong** chapter, quietly corrupting the guided path.

This change bundles those fixes into one pass: repair the cross-references, build a reusable **animated-derivation** primitive (algebra that moves, cancels, and factors on screen), add **interaction to the keystone chapters**, and close two **vocabulary/framing gaps** (the principle of relativity, the two diagram conventions, and the "two contributors" framing for light bending). It deliberately builds on the already-shipped `physics-accuracy-pass`; it does not re-litigate those corrections.

## What Changes

- **Fix stale chapter cross-references (correctness).** Every "Chapter N" mention in narration currently uses the *pre-reorder* numbering. Examples: Ch 1 S4 "Chapter 2 will unpack the budget" (budget is route **3**); Ch 12 S1 "In Chapter 10 we bent the paper into a cone" (cone is route **11**); Ch 11 S5 "Chapter 11 awaits" for the next chapter (route **12**); Doppler/clock back-references to "Chapter 2" (time dilation is route **7**, speed budget route **3**). Correct all of them to live route numbers and add a **regression guard** so this cannot silently rot again.
- **New `animated-derivation` primitive.** A declarative, timeline-driven way to author formula transformations on the existing MathJax CHTML output, animated with the engine's hand-rolled tween system. Vocabulary: tag tokens, `highlight`, `cancel` (red strike → fade → collapse the gap), `emphasize`, `move/substitute`. **Not** a symbolic-algebra engine — every transformation is author-scripted, the same as any other timeline beat.
- **Apply the derivation primitive to Chapter 10.** Re-author the see-saw derivation (Ch 10 S5: `M·(EL/Mc²) = m·L` → cancel `M` and `L` → `m = E/c²`) as an animated derivation, and add a **"skip the algebra, show the result"** affordance so symbol-averse learners still land on `E = mc²`.
- **Make Chapter 6 (the same speed of light) interactive.** Add a guided-exploration control: drag observer **B's velocity** and watch the wavefront stay centered on whichever observer is treated as at rest. Also **name the principle of relativity** explicitly and **define "frame of reference"** (currently used from Ch 4 onward but never defined).
- **Make Chapter 9 (the twin paradox) interactive.** Add a turnaround-speed dial with live proper-time totals and Doppler pulse counts, turning "B aged 8, A aged 10" from a stated fact into a discovered one.
- **Make Chapter 4 Step 4 (relativity of simultaneity) learner-driven.** Replace the scripted frame-switch reveal with a **frame toggle** the learner flips themselves.
- **Clarify the two diagram conventions.** Add a short beat where the Minkowski worldline diagram (light at 45°) first appears (Ch 9), acknowledging it differs from the Epstein speed-budget diagram (light flat along the space axis) taught in Ch 1–3.
- **Reframe light bending as "two contributors" from the start (Ch 13).** Today the chapter builds the gravitational-time-dilation argument and *then* admits it is only half the deflection. Seed both contributors (time curvature + space curvature) at the chapter opening so the closing beat reads as "here's the other half" rather than "what I told you was half-wrong."

## Capabilities

### New Capabilities
- `animated-derivation`: declarative formula-transformation primitive (token tagging, highlight, cancel/strike-fade, move/substitute) rendered on MathJax CHTML and driven by the timeline + tween engine, with a skip-to-result affordance.
- `narration-cross-references`: in-narration inter-chapter references SHALL resolve to the correct live route numbers, enforced by an automated guard.

### Modified Capabilities
- `chapter-constant-c`: add a guided-exploration interaction (drag B's velocity; wavefront re-centers) and explicitly name the principle of relativity and define "frame of reference."
- `chapter-twin-paradox`: add an interactive turnaround-speed control with live proper-time and Doppler-count readouts, plus a beat clarifying the Minkowski-vs-Epstein diagram convention.
- `chapter-mass-energy`: the see-saw derivation step SHALL use the `animated-derivation` primitive and offer a skip-to-result affordance.
- `chapter-03-step-04`: the relativity-of-simultaneity step SHALL let the learner toggle frames themselves rather than only watching a scripted switch.
- `chapter-08-step-01`: the light-bending opener SHALL introduce that deflection has two contributors (time curvature and space curvature).
- `chapter-08-step-07`: the closing payoff SHALL present the spatial-curvature half as the completion of a structure introduced up front, not a late correction.

## Impact

- **Engine / design:** new `animated-derivation` primitive (likely `libs/design` for rendering + a `derivation` timeline event or bind target in `libs/engine`); reuses `MathJaxService` (CHTML) and the existing tween/easing utilities. No new runtime dependency.
- **Content (narration):** cross-reference number edits across step-definition files in Ch 1, 4, 5, 7, 8, 10, 11, 12, 13; new/edited beats in Ch 6, Ch 9, Ch 4 S4, Ch 13 S1/S7.
- **Interactivity:** new sliders/toggles and registry-bound state in Ch 6, Ch 9, and Ch 4 S4 step components (mirrors the existing `v/c` slider pattern from Ch 1/3/7/10/12).
- **Tests:** unit coverage for the derivation primitive; a cross-reference guard test (scans narration for `Chapter N` and validates against the route map); interaction smoke tests where practical.
- **No breaking changes** to URLs, the timeline schema, or existing primitive APIs. No chapter reordering.
- **Out of scope:** anything already shipped by `physics-accuracy-pass` (factor-of-2 correctness, ether attribution, relativistic Doppler, slope-not-width); new chapters; mobile.
