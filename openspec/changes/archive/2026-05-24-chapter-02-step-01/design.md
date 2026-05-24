## Context

Chapter 1 Steps 1–4 are shipped at `/ch/01/step/1` through `/ch/01/step/4`. Step 4 introduced the speed-budget metaphor with a `single`-variant velocity vector and `v / c` slider — a teaser planted inside Chapter 1. Chapter 2 ("The speed budget", 11 steps per prototype) is the dedicated chapter for that thesis.

No chapter 2 feature lib exists yet. Architecture (`docs/architecture.md`) plans `libs/features/chapter-02-speed-budget/` as a lazy-loaded feature with its own route at `/ch/02`. The `single` diagram variant and timeline engine are already in place; this change scaffolds the chapter and delivers Step 1 only.

Step 1 pedagogical focus (`docs/product.md` Chapter 2 bullets): the **two allocation extremes** — pure time motion (v = 0, vector vertical) and pure space motion (v = 1, vector on the light cone). Twin-vector comparison, time-dilation math, and the chat-feed layout arrive in later Chapter 2 steps.

## Goals / Non-Goals

**Goals:**

- Scaffold `libs/features/chapter-02-speed-budget` mirroring Chapter 1's structure (shell, registry, step page, routes, public API).
- Ship `/ch/02/step/1` as a bookmarkable StepIntro experience with `single`-variant diagram and `v / c` slider.
- Narrate and animate the two extremes (pure time → pure space), then invite slider exploration.
- Wire cross-chapter navigation: Chapter 1 Step 4 → Chapter 2 Step 1; Chapter 2 Step 1 back → Chapter 1 Step 4.
- Update app routes and landing page Chapter 2 card link.

**Non-Goals:**

- Twin-vector `pair` variant, chat-feed layout, FactLine/Legend2 readouts, Lorentz formulas.
- `bind` / `trigger` timeline events, chapter-index, design-sheet, WebGL.
- Chapter 2 steps 2–11, Chapter 1 steps 5–6.
- Nx chapter generator (deferred; manual scaffold acceptable for first Chapter 2 step).

## Decisions

### 1. Feature lib scaffold mirrors Chapter 1

Generate `libs/features/chapter-02-speed-budget` with Nx Angular library generator, tagged `scope:feature`. Public API exports `chapter02Routes` only.

```
libs/features/chapter-02-speed-budget/
  src/
    index.ts                          → export { chapter02Routes }
    lib/
      chapter02.routes.ts             → /step/:step routing
      chapter-shell.component.ts      → <router-outlet />
      step-page.component.ts          → @switch on step number
      step-registry.ts                → CHAPTER_02_TOTAL_STEPS = 11
      steps/
        step-01-always-at-c.ts          → authored Step object
        step-01.component.ts            → StepIntro host
```

Route config:

```ts
export const chapter02Routes: Routes = [
  {
    path: '',
    component: ChapterShellComponent,
    children: [
      { path: 'step/:step', component: StepPageComponent },
      { path: '', redirectTo: 'step/1', pathMatch: 'full' },
    ],
  },
];
```

App shell addition:

```ts
{ path: 'ch/02', loadChildren: () => import('@lm/feature-chapter-02-speed-budget').then(m => m.chapter02Routes) }
```

**Alternative considered:** Add Chapter 2 steps to the existing Chapter 1 lib. Rejected: architecture mandates one feature lib per chapter for lazy-loading and dependency isolation.

### 2. Step 1 reuses `single` variant — no primitive changes

Step 1 uses the existing `LmSpacetimeDiagram` with `variant="single"`, `velocity` input, dimensions 680×460, and one `LmSlider` labeled `v / c`. Same StepIntro grid as Chapter 1 Step 4.

Initial value: `velocity = 0` (pure time). Timeline animates to `velocity = 1` (light cone) during narration of the space extreme, then resets to `0.5` or leaves at exploration default — **Decision:** end entry animation at `velocity = 1`, then on exploration wait the slider starts at current animated value (1.0); user can drag back toward 0. This makes the "frozen in time" extreme visually salient before exploration.

**Alternative considered:** Reset to 0.5 for exploration midpoint. Rejected: starting at the light-cone extreme reinforces the second beat; user drags back to discover the trade.

### 3. Step 1 narration copy (authored content)

