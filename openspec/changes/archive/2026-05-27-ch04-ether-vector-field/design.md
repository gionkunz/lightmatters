## Context

Chapter 4 Step 2 currently renders `LmMichelsonMorleySchematicComponent` — a static SVG of an interferometer with fringe readout. The narration describes split beams and null fringes, but the visual is hardware-centric. The founder's pedagogical intent (and the user's request) is to **feel** the ether first: a stationary medium you move through, wind opposing your motion, and light dragged along — then show why Michelson–Morley expected a signal and saw none.

Steps 3–5 already use `lm-light-scene` to show the *correct* behavior (pulse anchored at emission point). Step 2 must set up the *wrong* ether intuition so Step 4's contrast lands.

Constraints: SVG-first 2D visuals, accent-1 (red) for the moving observer/source, quiet linework for the field grid, timeline-driven phases via `TargetRegistry` + `animate` events, step-local component (not a new Nx primitive lib).

## Goals / Non-Goals

**Goals:**

- Replace the apparatus schematic with an animated ether-field scene that progresses through five timeline-driven phases.
- Make ether-wind direction obvious: field vectors equal $-\mathbf{v}_\text{frame}$ (or $-\mathbf{v}_\text{dot}$ in the circular phase).
- Show ether-dragged light pulses (forward-biased expansion) as the **prediction**, explicitly contrasted later in Step 4.
- End Step 2 with an abstract Michelson–Morley null-result panel: Earth at orbital positions, expected fringe shift along vs across motion, observed null.
- Rewrite narration to match beats; delete the old schematic component.

**Non-Goals:**

- Accurate interferometer optics or arm-length physics.
- Promoting ether-field to a reusable primitive (revisit if Chapter 5 needs it).
- Changing Step 1, 3, 4, or 5 structure beyond minor cross-reference tweaks.
- Side-by-side ether-prediction ghost in Step 4 (already deferred).

## Decisions

### 1. Step-local SVG component: `LmEtherFieldSceneComponent`

**Choice:** Single Angular component in the chapter feature lib, SVG canvas inside `lm-diagram-viewport`, timeline-bound inputs.

**Alternatives considered:**

| Option | Why not |
|--------|---------|
| Extend `lm-light-scene` | Wrong abstraction — ether field is a pedagogical fiction, not wavefront physics |
| New `libs/primitives/ether-field` | Only used in one step; premature extraction |
| WebGL | Overkill for a 2D arrow grid |

**Inputs (timeline targets):**

| Target | Type | Role |
|--------|------|------|
| `ether.phase` | `0 \| 1 \| 2 \| 3 \| 4` | Discrete scene mode (or derived from `elapsedMs` segments) |
| `ether.frameVelocity` | `{ x, y }` | Frame velocity for phases 1–2 (phase 1: `{0,0}`; phase 2: `{vx, 0}`) |
| `ether.orbitAngle` | `number` | Phase 3: angle on circular path (radians) |
| `ether.time` | `number` | Phase 4: elapsed time for pulse expansion + drift |
| `ether.earthOrbitIndex` | `0 \| 1 \| 2 \| 3` | Phase 5: which orbital quadrant to highlight |

Use discrete `narrate` → `animate` segments rather than user drag for this step (contrast with Chapter 2 sliders). Playback transport still works.

### 2. Vector field rendering

**Grid:** ~12×8 evenly spaced sample points in normalized coordinates, mapped to SVG viewBox.

**Per-cell vector:**

- **Phase 0 (rest):** render a dot (r ≈ 2px) at each grid point — zero ether wind.
- **Phases 1–3:** arrow from grid point in direction $\hat{\mathbf{w}} = -\mathbf{v}/|\mathbf{v}|$ with length scaled by $|\mathbf{v}|$ (clamped). In phase 3, $\mathbf{v}$ is the **instantaneous tangential velocity** of the red dot at `orbitAngle`.
- **Styling:** `stroke-ink` at low opacity (~0.35) for field; red dot uses `fill-accent-1` + glow per visual guidelines.

**Arrow geometry:** Reuse the polyline arrowhead pattern from `lm-spacetime-diagram` (short tip lines) — copy the helper locally to avoid coupling primitives.

