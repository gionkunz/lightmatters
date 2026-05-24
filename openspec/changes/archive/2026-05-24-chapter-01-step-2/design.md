## Context

Chapter 1 Step 1 is shipped: position-only spacetime diagram, timeline narration, slider exploration, and routing at `/ch/01/step/1`. The step frame hides the advance button because Step 2 did not exist. Product intent for Step 2 (`docs/product.md`): _"What is time? Another axis."_ — mirror Step 1's pedagogical structure before Step 3 combines both axes into the full spacetime diagram.

Visual guidelines lock axis conventions: time vertical (up), space horizontal (right). Step 1 used a horizontal `position-only` variant; Step 2 introduces a vertical **`time-only`** variant as the symmetric counterpart.

## Goals / Non-Goals

**Goals:**

- Ship `/ch/01/step/2` as a bookmarkable step matching StepIntro layout and prototype aesthetics.
- Extend `LmSpacetimeDiagram` with `time-only` variant without breaking Step 1's `position-only` mode.
- Enable chapter progression: Step 1 → Step 2 via footer continue; Step 2 back → Step 1.
- Reuse existing engine APIs (`TimelineRunner`, `narrate` / `animate` / `wait`) with no schema changes.

**Non-Goals:**

- Combined two-axis spacetime diagram (Step 3), worldlines, light cone, vectors.
- `bind` / `trigger` timeline events, WebGL, chapter-index, design-sheet.
- Footer label changes (Step 2 back still reads "← home" in the button — navigates to Step 1, not `/`; label polish deferred).
- Progress persistence to `localStorage`.

## Decisions

### 1. Diagram variant: `time-only` mirrors `position-only`

Add `variant: 'time-only'` to `LmSpacetimeDiagram`:

| Input     | Purpose                                      |
| --------- | -------------------------------------------- |
| `time`    | Normalized 0–1 position along vertical axis  |
| `variant` | `'position-only' \| 'time-only'`             |

Renders: vertical axis from bottom to top, 5 tick marks perpendicular outward, `t` label at top, point marker at `time`. SVG layout uses the same padding constants as position-only but swaps axes (axis runs vertically at a fixed `axisX`, ticks extend left).

Animatable target for timeline: `diagram.time` (registered in step component's `TargetRegistry`).

**Alternative considered:** Jump straight to full two-axis diagram in Step 2. Rejected: product lists time as a separate beat; combining axes is Step 3's insight.

### 2. Step 2 mirrors Step 1 structure

New files in `libs/features/chapter-01-position-time/src/lib/steps/`:

- `step-02-time.ts` — authored `Step` object (`id: 'time-intro'`, `layout: 'intro'`, timeline)
- `step-02.component.ts` — host component (clone Step 1 pattern with time variant + time slider)

Registry update in `step-registry.ts`:

```ts
[2, { step: STEP_02_TIME, component: Step02Component }]
```

`step-page.component.ts` gains `@case (2) { <lm-step-02 /> }`.

### 3. Step-to-step navigation

| Step | `hasNextStep` | Back handler              | Next handler                |
| ---- | ------------- | ------------------------- | --------------------------- |
| 1    | `true`        | `router.navigate(['/'])`  | `router.navigate(['/ch/01/step/2'])` |
| 2    | `false`       | `router.navigate(['/ch/01/step/1'])` | — |

Step 1 sets `[hasNextStep]="true"` and wires `(next)="goNextStep()"`. Continue is available once Step 2 exists (no requirement to wait for timeline completion — user can skip ahead).

Use `hasNextStep(1)` from step-registry in Step 1 component rather than hardcoding.

### 4. Step 2 narration copy (authored content)

| Beat | Kicker | Narration |
| ---- | ------ | --------- |
| 1    | time   | "Position tells us where something is. Time tells us when. It is another axis — not a clock on the wall, but a dimension things move through." |
| 2    | (hold) | "Drag the slider. The point climbs the axis. That is time passing. In the next step, we put both axes together." |

Timeline: narrate beat 1 → animate point from 0 → 0.5 on time axis → narrate beat 2 → `wait` for `userAdvance`.

Initial `time` value: `0` (bottom of axis); entry animation moves to `0.5` (mid-axis), matching Step 1's center reveal.

### 5. Diagram dimensions

Use taller aspect ratio for time-only: `width={680}`, `height={320}` (vs Step 1's 200px height) so the vertical axis has room. Slider label: `"time"`.

### 6. Testing

- Unit test: `time-only` renders vertical axis, `t` label, point moves when `time` input changes.
- Existing `position-only` tests unchanged.
- Optional smoke: Step 2 route resolves in step-page switch (covered by component existence; manual smoke in tasks).

## Risks / Trade-offs

- **[Axis orientation confusion]** → Vertical-up matches full-diagram convention from day one; Step 3 reuses same origin-at-bottom-left layout.
- **[Back button label says "home" on Step 2]** → Functionally navigates to Step 1; relabeling footer copy is cosmetic and deferred.
- **[Step-page switch grows with each step]** → Acceptable for 6 steps; refactor to dynamic registry lookup if pattern becomes unwieldy (Step 3+).
- **[Duplicate step component boilerplate]** → Intentional for now; extract shared step-host base when Step 3 adds a second slider or combined diagram.

## Migration Plan

Additive change. No data migration. New route `/ch/01/step/2`; Step 1 behavior change is showing the continue button. Rollback: revert commit; Step 1 returns to no-advance state.

## Open Questions

- **Continue before timeline completes:** Allow immediately (matches exploratory journey). **Decision:** show continue as soon as Step 2 exists; no gate on timeline completion.
- **Step 2 advance button:** Hidden (`hasNextStep: false`) until Step 3 lands. **Decision:** same as Step 1 was before this change.