| Beat | Kicker        | Narration |
| ---- | ------------- | --------- |
| 1    | always at c   | "Welcome to the speed budget. Everything in the universe moves through spacetime at exactly $c$. Not almost — exactly." |
| 2    | (hold)        | "At one extreme, spend it all on time. Stand still, and every bit of $c$ flows through time. Through space, nothing." |
| 3    | (hold)        | "At the other extreme, spend it all on space. Move at $c$ through space — the vector sits on the light cone. Time stops." |
| 4    | (hold)        | "Every real motion is somewhere in between. Drag the slider. Watch how space and time share the budget." |

Timeline sequence:

1. `narrate` beat 1
2. `narrate` beat 2 (vector at v = 0, vertical)
3. `narrate` beat 3
4. `animate` `diagram.velocity` from 0 → 1 (duration ~1.4s, ease-out) — sweeps to light cone during beat 3 narration overlap or immediately after beat 3 starts
5. `narrate` beat 4
6. `wait` for `userAdvance`

Reordering note: animate runs after beat 2 completes, timed with beat 3 narration so the vector sweeps as "pure space" is described.

### 4. Cross-chapter navigation

| Location        | Control  | Target                    |
| --------------- | -------- | ------------------------- |
| Ch1 Step 4      | continue | `/ch/02/step/1`           |
| Ch1 Step 4      | back     | `/ch/01/step/3` (unchanged) |
| Ch2 Step 1      | back     | `/ch/01/step/4`           |
| Ch2 Step 1      | advance  | hidden (no Step 2 yet)    |

Chapter 1 Step 4 changes: `[hasNextStep]="true"` with `(next)` navigating to `/ch/02/step/1` instead of `hasNextStep(4)` which is currently `false`.

Chapter 2 Step 1: `[hasNextStep]="false"`, back handler to `/ch/01/step/4`.

**Alternative considered:** Back from Ch2 Step 1 goes to `/` or chapter index. Rejected: user just finished Ch1 Step 4; back should return to the bridge step.

### 5. Landing page Chapter 2 card

Update `landing-chapters.component.ts`: Chapter 2 card (`chapter.n === 2`) becomes an `<a routerLink="/ch/02/step/1">` anchor, matching Chapter 1's pattern.

### 6. Step frame metadata

| Field          | Value              |
| -------------- | ------------------ |
| `chapter`      | 2                  |
| `chapterTitle` | "The speed budget" |
| `step`         | 1                  |
| `stepsTotal`   | 11                 |

Progress dots: 11 total, first dot active.

### 7. Testing

- Smoke: navigate `/ch/02/step/1`; verify step frame shows chapter 2 title and `01 / 11`.
- Cross-chapter: Ch1 Step 4 continue → Ch2 Step 1; back → Ch1 Step 4.
- Manual: narration plays, vector animates 0 → 1, slider controls vector during exploration.
- `nx build lightmatters`, `nx lint feature-chapter-02-speed-budget` pass.

## Risks / Trade-offs

- **[Content overlap with Ch1 Step 4]** Both steps use `single` variant and `v / c` slider. → Ch1 Step 4 is a teaser; Ch2 Step 1 opens the chapter with extremes-focused narration and a 0→1 entry animation Ch1 Step 4 does not perform.
- **[Ch1 Step 4 still last in Chapter 1 registry]** Steps 5–6 unauthored; cross-chapter advance from Step 4 skips them. → Acceptable; Step 4 is the natural bridge per product arc.
- **[Back button label may say "home"]** → Functionally navigates cross-chapter; relabel deferred.
- **[Manual scaffold vs generator]** → Manual mirror of Ch1 is faster for one step; generator can land when authoring steps 2+.

## Migration Plan

Additive change. New lazy chunk for chapter 2; new route `/ch/02/step/1`. Chapter 1 Step 4 gains a continue button. Landing Chapter 2 card becomes clickable. Rollback: revert commit; Ch1 Step 4 returns to no-advance state.

## Open Questions

- **Exploration starting velocity after 0→1 animation:** Start at 1.0 (light cone). **Decision:** yes — user drags down to discover the trade.
- **Inline math in beat 1:** Use `$c$` for consistency with Ch1 Step 4. **Decision:** yes — MathJax already shipped.
