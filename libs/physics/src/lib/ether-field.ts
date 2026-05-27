/**
 * Ether-field visualization helpers (Chapter 4 Step 2).
 * Pedagogical fiction — not physical light propagation.
 */

import type { Vec2 } from './light-scene';

/** Ether wind opposes frame motion through the stationary medium. */
export function etherWindVector(frameVelocity: Vec2): Vec2 {
  return { x: -frameVelocity.x, y: -frameVelocity.y };
}

/** Instantaneous tangential velocity on a circular path (SVG y-down). */
export function circularOrbitVelocity(
  angle: number,
  radius: number,
  angularSpeed: number,
): Vec2 {
  return {
    x: -radius * angularSpeed * Math.sin(angle),
    y: -radius * angularSpeed * Math.cos(angle),
  };
}

/** Position on a circular orbit (SVG y-down, CCW from +x). */
export function circularOrbitPosition(
  angle: number,
  radius: number,
  center: Vec2,
): Vec2 {
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y - radius * Math.sin(angle),
  };
}

/** Ether-dragged pulse center: emission point plus source velocity drift. */
export function etherDraggedPulseCenter(
  emissionPoint: Vec2,
  sourceVelocity: Vec2,
  elapsedSinceEmit: number,
): Vec2 {
  return {
    x: emissionPoint.x + sourceVelocity.x * elapsedSinceEmit,
    y: emissionPoint.y + sourceVelocity.y * elapsedSinceEmit,
  };
}

/** Expanding radius under ether drag (still grows at c). */
export function etherDraggedPulseRadius(
  elapsedSinceEmit: number,
  c = 1,
): number {
  return Math.max(0, c * elapsedSinceEmit);
}

/** Forward-leaning ellipse radii for a dragged wavefront (pedagogical exaggeration). */
export function etherDraggedPulseRadii(
  elapsedSinceEmit: number,
  speed: number,
  c = 1,
): { rx: number; ry: number } {
  const base = etherDraggedPulseRadius(elapsedSinceEmit, c);
  if (base <= 0) {
    return { rx: 0, ry: 0 };
  }
  const lean = Math.min(0.5, speed / 150);
  return {
    rx: base * (1 + lean),
    ry: base * Math.max(0.45, 1 - lean * 0.55),
  };
}
