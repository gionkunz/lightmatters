## Why

Chapter 6's curved-surface primitive renders a fixed camera angle chosen for each fold/unfold state. Readers cannot inspect the cylinder, cone, or geodesic paths from other viewpoints, which limits spatial intuition — especially on the oblique cylinder views. A standard orbit interaction (drag to rotate, fixed look-at target) plus a reset control restores the authored default framing when exploration gets disorienting.

## What Changes

- **Orbit interaction:** All WebGL 3D scene primitives SHALL support pointer drag to orbit the camera around a fixed target at the scene origin (or state-appropriate target for morphing views).
- **Reset control:** Each 3D scene SHALL expose a reset icon button overlay that animates the camera back to the authored default position/orientation for the current scene state (fold, unfold, etc.).
- **Timeline coexistence:** Camera orbit and reset are user-driven overlays — they do not pause or advance the timeline and do not fight timeline-driven camera updates until the user orbits; reset returns to the authored default.
- **Scope:** Applies to `libs/primitives/curved-surface` today; pattern should be reusable if additional WebGL primitives are added later.

## Capabilities

### New Capabilities

- `curved-surface`: camera orbit interaction and animated reset for the WebGL curved-surface primitive.

### Modified Capabilities

_(none — curved-surface is not yet in `openspec/specs/`; this change introduces the capability spec.)_

## Impact

- **`libs/primitives/curved-surface`:** `CurvedSurfaceRenderer` — spherical orbit state, pointer handlers, reset animation; `LmCurvedSurfaceComponent` — reset button overlay UI.
- **`libs/design` (optional):** shared reset icon button styling if not inlined in the primitive.
- **Chapter 6 steps:** inherit behavior automatically via `lm-curved-surface`; no timeline changes expected.
- **No new npm dependencies** (hand-rolled orbit math, consistent with hand-rolled tweening elsewhere).
