import type { Vec3 } from './curved-surface';

/**
 * Epstein folded-paper profile for a tunnel through Earth.
 * Outer space is **narrow**; the center is a **wide** flat cylinder (weightless).
 * Cones **expand** toward the surface (larger circumference = stronger gravity).
 */
export interface WellParams {
  /** Scene extent along the space axis (normalized x ∈ [-1, 1] maps to ±length/2). */
  length: number;
  /** Narrow radius in outer-space cylinders. */
  spaceRadius: number;
  /** Wide radius in Earth's flat center cylinder (weightless region). */
  bulgeRadius: number;
  /** Wireframe Earth globe drawn inside the center cylinder. */
  earthSphereRadius: number;
  outerLeft: number;
  innerLeft: number;
  innerRight: number;
  outerRight: number;
  smoothPower: number;
}

export const DEFAULT_WELL_PARAMS: WellParams = {
  length: 3.4,
  spaceRadius: 0.28,
  bulgeRadius: 1,
  earthSphereRadius: 0.72,
  outerLeft: -0.55,
  innerLeft: -0.17,
  innerRight: 0.17,
  outerRight: 0.55,
  smoothPower: 2,
};

/** Energy at/above which the trajectory reaches outer space on the far side. */
export const WELL_ESCAPE_ENERGY_THRESHOLD = 0.72;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** Piecewise Epstein bulge: narrow → expanding cone → wide center → contracting cone → narrow. */
function piecewiseRadiusAt(xNorm: number, params: WellParams): number {
  const {
    spaceRadius,
    bulgeRadius,
    outerLeft,
    innerLeft,
    innerRight,
    outerRight,
  } = params;

  if (xNorm <= outerLeft) {
    return spaceRadius;
  }
  if (xNorm <= innerLeft) {
    const t = (xNorm - outerLeft) / (innerLeft - outerLeft);
    return lerp(spaceRadius, bulgeRadius, t);
  }
  if (xNorm <= innerRight) {
    return bulgeRadius;
  }
  if (xNorm <= outerRight) {
    const t = (xNorm - innerRight) / (outerRight - innerRight);
    return lerp(bulgeRadius, spaceRadius, t);
  }
  return spaceRadius;
}

/** Smooth bulge: flat outer cylinders, widest at x = 0. */
function smoothRadiusAt(xNorm: number, params: WellParams): number {
  const absX = Math.abs(xNorm);
  const { spaceRadius, bulgeRadius, smoothPower, outerRight } = params;

  if (absX >= outerRight) {
    return spaceRadius;
  }

  const u = absX / outerRight;
  return spaceRadius + (bulgeRadius - spaceRadius) * (1 - u ** smoothPower);
}

/** Cross-section radius at normalized space coordinate x ∈ [-1, 1]. */
export function wellRadiusAt(
  xNorm: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
): number {
  const piecewise = piecewiseRadiusAt(xNorm, params);
  const smooth = smoothRadiusAt(xNorm, params);
  return lerp(piecewise, smooth, wellMorph);
}

/** Normalized x up to which the bulge is visible when wellReveal ∈ [0, 1]. */
export function wellRevealMaxX(wellReveal: number): number {
  return lerp(-1, 1, Math.max(0, Math.min(1, wellReveal)));
}

/** Whether xNorm lies within the revealed portion of the bulge. */
export function isWellXRevealed(
  xNorm: number,
  wellReveal: number,
): boolean {
  return xNorm <= wellRevealMaxX(wellReveal) + 1e-6;
}

/** Point on the bulge surface; xNorm ∈ [-1, 1], θ wraps time around the axis. */
export function wellSurfacePoint(
  theta: number,
  xNorm: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
): Vec3 {
  const radius = wellRadiusAt(xNorm, wellMorph, params);
  const spaceX = (xNorm * params.length) / 2;
  return {
    x: spaceX,
    y: radius * Math.cos(theta),
    z: radius * Math.sin(theta),
  };
}

/** Wireframe sphere strips for Earth at the center of the bulge. */
export function earthSphereWireframeStrips(
  params: WellParams = DEFAULT_WELL_PARAMS,
  segments = 24,
): Vec3[][] {
  const r = params.earthSphereRadius;
  const strips: Vec3[][] = [];
  const ring = (fn: (t: number) => Vec3) => {
    const pts: Vec3[] = [];
    for (let i = 0; i <= segments; i++) {
      pts.push(fn((i / segments) * 2 * Math.PI));
    }
    strips.push(pts);
  };

  ring((t) => ({ x: 0, y: r * Math.cos(t), z: r * Math.sin(t) }));
  ring((t) => ({ x: r * Math.sin(t), y: r * Math.cos(t), z: 0 }));
  ring((t) => ({ x: r * Math.sin(t), y: 0, z: r * Math.cos(t) }));

  for (const lat of [0.45, 0.75]) {
    const y0 = r * lat;
    const ringR = r * Math.sqrt(1 - lat * lat);
    ring((t) => ({ x: ringR * Math.sin(t), y: y0, z: ringR * Math.cos(t) }));
    ring((t) => ({ x: ringR * Math.sin(t), y: -y0, z: ringR * Math.cos(t) }));
  }

  return strips;
}

