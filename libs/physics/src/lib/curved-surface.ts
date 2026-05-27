import {
  APPLE_RELEASE_GLYPH,
  APPLE_TREE_STROKES,
  type TreePoint,
} from './apple-tree-glyph';

/** 3-D point in scene units. */
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Parametric dimensions for the folded spacetime surface. */
export interface CurvedSurfaceParams {
  height: number;
  topRadius: number;
  bottomRadius: number;
  /** Half-width of the flat strip at fold = 0. */
  flatWidth: number;
}

export const DEFAULT_CURVED_SURFACE_PARAMS: CurvedSurfaceParams = {
  height: 1.4,
  topRadius: 1,
  bottomRadius: 0.32,
  /** Visible width of the flat strip before rolling (space axis). */
  flatWidth: 0.28,
};

/** Visual scale for SVG apple trees (stem height, canopy width). */
const APPLE_TREE_SCALE = 2;
/** Stem length along the surface meridian (wide → narrow / +x). */
export const APPLE_STEM_SPACE_T = 0.1 * APPLE_TREE_SCALE;
/** spaceT of the releasing apple on the glyph canopy. */
export const APPLE_RELEASE_SPACE_T =
  APPLE_RELEASE_GLYPH[1] * APPLE_STEM_SPACE_T;

export type WorldlineMode = 'orbit' | 'time-only' | 'geodesic-fall' | 'apple-fall';

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t),
  };
}

/**
 * Point on a cylinder lying on its side: axis = space (x), circumference = time (θ).
 */
export function cylinderSurfacePoint(
  theta: number,
  spaceX: number,
  radius: number,
): Vec3 {
  return {
    x: spaceX,
    y: radius * Math.cos(theta),
    z: radius * Math.sin(theta),
  };
}

/** Truncated cone with axis along x; t ∈ [0, 1] from −length/2 to +length/2. */
export function coneSurfacePoint(
  theta: number,
  t: number,
  topRadius: number,
  bottomRadius: number,
  length: number,
): Vec3 {
  const spaceX = (t - 0.5) * length;
  const radius = topRadius + (bottomRadius - topRadius) * t;
  return {
    x: spaceX,
    y: radius * Math.cos(theta),
    z: radius * Math.sin(theta),
  };
}

function radiiAtCurvature(
  curvature: number,
  params: CurvedSurfaceParams,
): { top: number; bottom: number } {
  return {
    top: params.topRadius,
    bottom: lerp(params.topRadius, params.bottomRadius, curvature),
  };
}

/** Flat spacetime strip: time vertical (y), space fixed at x = 0. */
function flatWorldlinePoint(properTime: number, params: CurvedSurfaceParams): Vec3 {
  const y = lerp(-params.height / 2, params.height / 2, properTime);
  return { x: 0, y, z: 0 };
}

/** Bottom rim: fixed space (t = 0), motion purely in θ / time. */
function timeOnlyWorldlinePoint(
  curvature: number,
  properTime: number,
  params: CurvedSurfaceParams,
): Vec3 {
  const { top, bottom } = radiiAtCurvature(curvature, params);
  const theta = properTime * 2 * Math.PI;
  return coneSurfacePoint(theta, 0, top, bottom, params.height);
}

function timeOnlyWorldlinePointUnrolled(
  curvature: number,
  properTime: number,
  params: CurvedSurfaceParams,
): Vec3 {
  const theta = properTime * 2 * Math.PI;
  return unrolledSurfacePoint(theta, 0, curvature, params);
}

/** Starting 3D theta of the geodesic-fall worldline (front of the cone). */
const GEODESIC_START_THETA = Math.PI * 0.55;

interface GeodesicFallGeometry {
  sinA: number;
  rNarrow: number;
  rWide: number;
  sMax: number;
  /** Total Δθ_3D the geodesic sweeps from narrow → wide rim. */
  totalTurn: number;
  /** Half of the equivalent ψ angle (used to centre the unrolled sector). */
  psiHalf: number;
}

