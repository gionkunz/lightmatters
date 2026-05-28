import type { Vec3 } from './curved-surface';
import {
  DEFAULT_WELL_PARAMS,
  wellRadiusAt,
  wellSurfacePoint,
  type WellParams,
} from './gravity-well';

export type LightBeamEdge = 'center' | 'inner' | 'outer';

/** Half-width offset between inner and outer beam edges (normalized miss distance). */
export const DEFAULT_BEAM_HALF_WIDTH = 0.2;

/**
 * Stronger Epstein bulge — same shape grammar as Chapter 7, steeper rims for
 * visible light deflection when used on the 3D well (Steps 6–7 payoff).
 */
export const DEEP_WELL_PARAMS: WellParams = {
  length: 3.4,
  spaceRadius: 0.24,
  bulgeRadius: 1.06,
  earthSphereRadius: 0.62,
  outerLeft: -0.55,
  innerLeft: -0.17,
  innerRight: 0.17,
  outerRight: 0.55,
  smoothPower: 2.6,
};

/** Fixed θ for the center ray; inner/outer offset in θ around the well. */
const LIGHT_BEAM_THETA = Math.PI * 0.5;
const EDGE_THETA_SPREAD = 0.55;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function edgeMissDistance(
  missDistance: number,
  edge: LightBeamEdge,
  beamHalfWidth: number,
): number {
  const m = clamp01(missDistance);
  if (edge === 'center') {
    return m;
  }
  if (edge === 'inner') {
    return clamp01(m - beamHalfWidth);
  }
  return clamp01(m + beamHalfWidth);
}

function edgeTheta(edge: LightBeamEdge): number {
  if (edge === 'inner') {
    return LIGHT_BEAM_THETA - EDGE_THETA_SPREAD;
  }
  if (edge === 'outer') {
    return LIGHT_BEAM_THETA + EDGE_THETA_SPREAD;
  }
  return LIGHT_BEAM_THETA;
}

/** Normalized x at closest approach; 0 = grazes center, 1 = far skim. */
function closestApproachX(missDistance: number): number {
  return clamp01(missDistance) * 0.52;
}

/** Space coordinate along the ray at progress ∈ [0, 1]. */
function lightGeodesicXNorm(
  progress: number,
  missDistance: number,
  edge: LightBeamEdge,
): number {
  const t = clamp01(progress);
  const closest = closestApproachX(missDistance);
  const oneMinusT = 1 - t;
  let x = oneMinusT * oneMinusT * -1 + 2 * oneMinusT * t * closest + t * t;
  const bow = Math.sin(Math.PI * t);
  if (edge === 'outer') {
    x += 0.2 * bow;
  } else if (edge === 'inner') {
    x -= 0.12 * bow;
  }
  return x;
}

export function resolveWellParams(wellDepth: 'earth' | 'deep'): WellParams {
  return wellDepth === 'deep' ? DEEP_WELL_PARAMS : DEFAULT_WELL_PARAMS;
}

export function lightGeodesicPoint(
  missDistance: number,
  edge: LightBeamEdge,
  progress: number,
  wellMorph: number,
  params: WellParams = DEEP_WELL_PARAMS,
  beamHalfWidth: number = DEFAULT_BEAM_HALF_WIDTH,
): Vec3 {
  const edgeMiss = edgeMissDistance(missDistance, edge, beamHalfWidth);
  const xNorm = lightGeodesicXNorm(progress, edgeMiss, edge);
  return wellSurfacePoint(edgeTheta(edge), xNorm, wellMorph, params);
}

export function lightGeodesicSamples(
  missDistance: number,
  edge: LightBeamEdge,
  segmentCount: number,
  wellMorph: number,
  params: WellParams = DEEP_WELL_PARAMS,
  beamHalfWidth: number = DEFAULT_BEAM_HALF_WIDTH,
): Vec3[] {
  const n = Math.max(2, segmentCount);
  const out: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const progress = i / (n - 1);
    out.push(
      lightGeodesicPoint(
        missDistance,
        edge,
        progress,
        wellMorph,
        params,
        beamHalfWidth,
      ),
    );
  }
  return out;
}

function segmentLength(a: Vec3, b: Vec3, spaceRadius: number): number {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const rAvg =
    (Math.hypot(a.y, a.z) + Math.hypot(b.y, b.z)) * 0.5;
  // Pedagogical spatial sweep: horizontal chord weighted by rim radius.
  const horizontal = Math.hypot(dx, dz);
  const radiusWeight = 0.25 + 0.75 * (rAvg / spaceRadius);
  return horizontal * radiusWeight;
}

export function lightGeodesicArcLength(
  missDistance: number,
  edge: LightBeamEdge,
  wellMorph: number,
  params: WellParams = DEEP_WELL_PARAMS,
  beamHalfWidth: number = DEFAULT_BEAM_HALF_WIDTH,
  sampleCount = 64,
): number {
  const samples = lightGeodesicSamples(
    missDistance,
    edge,
    sampleCount,
    wellMorph,
    params,
    beamHalfWidth,
  );
  let len = 0;
  for (let i = 1; i < samples.length; i++) {
    len += segmentLength(samples[i - 1], samples[i], params.spaceRadius);
  }
  // Pedagogical lane width: outer edge sweeps a wider spatial arc than inner.
  if (edge === 'outer') {
    return len * (1 + beamHalfWidth * 1.5);
  }
  if (edge === 'inner') {
    return len * (1 - beamHalfWidth * 0.55);
  }
  return len;
}

/** Gravitational time-dilation factor in (0, 1]; deeper in the well → slower clock. */
export function gravitationalTimeDilationFactor(
  xNorm: number,
  wellMorph: number,
  params: WellParams = DEEP_WELL_PARAMS,
): number {
  const r = wellRadiusAt(xNorm, wellMorph, params);
  const rCenter = wellRadiusAt(0, wellMorph, params);
  const rRim = params.spaceRadius;
  // Epstein bulge: center is wide (slow), rims narrow (fast).
  const depth = (r - rRim) / Math.max(1e-6, rCenter - rRim);
  return Math.max(0.05, Math.min(1, depth));
}

/** Closest-approach x for an edge (readouts and annotations). */
export function lightGeodesicClosestApproachX(
  missDistance: number,
  edge: LightBeamEdge,
  beamHalfWidth: number = DEFAULT_BEAM_HALF_WIDTH,
): number {
  return closestApproachX(edgeMissDistance(missDistance, edge, beamHalfWidth));
}
