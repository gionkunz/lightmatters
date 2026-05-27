## 1. Orbit state in CurvedSurfaceRenderer

- [x] 1.1 Add spherical orbit offset state (`azimuth`, `elevation`) layered on authored base camera from `updateCamera`
- [x] 1.2 Implement pointer drag handlers on the canvas (pointer capture, sensitivity, elevation clamp)
- [x] 1.3 Apply orbit offset each render frame after base position/target are computed; preserve offset across fold/unfold input changes

## 2. Reset control

- [x] 2.1 Add `animateReset(durationMs)` to tween orbit offsets to zero with ease-out; cancel in-progress drag on reset start
- [x] 2.2 Add reset icon button overlay to `LmCurvedSurfaceComponent` (top-right, accessible label, interactive glow on hover)
- [x] 2.3 Wire button click to `renderer.animateReset()`; verify reset does not pause or advance timeline

## 3. Tests and QA

- [x] 3.1 Add unit tests for orbit offset math and reset completion (renderer or extracted helpers)
- [x] 3.2 Manual QA on Chapter 6 curved-surface steps: drag orbit on cylinder/cone views, reset animates to default, timeline playback unaffected
