## Context

Light Matters narrates relativity through Epstein-style geometry. A review of the eight authored chapters against Einstein and Epstein found the special-relativity *core* (speed budget, time dilation, Lorentz factor, signal reception) to be exact and faithful, but several beats elsewhere are quantitatively wrong or conceptually misleading. Crucially, one error is baked into a spec, not just narration: `chapter-04-step-02`'s "Phase 3 — ether-dragged light prediction" requires the visual to show "pulse wavefronts drift with the dot's velocity, conveying that light inherits the source's motion" and to frame this as *the ether prediction*. That is **emission (ballistic) theory**, not the ether. The same conflation propagates into Chapter 4's narration and into how the moving-source demo (Step 4) is used.

This change corrects the misleading physics in place. It is content-and-physics-helper scope only: no new primitives, no engine changes, no new chapters. The product principle "intuition before formalism" does not license teaching something false; the rule for this pass is to make a beat *unambiguously correct only where the current framing is truly false*, and otherwise apply the lightest reframing that removes the false implication.

## Goals / Non-Goals

**Goals:**
- Remove every beat that, taken at face value, teaches a *false* physical claim — specifically the Chapter 8 factor-of-2 and the Chapter 4 ether/emission conflation.
- Close the Chapter 3 simultaneity misconception with one added frame-switch beat.
- Make Chapter 5's Doppler relativistically correct so its time-dilation claim is supported.
- Fix the Chapter 7 wording contradiction.
- De-duplicate the speed-budget introduction across Ch1 S4 and Ch2 S1.
- Make and record the SR-spine ordering decision.

**Non-Goals:**
- No new visual primitives, engine events, controls, or chapters.
- No demonstrated c-invariance step, photon/light-clock step, length contraction, twin paradox, or E=mc² — all deferred to follow-up changes.
- No physical reordering of chapter routes/URLs *within this change* — the locked renumber + `/chapter/...` route rename is handled by the separate `reorder-chapters-and-route-scheme` change (lands after this one). See D7.
- No re-engineering of the Chapter 4 ether vector-field animation; corrections are by reframing the existing visual phases, not rebuilding them.

## Decisions

### D1 — Chapter 8: never attribute the whole bend to time dilation
The famous deflection (1.75″ at the Sun) is *twice* what gravitational time dilation alone gives — Einstein's 1911 result. The other half comes from the curvature of space (1915). The app currently says *"time dilation is what buys the bend"* (Step 6) and resolves the path-puzzle entirely with clocks.

**Decision:** Keep the clock argument as the intuitive mechanism for *why light bends at all and why the band stays square*, but (a) scope the language in Steps 5–6 so it is never stated as the entire cause, and (b) add one honest beat in Step 7 acknowledging that the *full amount* of bending also requires the curvature of space — Einstein needed both halves, and that is why the 1919 eclipse measurement was twice the "naive" value. This is the lightest fix that stops teaching a 2× error; we do not attempt a quantitative derivation.
*Alternative considered:* full quantitative treatment of both contributions — rejected as too complex for v1.0 and against the "intuition first" principle.

### D2 — Chapter 4: separate the ether from emission theory
There are two distinct wrong ideas, each killed by a different demo:
- **Ether (medium) theory** → light travels at `c` relative to the medium; Earth's motion through it should produce an "ether wind." Tested by **Michelson–Morley (observer/Earth motion)** → null.
- **Emission (ballistic) theory** → light inherits the *source's* velocity. Tested by the **moving-source demo (Step 4)** → pulse stays anchored at its birth point.

**Decision:** Reframe so the drifting-wavefront visual in Step 2 Phase 3 represents light **carried by the ether wind** (the medium moving relative to the apparatus), *not* light inheriting the source's velocity. Then the moving-source demo (Step 4) refutes **emission theory** and must **not** be narrated as "why Michelson–Morley saw nothing" or as disproving the ether. The chapter becomes: ether predicts wind-carried light (Step 2) → MM finds no wind (null) → does light instead inherit source speed? (Step 4) → no → therefore `c` is invariant, no medium, no inheritance.
*Alternative considered:* delete the drifting-pulse phase entirely — rejected; reinterpreting it as ether-wind carriage is correct and preserves existing animation work.

