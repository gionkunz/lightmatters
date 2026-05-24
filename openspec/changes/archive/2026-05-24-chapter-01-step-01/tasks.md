## 1. Library scaffolding and module boundaries

- [x] 1.1 Verify `@nx/enforce-module-boundaries` allows `scope:primitive` → `scope:engine`, `scope:design`, `scope:physics`; add tag if missing
- [x] 1.2 Generate `libs/primitives/spacetime-diagram` with `NX_TUI=false nx g @nx/angular:library --name=spacetime-diagram --directory=libs/primitives/spacetime-diagram --tags=scope:primitive --style=scss --skipModule=true --unitTestRunner=jest`
- [x] 1.3 Generate `libs/features/chapter-01-position-time` with `NX_TUI=false nx g @nx/angular:library --name=feature-chapter-01-position-time --directory=libs/features/chapter-01-position-time --tags=scope:feature --style=scss --skipModule=true --unitTestRunner=jest`
- [x] 1.4 Register path aliases in `tsconfig.base.json` if generators do not (`@lm/spacetime-diagram`, `@lm/feature-chapter-01-position-time`)
- [x] 1.5 Add `@source` directives for new libs in `apps/lightmatters/src/styles.css`

## 2. Timeline engine (libs/engine)

- [x] 2.1 Define TypeScript types: `Step`, `TimelineEvent` (`narrate`, `animate`, `wait`), `WaitCondition`, easing helpers
- [x] 2.2 Implement `TimelineRunner` service: sequential event walk, rAF scheduling, signals for playhead/waiting state
- [x] 2.3 Implement `skip()`: complete in-progress narrate + animate instantly, jump to next `wait`
- [x] 2.4 Implement animate interpolation (linear + ease-out) targeting named properties via a simple target registry
- [x] 2.5 Unit-test runner: event ordering, skip semantics, wait unblocking, reset on restart
- [x] 2.6 Export public API from `libs/engine/src/index.ts`; remove placeholder generator stub

## 3. Narrator component (libs/engine)

- [x] 3.1 Create `LmNarrator` standalone component: kicker slot, typewriter reveal, blinking caret
- [x] 3.2 Wire narrator to `TimelineRunner` narrate events via signal/effect or injection token
- [x] 3.3 Implement skip-to-complete for in-progress narration
- [x] 3.4 Export from `@lm/engine`

## 4. Step chrome (libs/engine)

- [x] 4.1 Create `LmStepFrame`: chapter nav (number, title), progress dots, step counter — port layout from `step-ui.jsx`
- [x] 4.2 Create step footer: back control, conditional advance (hidden when no next step)
- [x] 4.3 Create `LmStepHost`: resolve `:step` param, load step module, mount visualizations, start runner, keyboard Space/Enter handler
- [x] 4.4 Implement visualization remount lifecycle (destroy on step exit, fresh mount on entry)
- [x] 4.5 Export step chrome components from `@lm/engine`

## 5. Design system — LmSlider (libs/design)

- [x] 5.1 Create `LmSlider` component porting prototype `Slider`: label, value display, accent color input, `lmInteractive` on thumb
- [x] 5.2 Export `LmSlider` from `@lm/design`
- [x] 5.3 Add minimal unit test (renders label + emits value changes)

## 6. Spacetime diagram primitive (libs/primitives/spacetime-diagram)

- [x] 6.1 Create `LmSpacetimeDiagram` with `variant="position-only"`: horizontal x-axis, ticks, `x` label, point at normalized `position`
- [x] 6.2 Use SVG + theme token strokes; no glow on diagram elements
- [x] 6.3 Expose `position` as animatable input (0–1); register with timeline target registry as `diagram.position`
- [x] 6.4 Export from `@lm/spacetime-diagram`
- [x] 6.5 Snapshot or unit test: renders axis + point at given position

## 7. Chapter 1 feature — routing and shell

- [x] 7.1 Create `chapter01.routes.ts`: `{ path: '', component: ChapterShellComponent, children: [ step/:step → LmStepHost, redirect '' → step/1 ] }`
- [x] 7.2 Create `ChapterShellComponent`: wraps `LmStepHost` with chapter metadata (title, total steps = 6)
- [x] 7.3 Create step registry: map step numbers → lazy step modules; handle unknown step fallback
- [x] 7.4 Export `chapter01Routes` from feature public API
- [x] 7.5 Wire `app.routes.ts`: lazy `loadChildren` at `/ch/01`

## 8. Chapter 1 Step 1 content

- [x] 8.1 Author `steps/step-01-position.ts`: `Step` object with id `position-intro`, kicker, layout `intro`, timeline (2 narrate beats, animate point entry, wait userAdvance)
- [x] 8.2 Create `Step01Component` (or inline in host): StepIntro grid — narrator top, diagram center, `LmSlider` bottom bound to diagram position
- [x] 8.3 Wire slider interaction after timeline exploration wait; initial position 0.5
- [x] 8.4 Verify narration copy matches design.md beats

## 9. Landing page links

- [x] 9.1 Update Hero primary CTA to route to `/ch/01/step/1` (routerLink)
- [x] 9.2 Update Chapter 1 preview card to route to `/ch/01/step/1`

## 10. Verification

- [x] 10.1 `nx build lightmatters --tui=false` succeeds
- [x] 10.2 `nx lint engine design spacetime-diagram feature-chapter-01-position-time lightmatters --tui=false` succeeds
- [x] 10.3 `nx test engine --tui=false` succeeds (timeline runner tests)
- [x] 10.4 Manual smoke: `nx serve lightmatters --tui=false` — navigate `/ch/01/step/1`, verify narration plays, slider moves point, skip works, back returns to `/`, theme toggle works on step page
