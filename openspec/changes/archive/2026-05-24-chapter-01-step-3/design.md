## Context

Chapter 1 Steps 1 and 2 are shipped: `position-only` and `time-only` spacetime diagram variants, timeline narration, single-slider exploration, and routing at `/ch/01/step/1` and `/ch/01/step/2`. Step 2's narration ends with _"In the next step, we put both axes together."_ Product intent for Step 3 (`docs/product.md`): _"The spacetime diagram: space on one axis, time on the other. Things trace lines through it."_

The visual prototype (`step-ui.jsx` StepIntro) shows kicker **"a worldline"**, narration about worldlines, a full two-axis diagram, and a slider — but uses the `single` variant with an animated velocity vector and `v / c` label, which belongs to Chapter 2's speed-budget concept. Step 3 content follows the product arc: combine axes, introduce worldlines as paths through the diagram. Velocity vectors arrive in Chapter 2.

Visual guidelines lock axis conventions: time vertical (up), space horizontal (right), origin at bottom-left, dashed light-cone diagonal at 45°.

## Goals / Non-Goals

**Goals:**

- Ship `/ch/01/step/3` as a bookmarkable step matching StepIntro layout and prototype aesthetics.
- Extend `LmSpacetimeDiagram` with a `full` variant (both axes + light cone + worldline segment) without breaking existing `position-only` / `time-only` modes.
- Enable chapter progression: Step 2 → Step 3 via footer continue; Step 3 back → Step 2.
- Reuse existing engine APIs (`TimelineRunner`, `narrate` / `animate` / `wait`) with no schema changes.
- Dual-slider exploration: position and time sliders mirror Steps 1–2, now controlling a single point in the combined diagram.

**Non-Goals:**

- Velocity vector, `v / c` slider, twin-vector `pair` variant, decorative vector swing animation.
- Animated fading worldline trail (`worldline-tracer` primitive) — static segment from origin to point is sufficient for Step 3.
- `bind` / `trigger` timeline events, WebGL, chapter-index, design-sheet.
- Footer label polish (Step 3 back button label may still read "← home" while navigating to Step 2).
- Progress persistence to `localStorage`.

## Decisions

### 1. Diagram variant: `full` combines both axes

Add `variant: 'full'` to `LmSpacetimeDiagram`:

| Input          | Purpose                                           |
| -------------- | ------------------------------------------------- |
| `position`     | Normalized 0–1 along horizontal space axis        |
| `time`         | Normalized 0–1 along vertical time axis           |
| `showLightCone`| Optional dashed 45° line from origin (default on) |
| `showWorldline`| Line segment from origin to current point (default on) |

Renders:

- Horizontal space axis (bottom) with 5 tick marks, `x` label at right.
- Vertical time axis (left) with 5 tick marks, `t` label at top.
- Origin at bottom-left intersection.
- Dashed light-cone diagonal (`stroke-dasharray: 3 4`, opacity ~0.55) from origin upward-right.
- Worldline segment: straight line from origin to point at `(position, time)`.
- Point marker (filled circle, r=5) at the tip.

Layout constants align with prototype: `left=70`, `bottom=360`, `top=40`, `right=610` (scaled to component width/height inputs). Default dimensions: `width=680`, `height=460` (taller than single-axis variants to accommodate both axes).

Animatable targets: `diagram.position` and `diagram.time` (registered in step component's `TargetRegistry`).

**Alternative considered:** Reuse prototype name `single` including the velocity vector. Rejected: `single` in the prototype bundles Chapter 2's speed-budget vector; Step 3's insight is axes + worldline, not velocity allocation.

**Alternative considered:** Separate `worldline-tracer` primitive. Rejected for Step 3: a static SVG line segment inside the diagram component is simpler and sufficient; extract a tracer primitive when fading trails are needed (later steps/chapters).

### 2. Step 3 mirrors Steps 1–2 structure with dual sliders

New files in `libs/features/chapter-01-position-time/src/lib/steps/`:

- `step-03-spacetime.ts` — authored `Step` object (`id: 'spacetime-intro'`, `layout: 'intro'`, timeline)
- `step-03.component.ts` — host component (StepIntro grid with `full` diagram + two sliders)

Registry update in `step-registry.ts`:

```ts
[3, { step: STEP_03_SPACETIME, component: Step03Component }]
```

`step-page.component.ts` gains `@case (3) { <lm-step-03 /> }`.

Slider layout: two slim sliders stacked vertically (or side-by-side within the max-width column), labeled `position` and `time`. Both disabled until exploration wait, matching Steps 1–2.

### 3. Step-to-step navigation

| Step | `hasNextStep` | Back handler                         | Next handler                          |
| ---- | ------------- | ------------------------------------ | ------------------------------------- |
| 2    | `true`        | `router.navigate(['/ch/01/step/1'])` | `router.navigate(['/ch/01/step/3'])`  |
| 3    | `false`       | `router.navigate(['/ch/01/step/2'])` | —                                     |

Step 2 sets `[hasNextStep]="hasNextStep(2)"` and wires `(next)="goNextStep()"`. Continue available immediately (no timeline completion gate).

### 4. Step 3 narration copy (authored content)

| Beat | Kicker     | Narration |
| ---- | ---------- | --------- |
| 1    | a worldline | "Position and time are not separate ideas — they are two axes of the same diagram. Every object traces a line through it." |
| 2    | (hold)     | "We call those lines worldlines. Drag the sliders. The point moves through spacetime, and the line from the origin is its worldline so far." |

Timeline: narrate beat 1 → animate position 0→0.4 and time 0→0.5 concurrently (two animate events) → narrate beat 2 → `wait` for `userAdvance`.

Initial values: `position=0`, `time=0` (origin); entry animation moves to `(0.4, 0.5)`.

### 5. Diagram dimensions

Use full-diagram aspect ratio: `width={680}`, `height={460}` per prototype StepIntro. Slider column max-width `520px`, stacked with `gap-4`.

### 6. Testing

- Unit test: `full` renders both axes, `x`/`t` labels, light cone, worldline segment, point; point moves when `position`/`time` inputs change.
- Existing `position-only` and `time-only` tests unchanged.
- Manual smoke: Step 2 → continue → Step 3; verify narration, dual sliders move point and worldline, back returns to Step 2.

## Risks / Trade-offs

- **[Prototype divergence on slider label]** → Prototype shows `v / c`; Step 3 uses `position` + `time` sliders per pedagogical arc. Chapter 2 introduces velocity allocation.
- **[Dual-slider UX on mobile]** → Stacked layout with max-width constraint; acceptable for desktop-first vertical slice.
- **[Back button label says "home" on Step 3]** → Functionally navigates to Step 2; relabeling deferred.
- **[Step-page switch grows]** → Acceptable for 6 steps; refactor to dynamic registry lookup later.
- **[Duplicate step component boilerplate]** → Intentional; extract shared step-host base when Step 4 adds new interaction patterns.

## Migration Plan

Additive change. No data migration. New route `/ch/01/step/3`; Step 2 behavior change is showing the continue button. Rollback: revert commit; Step 2 returns to no-advance state.

## Open Questions

- **Light cone visibility during entry animation:** Show from mount (default on). **Decision:** visible immediately — it anchors the diagram visually even before the user understands it; Chapter 2 will revisit its meaning.
- **Concurrent animate events:** Timeline already supports multiple animate events in sequence; for simultaneous position+time animation, place two `animate` events back-to-back (runner executes concurrently within the same timeline tick if durations match). **Decision:** two animate events with same duration run in parallel via the existing runner batching; if not supported, chain sequentially with minimal gap — verify during implementation.
