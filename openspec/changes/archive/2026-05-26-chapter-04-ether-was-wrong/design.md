## Context

Chapter 3 uses `lm-light-scene` with stationary sources and moving observers. Chapter 4's pedagogical pivot requires the opposite emphasis: **moving sources** whose emitted light does not get "dragged along." The primitive currently centers every pulse on the source's rest position (`src.x`, `src.y`), which would incorrectly imply light inherits source motion — exactly the ether intuition we are debunking.

The founder interview names Michelson–Morley as the canonical ether disproof and the moving-source expanding-circle demo as the visual that kills the medium idea. Chapter 5 then reuses moving sources for Doppler; getting emission-origin correct here pays forward.

## Goals / Non-Goals

**Goals:**
- Five Chapter 4 steps on `lm-light-scene` (+ one step-local Michelson–Morley schematic).
- Moving sources: pulse circles centered on `(x₀ + v·t_emit, y₀ + v·t_emit)`, radius `c·(t − t_emit)`.
- Reception math uses emission point as wavefront origin.
- Clear narration arc: ether intuition → null experiment → rest baseline → moving source pivot → outro.

**Non-Goals:**
- Doppler shift visualization (Chapter 5).
- Full Michelson–Morley interferometer animation.
- E/M field oscillation diagram (mention in narration only; defer visual to design-sheet or later).
- Revisiting Chapter 3 step content (deferred per user).

## Decisions

### 1. Extend `LightSceneSource` with optional `velocity`

Mirror the observer pattern. When `velocity` is set:
- **Rendered source dot** moves: `(x + vx·t, y + vy·t)`.
- **Pulse circle center** is frozen at emission position: `(x + vx·t_emit, y + vy·t_emit)`.
- **Reception time** computed from emission position to observer (stationary or moving).

When `velocity` is absent, behavior is unchanged from Chapter 3.

### 2. Michelson–Morley as step-local SVG

A dedicated primitive is overkill for one schematic. Step 2 renders an inline SVG: interferometer arms, expected fringe shift (dashed / ghost), actual null result (aligned fringes). Narration carries the physics; the diagram is illustrative, not interactive.

### 3. Five-step arc

| Step | Title | Visual | Core claim |
|------|-------|--------|------------|
| 1 | The ether | Narration + optional static wave-in-medium metaphor (text) | Sound needs air; people assumed light needs ether |
| 2 | Michelson–Morley | Step-local schematic SVG | Expected signal from Earth's motion through ether; got nothing |
| 3 | Light at rest | `lm-light-scene`, stationary source, one pulse | Baseline: expands at $c$ in all directions |
| 4 | Source moving | `lm-light-scene`, moving source, one pulse | Circle born at emission point, still expands at $c$ — not dragged |
| 5 | Outro | Still frame from Step 4 | Self-propagating wave; $c$ same for everyone; on to Doppler |

Step 4 is the chapter's centerpiece — allocate the longest animate segment and explicit FactLine (`emission point · fixed`, `source · moving`, `pulse speed · always c`).

### 4. Chapter structure mirrors Chapter 3

`libs/features/chapter-04-ether-was-wrong/` with `step-registry.ts`, `step-page.component.ts`, `chapter04.routes.ts`, per-step timeline + component files. `CHAPTER_04_TOTAL_STEPS = 5`.

### 5. Routing

Lazy-load `@lm/feature-chapter-04-ether-was-wrong` at `ch/04`. Remove inline `Chapter04PlaceholderComponent`. Add minimal Ch 5 placeholder at `ch/05/step/1` for Step 5 forward nav (same pattern as Ch 3→4).

## Risks / Trade-offs

- **[Risk] Moving-source pulses look confusing if emission point is not marked** → Mitigation: faint dot or crosshair at emission origin; FactLine shows emission coordinates.
- **[Risk] Step 1–2 feel text-heavy after Ch 3's spatial steps** → Mitigation: keep Step 1 short; Step 2 schematic gives a visual anchor before returning to `lm-light-scene`.
- **[Risk] Breaking existing Ch 3 tests if pulse origin logic changes globally** → Mitigation: only apply emission-origin when `source.velocity` is set; Ch 3 sources have no velocity — zero regression.

## Open Questions

- Should Step 4 include a side-by-side "ether prediction" ghost circle (dragged at $c + v$)? Useful pedagogically but adds visual clutter — defer unless user asks during Ch 3 revisit.