function buildGeodesicFallGeometry(
  curvature: number,
  params: CurvedSurfaceParams,
): GeodesicFallGeometry | null {
  const { top, bottom } = radiiAtCurvature(curvature, params);
  const wide = Math.max(top, bottom);
  const narrow = Math.min(top, bottom);
  const length = params.height;
  if (wide - narrow < 1e-3) return null;

  const slant = Math.hypot(length, wide - narrow);
  const sinA = (wide - narrow) / slant;
  const rNarrow = narrow / sinA;
  const rWide = wide / sinA;
  const sMax = Math.sqrt(rWide * rWide - rNarrow * rNarrow);
  const psiMax = Math.atan2(sMax, rNarrow);
  return {
    sinA,
    rNarrow,
    rWide,
    sMax,
    totalTurn: psiMax / sinA,
    psiHalf: psiMax / 2,
  };
}

/**
 * True cone geodesic (a straight line in the unrolled net), launched tangentially
 * at the narrow rim and spiralling toward the wide opening.
 *
 * As properTime goes 0 → 1 the path traces an arclength-parametrised geodesic that
 * — when the cone is unrolled — is a straight line. Re-rolled, it becomes a spiral
 * that drifts axially toward the bigger circumference.
 */
function geodesicFallPoint(
  curvature: number,
  properTime: number,
  params: CurvedSurfaceParams,
): Vec3 {
  const geom = buildGeodesicFallGeometry(curvature, params);
  const { top, bottom } = radiiAtCurvature(curvature, params);
  const length = params.height;

  // Cylinder fallback (no taper): pure helix on the surface.
  if (!geom) {
    const wide = Math.max(top, bottom);
    const turns = 1.5;
    const theta = GEODESIC_START_THETA + properTime * turns * 2 * Math.PI;
    const x = (properTime - 0.5) * length;
    return cylinderSurfacePoint(theta, x, wide);
  }

  const s = properTime * geom.sMax;
  const r = Math.hypot(geom.rNarrow, s);
  const psi = Math.atan2(s, geom.rNarrow);
  const theta = GEODESIC_START_THETA + psi / geom.sinA;

  const radiusAxis = r * geom.sinA;
  const wideAtTop = top >= bottom;
  const spaceT = wideAtTop
    ? (top - radiusAxis) / (top - bottom)
    : (radiusAxis - top) / (bottom - top);

  const x = (spaceT - 0.5) * length;

  return {
    x,
    y: radiusAxis * Math.cos(theta),
    z: radiusAxis * Math.sin(theta),
  };
}

function curvedWorldlinePoint(
  curvature: number,
  properTime: number,
  params: CurvedSurfaceParams,
  mode: WorldlineMode,
  unfold = 0,
): Vec3 {
  if (mode === 'apple-fall') {
    return appleFallPoint(curvature, properTime, params, unfold);
  }
  if (mode === 'geodesic-fall') {
    return geodesicFallPoint(curvature, properTime, params);
  }
  if (mode === 'time-only') {
    return timeOnlyWorldlinePoint(curvature, properTime, params);
  }

  const { top, bottom } = radiiAtCurvature(curvature, params);
  const theta = properTime * 2 * Math.PI;
  const orbitRadius = (top + bottom) / 2;
  return cylinderSurfacePoint(theta, 0, orbitRadius);
}

/**
 * Geometry of the truncated-cone unrolling, derived once and reused by the surface
 * mesh and the worldline. The unrolled sector lies flat in the (x, y) plane
 * centered around the origin; cut line is on the back of the cone.
 */
export interface ConeUnrollFrame {
  sinA: number;
  rTop: number;
  rBottom: number;
  rMid: number;
  scale: number;
  /** 3D theta to subtract before unrolling so the cut sits on the back side. */
  cutTheta: number;
}

const UNFOLD_DISPLAY_SCALE = 0.7;