### D3 — Chapter 3 Step 4: add the frame-switch beat
Reception order alone is Galilean ("the witness moved"). Relativity of simultaneity requires the moving witness to regard *itself* as at rest and equidistant, and therefore conclude the flashes were genuinely not simultaneous.

**Decision:** Add one narrate beat (and a spec scenario) that performs the frame-switch explicitly. No visual change required. This sits well before the deferred "c is invariant" demonstration; for now the beat asserts the moving observer's equal entitlement to its own rest frame.

### D4 — Chapter 5: relativistic emission intervals
**Decision:** Pulse-train emissions SHALL be spaced by the source's **proper** interval mapped into the scene frame with the γ (time-dilation) factor, so the observed arrival spacing combines time dilation with classical light-travel-time — i.e. the relativistic Doppler factor √((1±β)/(1∓β)), not the bare classical (1±β). Implement as a physics helper (extend `buildPeriodicEmissions` or add a γ-aware variant) so the narration's "this is the time dilation you saw in Chapter 2" claim holds. Covered by unit tests asserting the mean observed interval matches the relativistic factor within tolerance.

### D5 — Chapter 7 Step 2 wording
**Decision:** Felt gravity is tied to the **slope/gradient** of the surface, never its width. The wide flat center is weightless (zero slope); the steep cone flanks are where gravity is felt. Remove/replace any phrasing implying "gravity pulls where the paper is widest."

### D6 — De-duplicate the speed budget (Ch1 S4 vs Ch2 S1)
**Decision:** Chapter 1 Step 4 becomes a *foreshadowing teaser* — it shows the tilting vector and poses the budget idea as a hook, but does not fully unpack pure-time/pure-space extremes. Chapter 2 Step 1 remains the canonical full introduction and may briefly nod to the teaser. This keeps Ch1 as "vocabulary" and Ch2 as "the speed budget," matching the chapter titles.

### D7 — SR-spine ordering (superseded by the locked v1.0 map)
Einstein's logic runs constancy-of-`c` → relativity of simultaneity. This change does not itself reorder chapters; it closes the logical gap with the D3 frame-switch beat plus a concept-level forward reference.

**Update:** the v1.0 journey map is now **locked** (see `reorder-chapters-and-route-scheme`). It keeps "Light and information" at Chapter 3 (where the simultaneity *puzzle* is planted) and adds a dedicated **Chapter 5 "The same speed of light"** that fully *resolves* it (show-the-phenomenon-then-explain). So this change's job here is unchanged — plant the puzzle and forward-reference — but the forward reference is kept **number-agnostic** (the resolution lives in a later chapter) so it survives the renumber. The actual reorder + route rename is handled by `reorder-chapters-and-route-scheme`, which lands after this change.

### D8 — Chapter 6 step-02 numbering
A `chapter-06-step-02` spec exists, but URL step 2 is served by `step-03-cone.ts` (no `step-02` definition file). **Decision:** treat as a verification/cleanup task — confirm routing, registry, and prerender all agree and there is no dead/duplicate spec; only adjust artifacts if a real mismatch is found. No requirement change unless the investigation surfaces one.

## Risks / Trade-offs

- **[Reframing Ch4 Phase 3 visual may read ambiguously]** → The existing animation shows pulses drifting with a moving dot; relabeling that drift as "ether wind carriage" rather than "source inheritance" relies on narration. Mitigation: ensure the narrate beat explicitly attributes the drift to the *medium/wind*, and keep the moving-*source* contrast in Step 4 visually distinct (birth-point anchoring) so the two threads don't blur.
- **[Ch8 caveat could feel like a let-down after a clean story]** → Mitigation: phrase the space-curvature half as a teaser toward deeper gravity / future chapters, not as an erratum.
- **[Doppler γ change alters on-screen timing/animation durations]** → Mitigation: it is a small numeric change to emission spacing; verify the Ch5 animations still look right and update any hard-coded `scene.time` end values that assumed classical spacing.
- **[De-duping Ch1 S4 weakens its standalone payoff]** → Mitigation: keep the interactive tilting vector and a compelling hook; only trim the explanatory overlap.

## Open Questions

- Ch5: should the relativistic factor be applied so the *source's* emitted rhythm is defined in its proper frame (preferred, matches narration) — confirm there are no steps that intentionally show classical-only Doppler for contrast.
- Ch8 Step 7: exact wording of the space-curvature caveat — to be settled when editing narration, keeping it to one or two sentences.
