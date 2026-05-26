## Context

Chapter 2 ships Steps 1–2. Step 3 is a **bridge** to Chapter 3 (*Light and information*), which will fully explore wavefronts — multiple pulses, irregular arrival rhythms, simultaneity. The bridge shows **one pulse** so the reader meets the visual language without Chapter 3's payoff.

Three observers:

| Observer | Motion | Role |
| -------- | ------ | ---- |
| **A** | Stationary | Receiver; clock |
| **B** | Stationary, different $x$ | Emitter — **one flash** |
| **C** | $v/c \approx 0.5$ | Receiver; clock |

Both A and C observe B. The wavefront expands in **stages**, pausing at each important arrival so narration can land before the ring continues.

Existing timeline supports this: sequential `animate` events on `wavefront.radius` interleaved with `narrate` events. Checkpoint pause-after-narrate (or `pause-after-checkpoint-controls` change) holds playback until the reader continues.

## Goals / Non-Goals

**Goals:**

- **Bridge only:** one pulse, two reception milestones, predictions, hand off to Chapter 3.
- **Staged wavefront animation:** expand to A → pause for narrative → expand to C → pause for narrative.
- Physics-derived milestone radii so `animate` `to` values match exact reception geometry.
- A/C FactLine clocks update at each milestone when the ring arrives.
- Reusable `wavefront` variant that Chapter 3 extends for multi-pulse timelines.

**Non-Goals:**

- Second or repeating pulses on this step (Chapter 3).
- Pulse-train / rhythm **animation** (rhythm question is prediction-only).
- Simultaneity hyperplanes, aberration, moving emitter.
- New timeline event types (`bind`/`trigger` deferred).
- Budget-arc `pair` diagram from Step 2.

## Decisions

### 1. Bridge vs. Chapter 3 scope

| | Bridge (Step 3) | Chapter 3 |
| --- | --- | --- |
| Pulses | **One** | Many |
| Wavefront animation | Two segments + pauses | Trains, irregular spacing |
| Payoff | Predictions only | Resolves predictions |
| Observers | A, B, C fixed layout | Expanded scenarios |

Closing narrate beat explicitly points forward: *"Next chapter we draw more signals…"*

### 2. Staged wavefront animation (milestone pauses)

**One ring**, animated in **two timeline segments** to physics-derived radii:

```
r = 0          r = r_A              r = r_C
|----animate----|----narrate pause----|----animate----|----narrate pause----|
                 A receives            C receives
                 clock updates         clock updates
```

Example timeline events:

```ts
{ type: 'narrate', text: '…B sends a single flash…' },
{ type: 'animate', target: 'wavefront.radius', from: 0, to: RADIUS_AT_A, duration: 1.4, easing: 'ease-out' },
{ type: 'narrate', text: 'The ring reaches A. By A\'s clock, this much time has passed.' /* pauseAfter */ },
{ type: 'animate', target: 'wavefront.radius', from: RADIUS_AT_A, to: RADIUS_AT_C, duration: 1.6, easing: 'ease-out' },
{ type: 'narrate', text: 'Now it reaches C — still moving. C\'s clock tells a different story.' },
// … prediction beats …
```

Each `narrate` after a milestone creates a **playback checkpoint**; the runner pauses until the user presses play / Space. The ring **stays frozen** at `r_A` or `r_C` during the pause; reception marker and clock readout remain visible.

Playback bar checkpoints align with: setup narrate → **A arrival** → **C arrival** → predictions.

**Alternative considered:** Single continuous `0 → r_C` animation with side-effect hooks at thresholds. Rejected — explicit segmented `animate` events are declarative, seekable, and match existing engine patterns.

### 3. Physics milestones — `@lm/physics`

Extend `signal-reception.ts`:

```ts
/** Diagram-space radius when expanding ring first touches observer worldline. */
export function wavefrontRadiusAtObserver(
  layout: WavefrontLayout,
  observer: 'a' | 'c',
): number;

export interface WavefrontLayout {
  xA: number;
  xB: number;
  xC: number;
  vOverC: number;
  tEmit?: number;
}
```

Step module imports constants `RADIUS_AT_A`, `RADIUS_AT_C` (and reception times for clock labels) from physics — single source of truth for timeline `from`/`to` and FactLine values.

Layout: **A left of B, C right of B**, omnidirectional ring from B's emission event.

### 4. Diagram — `wavefront` variant

- Flat spacetime axes; A (accent-1), B (neutral, emitter), C (accent-2) worldlines.
- Input `wavefrontRadius` bound to `wavefront.radius` target.
- At `radius >= wavefrontRadiusAtObserver(..., 'a')`: show A reception marker; step component sets A clock.
- At `radius >= wavefrontRadiusAtObserver(..., 'c')`: show C reception marker; step component sets C clock.
- Reception markers **persist** when animation pauses (radius held constant).

Chapter 3 reuses the same target name and milestone pattern for multi-pulse timelines.

### 5. Narration beats (revised)

| Beat | Narration | Visual state |
| ---- | --------- | -------------- |
| 1 | Introduce A, B, C — still vs moving | Worldlines visible, `r = 0` |
| 2 | News travels at $c$ only | — |
| 3 | B sends **one** flash | Begin `0 → r_A` |
| 4 | Ring reaches **A**; A's clock | Paused at `r_A`, A clock live |
| 5 | Ring continues toward **C** | Begin `r_A → r_C` |
| 6 | Ring reaches **C**; C's clock differs | Paused at `r_C`, both clocks |
| 7 | Prediction: do A and C agree on arrival? | Q1 |
| 8 | Prediction: same pulse rhythm if B repeated? | Q2 (hypothetical — still one pulse shown) |
| 9 | Closing bridge — hold predictions, tee up next chapter | Continue enabled |

Beat 8 wording makes clear we are **asking about** repeated pulses without animating them — Chapter 3 will show them.

**Closing narrate (beat 9)** — after both predictions are chosen, one final beat in the narrator's voice. Suggested copy:

> "Keep your answers in mind. We have only traced a single pulse — but the questions you just posed go much further. **In the next chapter we will explore this properly:** more signals, more observers, and what spacetime does with them."

Tone: calm handoff, not a quiz reveal. Do not say whether predictions were right or wrong. The footer **next chapter →** control aligns with this beat (enabled once predictions + timeline complete).

### 6. Predictions, layout, navigation

Unchanged from prior design: two yes/no predictions, `continueDisabled` until both chosen + timeline complete, `nextChapter → /ch/03/step/1`.

### 7. Register as Step 3 (interim)

Index 3, id `bridge-to-light`.

## Risks / Trade-offs

- **[Segmented vs. continuous animation]** Two animate events vs one. → Segmented is seekable and narratively precise; slight authoring verbosity accepted.
- **[Rhythm question without pulse train]** Asking about rhythm with one pulse visible. → Narration frames it as hypothetical; Ch 3 animates the answer.
- **[Checkpoint seek]** Seeking playback backward must reset reception markers/clocks correctly. → `TargetRegistry` initial values + runner rewind semantics (existing).

## Migration Plan

1. Physics helpers including milestone radii.
2. `wavefront` variant with radius input + persistent reception markers.
3. Step 3 timeline with staged animates + narrate pauses.
4. Predictions, navigation, smoke test.

## Open Questions

- **Emission beat:** separate narrate before first animate vs. combined. → Short narrate then animate (table above).
