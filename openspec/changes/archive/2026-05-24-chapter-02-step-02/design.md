## Context

Chapter 2 Step 1 ships a `single`-variant diagram with one `v / c` slider. Today `@lm/physics` maps slider value **linearly** to arc angle ($\theta = v \cdot 90°$), so $v/c = 0.5$ means 45° on the arc, ~212,000 km/s, and ~0.71 years — not half light speed and not Lorentz proper time.

Step 2 introduces **two travellers** for one year: Earth-bound (negligible $v$) vs half light speed ($v/c = 0.5$). The product decision is to **keep the circular Epstein diagram** but make **Lorentz the single source of truth** for all readouts and use **physical $v/c$** on the slider.

On the circle with $\theta = \arcsin(v/c)$:

$$\frac{\Delta\tau}{\Delta t} = \sqrt{1 - v^2/c^2} = \cos\theta \qquad v = \sin\theta \cdot c$$

Diagram trig and Lorentz give identical numbers when $v/c$ is physical velocity.

## Goals / Non-Goals

**Goals:**

- Add `lorentz`, `properTimeFraction`, `spatialSpeedKms` to `@lm/physics`; refactor all speed-budget readouts to call them.
- Map diagram vector angle as $\theta = \arcsin(v/c)$ on `single` and `pair` budget-arc variants.
- Ship Step 2 at `/ch/02/step/2` with traveller B at $v/c = 0.5$: ~150,000 km/s, ~0.87 years vs Earth's 1 year.
- Update Step 1 fifty-fifty beat to $v/c = \sin(45°) \approx 0.707$ (equal time/space components on the arc).
- Implement `pair` variant, chat-feed layout, `LmFactLine`, `LmLegend`, Step 1 → Step 2 navigation.

**Non-Goals:**

- Replacing the circular arc with hyperbolic diagram geometry.
- Narrating $\gamma = 1/\sqrt{1-v^2/c^2}$ by name (deferred; numbers are already correct).
- Acceleration, twin-paradox turnaround, relativity of simultaneity.
- `bind` / `trigger`, WebGL, decorative vector swing.

## Decisions

### 1. Lorentz as single source of truth in `@lm/physics`

New primitives in `libs/physics/src/lib/lorentz.ts` (or `special-relativity.ts`):

```ts
export const lorentz = (vOverC: number) =>
  1 / Math.sqrt(1 - vOverC * vOverC);

export const properTimeFraction = (vOverC: number) =>
  1 / lorentz(vOverC); // sqrt(1 - v²/c²)

export const spatialSpeedKms = (vOverC: number) =>
  vOverC * SPEED_OF_LIGHT_KMS;
```

Refactor `speedBudgetComponents`:

```ts
export function speedBudgetComponents(vOverC: number, coordinateYears = 1) {
  return {
    timeYears: coordinateYears * properTimeFraction(vOverC),
    spaceKm: coordinateYears * vOverC * LIGHT_YEAR_KM,
  };
}

export function arcSpatialSpeedKms(vOverC: number) {
  return spatialSpeedKms(vOverC);
}
```

Deprecate the linear $\theta = v \cdot \pi/2$ mapping entirely. All tip labels, FactLines, and tests derive from Lorentz helpers.

**Alternative considered:** Keep linear mapping for Step 1, Lorentz only in Step 2. Rejected: inconsistent readouts across steps.

### 2. Diagram angle — same circle, physical placement

Budget-arc variants (`single`, `pair`) compute:

```ts
protected get vectorAngleRad(): number {
  const v = Math.min(1, Math.max(0, this.velocity()));
  return Math.asin(v);
}
```

| $v/c$ | Angle on arc | Spatial speed | Proper time / 1 coord. yr |
| ----- | ------------ | ------------- | ------------------------ |
| 0 | 0° | 0 | 1.00 yr |
| 0.5 | 30° | 150,000 km/s | ~0.87 yr |
| $\approx 0.707$ | 45° | $\approx 212{,}000$ km/s | ~0.71 yr |
| 1 | 90° | $c$ | 0 yr |

The **quarter-circle SVG path is unchanged**; only vector tip position on that arc changes.

### 3. Step 1 updates (fifty-fifty vs half-$c$)

Step 1 currently animates to $v/c = 0.5$ with “fifty-fifty split” copy. After the Lorentz mapping:

