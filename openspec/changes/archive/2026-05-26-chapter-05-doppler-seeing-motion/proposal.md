## Why

Chapter 4 established that light propagates at $c$ from its emission point and does not inherit source velocity. Chapter 5 builds on that: when a source moves, wavefront spacing changes and an observer hears a different tick rhythm — Doppler shift, time dilation, and the visual experience of relativistic motion, all on the same `lm-light-scene` primitive.

## What Changes

- Replace the `/ch/05` placeholder with a real feature lib `@lm/feature-chapter-05-doppler-seeing-motion` and five authored steps.
- Extend `@lm/physics` with periodic-emission and pulse-arrival helpers for Doppler tick math.
- Wire lazy routes `/ch/05/step/{1..5}`; Step 5 forwards to a Chapter 6 placeholder.
- Update `docs/product.md` with the canonical step list for Chapter 5.

**Non-goals for this change:** aberration ("rain on the windshield"), spacetime-diagram return (Chapter 6), colour-coded red/blue wavelength rendering, audio tick sounds.

## Capabilities

### New Capabilities

- `chapter-05-step-01`: Each pulse is a tick — stationary source, periodic pulses, arrival counting.
- `chapter-05-step-02`: Receding redshift — source at $0.5\,c$ away; wider mean tick interval.
- `chapter-05-step-03`: Approaching blueshift — source at $0.5\,c$ toward observer; compressed ticks.
- `chapter-05-step-04`: Extreme recession — source at $0.9\,c$ away; nearly frozen tick rhythm.
- `chapter-05-step-05`: Outro — Doppler + time dilation recap; bridge to Chapter 6.

### Modified Capabilities

- `physics`: `buildPeriodicEmissions`, `pulseArrivalSceneTime(s)`, `meanPulseInterval`.
- `app-shell`: Chapter 5 routes resolve to real components; Chapter 6 placeholder route added.

## Impact

- `libs/physics/` — new helpers in `light-scene.ts`.
- New `libs/features/chapter-05-doppler-seeing-motion/`.
- `apps/lightmatters/src/app/app.routes.ts` — replace inline Ch 5 placeholder with lazy feature load.
- `docs/product.md` — Chapter 5 step breakdown.