export function isEscapeTrajectory(
  energy: number,
  _params: WellParams = DEFAULT_WELL_PARAMS,
): boolean {
  return energy >= WELL_ESCAPE_ENERGY_THRESHOLD;
}

/**
 * Step 6: fraction of the speed budget dedicated to **space** (running toward
 * Earth). The remainder is **time** (winding around the cylinder). Launch is
 * always from the gravity-less outer cylinder at x = −1.
 */
export const WELL_ESCAPE_SPATIAL_THRESHOLD = WELL_ESCAPE_ENERGY_THRESHOLD;

export function isEscapeSpatialBudget(
  spatialFraction: number,
  _params: WellParams = DEFAULT_WELL_PARAMS,
): boolean {
  return spatialFraction >= WELL_ESCAPE_SPATIAL_THRESHOLD;
}

/** Normalized x where outer space begins on the left (start of the first cylinder). */
export const WELL_OUTER_SPACE_X_NORM = -1;

/** Normalized x at the weightless center of Earth (middle of the flat cylinder). */
export const WELL_WEIGHTLESS_CENTER_X_NORM = 0;

/** Map Step 6 start slider (0 = far outer space, 1 = weightless center). */
export function wellStartXNormFromPositionFraction(
  fraction: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
): number {
  void params;
  const t = Math.max(0, Math.min(1, fraction));
  return lerp(WELL_OUTER_SPACE_X_NORM, WELL_WEIGHTLESS_CENTER_X_NORM, t);
}

/** Single fall-through vs continuous round-trip for bound trajectories. */
export type WellTrajectoryMode = 'pass-through' | 'oscillate';

export type WellLaunchMode = 'energy' | 'spatial-budget';

/**
 * Free-fall on the Epstein bulge is harmonic about the wide center: the worldline
 * "rolls" symmetrically between two turning points (rest where the surface bends
 * the trajectory back). Energy ↔ amplitude (drop height); higher energy reaches
 * further up the cones, escape energy launches past the outer rim.
 */
function trajectoryAmplitude(energy: number, params: WellParams): number {
  const frac = Math.min(1, energy / WELL_ESCAPE_ENERGY_THRESHOLD);
  // Even at minimum energy, oscillation is visible; at threshold, swings through
  // the entire cone region (-outerLeft .. +outerRight).
  const minA = params.innerRight * 1.5;
  const maxA = Math.abs(params.outerLeft);
  return lerp(minA, maxA, frac);
}

/**
 * Normalized space coordinate where the worldline begins (the near turning point).
 * For bound energies this is the rest point on the near cone; for escape energies
 * the trajectory still launches from the same point but never returns.
 */
export function wellTrajectoryEntryXNorm(
  energy: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
): number {
  return -trajectoryAmplitude(energy, params);
}

/**
 * Pass-through (Step 4 / timeline playback): half a cycle, particle dropped from
 * the near turning point falls through the center and reaches the far turning
 * point at properTime = 1. For escape energy, the second half straightens out
 * along the contracting cone and out into outer space.
 */
function passThroughXNorm(
  energy: number,
  properTime: number,
  params: WellParams,
): number {
  const A = trajectoryAmplitude(energy, params);
  if (isEscapeTrajectory(energy, params)) {
    // Cosine-shaped fall through the center, then straighten out toward +1.
    if (properTime <= 0.5) {
      return -A * Math.cos(Math.PI * properTime);
    }
    const t = smoothstep((properTime - 0.5) * 2);
    return lerp(0, 1, t);
  }
  return -A * Math.cos(Math.PI * properTime);
}

/**
 * Oscillate (Step 5 free exploration): full harmonic cycle. Bound energies
 * loop between -A and +A indefinitely; escape energies degrade to pass-through.
 */
function oscillateXNorm(
  energy: number,
  properTime: number,
  params: WellParams,
): number {
  const A = trajectoryAmplitude(energy, params);
  return -A * Math.cos(2 * Math.PI * properTime);
}

function trajectoryXNorm(
  energy: number,
  properTime: number,
  params: WellParams,
  mode: WellTrajectoryMode,
): number {
  if (mode === 'oscillate' && !isEscapeTrajectory(energy, params)) {
    return oscillateXNorm(energy, properTime, params);
  }
  return passThroughXNorm(energy, properTime, params);
}

