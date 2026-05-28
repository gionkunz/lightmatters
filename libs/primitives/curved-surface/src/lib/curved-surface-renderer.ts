import {
  buildAppleTreeScene,
  DEFAULT_BEAM_HALF_WIDTH,
  DEFAULT_CURVED_SURFACE_PARAMS,
  earthSphereWireframeStrips,
  isWellXRevealed,
  lightGeodesicSamples,
  morphSurfacePoint,
  resolveWellParams,
  surfaceThetaSweep,
  unrolledSurfacePoint,
  wellRevealMaxX,
  wellSurfacePoint,
  wellSurfacePointUnrolled,
  wellTrajectoryMorphedSamples,
  wellTrajectoryPointMorphed,
  wellSpatialBudgetTrajectoryPoint,
  wellSpatialBudgetTrajectorySamples,
  type LightBeamEdge,
  type WellLaunchMode,
  type CurvedSurfaceParams,
  type Vec3,
  type WellParams,
  type WellTrajectoryMode,
  type WorldlineMode,
  worldlineTrailSamples,
} from '@lm/physics';
import * as THREE from 'three';
import { readThemeColors, type Rgb, type ThemeColors } from './read-theme-colors';
import {
  buildAxisStrips,
  buildWellAxisStrips,
  computeAxisLabelAnchors,
  type AxisLabelAnchor,
} from './axis-labels';
import {
  applyOrbitOffset,
  easeOutCubic,
  ORBIT_SENSITIVITY,
} from './camera-orbit';
import { WidePolylineOverlay, WidePolylineStrips, WideWireframeLines, OVERLAY_LINE_WIDTH } from './wide-lines';

export type { AxisLabelAnchor };

export type SurfaceProfile = 'cone' | 'well';
export type WellDepth = 'earth' | 'deep';
export type LightBeamMode = 'single' | 'dual' | 'filled';

export interface CurvedSurfaceState {
  surfaceProfile: SurfaceProfile;
  fold: number;
  curvature: number;
  time: number;
  unfold: number;
  wellReveal: number;
  wellMorph: number;
  wellUnfold: number;
  energy: number;
  wellLaunchMode: WellLaunchMode;
  spatialFraction: number;
  /** Normalized x on the left half where a spatial-budget launch begins. */
  wellStartXNorm: number;
  showTrail: boolean;
  trailLength: number;
  /** Proper-time span of the fading trail (0–1). */
  trailSpan: number;
  worldlineMode: WorldlineMode;
  wellTrajectoryMode: WellTrajectoryMode;
  showAppleTree: boolean;
  /** When false, only the near-rim tree is drawn (proper-time copy hidden). */
  showProjectedTree: boolean;
  showGeodesic: boolean;
  showAxisLabels: boolean;
  showEarthSphere: boolean;
  wellDepth: WellDepth;
  showLightBeam: boolean;
  lightBeamProgress: number;
  lightBeamMissDistance: number;
  lightBeamHalfWidth: number;
  lightBeamMode: LightBeamMode;
}

/** Flat strip: face-on. Cylinder: oblique. Unrolled: face-on, pulled back. */
const CAMERA_FLAT = new THREE.Vector3(0, 0, 3.2);
const CAMERA_CYLINDER = new THREE.Vector3(0.25, 0.55, 3.4);
const CAMERA_UNROLLED = new THREE.Vector3(0, 0, 4.4);
const CAMERA_WELL = new THREE.Vector3(0.06, 0.34, 5.35);
const CAMERA_WELL_DEEP = new THREE.Vector3(0.06, 0.38, 5.95);
/** Top-down view for the unfolded paper (Step 3). */
const CAMERA_WELL_FLAT = new THREE.Vector3(0, 5.6, 0.001);
const CAMERA_TARGET = new THREE.Vector3(0, 0, 0);
const CAMERA_TARGET_UNROLLED = new THREE.Vector3(0, 0.2, 0);

const _vTarget = new THREE.Vector3();
const _baseCameraPos = new THREE.Vector3();

function computeAuthoredCamera(
  surfaceProfile: SurfaceProfile,
  fold: number,
  unfold: number,
  wellUnfold: number,
  wellDepth: WellDepth,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
): void {
  if (surfaceProfile === 'well') {
    outTarget.copy(CAMERA_TARGET);
    const baseWell = wellDepth === 'deep' ? CAMERA_WELL_DEEP : CAMERA_WELL;
    if (wellUnfold > 0) {
      const u = Math.max(0, Math.min(1, wellUnfold));
      const eased = u * u * (3 - 2 * u);
      outPosition.lerpVectors(baseWell, CAMERA_WELL_FLAT, eased);
    } else {
      outPosition.copy(baseWell);
    }
    return;
  }
  outPosition.lerpVectors(CAMERA_FLAT, CAMERA_CYLINDER, fold);
  if (unfold > 0) {
    outPosition.lerp(CAMERA_UNROLLED, unfold);
  }
  outTarget.lerpVectors(CAMERA_TARGET, CAMERA_TARGET_UNROLLED, unfold);
}

