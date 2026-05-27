## Context

`CurvedSurfaceRenderer` (`libs/primitives/curved-surface`) uses Three.js with a fixed camera position computed by `updateCamera(camera, fold, unfold)` — lerping between `CAMERA_FLAT`, `CAMERA_CYLINDER`, and `CAMERA_UNROLLED` with a matching look-at target. There is no pointer handling on the canvas. Chapter 6 steps embed `lm-curved-surface` as a read-only visualization; readers cannot inspect the surface from other angles.

The design system contract: interactive elements glow; diagram/scene linework stays quiet. A reset control is a secondary chrome affordance, not a primary interactive parameter.

## Goals / Non-Goals

**Goals:**

- Pointer drag on the canvas orbits the camera around the scene target (fixed at the lerped `CAMERA_TARGET` / `CAMERA_TARGET_UNROLLED` for the current fold/unfold state).
- A reset icon button on the scene overlay animates camera orientation back to the authored default for the current scene state.
- Orbit offset composes **on top of** timeline-driven base camera positions — when fold/unfold/time inputs change, base camera updates; user orbit delta persists until reset.
- Pattern lives in the primitive so all Chapter 6 steps inherit it without step changes.

**Non-Goals:**

- Zoom, pan, or free-flight camera (orbit only).
- Orbit on non-WebGL primitives (`lm-light-scene` is 2-D SVG).
- Persisting camera angle across step navigation (resets on remount per architecture).
- Adding `OrbitControls` from three/examples (keep dependency surface minimal; hand-roll spherical offset).

## Decisions

### 1. Spherical orbit offset layered on authored base position

Store user orbit as `{ azimuth, elevation }` offsets (radians). Each frame:

1. Compute base position + target from `updateCamera` logic (existing).
2. Apply offset by rotating the vector from target → camera around target using spherical delta.
3. Clamp elevation to avoid flipping past the poles (~ ±80°).

When `fold` / `unfold` change from timeline inputs, recompute base position but **keep** user offset until reset.

**Alternative considered:** Mutate camera position directly and lose base on morph. Rejected — fold animations would fight user orbit.

### 2. Pointer handling in `CurvedSurfaceRenderer`

Attach `pointerdown` / `pointermove` / `pointerup` / `pointercancel` on the canvas with `{ passive: false }` for drag. Use pointer capture during drag. Ignore drags that start on the reset button (handled in component overlay).

Sensitivity: ~0.005 rad/px, matching common orbit feel.

### 3. Reset button in `LmCurvedSurfaceComponent`

Absolute-positioned icon button in the top-right of the scene container (inside the relative wrapper, above canvas). Uses ink-faint idle styling; hover glow per interactive contract. `aria-label="Reset view"`.

On click, call `renderer.animateReset(durationMs)` — tween orbit offsets to zero over ~400ms with ease-out (reuse engine easing helpers or inline cubic).

Show button whenever the canvas is visible (always on 3D scenes).

### 4. Reset animation cancels in-progress drag

Starting reset cancels active pointer capture and lerps offsets to 0; base camera continues following fold/unfold.

### 5. No timeline integration

Orbit and reset do not emit timeline events, pause narration, or bind to `TargetRegistry`.

## Risks / Trade-offs

- **[Orbit during fold morph feels odd]** → Base camera moves under fixed offset; reset restores authored framing. Mitigation: reset button always visible.
- **[Touch vs mouse]** → Pointer events cover both. Mitigation: test on trackpad and touch.
- **[Axis labels misaligned after orbit]** → SVG axis labels are screen-fixed overlays, not 3-D anchored. Mitigation: acceptable — labels are approximate hints for flat/cylinder modes only.
- **[Performance]** → One extra matrix multiply per frame. Mitigation: negligible for this scene complexity.

## Migration Plan

1. Implement orbit state + pointer handlers in `CurvedSurfaceRenderer`.
2. Add reset overlay to `LmCurvedSurfaceComponent`.
3. Unit test reset animation completion; manual QA on Chapter 6 Steps 2–5.
4. No migration; rollback = revert primitive commit.

## Open Questions

- Icon: Unicode ↺ vs inline SVG? **Decision:** small inline SVG path matching design system stroke weight (consistent with playback bar icons discussion).
- Should orbit be disableable via input for future steps? **Decision:** not in v1; always enabled on 3D scenes.