- **Fifty-fifty (equal components):** $v/c = \sin(45°) = \sqrt{2}/2 \approx 0.707$, vector at 45° on arc.
- **Half light speed:** $v/c = 0.5$, vector at 30° — reserved for Step 2 story.

Step 1 changes:

| Item | Before | After |
| ---- | ------ | ----- |
| Animate target | `to: 0.5` | `to: Math.SQRT1_2` (~0.707) |
| Narration | “Halfway on the arc is a fifty-fifty split…” | “When the vector bisects the angle — forty-five degrees on the arc — time and space get equal shares. That takes about seventy-one percent of light speed through space.” |

Readouts at $v/c \approx 0.707$ show ~0.71 yr and ~212,000 km/s (equal split, Lorentz-consistent).

### 4. Chat-feed layout (Step 2)

Unchanged from prior design: two-column grid per `docs/visual-guidelines.md` §9; `layout: 'chat-feed'` on `Step` type; `LmNarratorChatFeedComponent` with past beats + current beat.

### 5. Traveller identities (Step 2)

| Label | Role | Color | $v/c$ | Readouts (1 coord. yr) |
| ----- | ---- | ----- | ----- | ---------------------- |
| A | Earth | accent-1 | 0.01 | ~1.00 yr, negligible speed |
| B | Traveller | accent-2 | 0.5 | ~0.87 yr, ~150,000 km/s |

Traveller B animates 0 → 0.5 during narration. Earth slider disabled during exploration.

Add `travellerReadout(vOverC, coordinateYears)` formatting FactLine strings via Lorentz helpers.

### 6. Step 2 narration and timeline

| Beat | Narration |
| ---- | --------- |
| 1 | "Imagine two people who agree to travel for exactly one year — each in their own way." |
| 2 | "One stays on Earth, moving through space as slowly as we ever do — almost all motion through time." |
| 3 | "The other launches at **half the speed of light** — still moving through time, but a significant share of $c$ goes to space." |
| 4 | "After one year passes on Earth, how much time has the traveller experienced? Watch the vectors — the geometry tells you." |
| 5 | "Drag the traveller's slider. See how spending more of the budget on space steals from time." |

Timeline: narrate 1–2 → narrate 3 + animate `velocityB` 0→0.5 → narrate 4 (readouts ~1.0 vs ~0.87 yr) → narrate 5 → wait `userAdvance`.

Optional closing beat (Step 2 or later): uniform motion only; acceleration and simultaneity come later — **not** “numbers are approximate.”

### 7. `pair` variant

Mirror `single` with `velocityA`, `velocityB`; accent-1 / accent-2 vectors; $\theta = \arcsin(v)$ each; timeline targets `diagram.velocityA`, `diagram.velocityB`. No tip labels in Step 2 (FactLine mini-map).

### 8. Navigation

| Location | Control | Target |
| -------- | ------- | ------ |
| Ch2 Step 1 | continue | `/ch/02/step/2` |
| Ch2 Step 2 | back | `/ch/02/step/1` |

## Risks / Trade-offs

- **[Step 1 behaviour change]** Shipped Step 1 vector/readouts shift for all $v/c$ values. → Correct physics; update tests and manual QA on `/ch/02/step/1`.
- **[Lost “slider = arc fraction” shortcut]** Equal slider steps ≠ equal angle steps. → Gain: slider reads as real $v/c$; teach fifty-fifty explicitly at 45° / ~0.71$c$.
- **[Chat-feed scope]** Still the largest UI chunk. → Justified for twin-vector steps.
- **[$\gamma$ not named yet]** Users get exact numbers before the symbol. → Later step introduces $\gamma$ as label for what they already measured.

## Migration Plan

1. Land Lorentz helpers + refactor `speed-budget.ts` + tests.
2. Update diagram `vectorAngleRad` + diagram tests.
3. Update Step 1 animation/copy.
4. Ship Step 2 + navigation + new components.

Rollback: revert commit; Step 1 returns to linear mapping (undesirable once Step 2 ships).

## Open Questions

- **$\gamma$ naming step:** defer to Step 3+ (decided).
- **Step 2 closing disclaimer:** uniform-motion scope only; no “approximate numbers” disclaimer (decided).
