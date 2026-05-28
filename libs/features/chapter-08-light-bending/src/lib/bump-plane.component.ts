import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import * as THREE from 'three';
import { ThemeService } from '@lm/design';
import {
  readThemeColors,
  type Rgb,
  type ThemeColors,
} from '@lm/curved-surface';

/**
 * Cone-on-a-plane WebGL primitive (Epstein Fig. 11-15 / 11-16).
 *
 * A flat reference ring with a paper cone glued at the centre. Light is a
 * geodesic — a straight line on the cone's intrinsic geometry. Re-roll the
 * cone and the same line projects to a **bent** xy path: that is the
 * deflection. Set `unfold` → 1 and the cone unrolls into a flat sector;
 * the same geodesic becomes one straight chord across the page.
 *
 * Mass model (single source of truth):
 *
 *   mass ∈ [0, 1]  →  half-angle α ∈ [80°, 32°]  →  taller, sharper cone.
 *
 * Base radius R is **constant**, so the line's miss-distance b is constant
 * too. Increasing mass makes the cone steeper, the unrolled sector smaller,
 * and the geodesic bend more — but never moves the line on the flat plane.
 */

/** Constant base radius of the cone (Three.js scene units). */
const BASE_R = 0.85;
/** Outer flat reference-ring radius. */
const PLANE_OUTER_R = 2.4;
/** Line miss-distance (perpendicular distance from cone axis to the line). */
const MISS_DISTANCE = 0.42 * BASE_R;
/** Length of the flat-plane extensions on either side of the cone. */
const EXTENSION_LENGTH = PLANE_OUTER_R - BASE_R;
/** Resolution of the unrolled chord sampling. */
const GEODESIC_SAMPLES = 96;
/** Wireframe density. */
const CONE_MERIDIANS = 24;
const CONE_PARALLELS = 6;
/** Annular flat-plane grid (between cone base and outer ring). */
const PLANE_RADIALS = 20;
const PLANE_RINGS = 5;

const ALPHA_MIN = (32 * Math.PI) / 180;
const ALPHA_MAX = (80 * Math.PI) / 180;
/** Matches {@link lightBend2D} permanent-deflection scale (deflection × 0.45). */
const BEND_ANGLE_SCALE = 0.45;

const ORBIT_SENSITIVITY = 0.008;
const CAMERA_RADIUS = 4.6;
const DEFAULT_AZ = -0.35;
const DEFAULT_EL = 0.6;

interface ConeGeometry {
  alpha: number;
  sinA: number;
  cosA: number;
  slant: number;
  height: number;
  sectorAngle: number;
}

function geometryForMass(mass: number): ConeGeometry {
  const m = Math.max(0, Math.min(1, mass));
  const alpha = ALPHA_MAX + (ALPHA_MIN - ALPHA_MAX) * m;
  const sinA = Math.sin(alpha);
  const cosA = Math.cos(alpha);
  const slant = BASE_R / sinA;
  const height = slant * cosA;
  const sectorAngle = 2 * Math.PI * sinA;
  return { alpha, sinA, cosA, slant, height, sectorAngle };
}

