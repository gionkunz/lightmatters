import { properTimeFraction } from './lorentz';

/** One constant-velocity leg of a worldline. */
export interface WorldlineSegment {
  /** Coordinate-time duration of this leg (same units as the result). */
  readonly dt: number;
  /** Speed of this leg as a fraction of c, in [0, 1]. */
  readonly vOverC: number;
}

/**
 * Proper time accumulated along a piecewise-constant-velocity worldline:
 * `Σ Δt · √(1 − v²/c²)`. A purely time-like (every `vOverC = 0`) worldline
 * returns the total coordinate time; any leg with motion reduces the total.
 */
export function properTimeAlongWorldline(
  segments: readonly WorldlineSegment[],
): number {
  let proper = 0;
  for (const segment of segments) {
    const dt = Math.max(0, segment.dt);
    proper += dt * properTimeFraction(segment.vOverC);
  }
  return proper;
}
