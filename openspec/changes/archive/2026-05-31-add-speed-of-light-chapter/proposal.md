## Why

The journey jumps from "what is spacetime" (Ch1) straight to "you always move through spacetime at the speed of light" (Ch2, the speed budget) without ever establishing **what that speed actually is, why it is special, or what light even is**. `c` is the central character of the whole product, yet it currently arrives unintroduced. A dedicated chapter makes `c` tangible (laps around the Earth, Earth→Moon, Sun→Earth), reframes it as the **limit of causality**, plants the "light has no time" intuition the speed budget then derives geometrically, and shows — twice, two independent ways — that the number is real: a hands-on flash-and-detect experiment, and Maxwell's `c = 1/√(ε₀μ₀)`. This gives every later SR chapter (constancy of `c`, dilation, Doppler, twins, `E=mc²`) a foundation it can lean on.

## What Changes

- **New chapter: "The speed of light"** inserted as **Chapter 2** (after "Position, time, spacetime", before "The speed budget"), ~6 steps:
  - **Step 1 — How fast is light?** Make `c` tangible: ≈300,000 km/s ≈ 7.5 laps around the Earth every second; ≈1.3 s Earth→Moon; ≈8 min 20 s Sun→Earth. A number you can *feel*.
  - **Step 2 — The cosmic speed limit.** `c` is not just light's speed — it is the speed limit of **cause and effect**. Nothing (no object, no signal, no influence) outruns it; the light cone is the boundary of what can affect what. The speed of information.
  - **Step 3 — Light has no time.** Because light spends its entire speed budget on space, it spends *none* on time: from a photon's own perspective, emission and absorption 13.8 billion years apart happen in a single instant. (Qualitative here; the speed budget chapter derives it.)
  - **Step 4 — Measuring `c` by hand.** Two stations 1 km apart with synchronized clocks; one emits a flash, the other detects it and stops its clock; `c = distance / time`. Simple, concrete, believable.
  - **Step 5 — What light *is*: a self-propagating wave.** An electromagnetic wave: perpendicular, phase-locked electric and magnetic fields. A changing electric field induces a magnetic field, whose change induces an electric field — the wave carries itself forward (Maxwell).
  - **Step 6 — Measuring `c` from Maxwell.** From the electric constant `ε₀` and magnetic constant `μ₀`, the self-propagating wave's speed is `c = 1/√(ε₀μ₀)` — the *same* number the flash experiment measured. Two roads, one speed. Outro bridges to the speed budget (now Ch3).
- **Renumber the journey map:** insert at position 2 and shift every later chapter +1 (speed budget 2→3, light & information 3→4, … light bending 12→13; chapter-13 placeholder → 14). The SR block becomes chapters 1–10, the GR block 11–13.
- **Physics helpers** in `@lm/physics`: tangible `c` readouts (light-travel time for a given distance, Earth-laps-per-second), the flash-experiment relation (`c` from distance & elapsed time), and Maxwell's `c = 1/√(ε₀μ₀)` from the electromagnetic constants.

## Capabilities

### New Capabilities
- `chapter-speed-of-light`: The "speed of light" chapter — tangible `c`, the causal speed limit, light's timelessness, the flash-and-detect measurement, the self-propagating EM wave, and Maxwell's `c = 1/√(ε₀μ₀)`; narration constraints, the EM-wave visual, interactions, and navigation.

### Modified Capabilities
- `chapter-routing`: The locked v1.0 numbering requirement changes — a 13-chapter map with "The speed of light" at position 2 and all subsequent chapters shifted +1 (SR 1–10, GR 11–13). Route mounts, registry, prerender, and SEO follow the new numbers.
- `physics`: Add pure helpers for tangible-`c` readouts, the distance/time flash-experiment relation, and `c` from `ε₀`/`μ₀`.

## Impact

- **One new feature lib** (`libs/features/chapter-02-speed-of-light`, exporting `chapter02SpeedOfLightRoutes` + `CHAPTER_02_SPEED_OF_LIGHT_STEPS`), registered in `app.routes.ts`, `apps/lightmatters/src/app/site-routes.ts`, the chapter registry, and the landing/chapter-index lists.
- **Route renumber cascade** in `app.routes.ts` and `site-routes.ts`: existing `/chapter/N` (N≥2) shift up by one. Feature lib *folder names* are historical and stay as-is (the route→lib mapping already decouples them, as with `chapter-05-doppler-seeing-motion` mounted at `/chapter/7`); only the mount numbers change.
- **Reuses existing primitives:** `lm-light-scene` (expanding pulse for tangible `c` and the flash experiment) and `spacetime-diagram` (light cone for the causal-limit step). A new EM-wave visual (perpendicular oscillating E/B field curves) is introduced for Step 5 — step-local first, promotable to an `em-wave` primitive if reused.
- **`@lm/physics`** gains tangible-`c`, flash-experiment, and Maxwell-`c` helpers with unit tests.
- **Docs:** `docs/product.md` and `docs/architecture.md` journey-map sections updated to the 13-chapter order.
- **No engine/timeline-schema changes.**
- **Out of scope:** the ether history and Michelson–Morley (stays in "The ether was wrong"); the geometric derivation of light's timelessness (stays in the speed budget); constancy of `c` for all observers (stays in "The same speed of light").