function rgb(c: Rgb): THREE.Color {
  return new THREE.Color(c[0], c[1], c[2]);
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Cone surface point at slant-distance `s` from apex, azimuth `phi`. */
function conePoint(s: number, phi: number, geom: ConeGeometry): THREE.Vector3 {
  const r = s * geom.sinA;
  return new THREE.Vector3(
    r * Math.cos(phi),
    r * Math.sin(phi),
    geom.height - s * geom.cosA,
  );
}

/** Unrolled-sector point at slant-distance `s` from apex, sector-angle `psi`. */
function unrolledPoint(s: number, psi: number): THREE.Vector3 {
  return new THREE.Vector3(s * Math.cos(psi), s * Math.sin(psi), 0);
}

/** Smoothly morph a cone point (unfold=0) → unrolled-flat position (unfold=1). */
function morphPoint(
  s: number,
  phi: number,
  geom: ConeGeometry,
  unfold: number,
): THREE.Vector3 {
  const cone = conePoint(s, phi, geom);
  const flat = unrolledPoint(s, phi * geom.sinA);
  return cone.lerp(flat, unfold);
}

@Component({
  selector: 'lm-bump-plane',
  template: `
    <div
      class="relative inline-block max-h-full max-w-full"
      [style.width.px]="width()"
      [style.height.px]="height()"
    >
      <canvas
        #canvas
        class="block max-h-full max-w-full"
        [attr.width]="width()"
        [attr.height]="height()"
        [style.width.px]="width()"
        [style.height.px]="height()"
      ></canvas>
      <button
        type="button"
        class="absolute right-2 top-2 flex size-9 cursor-pointer items-center justify-center rounded-full border border-ink-faint bg-paper/90 text-ink opacity-70 transition hover:border-accent-1 hover:opacity-100 hover:shadow-[0_0_12px_var(--color-accent-1-glow)]"
        aria-label="Reset view"
        (click)="resetCamera($event)"
      >
        <svg
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>
    </div>
  `,
})
export class LmBumpPlaneComponent implements OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  readonly width = input(560);
  readonly height = input(380);
  /** Gravitational mass / cone steepness. 0 = flat, 1 = steep. */
  readonly mass = input(0.55);
  /** 0 = full cone (3D bump); 1 = unrolled flat sector. */
  readonly unfold = input(0);
  /** 0..1 → fraction of the geodesic to draw (reserved for future timeline use). */
  readonly progress = input(1);

  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private rafId: number | null = null;
  private resetRafId: number | null = null;
  private dragging = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private orbitAzimuth = signal(DEFAULT_AZ);
  private orbitElevation = signal(DEFAULT_EL);

  private surfaceLines: THREE.LineSegments | null = null;
  private rimLine: THREE.LineLoop | null = null;
  private planeGrid: THREE.LineSegments | null = null;
  private geodesicLine: THREE.Line | null = null;
  private flatExtensionStart: THREE.Line | null = null;
  private flatExtensionEnd: THREE.Line | null = null;

  constructor() {
    afterNextRender(() => this.init());

    effect(() => {
      this.themeService.theme();
      this.applyTheme(readThemeColors());
    });

    effect(() => {
      this.width();
      this.height();
      this.applyResize();
    });

    effect(() => {
      const m = this.mass();
      const u = this.unfold();
      const p = this.progress();
      this.rebuild(m, u, p);
    });

    effect(() => {
      this.orbitAzimuth();
      this.orbitElevation();
      this.applyCamera();
    });
  }

  ngOnDestroy(): void {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
    if (this.resetRafId != null) cancelAnimationFrame(this.resetRafId);

    const canvas = this.canvasRef().nativeElement;
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointermove', this.onPointerMove);
    canvas.removeEventListener('pointerup', this.onPointerUp);
    canvas.removeEventListener('pointercancel', this.onPointerUp);

    [
      this.surfaceLines,
      this.rimLine,
      this.planeGrid,
      this.geodesicLine,
      this.flatExtensionStart,
      this.flatExtensionEnd,
    ].forEach((obj) => {
      obj?.geometry.dispose();
      (obj?.material as THREE.Material | undefined)?.dispose();
    });
    this.renderer?.dispose();
    this.renderer = null;
  }

  protected resetCamera(event: MouseEvent): void {
    event.stopPropagation();
    this.animateReset();
  }

  private init(): void {
    const canvas = this.canvasRef().nativeElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.05, 50);
    this.camera.up.set(0, 0, 1);

    const colors = readThemeColors();
    this.surfaceLines = this.makeLineSegments(colors.ink, 0.45);
    this.rimLine = this.makeLineLoop(colors.ink, 0.85);
    this.planeGrid = this.makeLineSegments(colors.ink, 0.28);
    this.geodesicLine = this.makeLine(colors.accent1, 1);
    this.flatExtensionStart = this.makeLine(colors.accent1, 0.55);
    this.flatExtensionEnd = this.makeLine(colors.accent1, 0.55);
    this.scene.add(this.surfaceLines);
    this.scene.add(this.rimLine);
    this.scene.add(this.planeGrid);
    this.scene.add(this.geodesicLine);
    this.scene.add(this.flatExtensionStart);
    this.scene.add(this.flatExtensionEnd);

    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerUp);

    this.applyResize();
    this.applyCamera();
    this.rebuild(this.mass(), this.unfold(), this.progress());

    const tick = () => {
      this.renderer?.render(
        this.scene as THREE.Scene,
        this.camera as THREE.PerspectiveCamera,
      );
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private makeLineSegments(color: Rgb, opacity: number): THREE.LineSegments {
    const mat = new THREE.LineBasicMaterial({
      color: rgb(color),
      transparent: true,
      opacity,
    });
    return new THREE.LineSegments(new THREE.BufferGeometry(), mat);
  }
  private makeLineLoop(color: Rgb, opacity: number): THREE.LineLoop {
    const mat = new THREE.LineBasicMaterial({
      color: rgb(color),
      transparent: true,
      opacity,
    });
    return new THREE.LineLoop(new THREE.BufferGeometry(), mat);
  }
  private makeLine(color: Rgb, opacity: number): THREE.Line {
    const mat = new THREE.LineBasicMaterial({
      color: rgb(color),
      transparent: true,
      opacity,
    });
    return new THREE.Line(new THREE.BufferGeometry(), mat);
  }

  private rebuild(mass: number, unfold: number, progress: number): void {
    if (!this.surfaceLines || !this.rimLine || !this.planeGrid) return;
    const geom = geometryForMass(mass);
    this.buildSurfaceWireframe(geom, unfold);
    this.buildRim(geom, unfold);
    this.buildPlaneGrid(unfold);
    this.buildGeodesic(mass, geom, unfold, progress);
  }

  private buildSurfaceWireframe(geom: ConeGeometry, unfold: number): void {
    if (!this.surfaceLines) return;
    const segs: number[] = [];

    // Meridians: constant φ, s sweeps from near-apex to base.
    for (let m = 0; m < CONE_MERIDIANS; m++) {
      const phi = (m / CONE_MERIDIANS) * 2 * Math.PI;
      let prev: THREE.Vector3 | null = null;
      for (let i = 0; i <= CONE_PARALLELS; i++) {
        const s = (i / CONE_PARALLELS) * geom.slant;
        const p = morphPoint(Math.max(s, 0.001), phi, geom, unfold);
        if (prev) segs.push(prev.x, prev.y, prev.z, p.x, p.y, p.z);
        prev = p;
      }
    }

    // Parallels: constant s, φ sweeps.
    for (let i = 1; i <= CONE_PARALLELS; i++) {
      const s = (i / CONE_PARALLELS) * geom.slant;
      const segments = 64;
      let prev: THREE.Vector3 | null = null;
      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * 2 * Math.PI;
        const p = morphPoint(s, phi, geom, unfold);
        if (prev) segs.push(prev.x, prev.y, prev.z, p.x, p.y, p.z);
        prev = p;
      }
    }

    const buf = this.surfaceLines.geometry as THREE.BufferGeometry;
    buf.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
    buf.computeBoundingSphere();
  }

  private buildRim(geom: ConeGeometry, unfold: number): void {
    if (!this.rimLine) return;
    const segments = 96;
    const pts: number[] = [];
    for (let j = 0; j <= segments; j++) {
      const phi = (j / segments) * 2 * Math.PI;
      const p = morphPoint(geom.slant, phi, geom, unfold);
      pts.push(p.x, p.y, p.z);
    }
    const buf = this.rimLine.geometry as THREE.BufferGeometry;
    buf.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    buf.computeBoundingSphere();
  }

  private buildPlaneGrid(unfold: number): void {
    if (!this.planeGrid) return;
    // Fade as we unfold — the annulus is meaningless on the flat sector.
    (this.planeGrid.material as THREE.LineBasicMaterial).opacity =
      0.28 * (1 - unfold);

    const segs: number[] = [];

    // Concentric rings in the annulus [BASE_R, PLANE_OUTER_R].
    for (let ring = 0; ring <= PLANE_RINGS; ring++) {
      const r =
        BASE_R + (ring / PLANE_RINGS) * (PLANE_OUTER_R - BASE_R);
      const segments = 72;
      let prev: [number, number] | null = null;
      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * 2 * Math.PI;
        const x = r * Math.cos(phi);
        const y = r * Math.sin(phi);
        if (prev) segs.push(prev[0], prev[1], 0, x, y, 0);
        prev = [x, y];
      }
    }

    // Radial spokes across the annulus.
    for (let r = 0; r < PLANE_RADIALS; r++) {
      const phi = (r / PLANE_RADIALS) * 2 * Math.PI;
      const cos = Math.cos(phi);
      const sin = Math.sin(phi);
      segs.push(
        BASE_R * cos,
        BASE_R * sin,
        0,
        PLANE_OUTER_R * cos,
        PLANE_OUTER_R * sin,
        0,
      );
    }

    const buf = this.planeGrid.geometry as THREE.BufferGeometry;
    buf.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
    buf.computeBoundingSphere();
  }

  private buildGeodesic(
    mass: number,
    geom: ConeGeometry,
    unfold: number,
    progress: number,
  ): void {
    if (
      !this.geodesicLine ||
      !this.flatExtensionStart ||
      !this.flatExtensionEnd
    )
      return;

    // Line lives in the plane y = MISS_DISTANCE. It crosses the cone-base
    // circle at two fixed xy points (independent of mass).
    const b = MISS_DISTANCE;
    const dx = Math.sqrt(BASE_R * BASE_R - b * b);
    const phiIn = Math.atan2(b, -dx); // ∈ (π/2, π)
    const phiOut = Math.atan2(b, dx); // ∈ (0, π/2)

    // Unrolled-sector positions of the rim entry/exit points.
    const psiIn = phiIn * geom.sinA;
    const psiOut = phiOut * geom.sinA;
    const startFlat = unrolledPoint(geom.slant, psiIn);
    const endFlat = unrolledPoint(geom.slant, psiOut);

    // Sample the straight chord on the unrolled sector, map every sample
    // back through the cone ↔ flat morph.
    const chordPts: THREE.Vector3[] = [];
    for (let i = 0; i <= GEODESIC_SAMPLES; i++) {
      const t = i / GEODESIC_SAMPLES;
      const cx = startFlat.x * (1 - t) + endFlat.x * t;
      const cy = startFlat.y * (1 - t) + endFlat.y * t;
      const s = Math.hypot(cx, cy);
      const psi = Math.atan2(cy, cx);
      const phi = psi / geom.sinA;
      chordPts.push(morphPoint(s, phi, geom, unfold));
    }

    const visibleCount = Math.max(2, Math.round(progress * chordPts.length));
    const visible = chordPts.slice(0, visibleCount);
    const flat: number[] = [];
    for (const p of visible) flat.push(p.x, p.y, p.z);
    const buf = this.geodesicLine.geometry as THREE.BufferGeometry;
    buf.setAttribute('position', new THREE.Float32BufferAttribute(flat, 3));
    buf.computeBoundingSphere();

    // Flat-plane extensions: entry stays horizontal (matches side view);
    // exit deflects toward the mass as cone steepness / mass increases.
    const startBase = new THREE.Vector3(-dx, b, 0);
    const endBase = new THREE.Vector3(dx, b, 0);
    const ext = (1 - unfold) * EXTENSION_LENGTH * 0.95;

    const entryDir = new THREE.Vector3(1, 0, 0);
    const exitTheta = mass * BEND_ANGLE_SCALE;
    const exitDir = new THREE.Vector3(
      Math.cos(exitTheta),
      -Math.sin(exitTheta),
      0,
    );

    const startExt = startBase
      .clone()
      .add(entryDir.clone().multiplyScalar(-ext));
    const endExt = endBase.clone().add(exitDir.clone().multiplyScalar(ext));

    (this.flatExtensionStart.geometry as THREE.BufferGeometry).setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [startExt.x, startExt.y, 0, startBase.x, startBase.y, 0],
        3,
      ),
    );
    (this.flatExtensionEnd.geometry as THREE.BufferGeometry).setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [endBase.x, endBase.y, 0, endExt.x, endExt.y, 0],
        3,
      ),
    );
    (this.flatExtensionStart.material as THREE.LineBasicMaterial).opacity =
      0.6 * (1 - unfold);
    (this.flatExtensionEnd.material as THREE.LineBasicMaterial).opacity =
      0.6 * (1 - unfold);
  }

  private applyResize(): void {
    if (!this.renderer || !this.camera) return;
    const w = this.width();
    const h = this.height();
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private applyCamera(): void {
    if (!this.camera) return;
    const az = this.orbitAzimuth();
    const el = Math.max(-1.3, Math.min(1.3, this.orbitElevation()));
    const r = CAMERA_RADIUS;
    const cosEl = Math.cos(el);
    const x = r * cosEl * Math.sin(az);
    const y = -r * cosEl * Math.cos(az);
    const z = r * Math.sin(el);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0.2);
    this.camera.updateProjectionMatrix();
  }

  private applyTheme(colors: ThemeColors): void {
    const set = (obj: THREE.Object3D | null, c: Rgb) => {
      if (!obj) return;
      const mat = (obj as THREE.Line | THREE.LineSegments | THREE.LineLoop)
        .material as THREE.LineBasicMaterial;
      mat.color = rgb(c);
    };
    set(this.surfaceLines, colors.ink);
    set(this.rimLine, colors.ink);
    set(this.planeGrid, colors.ink);
    set(this.geodesicLine, colors.accent1);
    set(this.flatExtensionStart, colors.accent1);
    set(this.flatExtensionEnd, colors.accent1);
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    this.dragging = true;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    this.canvasRef().nativeElement.setPointerCapture(event.pointerId);
  };
  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging) return;
    const dx = event.clientX - this.lastPointerX;
    const dy = event.clientY - this.lastPointerY;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    this.orbitAzimuth.update((v) => v - dx * ORBIT_SENSITIVITY);
    this.orbitElevation.update((v) => v + dy * ORBIT_SENSITIVITY);
  };
  private readonly onPointerUp = (event: PointerEvent): void => {
    if (!this.dragging) return;
    this.dragging = false;
    const canvas = this.canvasRef().nativeElement;
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  };

  private animateReset(durationMs = 400): void {
    if (this.resetRafId != null) cancelAnimationFrame(this.resetRafId);
    const startAz = this.orbitAzimuth();
    const startEl = this.orbitElevation();
    if (
      Math.abs(startAz - DEFAULT_AZ) < 1e-3 &&
      Math.abs(startEl - DEFAULT_EL) < 1e-3
    ) {
      return;
    }
    const startWall = performance.now();
    const step = (now: number) => {
      const t = easeOutCubic(Math.min(1, (now - startWall) / durationMs));
      this.orbitAzimuth.set(startAz + (DEFAULT_AZ - startAz) * t);
      this.orbitElevation.set(startEl + (DEFAULT_EL - startEl) * t);
      if (t < 1) this.resetRafId = requestAnimationFrame(step);
      else this.resetRafId = null;
    };
    this.resetRafId = requestAnimationFrame(step);
  }
}
