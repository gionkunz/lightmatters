## 1. Chapter 8 — the factor-of-2 (light bending)

- [x] 1.1 Edit `chapter-08-light-bending/.../steps/step-06-synchronized.ts` narration so "time dilation is what buys the bend" is scoped to keeping the wavefront square / contributing to the bend, not the whole cause of the deflection magnitude.
- [x] 1.2 Edit `step-05-time-dilation.ts` narration so the inner/outer clock difference is framed as a contribution, not the sole cause.
- [x] 1.3 Add a brief (1–2 sentence) beat to `step-07-straight-lines.ts` acknowledging that the curvature of space supplies the other half of the deflection — Einstein needed both halves — framed as opening toward deeper geometry, no formula.
- [x] 1.4 Re-read Steps 5–7 end to end to confirm no remaining beat implies time dilation alone gives the full bend.

## 2. Chapter 4 — untangle ether vs emission theory

- [x] 2.1 Edit `chapter-04-ether-was-wrong/.../steps/step-02-michelson-morley.ts`: reframe the "dragged light" beat so the wavefront drift is attributed to the ether **wind** (the medium moving relative to the apparatus), not to light inheriting the source's velocity.
- [x] 2.2 In the same step, ensure no beat states the ether predicts light "inherits / is dragged forward with / leans into" its source; describe the ether prediction as light at `c` relative to the medium, tested by Earth's motion through it.
- [x] 2.3 Edit `step-04-moving-source.ts`: frame the birth-point-anchored pulse as the test of **emission (ballistic) theory**; conclude light does not inherit source velocity.
- [x] 2.4 Remove from `step-04-moving-source.ts` the claim that this demo is "why Michelson and Morley saw nothing" and any implication it disproves a stationary ether; attribute `c`'s constancy to light's nature, noting full frame-invariance is shown later.
- [x] 2.5 Check `step-05-outro.ts` (and Ch4 step 1/3) for any residual ether/emission conflation and align.

## 3. Chapter 3 — relativity of simultaneity frame-switch

- [x] 3.1 Add a narrate beat to `chapter-03-light-information/.../steps/step-04-two-flashes-one-witness.ts` that switches into the moving witness's frame: it considers itself at rest and equidistant, so it concludes the flashes were genuinely not simultaneous.
- [x] 3.2 Ensure narration heads off the "the witness just moved into the flash" misconception and states each observer is equally entitled to its own rest frame.
- [x] 3.3 Add a one-line forward reference (here or in `step-05-outro.ts`) pointing to Chapter 4 for *why* `c` cannot be subtracted out.

## 4. Chapter 5 — relativistic Doppler

- [x] 4.1 Add/extend a `@lm/physics` helper so pulse-train emissions are placed at γ-dilated scene-frame times for a source moving at β (proper emission interval in the source frame).
- [x] 4.2 Add unit tests (`light-scene.spec.ts` or a new spec) asserting mean observed interval matches √((1+β)/(1−β)) for recession and its reciprocal for approach, within tolerance, and differs from the classical (1±β) by γ.
- [x] 4.3 Update Ch5 step components/definitions (`step-01`…`step-04`) to use the relativistic helper; re-tune any hard-coded `scene.time` end values so animations still frame the arrivals correctly.
- [x] 4.4 Verify Ch5 narration's "this is the Chapter 2 time dilation you saw" claim now holds against the model.

## 5. Chapter 7 — wording fix

- [x] 5.1 Edit `chapter-07-gravity-well/.../steps/step-02-piecewise.ts` so felt gravity is tied to the surface **slope/gradient**, never its width; remove/replace "gravity pulls where the paper is widest."
- [x] 5.2 Confirm the wide flat center is consistently described as weightless and no beat contradicts it.

## 6. Chapters 1 & 2 — de-duplicate the speed budget

- [x] 6.1 Edit `chapter-01-position-time/.../steps/step-04-moving-spacetime.ts` so it foreshadows the budget as a teaser/hook and does not fully unpack the pure-time/pure-space extremes.
- [x] 6.2 Confirm `chapter-02-speed-budget/.../steps/step-01-always-at-c.ts` remains the self-contained canonical full introduction (optionally a light nod to the Ch1 teaser).

## 7. SR-spine ordering & Ch6 numbering

- [x] 7.1 Record the D7 decision (keep Ch3 before Ch4 for v1.0; close the gap via the Ch3 frame-switch + forward reference) — verify it is reflected in the narration edits, no route changes.
- [x] 7.2 Investigate the `chapter-06-step-02` numbering: confirm routing, `step-registry`, prerender/sitemap, and the archived spec all agree (URL step 2 ⇄ `step-03-cone.ts`); fix any real mismatch or dead/duplicate spec, otherwise document as intentional.

## 8. Verification

- [x] 8.1 Run `nx affected -t lint test build --tui=false` and fix any failures introduced by the edits.
- [x] 8.2 Manually walk Chapters 3, 4, 5, 7, 8 in the browser to sign off on pacing/feel of the reworded beats.
- [x] 8.3 Run `openspec validate physics-accuracy-pass --strict` and ensure the change is ready to archive.
