import {
  DEFAULT_CURVED_SURFACE_PARAMS,
  DEFAULT_WELL_PARAMS,
  surfaceThetaSweep,
  unrolledSurfacePoint,
  wellRevealMaxX,
  wellSurfacePoint,
  type CurvedSurfaceParams,
  type Vec3,
  type WellParams,
} from '@lm/physics';
import type { PerspectiveCamera } from 'three';
import { Vector3 } from 'three';

export interface AxisStrips {
  space: Vec3[];
  time: Vec3[];
}

export interface AxisLabelAnchor {
  id: 'space' | 'time';
  label: string;
  /** Label position in canvas pixels. */
  x: number;
  y: number;
  /** Arrow tip in canvas pixels. */
  tipX: number;
  tipY: number;
  /** Unit direction from label toward tip (screen space). */
  dirX: number;
  dirY: number;
}

function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

function rimRadius(
  t: number,
  curvature: number,
  params: CurvedSurfaceParams,
): number {
  const top = params.topRadius;
  const bottom =
    params.topRadius +
    (params.bottomRadius - params.topRadius) * curvature;
  return top + (bottom - top) * t;
}

function morphedRimPoint(
  theta: number,
  spaceT: number,
  fold: number,
  curvature: number,
  unfold: number,
  params: CurvedSurfaceParams,
): Vec3 {
  const spaceX = (spaceT - 0.5) * params.height;
  const radius = rimRadius(spaceT, curvature, params);
  const curved: Vec3 = {
    x: spaceX,
    y: radius * Math.cos(theta),
    z: radius * Math.sin(theta),
  };

  const flatSpaceX = (spaceT - 0.5) * params.flatWidth;
  const flatTimeY = (theta / (2 * Math.PI) - 0.5) * params.height;
  const flat: Vec3 = { x: flatSpaceX, y: flatTimeY, z: 0 };
  const folded = lerpVec3(flat, curved, fold);
  if (unfold <= 0) return folded;
  const unrolled = unrolledSurfacePoint(theta, spaceT, curvature, params);
  return lerpVec3(folded, unrolled, unfold);
}

/** Space and time axis polylines for the current fold / unfold morph. */
export function buildAxisStrips(
  fold: number,
  curvature: number,
  unfold: number,
  params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS,
): AxisStrips {
  const morph = (theta: number, spaceT: number): Vec3 =>
    morphedRimPoint(theta, spaceT, fold, curvature, unfold, params);

  const half = params.height / 2;

  if (fold >= 0.35) {
    const sweep = surfaceThetaSweep(unfold, curvature, params);
    const leftTheta = sweep.cutTheta + sweep.min;

    const space: Vec3[] = [];
    const cols = 24;
    for (let i = 0; i <= cols; i++) {
      space.push(morph(leftTheta, i / cols));
    }

    const time: Vec3[] = [];
    const segs = 28;
    for (let i = 0; i <= segs; i++) {
      const thetaRel = sweep.min + (i / segs) * (sweep.max - sweep.min);
      time.push(morph(sweep.cutTheta + thetaRel, 0));
    }

    return { space, time };
  }

  return {
    space: [
      { x: -params.flatWidth / 2, y: -half, z: 0 },
      { x: params.flatWidth / 2, y: -half, z: 0 },
    ],
    time: [
      { x: 0, y: -half, z: 0 },
      { x: 0, y: half, z: 0 },
    ],
  };
}

/** Space (tunnel axis) and time (circumference) guides for the gravity bulge. */
export function buildWellAxisStrips(
  wellReveal: number,
  wellMorph: number,
  params: WellParams = DEFAULT_WELL_PARAMS,
): AxisStrips {
  const half = params.length / 2;
  const revealMax = wellRevealMaxX(wellReveal);
  const xMax = (revealMax * params.length) / 2;

  const space: Vec3[] = [];
  const cols = 24;
  for (let i = 0; i <= cols; i++) {
    const t = i / cols;
    const x = -half + t * (xMax + half);
    space.push({ x, y: 0, z: 0 });
  }

  const time: Vec3[] = [];
  const segs = 28;
  for (let i = 0; i <= segs; i++) {
    const theta = (i / segs) * 2 * Math.PI;
    time.push(wellSurfacePoint(theta, -1, wellMorph, params));
  }

  return { space, time };
}

const _projectVec = new Vector3();

function projectPoint(
  point: Vec3,
  camera: PerspectiveCamera,
  width: number,
  height: number,
): { x: number; y: number; visible: boolean } {
  _projectVec.set(point.x, point.y, point.z);
  _projectVec.project(camera);
  return {
    x: (_projectVec.x * 0.5 + 0.5) * width,
    y: (-_projectVec.y * 0.5 + 0.5) * height,
    visible: _projectVec.z < 1,
  };
}

function stripTipAnchor(
  strip: Vec3[],
  camera: PerspectiveCamera,
  width: number,
  height: number,
): Omit<AxisLabelAnchor, 'id' | 'label'> | null {
  if (strip.length < 2 || width <= 0 || height <= 0) return null;

  const projected = strip.map((p) => projectPoint(p, camera, width, height));
  if (!projected.some((p) => p.visible)) return null;

  const tip = projected[projected.length - 1];
  const prev = projected[projected.length - 2];
  let dirX = tip.x - prev.x;
  let dirY = tip.y - prev.y;
  const len = Math.hypot(dirX, dirY);
  if (len < 0.5) return null;
  dirX /= len;
  dirY /= len;

  const labelPad = 14;
  return {
    tipX: tip.x,
    tipY: tip.y,
    x: tip.x + dirX * labelPad,
    y: tip.y + dirY * labelPad,
    dirX,
    dirY,
  };
}

/** Project axis tips to screen space for SVG label overlays. */
export function computeAxisLabelAnchors(
  strips: AxisStrips,
  camera: PerspectiveCamera,
  width: number,
  height: number,
): AxisLabelAnchor[] {
  const anchors: AxisLabelAnchor[] = [];
  const space = stripTipAnchor(strips.space, camera, width, height);
  if (space) {
    anchors.push({ id: 'space', label: 'Space', ...space });
  }
  const time = stripTipAnchor(strips.time, camera, width, height);
  if (time) {
    anchors.push({ id: 'time', label: 'time', ...time });
  }
  return anchors;
}

/** Arrowhead polyline points (tip at end of axis). */
export function axisArrowPoints(
  anchor: AxisLabelAnchor,
  size = 8,
): string {
  const bx = -anchor.dirY;
  const by = anchor.dirX;
  const x1 = anchor.tipX - anchor.dirX * size + bx * size * 0.45;
  const y1 = anchor.tipY - anchor.dirY * size + by * size * 0.45;
  const x2 = anchor.tipX;
  const y2 = anchor.tipY;
  const x3 = anchor.tipX - anchor.dirX * size - bx * size * 0.45;
  const y3 = anchor.tipY - anchor.dirY * size - by * size * 0.45;
  return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
}