export function buildConeUnrollFrame(
  curvature: number,
  params: CurvedSurfaceParams,
): ConeUnrollFrame {
  const { top, bottom } = radiiAtCurvature(curvature, params);
  const length = params.height;
  const wide = Math.max(top, bottom);
  const narrow = Math.min(top, bottom);

  // Cylinder fallback uses a pseudo-large slant so unrolling reads as a wide rectangle.
  if (wide - narrow < 1e-3) {
    const r = wide;
    return {
      sinA: 1e-3,
      rTop: r,
      rBottom: r,
      rMid: r,
      scale: UNFOLD_DISPLAY_SCALE,
      cutTheta: GEODESIC_START_THETA + Math.PI,
    };
  }

  const slant = Math.hypot(length, wide - narrow);
  const sinA = (wide - narrow) / slant;
  const rTop = top / sinA;
  const rBottom = bottom / sinA;
  const rMid = (rTop + rBottom) / 2;

  // Centre the unrolled sector on the geodesic so the cut sits opposite to it
  // (the geodesic stays inside the visible sector, not crossing the seam).
  const geom = buildGeodesicFallGeometry(curvature, params);
  const totalTurn = geom?.totalTurn ?? Math.PI;
  const cutTheta = GEODESIC_START_THETA + totalTurn / 2;

  return {
    sinA,
    rTop,
    rBottom,
    rMid,
    scale: UNFOLD_DISPLAY_SCALE,
    cutTheta,
  };
}

/** Angular sampling range for (theta, spaceT) surface meshes and wireframes. */
export function surfaceThetaSweep(
  unfold: number,
  curvature: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
): { cutTheta: number; min: number; max: number } {
  if (unfold <= 0) {
    return { cutTheta: 0, min: -Math.PI, max: Math.PI };
  }
  const frame = buildConeUnrollFrame(curvature, params);
  // Full sector spans θ_rel ∈ (−π, π]. Inset ε at both ends so wrapTheta(−π) ≡ +π
  // never appears as consecutive polyline vertices (that drew a chord across the fan).
  const eps = 1e-3;
  return { cutTheta: frame.cutTheta, min: -Math.PI + eps, max: Math.PI - eps };
}

function wrapTheta(theta: number): number {
  // Wrap to (-π, π].
  let t = theta;
  while (t > Math.PI) t -= 2 * Math.PI;
  while (t <= -Math.PI) t += 2 * Math.PI;
  return t;
}

/** Position of a (theta, spaceT) surface point on the unrolled sector (z = 0). */
export function unrolledSurfacePoint(
  theta: number,
  spaceT: number,
  curvature: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
): Vec3 {
  const frame = buildConeUnrollFrame(curvature, params);
  const { top, bottom } = radiiAtCurvature(curvature, params);
  const radius = top + (bottom - top) * spaceT;

  // Cylinder unrolls to a rectangle: time around (x = R·θ_rel), space along (y = L·spaceT).
  if (frame.sinA <= 1e-2) {
    const thetaRel = wrapTheta(theta - frame.cutTheta);
    return {
      x: thetaRel * radius * frame.scale,
      y: (spaceT - 0.5) * params.height * frame.scale,
      z: 0,
    };
  }

  const r = radius / frame.sinA;
  const thetaRel = wrapTheta(theta - frame.cutTheta);
  const phi = thetaRel * frame.sinA;

  // Sector apex above the canvas; wide rim sweeps below center.
  const x = r * Math.sin(phi);
  const y = -r * Math.cos(phi) + frame.rMid;
  return {
    x: x * frame.scale,
    y: y * frame.scale,
    z: 0,
  };
}

/**
 * Geodesic position on the unrolled sector — by construction a straight line.
 * Centred so the geodesic runs symmetrically across the visible sector.
 */
function unrolledGeodesicFallPoint(
  curvature: number,
  properTime: number,
  params: CurvedSurfaceParams,
): Vec3 {
  const frame = buildConeUnrollFrame(curvature, params);
  if (frame.sinA <= 1e-2) {
    const xRange = frame.rMid * 2;
    return {
      x: -xRange * 0.5 * frame.scale + properTime * xRange * frame.scale,
      y: ((properTime - 0.5) * params.height) * frame.scale,
      z: 0,
    };
  }

  const geom = buildGeodesicFallGeometry(curvature, params);
  if (!geom) return { x: 0, y: 0, z: 0 };

  // Closest-approach point of the unrolled straight line, rotated by -ψ_max/2 so the
  // geodesic sweeps symmetrically through the centre of the sector.
  const cosH = Math.cos(geom.psiHalf);
  const sinH = Math.sin(geom.psiHalf);
  const tangentX = -geom.rNarrow * sinH;
  const tangentY = -geom.rNarrow * cosH;
  const dirX = cosH;
  const dirY = -sinH;
  const s = properTime * geom.sMax;
  const x = tangentX + s * dirX;
  const y = tangentY + s * dirY + frame.rMid;
  return { x: x * frame.scale, y: y * frame.scale, z: 0 };
}

