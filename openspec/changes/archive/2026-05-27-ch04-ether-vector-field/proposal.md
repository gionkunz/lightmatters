## Why

Chapter 4 Step 2 currently shows a static Michelson–Morley apparatus schematic. That drawing explains *what* was built, but not *why* physicists expected a signal — the intuition that Earth moves through a stationary ether, that motion creates an opposing "ether wind," and that light pulses should be dragged along with a moving source. A vector-field visualization makes the ether picture viscerally obvious before we show why the famous experiment saw nothing.

## What Changes

- **Remove** `LmMichelsonMorleySchematicComponent` and its interferometer SVG from Step 2.
- **Add** a step-local animated **ether vector field** scene for Step 2 with four pedagogical phases driven by the timeline:
  1. **At rest in the ether** — grid markers are dots (no relative motion between frame and medium).
  2. **Moving through the ether** — grid arrows point opposite the frame's velocity (ether resists motion).
  3. **Circular motion** — a red observer dot travels a large circular path; local ether arrows always oppose the dot's instantaneous motion.
  4. **Dragged light (ether prediction)** — pulsed emissions from the moving dot drift forward with the dot's velocity instead of expanding symmetrically at $c$.
- **Add** a fifth phase for the **Michelson–Morley null result** without apparatus art: Earth at distinct orbital positions where ether-wind components along X and Y should differ, expected interference-fringe shift vs observed null — abstract fringe readout, not bench hardware.
- **Rewrite** Step 2 narration and timeline beats to match the new visual arc; keep Steps 1, 3, 4, and 5 structurally intact (Step 4 still debunks ether drag on `lm-light-scene`).
- **Update** `docs/product.md` Chapter 4 Step 2 description.

**Non-goals:** Full Michelson–Morley apparatus animation; making the ether field a cross-chapter reusable primitive (start step-local); changing Step 3–4 light-scene physics (already correct).

## Capabilities

### New Capabilities

- `chapter-04-step-02`: Reworked Step 2 — ether vector field intuition (rest → linear motion → circular motion → dragged-light prediction) followed by Michelson–Morley null-result phase (orbital positions, expected vs observed fringes).

### Modified Capabilities

<!-- No existing openspec requirements for chapter-04-step-02; full ADDED spec. -->

## Impact

- `libs/features/chapter-04-ether-was-wrong/src/lib/steps/` — delete `lm-michelson-morley-schematic.component.ts`; add `lm-ether-field-scene.component.ts` (or equivalent); rewrite `step-02-michelson-morley.ts`, `step-02.component.ts`.
- `libs/physics/` — optional small helpers for ether-wind vector ($-\mathbf{v}_\text{frame}$) and circular-path kinematics (pure functions + tests if non-trivial).
- `docs/product.md` — Step 2 bullet updated to describe vector-field visualization instead of apparatus schematic.
- No routing, step-count, or `lm-light-scene` API changes.
