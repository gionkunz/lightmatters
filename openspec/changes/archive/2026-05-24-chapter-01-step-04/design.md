## Context

Chapter 1 Steps 1–3 are shipped: single-axis variants, then the `full` diagram with worldlines, dual-slider exploration, and routing through `/ch/01/step/3`. Step 3 ends with the user understanding that objects trace paths through spacetime. Step 4 reframes that insight: every object moves through spacetime at **c**, allocating that fixed "speed budget" between space and time.

The visual prototype (`step-ui.jsx` StepIntro) shows kicker **"the speed budget"**, a `single`-variant diagram with velocity vector and `v / c` slider. Step 3 deliberately deferred this variant to avoid conflating worldlines with velocity allocation. Step 4 is the bridge from worldlines → fixed-c velocity vectors — the geometric seed for Chapter 2's time-dilation thesis.

Visual guidelines lock vector conventions: `2.2–2.6px` stroke, round caps, 3-point polyline arrowhead, optional dot at tip. Decorative swing animation exists in the prototype but is **out of scope** for this step; angle is timeline- and slider-controlled only.

## Goals / Non-Goals

**Goals:**

- Ship `/ch/01/step/4` as a bookmarkable step matching StepIntro layout and prototype aesthetics.
- Extend `LmSpacetimeDiagram` with a `single` variant (full axes + light cone + velocity vector) without breaking existing variants.
- Enable chapter progression: Step 3 → Step 4 via footer continue; Step 4 back → Step 3.
- Reuse existing engine APIs (`TimelineRunner`, `narrate` / `animate` / `wait`) with no schema changes.
- Single `v / c` slider exploration after narration completes.

**Non-Goals:**

- Twin-vector `pair` variant, chat-feed layout, time dilation formulas, FactLine / Legend2 readouts.
- Decorative vector swing loop (`lmVectorSwing` CSS animation from prototype).
- `bind` / `trigger` timeline events, WebGL, chapter-index, design-sheet.
- Relocating this content to Chapter 2 (stays in Chapter 1 Step 4 per product arc).
- Footer label polish (back button may still read "← home" while navigating to Step 3).

## Decisions

### 1. Diagram variant: `single` = full axes + velocity vector

Add `variant: 'single'` to `LmSpacetimeDiagram`:

| Input           | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `velocity`      | Normalized v/c (0–1): 0 = pure time, 1 = light cone |
| `showLightCone` | Dashed 45° line from origin (default on)             |
| `showDot`       | Filled circle at vector tip (default on)             |
| `vectorStroke`  | Stroke width (default 2.4, per prototype StepIntro)  |

Renders (reuse `full` layout constants: `left=70`, `bottom=360`, `top=40`, `right=610`):

- Horizontal space axis + vertical time axis with 5 ticks each, `x`/`t` labels.
- Dashed light-cone diagonal (`stroke-dasharray: 3 4`, opacity ~0.55).
- Velocity vector from origin: fixed length `len=240` (prototype default), angle derived from `velocity`.
- Arrowhead: 3-point polyline (`±6px` horizontal offset, `+9px` from tip along vector).
- Optional dot at tip (r=3.5).

**Angle mapping:** `velocity` ∈ [0, 1] maps linearly from pure-time (vertical) to light-cone (45°):

```
angle = velocity * 45°   // from vertical toward horizontal
tipX  = left + len * sin(angle)
tipY  = fullBottom - len * cos(angle)
```

At `velocity=0`: vector is vertical (pure time motion). At `velocity=1`: vector aligns with the light cone (max spatial component at c).

