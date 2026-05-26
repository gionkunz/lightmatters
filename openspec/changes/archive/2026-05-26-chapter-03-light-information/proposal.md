## Why

Chapter 2 closes with the speed-budget grammar firmly in place: vertical = at rest, horizontal = light, every object moves at $c$ through spacetime. The bridge step previews "light is pure spatial motion" and tells the reader we will switch cameras. Chapter 3 must deliver on that handoff and explore **light as the carrier of information** — synchronized arrival, irregular arrival under motion, and the relativity of simultaneity — without forcing readers to learn a second spacetime-diagram convention (Minkowski) only to abandon it again in Chapters 6–8 (curved Epstein surfaces).

The cleanest answer is to leave the spacetime diagram behind for Chapter 3 and watch what happens **in space, from above**. Wavefronts are inherently spatial; rendering them as expanding circles in 2-D space is what readers' physical intuition already wants. The Epstein convention from Chapters 1–2 is preserved untouched and returns intact for Chapter 6.

## What Changes

- New visual primitive **`lm-light-scene`**: top-down 2-D space view with positionable observers, optional motion, expanding light circles emitted by sources, optional clock counters at each observer, and timeline-driven emission events.
- New physics helper module `light-scene.ts` (or extension of existing physics): pulse reception times in 2-D space (stationary + uniformly moving observer), pulse cadence helpers for Doppler-style rhythm.
- Author **Chapter 3** at `/ch/03/step/N` for N ∈ {1..5} (pending user approval — the count may change):
  1. **Step 1 — Light through space**: introduce the camera switch; one source, one expanding circle, one observer; the pulse arrives, observer's counter ticks once.
  2. **Step 2 — Two listeners**: source plus two stationary observers equidistant; both counters tick at the same instant; symmetry baked in.
  3. **Step 3 — One of them moves**: same setup, one observer slides toward/away; counters tick at different instants; intuition for "motion changes when news arrives."
  4. **Step 4 — Two flashes, one witness**: two stationary sources flash simultaneously in the page frame; a stationary middle observer sees both at once; a moving middle observer sees one before the other → **relativity of simultaneity**.
  5. **Step 5 — What we will not show yet**: closing beat that names Doppler, aberration, and the ether question, and points forward to Chapters 4–5.
- Replace the chapter 3 stub at `libs/features/chapter-03-light-information/src/lib/step-placeholder.component.ts` with real step components and registry.
- Update `docs/product.md` Chapter 3 section to reflect "spatial scene, not spacetime diagram" and the convention boundaries.

**Deliberately deferred to later chapters:**
- Source-vs-observer motion symmetry / ether discussion → Chapter 4.
- Doppler shift + redshift/blueshift → Chapter 5.
- Aberration ("rain on windshield") → Chapter 5.
- Acceleration animations → Chapter 5+.

**Not included in this change:**
- No new timeline event types. Existing `narrate` / `animate` / `wait` are sufficient. The light-scene primitive exposes targets like `scene.time`, `scene.observerB.x`, etc. for the timeline runner.
- No spacetime-diagram changes beyond what Chapter 2 already shipped.

## Capabilities

### New Capabilities

- `light-scene`: 2-D top-down space primitive — observers as dots, sources emitting expanding light circles at $c$, optional uniform observer motion, reception markers + counters, timeline-driven emission and observer-position targets.
- `chapter-03-step-01`: **Light through space** — primitive intro, single source + observer, single pulse.
- `chapter-03-step-02`: **Two listeners** — symmetric stationary observers, simultaneous arrival.
- `chapter-03-step-03`: **One of them moves** — uniform-motion observer, asymmetric arrival.
- `chapter-03-step-04`: **Two flashes, one witness** — relativity of simultaneity.
- `chapter-03-step-05`: **Outro** — name what is coming in Chapters 4–5.

### Modified Capabilities

- `physics`: add 2-D pulse reception helpers (stationary observer at arbitrary position, uniformly moving observer); pulse-train cadence at a moving receiver (preview helper, not full Doppler).
- `app-shell`: register Chapter 3 routes (`/ch/03/step/{1..5}`).

## Impact

- **New library:** `libs/primitives/light-scene/` (Nx generator).
- **Updated library:** `libs/physics/` adds `light-scene-physics.ts` (or similar) with pure helper functions + tests.
- **Replaced library:** `libs/features/chapter-03-light-information/` — placeholder removed; per-step components and a step registry mirror `chapter-02-speed-budget`.
- **Routing:** `apps/lightmatters/src/app/app.routes.ts` — Chapter 3 routes now resolve real components.
- **Docs:** `docs/product.md` Chapter 3 section rewritten to reflect "spatial scene" framing; `docs/architecture.md` build order ticks off Chapter 3.
- **No breaking changes** to existing primitives or chapters. The spacetime-diagram primitive's `wavefront` variant is left untouched (deferred review for whether Step 3 should also shed unused signal modes — out of scope for this change).
