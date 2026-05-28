## 1. Placement decision

- [x] 1.1 Placement locked: Chapter 6 "Clocks & rulers" (after "The same speed of light", Chapter 5). Renumber + route scheme owned by `reorder-chapters-and-route-scheme` (lands first).

## 2. Physics helpers

- [x] 2.1 Add `lengthContraction(properLength, vOverC)` to `@lm/physics` (reuses `properTimeFraction`).
- [x] 2.2 Add `tickPeriod(restPeriod, vOverC)` to `@lm/physics` (reuses `lorentz`).
- [x] 2.3 Add unit tests covering rest values, the 0.6c sample (γ = 1.25), monotonicity, and limits; export both from `libs/physics/src/index.ts`.

## 3. lm-light-clock primitive

- [x] 3.1 Generate `libs/primitives/light-clock` (`scope:primitive`) with `nx g @nx/angular:library` (NX_TUI=false, `--name=light-clock`).
- [x] 3.2 Implement `lm-light-clock`: two mirrors + bouncing photon, line-art, theme tokens, prerender-safe (afterNextRender / isPlatformBrowser).
- [x] 3.3 Implement animatable `velocity` (v/c → path tilt, longer diagonal, speed held at c) and `tick`/`progress` (one round trip per tick; expose tick-complete signal).
- [x] 3.4 Add primitive snapshot/unit tests (rest vertical bounce vs. moving diagonal) and wire dependency tags/lint boundaries.

## 4. Chapter feature lib

- [x] 4.1 Scaffold `libs/features/chapter-<NN>-clocks-and-rulers` via the chapter generator; export routes; register in the chapter registry, `app.routes.ts`, and `app.routes.server.ts`/SEO step list.
- [x] 4.2 Step 1 — light clock at rest: render `lm-light-clock`, narration (one bounce = one tick, photon at c), timeline + advance.
- [x] 4.3 Step 2 — moving clock: `v / c` slider bound to `velocity`; tick-period readout = `tickPeriod`; narration derives time dilation and ties to the Ch2 speed budget.
- [x] 4.4 Step 3 — length contraction: `v/c`-driven contraction visual (reuse spacetime-diagram, or minimal ruler) with readout = `lengthContraction`; narration (partner effect, along-motion only, muon intuition).
- [x] 4.5 Step 4 — outro: unify dilation + contraction (one geometry, constant c); bridge forward; no gravity/E=mc².
- [x] 4.6 Wire forward/back navigation between steps and to adjacent chapters per the final map.

## 5. Integration & verification

- [x] 5.1 Update sitemap/prerender enumeration and any landing/chapter-index chapter list entries.
- [x] 5.2 Run `nx affected -t lint test build --tui=false`; fix failures.
- [x] 5.3 Manually walk the chapter in light and dark themes; sign off on pacing and the dilation/contraction readouts.
- [x] 5.4 `openspec validate add-light-clock-and-length-contraction --strict`.