function curvedWorldlinePointUnrolled(
  curvature: number,
  properTime: number,
  params: CurvedSurfaceParams,
  mode: WorldlineMode,
): Vec3 {
  if (mode === 'geodesic-fall') {
    return unrolledGeodesicFallPoint(curvature, properTime, params);
  }
  if (mode === 'time-only') {
    return timeOnlyWorldlinePointUnrolled(curvature, properTime, params);
  }
  // Cylinder orbit unrolled: horizontal line at y = 0 (wide rim center), x sweeps
  // theta·R across the strip width.
  const frame = buildConeUnrollFrame(curvature, params);
  const { top, bottom } = radiiAtCurvature(curvature, params);
  const orbitRadius = (top + bottom) / 2;
  const r = frame.sinA > 1e-2 ? orbitRadius / frame.sinA : orbitRadius;
  const theta = properTime * 2 * Math.PI;
  const thetaRel = wrapTheta(theta - frame.cutTheta);
  const phi = thetaRel * frame.sinA;
  const x = r * Math.sin(phi);
  const y = -r * Math.cos(phi) + frame.rMid;
  return { x: x * frame.scale, y: y * frame.scale, z: 0 };
}

/** Flat strip → 3D surface (fold) → unrolled flat sector (unfold). */
export function morphSurfacePoint(
  fold: number,
  curvature: number,
  properTime: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
  mode: WorldlineMode = 'orbit',
  unfold = 0,
): Vec3 {
  const flat = flatWorldlinePoint(properTime, params);
  const curved = curvedWorldlinePoint(curvature, properTime, params, mode, unfold);
  const folded = lerpVec3(flat, curved, fold);
  if (mode === 'apple-fall') return curved;
  if (mode === 'time-only') {
    if (unfold <= 0) return folded;
    const unrolled = timeOnlyWorldlinePointUnrolled(curvature, properTime, params);
    return lerpVec3(folded, unrolled, unfold);
  }
  if (unfold <= 0) return folded;
  const unrolled = curvedWorldlinePointUnrolled(
    curvature,
    properTime,
    params,
    mode,
  );
  return lerpVec3(folded, unrolled, unfold);
}

/** Map a point on the unrolled net back onto the 3D cone. */
export function coneFromUnrolledPoint(
  point: Vec3,
  curvature: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
): Vec3 {
  const frame = buildConeUnrollFrame(curvature, params);
  const { top, bottom } = radiiAtCurvature(curvature, params);

  if (frame.sinA <= 1e-2) {
    const thetaRel = point.x / (frame.scale * top);
    const spaceT = point.y / (frame.scale * params.height) + 0.5;
    const theta = frame.cutTheta + thetaRel;
    return coneSurfacePoint(theta, spaceT, top, bottom, params.height);
  }

  const xs = point.x / frame.scale;
  const ys = point.y / frame.scale;
  const rNet = Math.hypot(xs, frame.rMid - ys);
  const phi = Math.atan2(xs, frame.rMid - ys);
  const radius = rNet * frame.sinA;
  const spaceT = (radius - top) / (bottom - top);
  const thetaRel = phi / frame.sinA;
  const theta = frame.cutTheta + thetaRel;
  return coneSurfacePoint(theta, spaceT, top, bottom, params.height);
}

/** Cone surface site morphed from 3D → unrolled net. */
export function morphSitePoint(
  theta: number,
  spaceT: number,
  curvature: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
  unfold = 0,
): Vec3 {
  const { top, bottom } = radiiAtCurvature(curvature, params);
  const curved = coneSurfacePoint(theta, spaceT, top, bottom, params.height);
  if (unfold <= 0) return curved;
  const unrolled = unrolledSurfacePoint(theta, spaceT, curvature, params);
  return lerpVec3(curved, unrolled, unfold);
}

/** Circumferential half-width of the glyph at |u| = 0.5 on the cone. */
const TREE_LATERAL_HALF = 0.055 * APPLE_TREE_SCALE;

