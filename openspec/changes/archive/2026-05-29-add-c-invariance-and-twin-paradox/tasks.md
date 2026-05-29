## 1. Placement & dependencies

- [x] 1.1 Positions locked: "The same speed of light" = Chapter 5, "The twin paradox" = Chapter 8. Renumber + route scheme owned by `reorder-chapters-and-route-scheme` (lands first).
- [x] 1.2 Confirm landing order: after `physics-accuracy-pass` (relativistic Doppler) and the light-clock change; otherwise gate the Doppler-counting view. **Decision:** the `@lm/physics` relativistic-Doppler helper is not yet present (physics-accuracy-pass not landed); `@lm/light-clock` exists. The worldline/proper-time resolution is the core payoff; the Doppler-counting view is delivered geometrically as null light-signal lines on the twin spacetime diagram (relativistically exact by construction), with the numeric relativistic-Doppler-factor readout gated until the helper lands.

## 2. Physics helpers

- [x] 2.1 Add `properTimeAlongWorldline(segments)` to `@lm/physics` (Σ Δt·√(1−v²/c²), reuses `properTimeFraction`); export it.
- [x] 2.2 Add twin-readout formatting consistent with existing readout helpers.
- [x] 2.3 Unit tests: at-rest returns full T; 0.6c out-and-back returns T·0.8; age-difference formatting.

## 3. Chapter — "The same speed of light"

- [x] 3.1 Scaffold `libs/features/chapter-05-constant-c`; export routes; register in registry, `app.routes.ts`, server routes/SEO.
- [x] 3.2 Step 1 — recall + pose the question (c asserted before; now demonstrate).
- [x] 3.3 Step 2 — ground-frame flash on `lm-light-scene`: wavefront centered on emission point at c; A centered, B drifts off-center; narration poses the puzzle.
- [x] 3.4 Step 3 — frame switch to B: re-derive the scene with B at rest; wavefront centered on B at c; narration frames dilation/contraction/relative-simultaneity as the *forced consequences* (resolving the Ch3 puzzle; the light clock proves them next). Implemented by step-level re-derivation (B at rest, A moving) — no `light-scene` change needed.
- [x] 3.5 Step 4 — outro: c-invariance as foundation; bridge; no gravity/E=mc².
- [x] 3.6 Wire navigation to adjacent chapters per the final map (ch4 step5 → ch5; ch5 outro → ch6 step1; ch6 step1 back → ch5 step4).

## 4. Chapter — "The twin paradox"

- [x] 4.1 Scaffold `libs/features/chapter-08-twin-paradox`; export routes; register in registry, `app.routes.ts`, server routes/SEO.
- [x] 4.2 Step 1 — both worldlines on `spacetime-diagram` (straight vs. bent, turnaround corner), A/B accents. Added a `twin` variant to `lm-spacetime-diagram`.
- [x] 4.3 Step 2 — state the apparent paradox (each sees the other slow).
- [x] 4.4 Step 3 — asymmetry resolution: turnaround breaks symmetry; show straight worldline has greatest proper time (use `properTimeAlongWorldline`); traveller younger; no gravity-magic framing.
- [x] 4.5 Step 4 — Doppler-counting view: light-signal (null) lines on the twin diagram show the rate switch at turnaround vs. the delayed switch for the stay-at-home; readout totals match proper time. Numeric relativistic-Doppler-factor readout gated (helper absent) per 1.2.
- [x] 4.6 Step 5 — outro: proper time is path-dependent (straightest = oldest); bridge to GR block (chapter 10; chapter 9 E=mc² not yet authored).
- [x] 4.7 Wire navigation to adjacent chapters per the final map (ch7 outro → ch8 step1; ch8 outro → ch10 step1; ch10 step1 back → ch8 step5).

## 5. Integration & verification

- [x] 5.1 Update sitemap/prerender enumeration and landing/chapter-index chapter lists.
- [x] 5.2 Run `nx affected -t lint test build --tui=false`; fix failures. (Build prerendered 54 routes; lint + physics/spacetime-diagram tests green. Note: build/test require Node ≥22.)
- [ ] 5.3 Manually walk both chapters (light/dark); sign off on the frame-switch clarity and the twin resolution.
- [x] 5.4 `openspec validate add-c-invariance-and-twin-paradox --strict`. → "Change is valid".