function trajectoryTheta(
  energy: number,
  properTime: number,
  mode: WellTrajectoryMode,
): number {
  if (mode === 'oscillate') {
    // One revolution per full cycle so t=0 and t=1 line up exactly.
    return properTime * 2 * Math.PI;
  }
  // Half a revolution per pass-through trip — gentle spiral, no dizzying wrap.
  const revolutions = 0.5 + energy * 0.4;
  return properTime * revolutions * 2 * Math.PI;
}

// ─── Spatial-budget launch (Step 6) ───────────────────────────────────────────
//
// Frictionless symmetric motion: start at xStart on the left, mirror to −xStart on
// the far side, return. |v| = 1 always; spatialFraction α is the cruise spatial
// speed in flat regions. Small ease bands at turning points only — not in the cylinders.

const SPATIAL_BUDGET_EASE_FRAC = 0.035;

export const WELL_DEFAULT_START_X_NORM = -1;

/** Mirror launch point through the weightless center. */
export function wellMirrorXNorm(startXNorm: number): number {
  return -startXNorm;
}

const SPATIAL_BUDGET_TABLE_SIZE = 96;

interface SpatialBudgetCache {
  key: string;
  xStart: number;
  xPeak: number;
  tauHalf: number;
  tauCycle: number;
  dxNormCruise: number;
  totalArcLength: number;
  /** Pure circumferential launch at the weightless center (no radial travel). */
  isCenterLaunch: boolean;
  /** θ at each table index i mapped to properTime i / (N−1). */
  thetas: Float64Array;
  /** Cumulative 3D arc length at each table index. */
  arcLengths: Float64Array;
}

let spatialBudgetCache: SpatialBudgetCache | null = null;

function vec3Dist(a: Vec3, b: Vec3): number {
  return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
}

function spatialBudgetEaseTau(tauHalf: number): number {
  return SPATIAL_BUDGET_EASE_FRAC * tauHalf;
}

/** Cruise |dx_norm/dτ| so spatial speed (L/2)|dx/dτ| equals α in flat regions. */
function spatialBudgetCruiseDxNormDtau(
  alpha: number,
  params: WellParams,
): number {
  return (2 * alpha) / params.length;
}

function spatialBudgetTauHalf(
  spatialFraction: number,
  xStart: number,
  xPeak: number,
  params: WellParams,
): number {
  const alpha = Math.max(1e-4, Math.min(1, spatialFraction));
  const span = Math.abs(xPeak - xStart);
  if (span < 1e-6) {
    return 1e-3;
  }
  const cruiseTau = (params.length * span) / (2 * alpha);
  return cruiseTau / (1 - SPATIAL_BUDGET_EASE_FRAC);
}

/** ∫₀ᵘ smoothstep(s) ds = u³ − u⁴/2 */
function smoothstepIntegral(u: number): number {
  const x = Math.max(0, Math.min(1, u));
  return x * x * x - 0.5 * x * x * x * x;
}

/** x on the inbound half-cycle; ease only near τ = 0 and τ = tauHalf. */
function spatialBudgetXInbound(
  tauLocal: number,
  tauHalf: number,
  xStart: number,
  xPeak: number,
  dxNormCruise: number,
): number {
  const easeTau = spatialBudgetEaseTau(tauHalf);
  const easeDist = dxNormCruise * easeTau * 0.5;

  if (tauLocal <= easeTau) {
    return xStart + dxNormCruise * easeTau * smoothstepIntegral(tauLocal / easeTau);
  }
  if (tauLocal >= tauHalf - easeTau) {
    const tRem = tauHalf - tauLocal;
    return xPeak - dxNormCruise * easeTau * smoothstepIntegral(tRem / easeTau);
  }
  return xStart + easeDist + dxNormCruise * (tauLocal - easeTau);
}

function spatialBudgetDxNormDtauAt(
  tauLocal: number,
  tauHalf: number,
  dxNormCruise: number,
): number {
  const easeTau = spatialBudgetEaseTau(tauHalf);
  if (tauLocal < easeTau) {
    return dxNormCruise * smoothstep(tauLocal / easeTau);
  }
  if (tauLocal > tauHalf - easeTau) {
    return dxNormCruise * smoothstep((tauHalf - tauLocal) / easeTau);
  }
  return dxNormCruise;
}

function spatialBudgetXFromTau(
  tau: number,
  tauHalf: number,
  xStart: number,
  xPeak: number,
  dxNormCruise: number,
  mode: WellTrajectoryMode,
): number {
  if (tau <= tauHalf) {
    return spatialBudgetXInbound(
      Math.max(0, tau),
      tauHalf,
      xStart,
      xPeak,
      dxNormCruise,
    );
  }
  if (mode === 'oscillate') {
    const tauLocal = 2 * tauHalf - tau;
    return spatialBudgetXInbound(
      Math.max(0, tauLocal),
      tauHalf,
      xStart,
      xPeak,
      dxNormCruise,
    );
  }
  return xPeak;
}

