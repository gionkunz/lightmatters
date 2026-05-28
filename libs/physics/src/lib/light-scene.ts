/**
 * 2-D light-scene physics helpers.
 *
 * Used by `lm-light-scene` and Chapter 3 steps. Pure functions; no Angular dependency.
 * Coordinates are unitless scene units; `c = 1` by default so a pulse expands one
 * scene unit per scene-time unit. Pass `c` explicitly to use other unit systems.
 */

import { lorentz } from './lorentz';

export interface Vec2 {
  readonly x: number;
  readonly y: number;
}

export function vec2(x: number, y: number): Vec2 {
  return { x, y };
}

export function distance(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

/** Position of a uniformly moving point at scene time `t`. */
export function sourcePositionAt(
  start: Vec2,
  velocity: Vec2,
  time: number,
): Vec2 {
  return {
    x: start.x + velocity.x * time,
    y: start.y + velocity.y * time,
  };
}

/** Position of a source at emission time (alias for clarity in step code). */
export function emissionPosition(
  start: Vec2,
  velocity: Vec2 | undefined,
  emitTime: number,
): Vec2 {
  const v = velocity ?? { x: 0, y: 0 };
  return sourcePositionAt(start, v, emitTime);
}

/** Reception time at a stationary observer for a pulse emitted from `source` at t = 0. */
export function pulseReachesStationary(
  source: Vec2,
  observer: Vec2,
  c = 1,
): number {
  if (c <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return distance(source, observer) / c;
}

/**
 * Reception time at an observer with uniform velocity `v`, starting at `O₀` at t = 0,
 * for a pulse emitted from `source` at t = 0. Solves `|O₀ + v·t − S| = c·t` for the
 * smallest positive `t`.
 *
 * Returns `null` when the observer is faster than light (`|v| ≥ c`) or no positive
 * solution exists (the pulse never reaches the observer).
 */
export function pulseReachesMoving(
  source: Vec2,
  observerStart: Vec2,
  observerVelocity: Vec2,
  c = 1,
): number | null {
  if (c <= 0) {
    return null;
  }
  const speed = Math.hypot(observerVelocity.x, observerVelocity.y);
  if (speed >= c) {
    return null;
  }

  const dx = observerStart.x - source.x;
  const dy = observerStart.y - source.y;
  const vx = observerVelocity.x;
  const vy = observerVelocity.y;

  // |d + v·t|² = (c·t)² → (vx² + vy² − c²)·t² + 2(d·v)·t + |d|² = 0
  const a = vx * vx + vy * vy - c * c;
  const b = 2 * (dx * vx + dy * vy);
  const dSquared = dx * dx + dy * dy;

  if (Math.abs(a) < 1e-12) {
    // Linear case: 0·t² + b·t + |d|² = 0 → t = −|d|²/b
    if (Math.abs(b) < 1e-12) {
      return null;
    }
    const t = -dSquared / b;
    return t > 0 ? t : null;
  }

  const discriminant = b * b - 4 * a * dSquared;
  if (discriminant < 0) {
    return null;
  }
  const sqrtDisc = Math.sqrt(discriminant);
  const t1 = (-b - sqrtDisc) / (2 * a);
  const t2 = (-b + sqrtDisc) / (2 * a);

  const candidates = [t1, t2].filter((t) => t > 1e-12);
  if (candidates.length === 0) {
    return null;
  }
  return Math.min(...candidates);
}

/** Radius of an expanding pulse circle at `currentTime`, given an emission at `emitTime`. */
export function lightCircleRadius(
  emitTime: number,
  currentTime: number,
  c = 1,
): number {
  return Math.max(0, c * (currentTime - emitTime));
}

export interface SceneEmission {
  readonly atTime: number;
  readonly pulseId: string;
}

/** Build a train of periodic emissions for pulse-train / Doppler steps. */
export function buildPeriodicEmissions(
  count: number,
  interval: number,
  startTime = 0,
  idPrefix = 'p',
): SceneEmission[] {
  return Array.from({ length: count }, (_, i) => ({
    atTime: startTime + i * interval,
    pulseId: `${idPrefix}${i}`,
  }));
}

/**
 * Build emissions spaced by the source's proper interval, mapped into scene time
 * with γ(β). Used for relativistic longitudinal Doppler in Chapter 5.
 */
export function buildRelativisticPeriodicEmissions(
  count: number,
  properInterval: number,
  beta: number,
  startTime = 0,
  idPrefix = 'p',
): SceneEmission[] {
  const gamma = lorentz(Math.abs(beta));
  return buildPeriodicEmissions(
    count,
    gamma * properInterval,
    startTime,
    idPrefix,
  );
}

/** Relativistic longitudinal Doppler factor on mean arrival interval (receding). */
export function relativisticDopplerRecedingFactor(beta: number): number {
  const b = Math.min(Math.max(0, Math.abs(beta)), 1 - Number.EPSILON);
  return Math.sqrt((1 + b) / (1 - b));
}

/** Relativistic longitudinal Doppler factor on mean arrival interval (approaching). */
export function relativisticDopplerApproachingFactor(beta: number): number {
  const b = Math.min(Math.max(0, Math.abs(beta)), 1 - Number.EPSILON);
  return Math.sqrt((1 - b) / (1 + b));
}

/** Classical light-travel-time-only factor (1±β) for comparison. */
export function classicalDopplerFactor(beta: number, receding: boolean): number {
  const b = Math.min(Math.max(0, Math.abs(beta)), 1 - Number.EPSILON);
  return receding ? 1 + b : 1 - b;
}

/**
 * Scene time when a pulse emitted at `emitTime` from a (possibly moving) source
 * reaches a (possibly moving) observer.
 */
export function pulseArrivalSceneTime(
  sourceStart: Vec2,
  sourceVelocity: Vec2 | undefined,
  emitTime: number,
  observerStart: Vec2,
  observerVelocity: Vec2 | undefined,
  c = 1,
): number | null {
  const emitPos = emissionPosition(sourceStart, sourceVelocity, emitTime);
  const obsVel = observerVelocity ?? { x: 0, y: 0 };
  let travel: number | null;
  if (obsVel.x === 0 && obsVel.y === 0) {
    travel = pulseReachesStationary(emitPos, observerStart, c);
  } else {
    travel = pulseReachesMoving(emitPos, observerStart, obsVel, c);
  }
  if (travel === null || !Number.isFinite(travel)) {
    return null;
  }
  return emitTime + travel;
}

/** Arrival scene times for each emission, sorted ascending. */
export function pulseArrivalSceneTimes(
  sourceStart: Vec2,
  sourceVelocity: Vec2 | undefined,
  emissions: readonly { atTime: number }[],
  observerStart: Vec2,
  observerVelocity: Vec2 | undefined,
  c = 1,
): number[] {
  const out: number[] = [];
  for (const emission of emissions) {
    const t = pulseArrivalSceneTime(
      sourceStart,
      sourceVelocity,
      emission.atTime,
      observerStart,
      observerVelocity,
      c,
    );
    if (t !== null) {
      out.push(t);
    }
  }
  return out.sort((a, b) => a - b);
}

/** Mean interval between consecutive arrival times (null if fewer than 2). */
export function meanPulseInterval(arrivals: readonly number[]): number | null {
  if (arrivals.length < 2) {
    return null;
  }
  let sum = 0;
  for (let i = 1; i < arrivals.length; i++) {
    sum += arrivals[i] - arrivals[i - 1];
  }
  return sum / (arrivals.length - 1);
}
