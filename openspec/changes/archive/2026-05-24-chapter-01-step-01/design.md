## Context

The workspace has a working landing page (`libs/features/landing`), design system (`libs/design`), and placeholder stubs for `libs/engine` and `libs/physics`. No timeline engine, no step routes, no diagram primitives, and no chapter content exist yet. Architecture build order (steps 5–9) calls for engine → narrator → end-to-end step → spacetime diagram → Chapter 1; this change delivers all of that scoped to **Chapter 1 · Step 1 only**.

Product intent for Step 1 (`docs/product.md`): _"What is position? A point on an axis."_ — establish vocabulary before time or spacetime. The visual-design prototype's `StepIntro` layout (narrator above, diagram below, slim control) is the reference chrome, but Step 1 shows **only a horizontal position axis** with a movable point — no time axis, no light cone, no vector yet.

## Goals / Non-Goals

**Goals:**

- Prove the full step loop: route → mount step → run timeline → narrate → animate → user explores → advance.
- Ship `/ch/01/step/1` as a bookmarkable, replayable experience matching prototype aesthetics.
- Establish engine APIs (`Step`, `TimelineEvent`, `TimelineRunner`) that later steps and chapters extend without rewrites.
- Build the spacetime-diagram primitive in a **position-only** variant reusable when Step 2 adds the time axis.

**Non-Goals:**

- Chapter 1 steps 2–6, chapter-index, design-sheet, WebGL/ogl, `branch`/`trigger` timeline events.
- Progress persistence to `localStorage` (deferred; step replays from defaults).
- Mobile-responsive step layout (desktop-first, matching prototype ~1100px content width).
- Full `STDiagram` variants (`pair`, `wavefront`, `cone`) — only position-only for now.
- `bind` timeline event — Step 1 wires the slider directly in the step component; timeline handles narration and entry animation only.

## Decisions

### 1. Timeline engine: minimal three-event set + skip

Implement `TimelineRunner` in `libs/engine` with:

| Event     | Purpose                                      |
| --------- | -------------------------------------------- |
| `narrate` | Append/reveal narrator text chunk            |
| `animate` | Tween a numeric property on a named target   |
| `wait`    | Pause until `userAdvance` or `animationDone` |

Skip (Space / Enter / footer button) fast-forwards to the next `wait` boundary, completing intermediate animations instantly. Hand-rolled linear + ease-out easing; no GSAP.

**Alternative considered:** Include `bind` now for slider wiring. Rejected: adds schema complexity before Chapter 2 needs it; direct Angular binding in the step component is sufficient for one slider.

### 2. Step data model

```ts
interface Step {
  id: string;
  title: string;
  kicker?: string;
  layout: 'intro'; // StepIntro grid from step-ui.jsx
  visualizations: VisualizationSlot[];
  timeline: TimelineEvent[];
  controls?: ControlDef[]; // declarative metadata; wired in step-host
}
```

Steps export as plain TypeScript modules from `libs/features/chapter-01-position-time/src/lib/steps/`. Chapter registry exports metadata + step list + routes.

Visualization lifecycle: **remount on every step entry**, state resets. Step 1 starts with `position: 0.5` (center of axis).

### 3. Engine component split

| Component / service     | Location        | Role                                                |
| ----------------------- | --------------- | --------------------------------------------------- |
| `TimelineRunner`        | `libs/engine`   | State machine; signals for playhead, narrator queue |
| `LmNarrator`            | `libs/engine`   | Typewriter reveal; driven by runner                 |
| `LmStepFrame`           | `libs/engine`   | Nav, progress dots, footer — from `step-ui.jsx`     |
| `LmStepHost`            | `libs/engine`   | Resolves step from route param, mounts runner + viz |
| `ChapterShellComponent` | chapter feature | Wraps step-host, provides chapter context           |

Step chrome lives in `libs/engine` (reused by all chapters). Chapter-specific step files live in the feature lib.

### 4. Spacetime diagram: position-only variant

New lib `libs/primitives/spacetime-diagram`, tagged `scope:primitive`.

`LmSpacetimeDiagram` inputs for Step 1:

- `variant: 'position-only'`
- `position: number` (0–1, normalized along axis)
- `width`, `height`
- `showLabels: boolean`

Renders: horizontal x-axis with tick marks, axis label `x`, a point marker at `position`. No vertical time axis, no light-cone diagonal, no vectors. SVG, thin strokes, theme tokens via CSS variables (`stroke: var(--color-ink)`).

Animatable property exposed to timeline: `position` (for entry animation from 0 → 0.5).

**Alternative considered:** Separate `position-axis` primitive. Rejected: same SVG scaffolding becomes the full diagram in Step 2; one primitive avoids duplication.

### 5. Step 1 layout and interaction

Layout matches `StepIntro` in `step-ui.jsx`:

```
┌─────────────────────────────────────┐
│  Kicker · narrator text             │
├─────────────────────────────────────┤
│         position axis + point       │
├─────────────────────────────────────┤
│         [position slider]           │
└─────────────────────────────────────┘
```

- `LmSlider` added to `libs/design` (port from prototype `Slider`).
- Slider bound to diagram `position` signal after timeline reaches the exploration `wait`.
- Footer: back (→ `/`) and advance (→ `/ch/01/step/2` stub or disabled with "coming soon" until step 2 exists — **advance disabled/hidden for v1** since step 2 is out of scope).

### 6. Routing

```
/ch/01          → redirect to /ch/01/step/1
/ch/01/step/:step → StepHost resolves step module
```

Lazy-loaded from `app.routes.ts` via `@lm/feature-chapter-01-position-time`. Landing chapter 1 card and Hero "begin" CTA link to `/ch/01/step/1`.

### 7. Step 1 narration copy (authored content)

| Beat | Kicker   | Narration                                                                                                                  |
| ---- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1    | position | "Before we talk about relativity, we need a place to stand. Position is simply where something is — a location on a line." |
| 2    | (hold)   | "Drag the slider. The point moves along the axis. That number is its position. Everything we build later starts here."     |

Timeline: narrate beat 1 → animate point fade-in at x=0.5 → narrate beat 2 → wait for userAdvance.

### 8. Module boundaries

Generate with Nx:

- `libs/primitives/spacetime-diagram` — `scope:primitive`
- `libs/features/chapter-01-position-time` — `scope:feature`

Engine may depend on design only. Primitive may depend on engine + design. Chapter feature depends on engine, primitives, design.

## Risks / Trade-offs

- **[Timeline schema too narrow]** → Step 1 needs only three events; iterate schema when authoring Step 2 (sliders via direct binding, twin vectors via `animate`).
- **[Spacetime diagram premature abstraction]** → Position-only variant keeps API small; extend with `variant: 'full'` in Step 2–3 without breaking Step 1.
- **[No step 2 to advance to]** → Footer advance button hidden or shows toast "Step 2 coming soon"; back link returns to `/`.
- **[Typewriter pacing subjective]** → Match prototype speeds (~28ms/char); manual sign-off acceptable.
- **[Import path aliases]** → Follow existing `@lm/*` pattern from scaffold; verify `tsconfig.base.json` after generation.

## Migration Plan

Additive change. No data migration. Deploy as static build; `/ch/01/step/1` is a new route. Rollback: revert commit; landing page unaffected except updated links.

## Open Questions

- **Advance button behavior without Step 2:** Hide vs. disabled vs. link to chapter index (not built). **Decision:** hide advance; show back-to-home only until Step 2 lands.
- **Keyboard skip during slider exploration:** Space skips narration waits but does not block slider use. **Decision:** skip applies only during timeline-driven phases.