function spatialBudgetSignedDxNormDtau(
  tau: number,
  tauHalf: number,
  dxNormCruise: number,
  mode: WellTrajectoryMode,
): number {
  if (tau <= tauHalf) {
    return spatialBudgetDxNormDtauAt(tau, tauHalf, dxNormCruise);
  }
  if (mode === 'oscillate') {
    const tauLocal = 2 * tauHalf - tau;
    return -spatialBudgetDxNormDtauAt(tauLocal, tauHalf, dxNormCruise);
  }
  return 0;
}

function clampWellStartXNorm(startXNorm: number): number {
  return Math.max(-1, Math.min(WELL_WEIGHTLESS_CENTER_X_NORM, startXNorm));
}

function spatialBudgetCacheKey(
  spatialFraction: number,
  startXNorm: number,
  wellMorph: number,
  mode: WellTrajectoryMode,
): string {
  return `${spatialFraction.toFixed(5)}:${startXNorm.toFixed(5)}:${wellMorph}:${mode}`;
}

function buildSpatialBudgetCache(
  spatialFraction: number,
  startXNorm: number,
  wellMorph: number,
  params: WellParams,
  mode: WellTrajectoryMode,
): SpatialBudgetCache {
  const xStart = clampWellStartXNorm(startXNorm);
  const xPeak = wellMirrorXNorm(xStart);
  const span = Math.abs(xPeak - xStart);
  const alpha = Math.max(1e-4, Math.min(1, spatialFraction));
  const dxNormCruise = spatialBudgetCruiseDxNormDtau(alpha, params);
  const isCenterLaunch = span < 1e-6;
  const key = spatialBudgetCacheKey(spatialFraction, xStart, wellMorph, mode);

  let tauHalf: number;
  if (isCenterLaunch) {
    const refArc = buildSpatialBudgetCache(
      spatialFraction,
      WELL_DEFAULT_START_X_NORM,
      wellMorph,
      params,
      mode,
    ).totalArcLength;
    const timeMag = Math.sqrt(Math.max(0, 1 - alpha * alpha));
    tauHalf = refArc / Math.max(timeMag, 1e-6);
  } else {
    tauHalf = spatialBudgetTauHalf(spatialFraction, xStart, xPeak, params);
  }

  const tauCycle = mode === 'oscillate' ? 2 * tauHalf : tauHalf;
  const thetas = new Float64Array(SPATIAL_BUDGET_TABLE_SIZE);
  const arcLengths = new Float64Array(SPATIAL_BUDGET_TABLE_SIZE);
  thetas[0] = 0;
  arcLengths[0] = 0;

  const integrateSteps = 200;
  let theta = 0;
  let tau = 0;
  let prevPoint = wellSurfacePoint(0, xStart, wellMorph, params);

  for (let i = 1; i < SPATIAL_BUDGET_TABLE_SIZE; i++) {
    const targetTau = (i / (SPATIAL_BUDGET_TABLE_SIZE - 1)) * tauCycle;
    while (tau < targetTau - 1e-12) {
      const remaining = targetTau - tau;
      const dTauStep = Math.min(remaining, targetTau / integrateSteps);
      let xNorm = xStart;
      let vxMag: number;

      if (isCenterLaunch) {
        vxMag = 0;
        const r = Math.max(wellRadiusAt(xStart, wellMorph, params), 1e-6);
        const timeMag = Math.sqrt(Math.max(0, 1 - alpha * alpha));
        theta += (timeMag / r) * dTauStep;
      } else {
        const dxNormDtau = spatialBudgetSignedDxNormDtau(
          tau,
          tauHalf,
          dxNormCruise,
          mode,
        );
        vxMag = Math.abs((params.length / 2) * dxNormDtau);
        xNorm = spatialBudgetXFromTau(
          tau,
          tauHalf,
          xStart,
          xPeak,
          dxNormCruise,
          mode,
        );
        const timeMag = Math.sqrt(Math.max(0, 1 - vxMag * vxMag));
        const r = Math.max(wellRadiusAt(xNorm, wellMorph, params), 1e-6);
        theta += (timeMag / r) * dTauStep;
      }

      void vxMag;
      tau += dTauStep;
    }

    const xNorm = isCenterLaunch
      ? xStart
      : spatialBudgetXFromTau(
          targetTau,
          tauHalf,
          xStart,
          xPeak,
          dxNormCruise,
          mode,
        );
    const point = wellSurfacePoint(theta, xNorm, wellMorph, params);
    arcLengths[i] = arcLengths[i - 1] + vec3Dist(prevPoint, point);
    thetas[i] = theta;
    prevPoint = point;
  }

  return {
    key,
    xStart,
    xPeak,
    tauHalf,
    tauCycle,
    dxNormCruise,
    totalArcLength: arcLengths[SPATIAL_BUDGET_TABLE_SIZE - 1],
    isCenterLaunch,
    thetas,
    arcLengths,
  };
}

