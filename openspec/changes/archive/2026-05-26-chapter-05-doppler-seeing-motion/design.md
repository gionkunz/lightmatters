# Chapter 5 — Doppler and seeing motion

## Pedagogy

Each step reuses `lm-light-scene` with a **pulse train** from a moving or stationary source. The observer counts **reception events** as clock ticks. The pedagogical arc:

1. Establish ticks (stationary baseline).
2. Recede → spaced wavefronts → slow rhythm (redshift).
3. Approach → compressed wavefronts → fast rhythm (blueshift).
4. Extreme recession → nearly frozen ticks.
5. Outro tying rhythm to Doppler and bridging to curved spacetime (Ch 6).

## Physics

Shared constants in `pulse-train.constants.ts`:

- `CH5_PULSE_INTERVAL = 0.45` (source emission period in scene time)
- `CH5_PULSE_COUNT = 6` (steps 1–3)
- `CH5_OBSERVER_X = -0.55` (observer A fixed left)

Helpers in `@lm/physics/light-scene.ts`:

- `buildPeriodicEmissions(count, interval, startTime?, idPrefix?)`
- `pulseArrivalSceneTime` / `pulseArrivalSceneTimes` — arrival at observer using emission-position + $c$
- `meanPulseInterval(arrivals)` — for FactLine readouts

## Feature layout

`libs/features/chapter-05-doppler-seeing-motion/` with `step-registry.ts`, `step-page.component.ts`, `chapter05.routes.ts`, per-step timeline + component files. `CHAPTER_05_TOTAL_STEPS = 5`.

## Routing

Lazy-load `@lm/feature-chapter-05-doppler-seeing-motion` at `ch/05`. Remove inline `Chapter05PlaceholderComponent`. Add minimal Ch 6 placeholder at `ch/06/step/1` for Step 5 forward nav (same pattern as Ch 4→5).

## Step chrome

- Continue never blocked (`continueDisabled` removed globally).
- Step 5 uses `[hasNextStep]="true"` + `[nextChapter]="true"` for cross-chapter nav.
