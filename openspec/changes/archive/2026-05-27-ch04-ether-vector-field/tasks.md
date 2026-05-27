## 1. Physics helpers (optional)

- [x] 1.1 Add `etherWindVector(frameVelocity)` to `libs/physics/src/lib/` (negated velocity) + unit test
- [x] 1.2 Add `circularOrbitVelocity(angle, radius, angularSpeed)` helper + unit test (skip if inlined in component)

## 2. Ether field scene component

- [x] 2.1 Create `lm-ether-field-scene.component.ts` in chapter-04 steps folder — SVG viewBox, grid layout, dot vs arrow rendering
- [x] 2.2 Implement phase 0 (dot grid at rest) and phase 1 (linear ether-wind arrows)
- [x] 2.3 Implement phase 2 (red dot on circular path, local opposing arrows)
- [x] 2.4 Implement phase 3 (ether-dragged pulses: drifting center + expanding radius)
- [x] 2.5 Implement phase 4 (Earth orbit positions + abstract expected-vs-null fringe readout, no apparatus)
- [x] 2.6 Wire timeline inputs via `@Input()` or signal inputs: `phase`, `frameVelocity`, `orbitAngle`, `time`, `earthOrbitIndex`

## 3. Step 2 timeline + component rewire

- [x] 3.1 Rewrite `step-02-michelson-morley.ts` — new narrate beats for phases 0–4, animate segments, checkpoint timing
- [x] 3.2 Update `step-02.component.ts` — replace schematic with `lm-diagram-viewport` + `LmEtherFieldSceneComponent`; register `TargetRegistry` bindings
- [x] 3.3 Delete `lm-michelson-morley-schematic.component.ts` and remove all imports

## 4. Cross-step polish + docs

- [x] 4.1 Review Step 1 closing beat — ensure it no longer implies an apparatus drawing is coming
- [x] 4.2 Update `docs/product.md` Chapter 4 Step 2 bullet (vector field + null result, not apparatus schematic)

## 5. Verification

- [ ] 5.1 Manual spot-check all five phases in light and dark theme at `/ch/04/step/2` (blocked: `nx build` fails in this environment with Angular ESM require error; `tsc --noEmit` passes)
- [x] 5.2 Run `nx lint chapter-04-ether-was-wrong --tui=false` and `nx test physics --tui=false` (if helpers added)