function ensureSpatialBudgetCache(
  spatialFraction: number,
  startXNorm: number,
  wellMorph: number,
  params: WellParams,
  mode: WellTrajectoryMode,
): SpatialBudgetCache {
  const xStart = clampWellStartXNorm(startXNorm);
  const key = spatialBudgetCacheKey(spatialFraction, xStart, wellMorph, mode);
  if (spatialBudgetCache?.key === key) {
    return spatialBudgetCache;
  }

  spatialBudgetCache = buildSpatialBudgetCache(
    spatialFraction,
    startXNorm,
    wellMorph,
    params,
    mode,
  );
  return spatialBudgetCache;
}

/** Total 3D arc length for the reference launch from far outer space. */
export function spatialBudgetReferenceArcLength(
  spatialFraction: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
  mode: WellTrajectoryMode = 'pass-through',
): number {
  return buildSpatialBudgetCache(
    spatialFraction,
    WELL_DEFAULT_START_X_NORM,
    wellMorph,
    params,
    mode,
  ).totalArcLength;
}

/**
 * Wall-clock duration scale for pass-through playback: shorter trips take less
 * time so on-screen speed stays comparable to the full outer-space launch.
 */
export function spatialBudgetPassThroughDurationScale(
  spatialFraction: number,
  startXNorm: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
): number {
  const refArc = spatialBudgetReferenceArcLength(
    spatialFraction,
    wellMorph,
    params,
    'pass-through',
  );
  const cur = ensureSpatialBudgetCache(
    spatialFraction,
    startXNorm,
    wellMorph,
    params,
    'pass-through',
  );
  return Math.max(0.08, cur.totalArcLength / Math.max(refArc, 1e-6));
}

function spatialBudgetArcAtProperTime(
  cache: SpatialBudgetCache,
  properTime: number,
): number {
  const t = Math.max(0, Math.min(1, properTime));
  const f = t * (SPATIAL_BUDGET_TABLE_SIZE - 1);
  const lo = Math.floor(f);
  const hi = Math.min(SPATIAL_BUDGET_TABLE_SIZE - 1, lo + 1);
  const u = f - lo;
  return cache.arcLengths[lo] + (cache.arcLengths[hi] - cache.arcLengths[lo]) * u;
}

function spatialBudgetProperTimeAtArc(
  cache: SpatialBudgetCache,
  targetArc: number,
): number {
  const s = Math.max(0, Math.min(cache.totalArcLength, targetArc));
  if (s <= 0) {
    return 0;
  }
  if (s >= cache.totalArcLength) {
    return 1;
  }

  let lo = 0;
  let hi = SPATIAL_BUDGET_TABLE_SIZE - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cache.arcLengths[mid] < s) lo = mid;
    else hi = mid;
  }
  const a = cache.arcLengths[lo];
  const b = cache.arcLengths[hi];
  const seg = b - a;
  const frac = seg > 1e-9 ? (s - a) / seg : 0;
  return (lo + frac) / (SPATIAL_BUDGET_TABLE_SIZE - 1);
}

function spatialBudgetThetaAtProperTime(
  cache: SpatialBudgetCache,
  properTime: number,
): number {
  const t = Math.max(0, Math.min(1, properTime));
  const f = t * (SPATIAL_BUDGET_TABLE_SIZE - 1);
  const lo = Math.floor(f);
  const hi = Math.min(SPATIAL_BUDGET_TABLE_SIZE - 1, lo + 1);
  const u = f - lo;
  return cache.thetas[lo] + (cache.thetas[hi] - cache.thetas[lo]) * u;
}

interface SpatialBudgetState {
  xNorm: number;
  theta: number;
}

function spatialBudgetState(
  spatialFraction: number,
  properTime: number,
  wellMorph: number,
  params: WellParams,
  mode: WellTrajectoryMode,
  startXNorm: number,
): SpatialBudgetState {
  const cache = ensureSpatialBudgetCache(
    spatialFraction,
    startXNorm,
    wellMorph,
    params,
    mode,
  );
  const targetTau = properTime * cache.tauCycle;
  const clampedTau = Math.min(targetTau, cache.tauCycle);
  if (cache.isCenterLaunch) {
    return {
      xNorm: cache.xStart,
      theta: spatialBudgetThetaAtProperTime(cache, properTime),
    };
  }
  return {
    xNorm: spatialBudgetXFromTau(
      clampedTau,
      cache.tauHalf,
      cache.xStart,
      cache.xPeak,
      cache.dxNormCruise,
      mode,
    ),
    theta: spatialBudgetThetaAtProperTime(cache, properTime),
  };
}

