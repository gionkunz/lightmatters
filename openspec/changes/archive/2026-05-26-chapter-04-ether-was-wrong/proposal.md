## Why

Chapter 3 established how information travels in space — wavefronts, arrival times, and the relativity of simultaneity — but it left open *why* light always travels at $c$ regardless of who is moving. Before Chapter 5 can use source motion to teach Doppler shift, readers need the ether idea dismantled and replaced with the correct mental model: light is a self-propagating electromagnetic wave that does **not** inherit its source's velocity. Chapter 4 is that detour.

## What Changes

- Replace the `/ch/04` placeholder with a real feature lib `@lm/feature-chapter-04-ether-was-wrong` and five authored steps.
- Extend `lm-light-scene` so **sources** can have uniform velocity; pulse circles expand from the **emission point** (where the source was when the flash left), not from the source's current position.
- Extend `@lm/physics` with emission-position helpers for moving-source reception math.
- Add a step-local Michelson–Morley schematic (inline SVG, not a new primitive) for the null-result thought experiment.
- Wire lazy routes `/ch/04/step/{1..5}`; Step 5 forwards to a Chapter 5 placeholder.
- Update `docs/product.md` with the canonical step list for Chapter 4.

**Non-goals for this change:** Doppler/redshift (Chapter 5), aberration, spacetime-diagram return (Chapter 6), full historical Michelson–Morley apparatus animation.

## Capabilities

### New Capabilities

- `chapter-04-step-01`: The ether — historical intuition that light needs a medium.
- `chapter-04-step-02`: Michelson–Morley — null-result thought experiment, schematic visualization.
- `chapter-04-step-03`: Source at rest — reinforcing pulse-at-$c$ baseline on `lm-light-scene`.
- `chapter-04-step-04`: Moving source — circles expand from emission point at $c$; light does not inherit source velocity.
- `chapter-04-step-05`: Outro — self-propagation, invariant $c$, bridge to Chapter 5.

### Modified Capabilities

- `light-scene`: Sources gain optional uniform velocity; pulse rendering and reception use emission-position origin.
- `physics`: Emission-position helpers for moving-source pulse math.
- `app-shell`: Chapter 4 routes resolve to real components; Chapter 5 placeholder route added.

## Impact

- `libs/primitives/light-scene/` — moving-source pulse origin (breaking change to pulse rendering when `source.velocity` is set; stationary sources unchanged).
- `libs/physics/` — new helpers in `light-scene.ts`.
- New `libs/features/chapter-04-ether-was-wrong/`.
- `apps/lightmatters/src/app/app.routes.ts` — replace inline Ch 4 placeholder with lazy feature load.
- `docs/product.md` — Chapter 4 step breakdown.