### 3. Phase-by-phase visual content

| Phase | Title (kicker) | Visual | Narration claim |
|-------|----------------|--------|-----------------|
| 0 | at rest in ether | Dot grid, stationary red frame marker at center | We and the ether share a rest frame — no wind |
| 1 | ether wind | Arrows oppose rightward frame motion | Moving through ether feels a headwind |
| 2 | circular path | Red dot on large circle; field arrows oppose local motion | Wind always pushes back against how you're moving |
| 3 | dragged light | Dot on circle emits periodic pulses; each pulse center drifts with dot velocity while also expanding | Ether says light inherits your velocity |
| 4 | null result | Small Earth-orbit diagram (4 positions); fringe bars "expected shift" vs "observed: null" | Earth's motion through ether should change the signal seasonally — it didn't |

**Phase 3 pulse model (ether fiction):** For each emission at $t_i$, center at $\mathbf{p}_0 + \mathbf{v}\,t$; radius grows at $c$ but center drifts — visually asymmetric forward bulge. This is intentionally **wrong** physics; Step 4 corrects it.

**Phase 4:** Reuse the fringe-bar pattern from the deleted schematic but drop the L-shaped bench. Show Earth as a small circle on an elliptical orbit with velocity arrow; cycle `earthOrbitIndex` through four positions where ether-wind X/Y components differ. Ghost fringe pattern shifts (expected) vs fixed pattern (observed null).

### 4. Timeline structure for Step 2

Replace current four narrate-only beats with a longer arc (~6–7 beats):

1. Narrate: ether as stationary medium → phase 0
2. Narrate: moving through ether → animate `frameVelocity` 0 → `{0.4, 0}` (phase 1)
3. Narrate: circular motion, wind always opposes → animate `orbitAngle` 0 → $2\pi$ (phase 2)
4. Narrate: light dragged along → phase 3; animate `ether.time` 0 → 1
5. Narrate: Michelson–Morley — split paths, different seasons → phase 4; cycle orbit index
6. Narrate: null result, bridge to Step 3
7. `wait` for `userAdvance`

Checkpoint holds align with narrate `pauseAfter` (6500 ms, matching chapter convention).

### 5. Physics helpers (optional, in `@lm/physics`)

Add `etherWindVector(frameVelocity)` → negated velocity, and `circularOrbitVelocity(angle, radius, angularSpeed)` → `{ x, y }`. Keeps component thin and unit-testable. Skip if trivial one-liners inlined.

### 6. Cleanup

- Delete `lm-michelson-morley-schematic.component.ts`.
- Update `step-02.component.ts` imports and right-panel layout to use `lm-diagram-viewport` + `LmEtherFieldSceneComponent` (mirror Step 3 layout pattern).
- Adjust Step 1 closing beat if needed: "First: the experiment that tried to catch Earth moving through the ether" (drop "apparatus" implication).

## Risks / Trade-offs

- **[Risk] Phase 3 dragged-light looks like correct Step 4 behavior** → Mitigation: distinct visual mode (pulses clearly lean forward / center drifts); narration explicitly says "the ether picture predicts…"; kicker "ether prediction".
- **[Risk] Arrow grid is visually busy** → Mitigation: sparse grid, low opacity, fade field during phase 4 orbit panel.
- **[Risk] Step 2 runtime grows long** → Mitigation: keep each animate segment 3–4 s; user can skip via checkpoint transport.
- **[Risk] Fringe readout without apparatus may feel abstract** → Mitigation: label beats "along motion" / "across motion" in mono kicker text; Earth orbit gives spatial anchor.

## Migration Plan

1. Implement `LmEtherFieldSceneComponent` alongside old schematic.
2. Rewire Step 2 component + timeline; verify playback checkpoints.
3. Delete schematic component; run lint/test on chapter-04 feature.
4. Update `docs/product.md` Step 2 bullet.
5. Manual spot-check: all five phases render in light and dark theme.

No routing migration; URLs unchanged.

## Open Questions

- Should phase 3 reuse the circular path from phase 2 or switch to linear motion for clarity? **Default:** stay on circular path — user explicitly requested circular motion.
- Interactive scrub of orbit angle vs fully timeline-driven? **Default:** timeline-driven only for Step 2.