function updateCamera(
  camera: THREE.PerspectiveCamera,
  surfaceProfile: SurfaceProfile,
  fold: number,
  unfold: number,
  wellUnfold: number,
  wellDepth: WellDepth,
  azimuthDelta = 0,
  elevationDelta = 0,
): void {
  computeAuthoredCamera(
    surfaceProfile,
    fold,
    unfold,
    wellUnfold,
    wellDepth,
    _baseCameraPos,
    _vTarget,
  );
  const orbited = applyOrbitOffset(
    _vTarget,
    _baseCameraPos,
    azimuthDelta,
    elevationDelta,
  );
  camera.position.set(orbited.x, orbited.y, orbited.z);
  camera.lookAt(_vTarget);
}

function rgbToColor(rgb: Rgb): THREE.Color {
  return new THREE.Color(rgb[0], rgb[1], rgb[2]);
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

function buildWireframeStrips(
  fold: number,
  curvature: number,
  unfold: number,
  params: CurvedSurfaceParams,
): Vec3[][] {
  const segments = 72;
  const meridians = 16;
  const strips: Vec3[][] = [];

  const sweep = surfaceThetaSweep(unfold, curvature, params);

  const ring = (rimT: number) => {
    const pts: Vec3[] = [];
    for (let i = 0; i <= segments; i++) {
      const thetaRel =
        sweep.min + (i / segments) * (sweep.max - sweep.min);
      const theta = sweep.cutTheta + thetaRel;
      pts.push(morphedRimPoint(theta, rimT, fold, curvature, unfold, params));
    }
    strips.push(pts);
  };

  ring(0);
  ring(1);

  // Cut edges at sector ends; meridians only span the visible sector.
  for (let m = 0; m <= meridians; m++) {
    const thetaRel =
      sweep.min + (m / meridians) * (sweep.max - sweep.min);
    const theta = sweep.cutTheta + thetaRel;
    const meridian: Vec3[] = [];
    const cols = 18;
    for (let i = 0; i <= cols; i++) {
      const spaceT = i / cols;
      meridian.push(
        morphedRimPoint(theta, spaceT, fold, curvature, unfold, params),
      );
    }
    strips.push(meridian);
  }

  if (fold > 0.35) {
    for (const t of [0.2, 0.4, 0.6, 0.8]) {
      ring(t);
    }
  }

  if (fold < 0.65) {
    // Time axis on the flat strip (vertical before roll).
    strips.push([
      { x: 0, y: -params.height / 2, z: 0 },
      { x: 0, y: params.height / 2, z: 0 },
    ]);
    // Space axis tick across the strip width.
    strips.push([
      { x: -params.flatWidth / 2, y: -params.height / 2, z: 0 },
      { x: params.flatWidth / 2, y: -params.height / 2, z: 0 },
    ]);
  }

  return strips;
}


interface SurfaceMeshData {
  positions: Float32Array;
  indices: Uint32Array;
}

function buildSurfaceMesh(
  fold: number,
  curvature: number,
  unfold: number,
  params: CurvedSurfaceParams,
): SurfaceMeshData {
  const segs = 60;
  const cols = 24;
  const positions = new Float32Array((cols + 1) * (segs + 1) * 3);
  const indices = new Uint32Array(cols * segs * 6);

  const sweep = surfaceThetaSweep(unfold, curvature, params);

  let vi = 0;
  for (let i = 0; i <= cols; i++) {
    const spaceT = i / cols;
    for (let j = 0; j <= segs; j++) {
      const thetaRel = sweep.min + (j / segs) * (sweep.max - sweep.min);
      const theta = sweep.cutTheta + thetaRel;
      const p = morphedRimPoint(theta, spaceT, fold, curvature, unfold, params);
      positions[vi++] = p.x;
      positions[vi++] = p.y;
      positions[vi++] = p.z;
    }
  }

  let ii = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < segs; j++) {
      const a = i * (segs + 1) + j;
      const b = a + 1;
      const c = a + (segs + 1);
      const d = c + 1;
      indices[ii++] = a;
      indices[ii++] = b;
      indices[ii++] = d;
      indices[ii++] = a;
      indices[ii++] = d;
      indices[ii++] = c;
    }
  }

  return { positions, indices };
}