/** Spatial speed |(L/2) dx/dτ| along the worldline (≈ α in flat cruise regions). */
export function spatialBudgetSpatialSpeedMagnitude(
  spatialFraction: number,
  properTime: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
  mode: WellTrajectoryMode = 'pass-through',
  startXNorm: number = WELL_DEFAULT_START_X_NORM,
  dt = 2e-3,
): number {
  const cache = ensureSpatialBudgetCache(
    spatialFraction,
    startXNorm,
    wellMorph,
    params,
    mode,
  );
  const t0 = Math.max(0, properTime - dt);
  const t1 = Math.min(1, properTime + dt);
  const a = spatialBudgetState(
    spatialFraction,
    t0,
    wellMorph,
    params,
    mode,
    startXNorm,
  );
  const b = spatialBudgetState(
    spatialFraction,
    t1,
    wellMorph,
    params,
    mode,
    startXNorm,
  );
  const dxPhys = ((b.xNorm - a.xNorm) * params.length) / 2;
  const dTau = (t1 - t0) * cache.tauCycle;
  return dTau > 1e-9 ? Math.abs(dxPhys / dTau) : cache.dxNormCruise * (params.length / 2);
}

/** Approximate proper speed |v| along the worldline (should ≈ 1). */
export function spatialBudgetProperSpeed(
  spatialFraction: number,
  properTime: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
  mode: WellTrajectoryMode = 'pass-through',
  startXNorm: number = WELL_DEFAULT_START_X_NORM,
  dt = 1e-3,
): number {
  const cache = ensureSpatialBudgetCache(
    spatialFraction,
    startXNorm,
    wellMorph,
    params,
    mode,
  );
  const t0 = Math.max(0, properTime - dt);
  const t1 = Math.min(1, properTime + dt);
  const a = spatialBudgetState(
    spatialFraction,
    t0,
    wellMorph,
    params,
    mode,
    startXNorm,
  );
  const b = spatialBudgetState(
    spatialFraction,
    t1,
    wellMorph,
    params,
    mode,
    startXNorm,
  );
  const dxPhys = ((b.xNorm - a.xNorm) * params.length) / 2;
  const r = wellRadiusAt(a.xNorm, wellMorph, params);
  const dTheta = b.theta - a.theta;
  const ds = Math.sqrt(dxPhys * dxPhys + (r * dTheta) * (r * dTheta));
  const dTau = (t1 - t0) * cache.tauCycle;
  return dTau > 1e-9 ? ds / dTau : 1;
}

/** Position along a frictionless symmetric spatial-budget launch. */
export function wellSpatialBudgetTrajectoryPoint(
  spatialFraction: number,
  properTime: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
  mode: WellTrajectoryMode = 'pass-through',
  startXNorm: number = WELL_DEFAULT_START_X_NORM,
): Vec3 {
  const { xNorm, theta } = spatialBudgetState(
    spatialFraction,
    properTime,
    wellMorph,
    params,
    mode,
    startXNorm,
  );
  return wellSurfacePoint(theta, xNorm, wellMorph, params);
}

/** Fading trail samples (arc-length uniform; tail size is fixed in world units). */
export function wellSpatialBudgetTrajectorySamples(
  spatialFraction: number,
  segmentCount: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
  properTime = 1,
  trailSpan = 1,
  mode: WellTrajectoryMode = 'pass-through',
  startXNorm: number = WELL_DEFAULT_START_X_NORM,
): WellTrailSample[] {
  const count = Math.max(0, Math.floor(segmentCount));
  if (count === 0) {
    return [];
  }

  const cache = ensureSpatialBudgetCache(
    spatialFraction,
    startXNorm,
    wellMorph,
    params,
    mode,
  );
  const refArc = spatialBudgetReferenceArcLength(
    spatialFraction,
    wellMorph,
    params,
    mode,
  );
  const tailArc = Math.max(1e-6, trailSpan * refArc);
  const endArc = spatialBudgetArcAtProperTime(cache, properTime);
  const startArc = Math.max(0, endArc - tailArc);

  if (endArc - startArc < 1e-9) {
    const p = wellSpatialBudgetTrajectoryPoint(
      spatialFraction,
      properTime,
      wellMorph,
      params,
      mode,
      startXNorm,
    );
    return [{ ...p, age: 1 }];
  }

  const samples: WellTrailSample[] = [];
  for (let i = 0; i < count; i++) {
    const u = count === 1 ? 1 : i / (count - 1);
    const targetArc = lerp(startArc, endArc, u);
    const t = spatialBudgetProperTimeAtArc(cache, targetArc);
    const point = wellSpatialBudgetTrajectoryPoint(
      spatialFraction,
      t,
      wellMorph,
      params,
      mode,
      startXNorm,
    );
    samples.push({ ...point, age: u });
  }
  return samples;
}