/** Map normalized glyph (u, v) to a point on the curved surface. */
function treeGlyphPoint(
  u: number,
  v: number,
  theta: number,
  curvature: number,
  params: CurvedSurfaceParams,
  unfold: number,
): Vec3 {
  const spaceT = v * APPLE_STEM_SPACE_T;
  const dTh = u * 2 * TREE_LATERAL_HALF;
  return morphSitePoint(theta + dTh, spaceT, curvature, params, unfold);
}

function treeGlyphStroke(
  stroke: readonly TreePoint[],
  theta: number,
  curvature: number,
  params: CurvedSurfaceParams,
  unfold: number,
): Vec3[] {
  return stroke.map(([u, v]) =>
    treeGlyphPoint(u, v, theta, curvature, params, unfold),
  );
}

/** Straight geodesic between two (θ, spaceT) points — a line in the unrolled net. */
export function geodesicBetweenSurfacePoints(
  thetaA: number,
  spaceTA: number,
  thetaB: number,
  spaceTB: number,
  curvature: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
  segments = 48,
  unfold = 0,
): Vec3[] {
  const a = unrolledSurfacePoint(thetaA, spaceTA, curvature, params);
  const b = unrolledSurfacePoint(thetaB, spaceTB, curvature, params);
  const points: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const flat = lerpVec3(a, b, t);
    const folded = coneFromUnrolledPoint(flat, curvature, params);
    const unrolled3: Vec3 = { x: flat.x, y: flat.y, z: 0 };
    points.push(unfold <= 0 ? folded : lerpVec3(folded, unrolled3, unfold));
  }
  return points;
}

/** θ on the wide rim for tree 1 — front hemisphere facing the oblique camera. */
export const APPLE_TREE_THETA = Math.PI * 0.22;
/** Fallback Δθ (proper-time projection) when cone geometry is near-cylindrical. */
export const APPLE_TREE_TIME_OFFSET = Math.PI * 0.55;

interface AppleGeodesicGeometry {
  sinA: number;
  rApple: number;
  sMax: number;
  top: number;
  bottom: number;
  /** Proper-time Δθ: where the projected copy sits so the fall lands on the wide rim. */
  thetaOffset: number;
}

/** Cone geometry for an apple fall launched tangentially ( ⊥ meridian / x-axis). */
function buildAppleGeodesicGeometry(
  curvature: number,
  params: CurvedSurfaceParams,
  spaceTA = APPLE_RELEASE_SPACE_T,
): AppleGeodesicGeometry | null {
  const { top, bottom } = radiiAtCurvature(curvature, params);
  const frame = buildConeUnrollFrame(curvature, params);
  if (frame.sinA <= 1e-2) return null;

  const sinA = frame.sinA;
  const radiusAxisStart = top + (bottom - top) * spaceTA;
  const rApple = radiusAxisStart / sinA;
  const rWide = top / sinA;
  if (rWide <= rApple + 1e-6) return null;

  const sMax = Math.sqrt(rWide * rWide - rApple * rApple);
  return {
    sinA,
    rApple,
    sMax,
    top,
    bottom,
    thetaOffset: Math.atan2(sMax, rApple) / sinA,
  };
}

/** 3-D cone point along the apple geodesic; arclength s = 0 at the stem apple. */
function appleGeodesicConePoint(
  s: number,
  geom: AppleGeodesicGeometry,
  theta1: number,
  params: CurvedSurfaceParams,
): Vec3 {
  const { sinA, rApple, top, bottom } = geom;
  const r = Math.hypot(rApple, s);
  const psi = Math.atan2(s, rApple);
  const theta = theta1 + psi / sinA;
  const radiusAxis = r * sinA;
  const wideAtTop = top >= bottom;
  const spaceT = wideAtTop
    ? (top - radiusAxis) / (top - bottom)
    : (radiusAxis - top) / (bottom - top);
  return coneSurfacePoint(theta, spaceT, top, bottom, params.height);
}