Animatable target: `diagram.velocity` (registered in step component's `TargetRegistry`).

**Alternative considered:** Reuse `full` variant with `position`/`time` inputs to position the vector tip. Rejected: `velocity` as v/c is the pedagogical parameter; mapping through position/time conflates the speed-budget metaphor with arbitrary spacetime coordinates.

**Alternative considered:** Separate velocity-vector primitive. Rejected: vector shares axes, light cone, and layout with `full`; co-locating in `LmSpacetimeDiagram` matches prototype structure and avoids a new library.

### 2. Step 4 mirrors Steps 1–3 structure with single slider

New files in `libs/features/chapter-01-position-time/src/lib/steps/`:

- `step-04-moving-spacetime.ts` — authored `Step` object (`id: 'moving-spacetime'`, `layout: 'intro'`, timeline)
- `step-04.component.ts` — host component (StepIntro grid with `single` diagram + one slider)

Registry update in `step-registry.ts`:

```ts
[4, { step: STEP_04_MOVING_SPACETIME, component: Step04Component }]
```

`step-page.component.ts` gains `@case (4) { <lm-step-04 /> }`.

Slider: one `LmSlider` labeled `v / c`, disabled until exploration wait. Initial value `velocity=0`.

### 3. Step-to-step navigation

| Step | `hasNextStep`        | Back handler                         | Next handler                          |
| ---- | -------------------- | ------------------------------------ | ------------------------------------- |
| 3    | `true`               | `router.navigate(['/ch/01/step/2'])` | `router.navigate(['/ch/01/step/4'])`  |
| 4    | `false`              | `router.navigate(['/ch/01/step/3'])` | —                                     |

Step 3 updates: `[hasNextStep]="hasNextStep(3)"`, wire `(next)="goNextStep()"`.

### 4. Step 4 narration copy (authored content)

| Beat | Kicker           | Narration |
| ---- | ---------------- | --------- |
| 1    | the speed budget | "Did you know you are traveling at the speed of light right now? Maybe not the way you imagine it." |
| 2    | (hold)           | "When you are at rest — and relativistically, almost everything around you is too — you are moving through time at nearly the full speed of light. Through space, barely at all." |
| 3    | (hold)           | "Spacetime works like a budget. Everything in the universe moves at c. You can spend it on motion through space, or motion through time — but the total is always the same." |
| 4    | (hold)           | "Drag the slider. Watch the vector tilt. More through space means less through time — and vice versa." |

Timeline sequence:

1. `narrate` beat 1
2. `narrate` beat 2
3. `animate` `diagram.velocity` from 0 → 0.15 (duration ~1.2s, ease-out) — shows "almost all time" even with slight tilt
4. `narrate` beat 3
5. `narrate` beat 4
6. `wait` for `userAdvance`

Initial value: `velocity=0` (vector vertical, pure time motion).

### 5. Diagram dimensions

Match prototype StepIntro: `width={680}`, `height={460}`. Slider column max-width `520px`.

### 6. Testing

- Unit test: `single` renders both axes, labels, light cone, velocity vector with arrowhead; vector angle changes when `velocity` input changes; `velocity=0` is vertical, `velocity=1` aligns with light cone.
- Existing `position-only`, `time-only`, and `full` tests unchanged.
- Manual smoke: Step 3 → continue → Step 4; verify narration, slider tilts vector, back returns to Step 3.

## Risks / Trade-offs

- **[Chapter 2 overlap]** Step 4 introduces Chapter 2's core thesis early in Chapter 1. → Intentional per user spec; Chapter 2 will deepen with twin vectors and time-dilation math.
- **[Prototype swing animation omitted]** Landing page placeholder still shows static vector; decorative swing deferred to brand-sheet or landing refresh. → Step 4 vector is pedagogically controlled, not decorative.
- **[Back button label says "home" on Step 4]** → Functionally navigates to Step 3; relabeling deferred.
- **[Step-page switch grows]** → Acceptable for 6 steps; refactor to dynamic registry lookup later.
- **[Linear v/c → angle mapping]** Not physically exact Lorentz geometry; sufficient for geometric seed. → Math arrives in later steps/chapters.

## Migration Plan

Additive change. No data migration. New route `/ch/01/step/4`; Step 3 behavior change is showing the continue button. Rollback: revert commit; Step 3 returns to no-advance state.

## Open Questions

- **Kicker timing:** Kicker "the speed budget" applies to the whole step (set on `Step` object, visible from mount). **Decision:** yes — matches prototype StepIntro.
- **Entry animation target 0.15:** Shows slight spatial component while narration emphasizes "almost all time." **Decision:** 0.15 per user spec; tune during implementation if visually too subtle.