/** Position along a pedagogical bulge trajectory at properTime ∈ [0, 1]. */
export function wellTrajectoryPoint(
  energy: number,
  properTime: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
  mode: WellTrajectoryMode = 'pass-through',
): Vec3 {
  const xNorm = trajectoryXNorm(energy, properTime, params, mode);
  const theta = trajectoryTheta(energy, properTime, mode);
  return wellSurfacePoint(theta, xNorm, wellMorph, params);
}

export interface WellTrailSample extends Vec3 {
  age: number;
}

/** Fading trail samples for a bulge trajectory. */
export function wellTrajectorySamples(
  energy: number,
  segmentCount: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
  properTime = 1,
  trailSpan = 1,
  mode: WellTrajectoryMode = 'pass-through',
): WellTrailSample[] {
  const count = Math.max(0, Math.floor(segmentCount));
  if (count === 0) {
    return [];
  }

  const span = Math.max(1e-6, trailSpan);
  const startT = Math.max(0, properTime - span);
  const samples: WellTrailSample[] = [];

  for (let i = 0; i < count; i++) {
    const u = count === 1 ? 1 : i / (count - 1);
    const t = lerp(startT, properTime, u);
    const point = wellTrajectoryPoint(energy, t, wellMorph, params, mode);
    samples.push({ ...point, age: u });
  }

  return samples;
}

// ─── Piecewise unfold (Step 3 paper demo) ────────────────────────────────────

export type WellSegmentKind = 'cylinder' | 'cone';

export interface WellSegment {
  kind: WellSegmentKind;
  /** Normalized x bounds of the segment, with xStartNorm < xEndNorm. */
  xStartNorm: number;
  xEndNorm: number;
  /** Radius at xStartNorm / xEndNorm (constant for cylinders, sloped for cones). */
  rStart: number;
  rEnd: number;
}

/**
 * Five-segment piecewise layout for the bulge: outer cylinder (left),
 * expanding cone, wide center cylinder (Earth), contracting cone, outer
 * cylinder (right). Used by the paper-unfold view in Step 3.
 */
export function wellUnrollSegmentLayout(
  params: WellParams = DEFAULT_WELL_PARAMS,
): WellSegment[] {
  const {
    spaceRadius,
    bulgeRadius,
    outerLeft,
    innerLeft,
    innerRight,
    outerRight,
  } = params;
  return [
    {
      kind: 'cylinder',
      xStartNorm: -1,
      xEndNorm: outerLeft,
      rStart: spaceRadius,
      rEnd: spaceRadius,
    },
    {
      kind: 'cone',
      xStartNorm: outerLeft,
      xEndNorm: innerLeft,
      rStart: spaceRadius,
      rEnd: bulgeRadius,
    },
    {
      kind: 'cylinder',
      xStartNorm: innerLeft,
      xEndNorm: innerRight,
      rStart: bulgeRadius,
      rEnd: bulgeRadius,
    },
    {
      kind: 'cone',
      xStartNorm: innerRight,
      xEndNorm: outerRight,
      rStart: bulgeRadius,
      rEnd: spaceRadius,
    },
    {
      kind: 'cylinder',
      xStartNorm: outerRight,
      xEndNorm: 1,
      rStart: spaceRadius,
      rEnd: spaceRadius,
    },
  ];
}

function wrapTheta(theta: number): number {
  const TWO_PI = 2 * Math.PI;
  let t = ((theta % TWO_PI) + TWO_PI) % TWO_PI;
  if (t > Math.PI) t -= TWO_PI;
  return t;
}

/**
 * Point on the unrolled flat paper for the piecewise bulge.
 *
 * - `x` = scene-x (same axis as the rolled view), so the unfold preserves the
 *   horizontal space axis.
 * - `y` = signed circumference offset `theta · R(x)`, with theta wrapped to
 *   `[-π, π]`. The cut runs along `theta = ±π` (back of the cylinder).
 * - `z` = 0.
 *
 * This is a developable approximation: cylinders unroll exactly to rectangles
 * of height `2π · R`; cones are flattened along the meridian (visualized as
 * trapezoids), close to but not exactly the isometric circular-sector unroll.
 * The trade-off keeps the layout axis-aligned with the rolled view so the
 * straight-line worldline punchline reads cleanly.
 */
export function wellSurfacePointUnrolled(
  theta: number,
  xNorm: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
): Vec3 {
  const radius = wellRadiusAt(xNorm, 0, params);
  const sceneX = (xNorm * params.length) / 2;
  const wrapped = wrapTheta(theta);
  return { x: sceneX, y: wrapped * radius, z: 0 };
}

