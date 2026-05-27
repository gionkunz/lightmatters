import {
  buildAppleTreeScene,
  DEFAULT_CURVED_SURFACE_PARAMS,
  morphSurfacePoint,
  surfaceThetaSweep,
  unrolledSurfacePoint,
  type CurvedSurfaceParams,
  type Vec3,
  type WorldlineMode,
  worldlineTrailSamples,
} from '@lm/physics';
import * as THREE from 'three';
import { readThemeColors, type Rgb, type ThemeColors } from './read-theme-colors';
import {
  applyOrbitOffset,
  easeOutCubic,
  ORBIT_SENSITIVITY,
} from './camera-orbit';

export interface CurvedSurfaceState {
  fold: number;
  curvature: number;
  time: number;
  unfold: number;
  showTrail: boolean;
  trailLength: number;
  /** Proper-time span of the fading trail (0–1). */
  trailSpan: number;
  worldlineMode: WorldlineMode;
  showAppleTree: boolean;
  /** When false, only the near-rim tree is drawn (proper-time copy hidden). */
  showProjectedTree: boolean;
  showGeodesic: boolean;
  showAxisLabels: boolean;
}

/** Flat strip: face-on. Cylinder: oblique. Unrolled: face-on, pulled back. */
const CAMERA_FLAT = new THREE.Vector3(0, 0, 3.2);
const CAMERA_CYLINDER = new THREE.Vector3(0.25, 0.55, 3.4);
const CAMERA_UNROLLED = new THREE.Vector3(0, 0, 4.4);
const CAMERA_TARGET = new THREE.Vector3(0, 0, 0);
const CAMERA_TARGET_UNROLLED = new THREE.Vector3(0, 0.2, 0);

const _vTarget = new THREE.Vector3();
const _baseCameraPos = new THREE.Vector3();

function computeAuthoredCamera(
  fold: number,
  unfold: number,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
): void {
  outPosition.lerpVectors(CAMERA_FLAT, CAMERA_CYLINDER, fold);
  if (unfold > 0) {
    outPosition.lerp(CAMERA_UNROLLED, unfold);
  }
  outTarget.lerpVectors(CAMERA_TARGET, CAMERA_TARGET_UNROLLED, unfold);
}

