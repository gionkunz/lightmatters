## Why

Chapter 7 ends with escape velocity and explicitly bridges to the next regime: around ordinary mass like Earth, light's deflection is barely visible, but in **extreme** gravity a beam visibly **bends** instead of passing straight through. Readers who followed the gravity-well model still lack the founder's central light-bending intuition — a wide beam skimming a massive body, outer and inner edges on unequal spatial paths, yet arriving **synchronized** because gravitational time dilation slows the inner edge. Chapter 8 delivers that arc: from a single deflected ray, through the path-length puzzle, to the payoff that light is not pulled by a force but follows straight geodesics on curved spacetime.

## What Changes

- Extend **`@lm/physics`** with pedagogical light-geodesic sampling on the gravity-well surface: single-ray and dual-edge (beam) paths, arc-length comparison helpers, and gravitational time-dilation factor vs well depth (pure functions, unit-tested).
- Extend **`lm-curved-surface`** with light-beam rendering on the well profile: one or two accent geodesics (inner/outer beam edges), optional beam fill band, deep-well depth preset distinct from Chapter 7's Earth-scale well, and timeline targets for beam progress and reveal.
- Add feature lib **`@lm/feature-chapter-08-light-bending`** with **seven** authored steps at `/ch/08/step/{1..7}`.
- Replace the `/ch/08` placeholder with lazy-loaded Chapter 8 routes; add a forward-nav placeholder for whatever chapter follows (same pattern as Ch 6→7→8).
- Update `docs/product.md` with the canonical Chapter 8 step list.

**Pedagogical arc (seven steps):**

1. **Step 1 — The deep well.** Bridge from Chapter 7: Earth's gravity barely bends light. Introduce a **deep** well and massive body — the regime where deflection is visible.
2. **Step 2 — One ray.** A single light ray passes near the mass; animate its geodesic across the well surface with visible deflection.
3. **Step 3 — Widen the beam.** Expand from one ray to a **wide beam** — inner and outer edges both bend, the whole band curves together.
4. **Step 4 — The path puzzle.** Compare spatial path lengths: the outer edge travels farther than the inner. Pose the question: how can both edges arrive at the same time without the outer edge exceeding *c*?
5. **Step 5 — Time runs slower inside.** Introduce gravitational time dilation on the inner edge — deeper in the well, more dilation; connect to the speed-budget vocabulary from Chapter 2.
6. **Step 6 — Synchronized arrival.** Both edges reach the target together; narration resolves the puzzle — dilation compensates for the shorter inner spatial path.
7. **Step 7 — Straight lines, curved canvas.** Payoff: light is not yanked by a force; it follows straight geodesics on curved spacetime. Optional interactive miss-distance or beam-width control; outro opens toward future chapters (black holes, horizons).

**Non-goals for this change:** full numerical GR ray tracing or Einstein-ring lensing math; black-hole event horizons; `bind`/`trigger` timeline wiring for exploration sliders (component-local control + timeline handoff); shared WebGL context across steps; spacetime-diagram overlay as the primary visualization (well + beam geodesics are the hero).

## Capabilities

### New Capabilities

- `chapter-08-step-01`: The deep well — Ch 7 bridge, deep-well preset, massive body; no beam yet.
- `chapter-08-step-02`: One ray — single light geodesic deflection animation on the well.
- `chapter-08-step-03`: Widen the beam — dual-edge beam geodesics, visible band curvature.
- `chapter-08-step-04`: The path puzzle — arc-length comparison, unanswered synchronization question.
- `chapter-08-step-05`: Time runs slower inside — gravitational time-dilation readout on inner vs outer edge.
- `chapter-08-step-06`: Synchronized arrival — both edges reach target; puzzle resolved in narration.
- `chapter-08-step-07`: Straight lines, curved canvas — geodesic payoff, optional exploration, chapter outro.

### Modified Capabilities

- `curved-surface`: Add deep-well depth preset, light-beam geodesic rendering (single ray, dual edges, optional fill), and timeline targets for beam progress.
- `physics`: Add well-surface light geodesic sampling, beam edge parametrization, path-length helpers, and gravitational time-dilation factor vs well depth.

## Impact

- **Updated library:** `libs/physics/` — new light-bending helpers (extend or sibling to `gravity-well.ts`) + tests.
- **Updated primitive:** `libs/primitives/curved-surface/` — beam geodesic overlays, deep-well params, new timeline targets.
- **New feature lib:** `libs/features/chapter-08-light-bending/`.
- **Routing:** `apps/lightmatters/src/app/app.routes.ts` — lazy-load Chapter 8 feature; delete `Chapter08PlaceholderComponent`; add next-chapter placeholder for Step 7 forward nav.
- **Landing data:** update chapter index / `chapterFirstStepHref` when chapter is live.
- **Docs:** `docs/product.md` Chapter 8 step breakdown; `AGENTS.md` project state.