/** Apple fall path — straight on the unrolled net, tangential (circumferential) at release. */
export function appleGeodesicPoints(
  curvature: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
  segments = 48,
  unfold = 0,
  theta1 = APPLE_TREE_THETA,
): Vec3[] {
  const geom = buildAppleGeodesicGeometry(curvature, params);
  if (!geom) {
    const theta2 = theta1 + APPLE_TREE_TIME_OFFSET;
    return geodesicBetweenSurfacePoints(
      theta1,
      APPLE_RELEASE_SPACE_T,
      theta2,
      0,
      curvature,
      params,
      segments,
      unfold,
    );
  }

  const points: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const s = t * geom.sMax;
    const folded = appleGeodesicConePoint(s, geom, theta1, params);
    if (unfold <= 0) {
      points.push(folded);
      continue;
    }
    const psi = Math.atan2(s, geom.rApple);
    const theta = theta1 + psi / geom.sinA;
    const radiusAxis = Math.hypot(geom.rApple, s) * geom.sinA;
    const spaceT = (geom.top - radiusAxis) / (geom.top - geom.bottom);
    const unrolled = unrolledSurfacePoint(theta, spaceT, curvature, params);
    points.push(lerpVec3(folded, { x: unrolled.x, y: unrolled.y, z: 0 }, unfold));
  }
  return points;
}

export interface AppleTreeScene {
  nearTreeStrips: Vec3[][];
  projectedTreeStrips: Vec3[][];
  /** @deprecated Prefer nearTreeStrips / projectedTreeStrips. */
  treeStrips: Vec3[][];
  accentStrips: Vec3[][];
  /** Straight geodesic on the unrolled net: apple → projected tree floor. */
  appleGeodesic: Vec3[];
}

/** SVG apple-tree glyph mapped onto the cone surface. */
function buildComicTree(
  theta: number,
  curvature: number,
  params: CurvedSurfaceParams,
  _includeApple: boolean,
  unfold = 0,
): { tree: Vec3[][]; accent: Vec3[][] } {
  const tree: Vec3[][] = [];
  const accent: Vec3[][] = [];

  APPLE_TREE_STROKES.forEach((stroke) => {
    tree.push(treeGlyphStroke(stroke, theta, curvature, params, unfold));
  });

  return { tree, accent };
}

/** Tree now + same tree projected in proper time, with apple fall between them. */
export function buildAppleTreeScene(
  curvature: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
  unfold = 0,
  showProjectedCopy = true,
): AppleTreeScene {
  const geom = buildAppleGeodesicGeometry(curvature, params);
  const projectedTheta =
    APPLE_TREE_THETA + (geom?.thetaOffset ?? APPLE_TREE_TIME_OFFSET);
  const t1 = buildComicTree(APPLE_TREE_THETA, curvature, params, false, unfold);
  const projected = buildComicTree(
    projectedTheta,
    curvature,
    params,
    false,
    unfold,
  );
  const appleGeodesic = appleGeodesicPoints(
    curvature,
    params,
    48,
    unfold,
  );
  const treeStrips = showProjectedCopy
    ? [...t1.tree, ...projected.tree]
    : t1.tree;
  return {
    nearTreeStrips: t1.tree,
    projectedTreeStrips: projected.tree,
    treeStrips,
    accentStrips: [],
    appleGeodesic,
  };
}

/** Falling apple worldline — tangential geodesic to the projected tree's floor. */
export function appleFallPoint(
  curvature: number,
  properTime: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
  unfold = 0,
): Vec3 {
  const appleGeodesic = appleGeodesicPoints(curvature, params, 48, unfold);
  const t = Math.max(0, Math.min(1, properTime));
  const idx = t * (appleGeodesic.length - 1);
  const i0 = Math.floor(idx);
  const i1 = Math.min(appleGeodesic.length - 1, i0 + 1);
  const f = idx - i0;
  return lerpVec3(appleGeodesic[i0], appleGeodesic[i1], f);
}

export interface WorldlineTrailSample extends Vec3 {
  age: number;
}

/** Past worldline positions for fading trail rendering. */
export function worldlineTrailSamples(
  fold: number,
  curvature: number,
  time: number,
  segmentCount: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
  mode: WorldlineMode = 'orbit',
  trailSpan = 1,
  unfold = 0,
): WorldlineTrailSample[] {
  const samples: WorldlineTrailSample[] = [];
  const count = Math.max(1, segmentCount);

  for (let i = 0; i < count; i++) {
    const age = (i + 1) / count;
    const sampleTime = Math.max(0, time - (1 - age) * trailSpan);
    const point = morphSurfacePoint(
      fold,
      curvature,
      sampleTime,
      params,
      mode,
      unfold,
    );
    samples.push({ ...point, age });
  }

  return samples;
}