function smoothstep01(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/**
 * Surface point morphed between rolled bulge and flat unrolled paper.
 * `wellUnfold` is gated to 0 when `wellMorph > 0` (smooth bulge is not
 * developable).
 */
function wellSurfaceMorphedPoint(
  theta: number,
  xNorm: number,
  wellMorph: number,
  wellUnfold: number,
  params: WellParams,
): Vec3 {
  const rolled = wellSurfacePoint(theta, xNorm, wellMorph, params);
  if (wellMorph > 1e-6 || wellUnfold <= 0) {
    return rolled;
  }
  const flat = wellSurfacePointUnrolled(theta, xNorm, params);
  const eased = smoothstep01(wellUnfold);
  return {
    x: rolled.x + (flat.x - rolled.x) * eased,
    y: rolled.y + (flat.y - rolled.y) * eased,
    z: rolled.z + (flat.z - rolled.z) * eased,
  };
}

function buildWellWireframeStrips(
  wellReveal: number,
  wellMorph: number,
  wellUnfold: number,
  params: WellParams,
): Vec3[][] {
  const segments = 72;
  const meridians = 20;
  const xCols = 24;
  const strips: Vec3[][] = [];
  const revealMax = wellRevealMaxX(wellReveal);

  const ringAt = (xNorm: number) => {
    if (!isWellXRevealed(xNorm, wellReveal)) {
      return;
    }
    const pts: Vec3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      pts.push(
        wellSurfaceMorphedPoint(theta, xNorm, wellMorph, wellUnfold, params),
      );
    }
    strips.push(pts);
  };

  for (let i = 0; i <= xCols; i++) {
    const xNorm = -1 + (2 * i) / xCols;
    if (!isWellXRevealed(xNorm, wellReveal)) {
      continue;
    }
    ringAt(xNorm);
  }

  for (let m = 0; m <= meridians; m++) {
    const theta = (m / meridians) * 2 * Math.PI;
    const meridian: Vec3[] = [];
    for (let i = 0; i <= xCols; i++) {
      const xNorm = -1 + (2 * i) / xCols;
      if (!isWellXRevealed(xNorm, wellReveal)) {
        continue;
      }
      meridian.push(
        wellSurfaceMorphedPoint(theta, xNorm, wellMorph, wellUnfold, params),
      );
    }
    if (meridian.length > 1) {
      strips.push(meridian);
    }
  }

  if (revealMax > -0.95) {
    ringAt(Math.max(-1, revealMax));
  }

  return strips;
}

function buildWellSurfaceMesh(
  wellReveal: number,
  wellMorph: number,
  wellUnfold: number,
  params: WellParams,
): SurfaceMeshData {
  const xCols = 24;
  const segs = 48;
  const visibleX: number[] = [];
  for (let i = 0; i <= xCols; i++) {
    const xNorm = -1 + (2 * i) / xCols;
    if (isWellXRevealed(xNorm, wellReveal)) {
      visibleX.push(xNorm);
    }
  }

  const positions = new Float32Array(visibleX.length * (segs + 1) * 3);
  const indices = new Uint32Array(Math.max(0, visibleX.length - 1) * segs * 6);

  let vi = 0;
  for (const xNorm of visibleX) {
    for (let j = 0; j <= segs; j++) {
      const theta = (j / segs) * 2 * Math.PI;
      const p = wellSurfaceMorphedPoint(
        theta,
        xNorm,
        wellMorph,
        wellUnfold,
        params,
      );
      positions[vi++] = p.x;
      positions[vi++] = p.y;
      positions[vi++] = p.z;
    }
  }

  let ii = 0;
  for (let col = 0; col < visibleX.length - 1; col++) {
    for (let j = 0; j < segs; j++) {
      const a = col * (segs + 1) + j;
      const b = a + 1;
      const c = a + (segs + 1);
      const d = c + 1;
      indices[ii++] = a;
      indices[ii++] = b;
      indices[ii++] = d;
      indices[ii++] = a;
      indices[ii++] = d;
      indices[ii++] = c;
    }
  }

  return { positions, indices };
}

const _camDir = new THREE.Vector3();
const _segMid = new THREE.Vector3();

/** Outward normal for axis-along-x cylinder / cone / flat strip. */
function surfaceOutwardNormal(p: Vec3): Vec3 {
  const len = Math.hypot(p.y, p.z);
  if (len < 1e-4) return { x: 0, y: 0, z: 1 };
  return { x: 0, y: p.y / len, z: p.z / len };
}

