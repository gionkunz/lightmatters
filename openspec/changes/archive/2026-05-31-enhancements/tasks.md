## 1. Cross-reference repair (low-risk, do first)

- [x] 1.1 Build the canonical `{ topic/chapter → live route number }` source of truth from the existing route registry / `*_ROUTE_NUMBER` constants (no duplicated numbers in tests)
- [x] 1.2 Correct every stale "Chapter N" reference in narration to the live route number (Ch 1 S4 budget→3; Ch 4 S4/S5; Ch 5 S3/S5; Ch 7 S2; Ch 8 S2/S3/S5; Ch 10 S1/S6; Ch 11 S5; Ch 12 S1/S6; Ch 13 S1/S6) — prefer concept-based phrasing where it reads naturally
- [x] 1.3 Add a Jest guard test that scans all narrate `text` fields for `Chapter\s+(\d+)`, fails on out-of-range numbers (not 1–13), and checks known topic references against the route map
- [x] 1.4 Run the guard and `nx affected -t test lint --tui=false`; fix any flagged strings

## 2. `animated-derivation` primitive

- [x] 2.1 Create `lm-derivation` component in `libs/design` accepting `frames: { latex: string; cancel?: string[] }[]` and a fractional playhead input
- [x] 2.2 Typeset frames via `MathJaxService` (CHTML); query `\cssId`-tagged token nodes after each typeset (no cross-frame node caching)
- [x] 2.3 Implement FLIP transitions between frames keyed by author token id (shared = move, removed = exit, new = enter)
- [x] 2.4 Implement the `cancel` effect: tint accent-red → strike → fade → collapse gap, using the existing hand-rolled easing utilities
- [x] 2.5 Reserve layout space for the widest frame; render first frame statically for prerender/SSG and start motion only on client hydration
- [x] 2.6 Wire the playhead so a step can drive it via a `derivation.frame` `TargetRegistry` target + an `animate` event (no new timeline event type); ensure skip/seek lands on the final frame
- [x] 2.7 Unit tests: frame rendering, token move/enter/exit, cancellation, skip-to-result, prerender no-op
- [x] 2.8 Export from `libs/design` public API

## 3. Apply derivation to Chapter 10 (Mass is energy), Step 5

- [x] 3.1 Author the see-saw cancellation as derivation frames (`M·EL/Mc² = m·L` → cancel `M`, `L` → `m = E/c²`) with tagged tokens
- [x] 3.2 Replace the static formula presentation in Ch 10 S5 with the `lm-derivation` driven by the timeline
- [x] 3.3 Add the skip-to-result affordance (reuse playback transport per design D3/open question) and verify forward progress is not gated on the animation
- [x] 3.4 Verify against `chapter-mass-energy` scenarios (moments balance, cancellation animated, skip lands on result)

## 4. Chapter 6 (The same speed of light) — interactivity + framing

- [x] 4.1 Register a `B.vOverC` target and add the glowing velocity slider (mirror the Ch 1/3 `v/c` pattern), unlocked at `atExplorationWait`
- [x] 4.2 Re-center the wavefront on the adopted at-rest observer as B's velocity changes, in real time (no playback required)
- [x] 4.3 Add narrate beat naming the **principle of relativity** as the justification for B also measuring a centered sphere
- [x] 4.4 Add a plain-language **frame-of-reference** definition at/before first frame-switch reliance (this chapter, or earlier if it reads better)
- [x] 4.5 Verify against `chapter-constant-c` added scenarios

## 5. Chapter 9 (Twin paradox) — interactivity + diagram convention

- [x] 5.1 Register a `turnaround.vOverC` target; add the glowing speed slider with live proper-time totals and age-difference readout
- [x] 5.2 Keep the Doppler pulse counts consistent with the live proper-time totals as speed changes
- [x] 5.3 Add the brief beat distinguishing the Minkowski worldline diagram (light at 45°) from the Epstein speed-budget diagram (light along the space axis)
- [x] 5.4 Verify against `chapter-twin-paradox` added scenarios

## 6. Chapter 4 Step 4 — learner-driven simultaneity

- [x] 6.1 Register a `witness.frame` target; add a glowing frame toggle (ground ↔ witness rest frame) unlocked at `atExplorationWait`
- [x] 6.2 In the witness frame, render the witness at rest and equidistant with the flashes non-simultaneous; in ground frame, the moving witness with asymmetric arrival
- [x] 6.3 Ensure the toggle does not gate forward navigation
- [x] 6.4 Verify against `chapter-03-step-04` added scenarios

## 7. Chapter 13 (Light bending) — two-contributor reframe

- [x] 7.1 Add the opening beat in Ch 13 S1 introducing both contributors (time curvature + space curvature) and framing the chapter as showing the clock half
- [x] 7.2 Reword Ch 13 S7's spatial-curvature beat to read as completing the promised structure, not a correction
- [x] 7.3 Verify against `chapter-08-step-01` (new) and `chapter-08-step-07` (modified) scenarios

## 8. Validation & wrap-up

- [x] 8.1 `nx affected -t lint test build --tui=false` clean
- [x] 8.2 Manual pass of the touched steps (Ch 4 S4, Ch 6, Ch 9, Ch 10 S5, Ch 13 S1/S7) for feel and no layout shift
- [x] 8.3 `openspec validate enhancements`; update any spec Purpose/`TBD` notes touched
- [x] 8.4 Archive the change once implemented and verified