function updateCamera(
  camera: THREE.PerspectiveCamera,
  fold: number,
  unfold: number,
  azimuthDelta = 0,
  elevationDelta = 0,
): void {
  computeAuthoredCamera(fold, unfold, _baseCameraPos, _vTarget);
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

function buildAxisLabelStrips(
  fold: number,
  curvature: number,
  params: CurvedSurfaceParams,
): Vec3[][] {
  if (fold < 0.5) return [];

  const radius = rimRadius(0.5, curvature, params);
  const half = params.height / 2;
  const strips: Vec3[][] = [];

  // Space axis (x) through the cylinder centre.
  strips.push([
    { x: -half - 0.08, y: 0, z: 0 },
    { x: half + 0.12, y: 0, z: 0 },
  ]);

  // Time (t) arc on the near end cap — about a quarter turn.
  const arc: Vec3[] = [];
  const segments = 14;
  for (let i = 0; i <= segments; i++) {
    const theta = Math.PI * 0.55 + (i / segments) * Math.PI * 0.55;
    arc.push({
      x: -half,
      y: radius * Math.cos(theta),
      z: radius * Math.sin(theta),
    });
  }
  strips.push(arc);

  return strips;
}

function buildWireframeStripsWithAxes(
  fold: number,
  curvature: number,
  unfold: number,
  params: CurvedSurfaceParams,
  showAxisLabels: boolean,
): Vec3[][] {
  const strips = buildWireframeStrips(fold, curvature, unfold, params);
  if (showAxisLabels && unfold < 0.5) {
    strips.push(...buildAxisLabelStrips(fold, curvature, params));
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

/** Offset each segment sideways to fake line thickness (WebGL ignores linewidth). */
function thickenStrips(strips: Vec3[][], halfWidth: number): Vec3[][] {
  if (halfWidth <= 0) return strips;
  const out: Vec3[][] = [];
  for (const strip of strips) {
    for (let i = 0; i < strip.length - 1; i++) {
      const a = strip[i];
      const b = strip[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dy, dz) || 1;
      const tx = dx / len;
      const ty = dy / len;
      const tz = dz / len;
      const n = surfaceOutwardNormal({
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
        z: (a.z + b.z) / 2,
      });
      let bx = ty * n.z - tz * n.y;
      let by = tz * n.x - tx * n.z;
      let bz = tx * n.y - ty * n.x;
      const blen = Math.hypot(bx, by, bz) || 1;
      bx = (bx / blen) * halfWidth;
      by = (by / blen) * halfWidth;
      bz = (bz / blen) * halfWidth;
      out.push([a, b]);
      out.push([
        { x: a.x + bx, y: a.y + by, z: a.z + bz },
        { x: b.x + bx, y: b.y + by, z: b.z + bz },
      ]);
      out.push([
        { x: a.x - bx, y: a.y - by, z: a.z - bz },
        { x: b.x - bx, y: b.y - by, z: b.z - bz },
      ]);
    }
  }
  return out;
}

function pointsToFlatArray(points: Vec3[]): Float32Array {
  const data = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    data[i * 3] = points[i].x;
    data[i * 3 + 1] = points[i].y;
    data[i * 3 + 2] = points[i].z;
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
    private readonly thickness = 0,
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
    const drawStrips =
      this.thickness > 0 ? thickenStrips(strips, this.thickness) : strips;
    const positions = stripToLinePositions(drawStrips);
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

class PolylineOverlay {
  readonly line: THREE.Line;
  private readonly geometry = new THREE.BufferGeometry();

  constructor(
    scene: THREE.Scene,
    rgb: Rgb,
    opacity: number,
    alwaysOnTop = false,
  ) {
    const material = new THREE.LineBasicMaterial({
      color: rgbToColor(rgb),
      transparent: opacity < 1,
      opacity,
      vertexColors: true,
      depthTest: !alwaysOnTop,
    });
    this.line = new THREE.Line(this.geometry, material);
    if (alwaysOnTop) {
      this.line.renderOrder = 2;
    }
    scene.add(this.line);
  }

  setPoints(points: Vec3[], colorFn?: (index: number, total: number) => number): void {
    if (points.length < 2) {
      this.line.visible = false;
      return;
    }
    this.line.visible = true;
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(pointsToFlatArray(points), 3),
    );

    if (colorFn) {
      const base = (this.line.material as THREE.LineBasicMaterial).color;
      const colors = new Float32Array(points.length * 3);
      for (let i = 0; i < points.length; i++) {
        const alpha = colorFn(i, points.length);
        colors[i * 3] = base.r * alpha;
        colors[i * 3 + 1] = base.g * alpha;
        colors[i * 3 + 2] = base.b * alpha;
      }
      this.geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3),
      );
    } else {
      this.geometry.deleteAttribute('color');
    }

    this.geometry.computeBoundingSphere();
  }

  setColor(rgb: Rgb, opacity: number): void {
    const material = this.line.material as THREE.LineBasicMaterial;
    material.color.copy(rgbToColor(rgb));
    material.opacity = opacity;
    material.transparent = opacity < 1;
  }

  dispose(): void {
    this.geometry.dispose();
    (this.line.material as THREE.Material).dispose();
  }
}

export class CurvedSurfaceRenderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly camera: THREE.PerspectiveCamera;
  readonly scene = new THREE.Scene();
  private readonly surface: TranslucentSurface;
  private readonly wireLinesFront: WireframeLines;
  private readonly wireLinesBack: WireframeLines;
  private readonly geodesicLine: PolylineOverlay;
  private readonly appleGeodesicLines: WireframeLines;
  private readonly trailLine: PolylineOverlay;
  private readonly appleTreeLines: WireframeLines;
  private readonly appleAccentLines: WireframeLines;
  private readonly dotMesh: THREE.Mesh;
  private colors: ThemeColors = readThemeColors();
  private readonly params: CurvedSurfaceParams = DEFAULT_CURVED_SURFACE_PARAMS;
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
    fold: 1,
    curvature: 0,
    time: 0,
    unfold: 0,
    showTrail: true,
    trailLength: 96,
    trailSpan: 1,
    worldlineMode: 'orbit',
    showAppleTree: false,
    showProjectedTree: true,
    showGeodesic: false,
    showAxisLabels: false,
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
    updateCamera(this.camera, 0, 0);

    const colors = readThemeColors();
    this.colors = colors;

    this.surface = new TranslucentSurface(this.scene, colors.ink, 0.14);
    this.wireLinesBack = new WireframeLines(this.scene, colors.ink, 0.09, -2);
    this.wireLinesFront = new WireframeLines(this.scene, colors.ink, 0.52, 0);
    this.geodesicLine = new PolylineOverlay(this.scene, colors.accent1, 0.35, true);
    this.appleGeodesicLines = new WireframeLines(
      this.scene,
      colors.accent1,
      0.55,
      2,
      true,
      0.004,
    );
    this.trailLine = new PolylineOverlay(this.scene, colors.accent1, 0.95, true);
    this.appleTreeLines = new WireframeLines(
      this.scene,
      colors.ink,
      0.85,
      2,
      true,
      0.007,
    );
    this.appleAccentLines = new WireframeLines(
      this.scene,
      colors.accent1,
      0.95,
      2,
      true,
      0.005,
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
      this.state.fold,
      this.state.unfold,
      this.orbitAzimuth,
      this.orbitElevation,
    );
  }

  resize(width: number, height: number): void {
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
    this.geodesicLine.setColor(colors.accent1, 0.35);
    this.appleGeodesicLines.setColor(colors.accent1, 0.55);
    this.trailLine.setColor(colors.accent1, 0.95);
    this.appleTreeLines.setColor(colors.ink, 0.85);
    this.appleAccentLines.setColor(colors.accent1, 0.95);
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
      fold,
      curvature,
      time,
      unfold,
      showTrail,
      trailLength,
      trailSpan,
      worldlineMode,
      showAppleTree,
      showProjectedTree,
      showGeodesic,
      showAxisLabels,
    } = this.state;

    updateCamera(
      this.camera,
      fold,
      unfold,
      this.orbitAzimuth,
      this.orbitElevation,
    );

    if (fold > 0.35) {
      this.surface.setData(
        buildSurfaceMesh(fold, curvature, unfold, this.params),
      );
      this.surface.setVisible(true);
    } else {
      this.surface.setVisible(false);
    }

    const strips = buildWireframeStripsWithAxes(
      fold,
      curvature,
      unfold,
      this.params,
      showAxisLabels,
    );
    const { front, back } = splitStripsByFacing(strips, this.camera);
    this.wireLinesBack.setStrips(back);
    this.wireLinesFront.setStrips(front);

    if (showAppleTree) {
      const scene = buildAppleTreeScene(
        curvature,
        this.params,
        unfold,
        showProjectedTree,
      );
      this.appleTreeLines.setStrips(scene.treeStrips);
      this.appleAccentLines.setStrips(scene.accentStrips);
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
      this.appleTreeLines.setStrips([]);
      this.appleAccentLines.setStrips([]);
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

  private render(): void {
    this.renderer.render(this.scene, this.camera);
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
    this.geodesicLine.dispose();
    this.appleGeodesicLines.dispose();
    this.trailLine.dispose();
    this.appleTreeLines.dispose();
    this.appleAccentLines.dispose();
    this.dotMesh.geometry.dispose();
    (this.dotMesh.material as THREE.Material).dispose();
    this.renderer.dispose();
    const ext = this.renderer.getContext().getExtension('WEBGL_lose_context');
    ext?.loseContext();
  }
}