function isFrontFacingSegment(
  a: Vec3,
  b: Vec3,
  camera: THREE.PerspectiveCamera,
): boolean {
  _segMid.set((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  const n = surfaceOutwardNormal(_segMid);
  _camDir.set(
    camera.position.x - _segMid.x,
    camera.position.y - _segMid.y,
    camera.position.z - _segMid.z,
  );
  return _camDir.x * n.x + _camDir.y * n.y + _camDir.z * n.z > 0;
}

function splitStripsByFacing(
  strips: Vec3[][],
  camera: THREE.PerspectiveCamera,
): { front: Vec3[][]; back: Vec3[][] } {
  const front: Vec3[][] = [];
  const back: Vec3[][] = [];
  for (const strip of strips) {
    for (let i = 0; i < strip.length - 1; i++) {
      const seg = [strip[i], strip[i + 1]];
      if (isFrontFacingSegment(strip[i], strip[i + 1], camera)) {
        front.push(seg);
      } else {
        back.push(seg);
      }
    }
  }
  return { front, back };
}

function stripToLinePositions(strips: Vec3[][]): Float32Array {
  let count = 0;
  for (const strip of strips) {
    count += Math.max(0, strip.length - 1) * 2;
  }
  const data = new Float32Array(count * 3);
  let offset = 0;
  for (const strip of strips) {
    for (let i = 0; i < strip.length - 1; i++) {
      data[offset++] = strip[i].x;
      data[offset++] = strip[i].y;
      data[offset++] = strip[i].z;
      data[offset++] = strip[i + 1].x;
      data[offset++] = strip[i + 1].y;
      data[offset++] = strip[i + 1].z;
    }
  }
  return data;
}

function buildGeodesicPoints(
  curvature: number,
  unfold: number,
  params: CurvedSurfaceParams,
  segments = 64,
): Vec3[] {
  const points: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push(
      morphSurfacePoint(1, curvature, t, params, 'geodesic-fall', unfold),
    );
  }
  return points;
}

class TranslucentSurface {
  readonly mesh: THREE.Mesh;
  private readonly geometry = new THREE.BufferGeometry();

  constructor(scene: THREE.Scene, rgb: Rgb, opacity: number) {
    const material = new THREE.MeshBasicMaterial({
      color: rgbToColor(rgb),
      transparent: true,
      opacity,
      // FrontSide only — DoubleSide was drawing the interior shell too,
      // which stacked at the silhouette rims and read as bright end caps.
      side: THREE.FrontSide,
      // No depth write — lets faint back-side wireframe show through the shell.
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: 2,
      polygonOffsetUnits: 2,
    });
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.mesh.renderOrder = -1;
    scene.add(this.mesh);
  }

  setData(data: SurfaceMeshData): void {
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(data.positions, 3),
    );
    this.geometry.setIndex(new THREE.BufferAttribute(data.indices, 1));
    this.geometry.computeBoundingSphere();
  }

  setVisible(visible: boolean): void {
    this.mesh.visible = visible;
  }

  setColor(rgb: Rgb, opacity: number): void {
    const material = this.mesh.material as THREE.MeshBasicMaterial;
    material.color.copy(rgbToColor(rgb));
    material.opacity = opacity;
  }

  dispose(): void {
    this.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}

class WireframeLines {
  readonly mesh: THREE.LineSegments;
  private readonly geometry = new THREE.BufferGeometry();

  constructor(
    scene: THREE.Scene,
    rgb: Rgb,
    opacity: number,
    renderOrder = 0,
    alwaysOnTop = false,
  ) {
    const material = new THREE.LineBasicMaterial({
      color: rgbToColor(rgb),
      transparent: opacity < 1,
      opacity,
      depthTest: !alwaysOnTop,
    });
    this.mesh = new THREE.LineSegments(this.geometry, material);
    this.mesh.renderOrder = renderOrder;
    scene.add(this.mesh);
  }

  setStrips(strips: Vec3[][]): void {
    const positions = stripToLinePositions(strips);
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );
    this.geometry.computeBoundingSphere();
  }

  setColor(rgb: Rgb, opacity: number): void {
    const material = this.mesh.material as THREE.LineBasicMaterial;
    material.color.copy(rgbToColor(rgb));
    material.opacity = opacity;
    material.transparent = opacity < 1;
  }

  dispose(): void {
    this.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}

function buildLightBeamPoints(
  missDistance: number,
  edge: LightBeamEdge,
  progress: number,
  wellMorph: number,
  params: WellParams,
  beamHalfWidth: number,
  sampleCount = 48,
): Vec3[] {
  if (progress <= 0) {
    return [];
  }
  const full = lightGeodesicSamples(
    missDistance,
    edge,
    sampleCount,
    wellMorph,
    params,
    beamHalfWidth,
  );
  const endIndex = Math.max(1, Math.round(progress * (full.length - 1)));
  return full.slice(0, endIndex + 1);
}

export class CurvedSurfaceRenderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly camera: THREE.PerspectiveCamera;
  readonly scene = new THREE.Scene();
  private readonly surface: TranslucentSurface;
  private readonly wireLinesFront: WireframeLines;
  private readonly wireLinesBack: WireframeLines;
  private readonly axisLines: WideWireframeLines;
  private readonly geodesicLine: WidePolylineOverlay;
  private readonly appleGeodesicLines: WideWireframeLines;
  private readonly trailLine: WidePolylineOverlay;
  private readonly appleTreeNearLines: WidePolylineStrips;
  private readonly appleTreeProjectedLines: WidePolylineStrips;
  private readonly earthSphereLines: WireframeLines;
  private readonly dotMesh: THREE.Mesh;
  private colors: ThemeColors = readThemeColors();
  private readonly params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS;
  private readonly lightBeamOuterLine: WidePolylineOverlay;
  private viewportWidth = 720;
  private viewportHeight = 520;
  private axisLabelAnchors: AxisLabelAnchor[] = [];
  /** Fired whenever projected axis label positions change. */
  onAxisLabelsUpdated?: (anchors: AxisLabelAnchor[]) => void;
  private orbitAzimuth = 0;
  private orbitElevation = 0;
  private dragging = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private resetRafId: number | null = null;
  private readonly onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) {
      return;
    }
    this.dragging = true;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    this.canvas.setPointerCapture(event.pointerId);
  };
  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging) {
      return;
    }
    const dx = event.clientX - this.lastPointerX;
    const dy = event.clientY - this.lastPointerY;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    this.orbitAzimuth -= dx * ORBIT_SENSITIVITY;
    this.orbitElevation += dy * ORBIT_SENSITIVITY;
    this.applyCamera();
    this.render();
  };
  private readonly onPointerUp = (event: PointerEvent): void => {
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    if (this.canvas.hasPointerCapture(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId);
    }
    this.syncGeometry();
  };
  state: CurvedSurfaceState = {
    surfaceProfile: 'cone',
    fold: 1,
    curvature: 0,
    time: 0,
    unfold: 0,
    wellReveal: 1,
    wellMorph: 1,
    wellUnfold: 0,
    energy: 0.35,
    wellLaunchMode: 'energy',
    spatialFraction: 0.28,
    wellStartXNorm: -1,
    showTrail: true,
    trailLength: 96,
    trailSpan: 1,
    worldlineMode: 'orbit',
    wellTrajectoryMode: 'pass-through',
    showAppleTree: false,
    showProjectedTree: true,
    showGeodesic: false,
    showAxisLabels: false,
    showEarthSphere: false,
    wellDepth: 'earth',
    showLightBeam: false,
    lightBeamProgress: 0,
    lightBeamMissDistance: 0.25,
    lightBeamHalfWidth: DEFAULT_BEAM_HALF_WIDTH,
    lightBeamMode: 'single',
  };

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.05, 50);
    updateCamera(this.camera, 'cone', 0, 0, 0, 'earth');

    const colors = readThemeColors();
    this.colors = colors;

    this.surface = new TranslucentSurface(this.scene, colors.ink, 0.14);
    this.wireLinesBack = new WireframeLines(this.scene, colors.ink, 0.09, -2);
    this.wireLinesFront = new WireframeLines(this.scene, colors.ink, 0.52, 0);
    this.axisLines = new WideWireframeLines(
      this.scene,
      colors.ink,
      0.82,
      OVERLAY_LINE_WIDTH,
      1,
      true,
    );
    this.geodesicLine = new WidePolylineOverlay(
      this.scene,
      colors.accent1,
      0.85,
      OVERLAY_LINE_WIDTH,
      true,
    );
    this.lightBeamOuterLine = new WidePolylineOverlay(
      this.scene,
      colors.accent2,
      0.85,
      OVERLAY_LINE_WIDTH,
      true,
    );
    this.appleGeodesicLines = new WideWireframeLines(
      this.scene,
      colors.accent1,
      0.55,
      OVERLAY_LINE_WIDTH,
      2,
      true,
    );
    this.trailLine = new WidePolylineOverlay(
      this.scene,
      colors.accent1,
      0.95,
      OVERLAY_LINE_WIDTH,
      true,
    );
    this.appleTreeNearLines = new WidePolylineStrips(
      this.scene,
      colors.ink,
      0.85,
      OVERLAY_LINE_WIDTH,
      2,
      true,
    );
    this.appleTreeProjectedLines = new WidePolylineStrips(
      this.scene,
      colors.ink,
      0.85,
      OVERLAY_LINE_WIDTH,
      2,
      true,
    );
    this.earthSphereLines = new WireframeLines(
      this.scene,
      colors.accent2,
      0.78,
      1,
      true,
    );

    const dotGeometry = new THREE.SphereGeometry(0.028, 16, 16);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: rgbToColor(colors.accent1),
      depthTest: false,
    });
    this.dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);
    this.dotMesh.renderOrder = 3;
    this.scene.add(this.dotMesh);

    this.syncGeometry();
    this.render();
    this.bindPointerHandlers();
  }

  animateReset(durationMs = 400): void {
    this.cancelDrag();
    if (this.resetRafId !== null) {
      cancelAnimationFrame(this.resetRafId);
      this.resetRafId = null;
    }

    const startAz = this.orbitAzimuth;
    const startEl = this.orbitElevation;
    if (startAz === 0 && startEl === 0) {
      return;
    }

    const startWall = performance.now();
    const step = (now: number) => {
      const t = easeOutCubic(Math.min(1, (now - startWall) / durationMs));
      this.orbitAzimuth = startAz * (1 - t);
      this.orbitElevation = startEl * (1 - t);
      this.applyCamera();
      this.render();
      if (t < 1) {
        this.resetRafId = requestAnimationFrame(step);
      } else {
        this.orbitAzimuth = 0;
        this.orbitElevation = 0;
        this.resetRafId = null;
        this.syncGeometry();
      }
    };
    this.resetRafId = requestAnimationFrame(step);
  }

  private bindPointerHandlers(): void {
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerUp);
  }

  private cancelDrag(): void {
    this.dragging = false;
  }

  private applyCamera(): void {
    updateCamera(
      this.camera,
      this.state.surfaceProfile,
      this.state.fold,
      this.state.unfold,
      this.state.wellUnfold,
      this.state.wellDepth,
      this.orbitAzimuth,
      this.orbitElevation,
    );
  }

  getAxisLabelAnchors(): AxisLabelAnchor[] {
    return this.axisLabelAnchors;
  }

  resize(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  setThemeColors(colors: ThemeColors): void {
    this.colors = colors;
    this.surface.setColor(colors.ink, 0.14);
    this.wireLinesBack.setColor(colors.ink, 0.09);
    this.wireLinesFront.setColor(colors.ink, 0.52);
    this.axisLines.setColor(colors.ink, 0.82);
    this.geodesicLine.setColor(colors.accent1, 0.85);
    this.lightBeamOuterLine.setColor(colors.accent2, 0.85);
    this.appleGeodesicLines.setColor(colors.accent1, 0.55);
    this.trailLine.setColor(colors.accent1, 0.95);
    this.appleTreeNearLines.setColor(colors.ink, 0.85);
    this.appleTreeProjectedLines.setColor(colors.ink, 0.85);
    this.earthSphereLines.setColor(colors.accent2, 0.78);
    (this.dotMesh.material as THREE.MeshBasicMaterial).color.copy(
      rgbToColor(colors.accent1),
    );
    this.syncGeometry();
    this.render();
  }

  update(state: Partial<CurvedSurfaceState>): void {
    this.state = { ...this.state, ...state };
    this.syncGeometry();
    this.render();
  }

  private syncGeometry(): void {
    const {
      surfaceProfile,
      fold,
      curvature,
      time,
      unfold,
      wellReveal,
      wellMorph,
      wellUnfold,
      energy,
      wellLaunchMode,
      spatialFraction,
      wellStartXNorm,
      showTrail,
      trailLength,
      trailSpan,
      worldlineMode,
      wellTrajectoryMode,
      showAppleTree,
      showProjectedTree,
      showGeodesic,
      showAxisLabels,
      showEarthSphere,
      wellDepth,
      showLightBeam,
      lightBeamProgress,
      lightBeamMissDistance,
      lightBeamHalfWidth,
      lightBeamMode,
    } = this.state;

    this.applyCamera();

    if (surfaceProfile === 'well') {
      this.syncWellGeometry(
        wellReveal,
        wellMorph,
        wellUnfold,
        energy,
        wellLaunchMode,
        spatialFraction,
        wellStartXNorm,
        time,
        showTrail,
        trailLength,
        trailSpan,
        worldlineMode,
        wellTrajectoryMode,
        showAxisLabels,
        showEarthSphere,
        wellDepth,
        showLightBeam,
        lightBeamProgress,
        lightBeamMissDistance,
        lightBeamHalfWidth,
        lightBeamMode,
      );
      return;
    }

    this.lightBeamOuterLine.setPoints([]);

    this.earthSphereLines.setStrips([]);

    if (fold > 0.35) {
      this.surface.setData(
        buildSurfaceMesh(fold, curvature, unfold, this.params),
      );
      this.surface.setVisible(true);
    } else {
      this.surface.setVisible(false);
    }

    const strips = buildWireframeStrips(fold, curvature, unfold, this.params);
    const { front, back } = splitStripsByFacing(strips, this.camera);
    this.wireLinesBack.setStrips(back);
    this.wireLinesFront.setStrips(front);

    if (showAxisLabels) {
      const axisStrips = buildAxisStrips(
        fold,
        curvature,
        unfold,
        this.params,
      );
      this.axisLines.setStrips([axisStrips.space, axisStrips.time]);
      this.updateAxisLabelAnchors(axisStrips);
    } else {
      this.axisLines.setStrips([]);
      this.setAxisLabelAnchors([]);
    }

    if (showAppleTree) {
      const scene = buildAppleTreeScene(
        curvature,
        this.params,
        unfold,
        true,
      );
      this.appleTreeNearLines.setStrips(scene.nearTreeStrips);
      this.appleTreeProjectedLines.setStrips(
        showProjectedTree ? scene.projectedTreeStrips : [],
      );
      const geodesicStrips: Vec3[][] = [];
      for (let i = 0; i < scene.appleGeodesic.length - 1; i++) {
        geodesicStrips.push([
          scene.appleGeodesic[i],
          scene.appleGeodesic[i + 1],
        ]);
      }
      this.appleGeodesicLines.setStrips(geodesicStrips);
      this.geodesicLine.setPoints([]);
    } else {
      this.appleTreeNearLines.setStrips([]);
      this.appleTreeProjectedLines.setStrips([]);
      this.appleGeodesicLines.setStrips([]);
      if (showGeodesic || worldlineMode === 'geodesic-fall') {
        this.geodesicLine.setPoints(
          buildGeodesicPoints(curvature, unfold, this.params),
        );
        this.geodesicLine.setColor(this.colors.accent1, 0.35);
      } else {
        this.geodesicLine.setPoints([]);
      }
    }

    const dot = morphSurfacePoint(
      fold,
      curvature,
      time,
      this.params,
      worldlineMode,
      unfold,
    );
    this.dotMesh.position.set(dot.x, dot.y, dot.z);

    if (showTrail && time > 0) {
      const samples = worldlineTrailSamples(
        fold,
        curvature,
        time,
        trailLength,
        this.params,
        worldlineMode,
        trailSpan,
        unfold,
      );
      this.trailLine.setPoints(
        samples,
        (index, total) => 0.25 + 0.75 * ((index + 1) / total),
      );
    } else {
      this.trailLine.setPoints([]);
    }
  }

  private syncWellGeometry(
    wellReveal: number,
    wellMorph: number,
    wellUnfold: number,
    energy: number,
    wellLaunchMode: WellLaunchMode,
    spatialFraction: number,
    wellStartXNorm: number,
    time: number,
    showTrail: boolean,
    trailLength: number,
    trailSpan: number,
    worldlineMode: WorldlineMode,
    wellTrajectoryMode: WellTrajectoryMode,
    showAxisLabels: boolean,
    showEarthSphere: boolean,
    wellDepth: WellDepth,
    showLightBeam: boolean,
    lightBeamProgress: number,
    lightBeamMissDistance: number,
    lightBeamHalfWidth: number,
    lightBeamMode: LightBeamMode,
  ): void {
    const params = resolveWellParams(wellDepth);
    // Smooth bulge cannot lay perfectly flat — clamp unfold for any non-zero morph.
    const effectiveUnfold = wellMorph > 1e-6 ? 0 : wellUnfold;

    if (wellReveal > 0.05) {
      this.surface.setData(
        buildWellSurfaceMesh(
          wellReveal,
          wellMorph,
          effectiveUnfold,
          params,
        ),
      );
      this.surface.setVisible(true);
    } else {
      this.surface.setVisible(false);
    }

    const strips = buildWellWireframeStrips(
      wellReveal,
      wellMorph,
      effectiveUnfold,
      params,
    );
    const { front, back } = splitStripsByFacing(strips, this.camera);
    this.wireLinesBack.setStrips(back);
    this.wireLinesFront.setStrips(front);

    if (showAxisLabels && wellReveal > 0.05) {
      const axisStrips = buildWellAxisStrips(
        wellReveal,
        wellMorph,
        params,
      );
      this.axisLines.setStrips([axisStrips.space, axisStrips.time]);
      this.updateAxisLabelAnchors(axisStrips);
    } else {
      this.axisLines.setStrips([]);
      this.setAxisLabelAnchors([]);
    }
    this.appleTreeNearLines.setStrips([]);
    this.appleTreeProjectedLines.setStrips([]);
    this.appleGeodesicLines.setStrips([]);

    if (showLightBeam && lightBeamProgress > 0) {
      this.dotMesh.visible = false;
      const beamEdge: LightBeamEdge =
        lightBeamMode === 'single' ? 'center' : 'inner';
      const innerPoints = buildLightBeamPoints(
        lightBeamMissDistance,
        beamEdge,
        lightBeamProgress,
        wellMorph,
        params,
        lightBeamHalfWidth,
      );
      this.geodesicLine.setPoints(innerPoints);
      this.geodesicLine.setColor(this.colors.accent1, 0.9);

      if (lightBeamMode === 'dual' || lightBeamMode === 'filled') {
        const outerPoints = buildLightBeamPoints(
          lightBeamMissDistance,
          'outer',
          lightBeamProgress,
          wellMorph,
          params,
          lightBeamHalfWidth,
        );
        this.lightBeamOuterLine.setPoints(outerPoints);
        this.lightBeamOuterLine.setColor(this.colors.accent2, 0.9);
      } else {
        this.lightBeamOuterLine.setPoints([]);
      }
    } else {
      this.geodesicLine.setPoints([]);
      this.lightBeamOuterLine.setPoints([]);
      this.dotMesh.visible = true;
    }

    // Hide the Earth globe as the paper unrolls (the globe is a 3-D artifact).
    const earthOpacity = effectiveUnfold > 0.01 ? 1 - smoothstep01(effectiveUnfold) : 1;
    if (showEarthSphere && wellReveal >= 0.38 && earthOpacity > 0.05) {
      this.earthSphereLines.setStrips(earthSphereWireframeStrips(params));
    } else {
      this.earthSphereLines.setStrips([]);
    }

    const dot =
      worldlineMode === 'well-trajectory'
        ? wellLaunchMode === 'spatial-budget'
          ? wellSpatialBudgetTrajectoryPoint(
              spatialFraction,
              time,
              wellMorph,
              params,
              wellTrajectoryMode,
              wellStartXNorm,
            )
          : wellTrajectoryPointMorphed(
              energy,
              time,
              wellMorph,
              effectiveUnfold,
              params,
              wellTrajectoryMode,
            )
        : wellSurfaceMorphedPoint(
            0,
            wellRevealMaxX(wellReveal),
            wellMorph,
            effectiveUnfold,
            params,
          );
    if (!showLightBeam) {
      this.dotMesh.visible = worldlineMode === 'well-trajectory';
    }

    if (!showLightBeam && worldlineMode === 'well-trajectory') {
      this.dotMesh.position.set(dot.x, dot.y, dot.z);
    }

    if (
      showTrail &&
      time > 0 &&
      worldlineMode === 'well-trajectory' &&
      !showLightBeam
    ) {
      const samples =
        wellLaunchMode === 'spatial-budget'
          ? wellSpatialBudgetTrajectorySamples(
              spatialFraction,
              trailLength,
              wellMorph,
              params,
              time,
              trailSpan,
              wellTrajectoryMode,
              wellStartXNorm,
            )
          : wellTrajectoryMorphedSamples(
              energy,
              trailLength,
              wellMorph,
              effectiveUnfold,
              params,
              time,
              trailSpan,
              wellTrajectoryMode,
            );
      this.trailLine.setPoints(
        samples,
        (index, total) => 0.25 + 0.75 * ((index + 1) / total),
      );
    } else {
      this.trailLine.setPoints([]);
    }
  }

  private updateAxisLabelAnchors(
    strips: ReturnType<typeof buildAxisStrips>,
  ): void {
    const anchors = computeAxisLabelAnchors(
      strips,
      this.camera,
      this.viewportWidth,
      this.viewportHeight,
    );
    this.setAxisLabelAnchors(anchors);
  }

  private setAxisLabelAnchors(anchors: AxisLabelAnchor[]): void {
    this.axisLabelAnchors = anchors;
    this.onAxisLabelsUpdated?.(anchors);
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
    if (this.state.showAxisLabels) {
      const strips =
        this.state.surfaceProfile === 'well'
          ? buildWellAxisStrips(
              this.state.wellReveal,
              this.state.wellMorph,
              resolveWellParams(this.state.wellDepth),
            )
          : buildAxisStrips(
              this.state.fold,
              this.state.curvature,
              this.state.unfold,
              this.params,
            );
      this.updateAxisLabelAnchors(strips);
    }
  }

  dispose(): void {
    if (this.resetRafId !== null) {
      cancelAnimationFrame(this.resetRafId);
      this.resetRafId = null;
    }
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerUp);
    this.surface.dispose();
    this.wireLinesBack.dispose();
    this.wireLinesFront.dispose();
    this.axisLines.dispose();
    this.geodesicLine.dispose();
    this.lightBeamOuterLine.dispose();
    this.appleGeodesicLines.dispose();
    this.trailLine.dispose();
    this.appleTreeNearLines.dispose();
    this.appleTreeProjectedLines.dispose();
    this.earthSphereLines.dispose();
    this.dotMesh.geometry.dispose();
    (this.dotMesh.material as THREE.Material).dispose();
    this.renderer.dispose();
    const ext = this.renderer.getContext().getExtension('WEBGL_lose_context');
    ext?.loseContext();
  }
}
