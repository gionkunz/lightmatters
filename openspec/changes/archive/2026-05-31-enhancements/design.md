## Context

The journey runs on a declarative `TimelineRunner` (events: `narrate`, `animate`, `wait`, `sound`) plus a `TargetRegistry` of named numeric properties that `animate` tweens and step components read as signals. Interactive steps register a target (e.g. `scene.time`, `v/c`), expose a slider bound to it, and unlock the slider at the `atExplorationWait` boundary. Math already renders through `MathJaxService`, which lazy-loads MathJax **CHTML** (`tex-chtml-nofont.js`) and typesets `$...$` segments as a DOM tree of per-glyph `<mjx-*>` elements. Tweening is hand-rolled (no GSAP). Builds are SSG/prerendered, so any new visual must degrade gracefully when MathJax is unavailable at prerender time (the narrator already handles this).

This change is cross-cutting (new primitive + engine touch + content edits across many chapters), so the decisions below fix the integration seams before implementation.

## Goals / Non-Goals

**Goals:**
- A reusable `animated-derivation` primitive that animates author-scripted formula transformations (highlight, cancel, move/substitute) on the existing MathJax CHTML output, driven by the existing timeline/tween system.
- Add guided-exploration interaction to the two passive keystones (Ch 6 c-invariance, Ch 9 twin paradox) and make Ch 4 S4 learner-driven — all reusing the established registry+slider pattern, with **no engine event-type change required for interactivity**.
- Repair every stale inter-chapter narration reference and prevent regression with an automated guard.
- Close the three framing/vocabulary gaps (principle of relativity + frame definition; two diagram conventions; light-bending "two contributors") as content edits.

**Non-Goals:**
- A symbolic algebra / CAS engine. Transformations are 100% author-scripted; the system never *computes* a simplification.
- Auto-matching tokens between arbitrary LaTeX strings (manim `TransformMatchingTex`). Token identity is author-declared.
- Re-opening anything shipped by `physics-accuracy-pass`. No chapter reordering. No mobile work.

## Decisions

### D1 — Derivation is a component primitive driven by a registry target, not a new timeline event

`lm-derivation` (in `libs/design`) renders an ordered array of **frames**; the step registers a `derivation.frame` numeric target and drives it with the **existing `animate` event** (e.g. `animate derivation.frame 0 → 1`). The component interpolates the visual transition for the fractional value between integer frames.

- *Why:* zero engine schema change, reuses checkpoint/seek/skip/`atExplorationWait` for free, matches the `scene.time` pattern authors already know. Skip lands on the final frame's `to` value (already guaranteed by the runner's "skip preserves final animation values").
- *Alternative rejected:* a bespoke `derivation` timeline event. More expressive but duplicates playhead/seek logic the runner already owns, and fragments the authoring model.

### D2 — Token identity is author-declared via tagged LaTeX, animated FLIP-style

Each frame is a LaTeX string whose animatable atoms are wrapped with stable IDs using MathJax's `\cssId{tok-M}{M}` (CHTML preserves these as addressable DOM nodes). The component diffs consecutive frames by token ID: shared IDs **move** (FLIP — measure first/last rects, tween transform), removed IDs **exit**, new IDs **enter**. A `cancel` annotation marks IDs that exit via the signature effect: turn accent-red → draw a strike → fade → collapse the surrounding gap.

- *Why:* gives the "L cancels on both sides" feel the product wants, with full author control and no glyph-matching heuristics. CHTML (already configured) exposes the per-token DOM that SVG output would make harder to address.
- *Alternative rejected:* re-typeset every frame and crossfade whole expressions — loses the per-token motion that is the entire point.

### D3 — Authoring shape

A derivation is authored as plain data next to the step timeline:
```
{ frames: [
    { latex: '\\cssId{M}{M}\\cdot\\frac{EL}{\\cssId{Mc2}{Mc^2}} = m\\cdot \\cssId{L}{L}',
      annotate: [{ cancel: ['M'] }, { cancel: ['L'] }] },
    { latex: 'm = \\frac{E}{c^2}' },
] }
```
The skip-to-result affordance simply seeks `derivation.frame` to its max (reusing checkpoint seek). No new control type.

### D4 — Cross-reference fix uses a single route-map source of truth + a guard test

Define the canonical `{ topic → live route number }` map once (it already effectively exists via the route registry/`*_ROUTE_NUMBER` constants). Correct the prose, then add a Jest guard that scans all narrate `text` fields for `/Chapter\s+(\d+)/`, and (where a reference is tagged to a known topic) asserts the number matches the route map. This converts a silent rot into a failing test on the next reorder.

- *Trade-off:* fully validating free-text references is undecidable; the guard catches the common "next chapter" / known-topic cases and flags any number outside `1..13`. Good enough to prevent the class of bug we just hit.

### D5 — Interactivity and framing additions are existing-pattern reuse

Ch 6, Ch 9, and Ch 4 S4 register a numeric target (`B.vOverC`, `turnaround.vOverC`, `witness.frame`) and bind a slider/toggle exactly like Ch 1/3/7/10/12. The principle-of-relativity naming, frame-of-reference definition, two-diagram clarification, and light-bending reframe are `narrate` content edits only.

## Risks / Trade-offs

- **MathJax token IDs survive CHTML rebuilds inconsistently** → keep frames small, assign explicit `\cssId`, and re-query nodes after each typeset rather than caching across frames.
- **SSG/prerender has no MathJax** → `lm-derivation` renders its first frame as static typeset-on-hydrate (mirroring the narrator's lazy-math handling); animation is client-only. No layout shift beyond what inline math already causes.
- **FLIP measurement jank on reflow** → measure within a fixed-size container (reserve space for the widest frame) so cancellation collapse animates without reflowing the page.
- **Scope creep across many chapters** → the derivation primitive's *required* first application is Ch 10 S5 only; Ch 10 S2 and Ch 2 S6 are explicitly follow-on (primitive designed to support them, not blocked on them).
- **Guard test false positives on legitimate prose numbers** → only assert on references that match the topic map or fall outside the valid route range; otherwise warn, don't fail.

## Open Questions

- Should the skip-to-result affordance be a visible button in the diagram area or reuse the playback "next checkpoint" control? (Leaning: reuse existing transport; revisit if user testing shows it's undiscoverable.)
- Ch 9 turnaround interactivity: dial the **speed** (fixed distance) or the **turnaround point** (fixed speed)? Speed maps more directly to the proper-time payoff; to be confirmed in the spec.