/**
 * Worldline for the unfold demo: a straight line in unrolled paper coordinates
 * `(sceneX, v)`. When the paper rolls back, `theta = v / R(x)` — so theta
 * varies with x as `R(x)` does, producing a curve on the rolled bulge that is
 * piecewise-straight on the unrolled paper.
 *
 * Energy controls the v-slope (how much rotation per unit space — Epstein's
 * "speed budget"), and properTime ∈ [0, 1] sweeps from the near outer cylinder
 * through the bulge to the far outer cylinder.
 */
function piecewiseStraightUnrolled(
  energy: number,
  properTime: number,
  params: WellParams,
): { sceneX: number; v: number } {
  const { length, spaceRadius, bulgeRadius } = params;
  const xStartNorm = -1;
  const xEndNorm = 1;
  const xNorm = lerp(xStartNorm, xEndNorm, properTime);
  const sceneX = (xNorm * length) / 2;

  const avgR = (spaceRadius + bulgeRadius) / 2;
  const totalV = Math.PI * avgR * (0.6 + energy * 0.6);
  const v = totalV * (properTime - 0.5);

  return { sceneX, v };
}

/**
 * Convert an unrolled `(sceneX, v)` point back onto the rolled piecewise bulge.
 * `theta = v / R(x)` — local radius scales the v coordinate to an angle.
 */
function piecewiseUnrolledToRolled(
  sceneX: number,
  v: number,
  params: WellParams,
): Vec3 {
  const xNorm = Math.max(-1, Math.min(1, (sceneX * 2) / params.length));
  const radius = Math.max(1e-6, wellRadiusAt(xNorm, 0, params));
  const theta = v / radius;
  return wellSurfacePoint(theta, xNorm, 0, params);
}

/**
 * Trajectory point morphed between rolled and unrolled views.
 *
 * - `wellMorph >= 1`: smooth bulge → harmonic-cosine trajectory (`wellUnfold`
 *   ignored, since the smooth bulge is not developable).
 * - `wellMorph = 0`: piecewise bulge → straight-on-paper trajectory; rolled
 *   when `wellUnfold = 0`, flat 2D paper when `wellUnfold = 1`.
 * - Intermediate `wellMorph`: cosine-interpolated between piecewise rolled and
 *   harmonic rolled (used during Step 4's smooth morph; `wellUnfold` clamped).
 */
export function wellTrajectoryPointMorphed(
  energy: number,
  properTime: number,
  wellMorph: number,
  wellUnfold: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
  mode: WellTrajectoryMode = 'pass-through',
): Vec3 {
  const morph = Math.max(0, Math.min(1, wellMorph));
  const unfoldRaw = morph > 1e-6 ? 0 : Math.max(0, Math.min(1, wellUnfold));

  if (morph >= 1 - 1e-6) {
    return wellTrajectoryPoint(energy, properTime, 1, params, mode);
  }

  const flat = piecewiseStraightUnrolled(energy, properTime, params);
  const rolledPiecewise = piecewiseUnrolledToRolled(flat.sceneX, flat.v, params);

  let rolled: Vec3 = rolledPiecewise;
  if (morph > 0) {
    const harmonic = wellTrajectoryPoint(energy, properTime, morph, params, mode);
    rolled = {
      x: lerp(rolledPiecewise.x, harmonic.x, morph),
      y: lerp(rolledPiecewise.y, harmonic.y, morph),
      z: lerp(rolledPiecewise.z, harmonic.z, morph),
    };
  }

  if (unfoldRaw <= 0) {
    return rolled;
  }

  const unrolled: Vec3 = { x: flat.sceneX, y: flat.v, z: 0 };
  const eased = smoothstep(unfoldRaw);
  return {
    x: lerp(rolled.x, unrolled.x, eased),
    y: lerp(rolled.y, unrolled.y, eased),
    z: lerp(rolled.z, unrolled.z, eased),
  };
}

/** Fading trail samples following `wellTrajectoryPointMorphed`. */
export function wellTrajectoryMorphedSamples(
  energy: number,
  segmentCount: number,
  wellMorph: number,
  wellUnfold: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
  properTime = 1,
  trailSpan = 1,
  mode: WellTrajectoryMode = 'pass-through',
): WellTrailSample[] {
  const count = Math.max(0, Math.floor(segmentCount));
  if (count === 0) return [];
  const span = Math.max(1e-6, trailSpan);
  const startT = Math.max(0, properTime - span);
  const samples: WellTrailSample[] = [];
  for (let i = 0; i < count; i++) {
    const u = count === 1 ? 1 : i / (count - 1);
    const t = lerp(startT, properTime, u);
    const p = wellTrajectoryPointMorphed(
      energy,
      t,
      wellMorph,
      wellUnfold,
      params,
      mode,
    );
    samples.push({ ...p, age: u });
  }
  return samples;
}
