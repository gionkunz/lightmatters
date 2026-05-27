import type { Vec3 } from '@lm/physics';
import { Color, Group, Scene, Vector2 } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import type { Rgb } from './read-theme-colors';

/** ~3× default 1px WebGL hairline — solid screen-space width. */
export const OVERLAY_LINE_WIDTH = 3;

function rgbToColor(rgb: Rgb): Color {
  return new Color(rgb[0], rgb[1], rgb[2]);
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

function pointsToFlatArray(points: Vec3[]): Float32Array {
  const data = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    data[i * 3] = points[i].x;
    data[i * 3 + 1] = points[i].y;
    data[i * 3 + 2] = points[i].z;
  }
  return data;
}

function createLineMaterial(
  rgb: Rgb,
  opacity: number,
  lineWidth: number,
  alwaysOnTop: boolean,
  vertexColors = false,
): LineMaterial {
  return new LineMaterial({
    color: rgbToColor(rgb).getHex(),
    linewidth: lineWidth,
    transparent: opacity < 1,
    opacity,
    depthTest: !alwaysOnTop,
    depthWrite: !alwaysOnTop,
    vertexColors,
    resolution: new Vector2(1, 1),
  });
}

/** Wide solid line segments (axis, tree glyph, etc.). */
export class WideWireframeLines {
  readonly mesh: LineSegments2;
  private readonly geometry = new LineSegmentsGeometry();
  private readonly material: LineMaterial;

  constructor(
    scene: Scene,
    rgb: Rgb,
    opacity: number,
    lineWidth = OVERLAY_LINE_WIDTH,
    renderOrder = 0,
    alwaysOnTop = false,
  ) {
    this.material = createLineMaterial(rgb, opacity, lineWidth, alwaysOnTop);
    this.mesh = new LineSegments2(this.geometry, this.material);
    this.mesh.renderOrder = renderOrder;
    scene.add(this.mesh);
  }

  setStrips(strips: Vec3[][]): void {
    if (strips.length === 0) {
      this.mesh.visible = false;
      return;
    }
    const positions = stripToLinePositions(strips);
    if (positions.length === 0) {
      this.mesh.visible = false;
      return;
    }
    this.mesh.visible = true;
    this.geometry.setPositions(positions);
  }

  setColor(rgb: Rgb, opacity: number): void {
    this.material.color.copy(rgbToColor(rgb));
    this.material.opacity = opacity;
    this.material.transparent = opacity < 1;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

/** One wide Line2 per strip — for SVG-style tree glyphs with multiple subpaths. */
export class WidePolylineStrips {
  readonly root = new Group();
  private lines: Line2[] = [];
  private readonly renderOrder: number;

  constructor(
    scene: Scene,
    private rgb: Rgb,
    private opacity: number,
    private lineWidth = OVERLAY_LINE_WIDTH,
    renderOrder = 0,
    private alwaysOnTop = false,
  ) {
    this.renderOrder = renderOrder;
    scene.add(this.root);
  }

  setStrips(strips: Vec3[][]): void {
    while (this.lines.length < strips.length) {
      const material = createLineMaterial(
        this.rgb,
        this.opacity,
        this.lineWidth,
        this.alwaysOnTop,
      );
      const line = new Line2(new LineGeometry(), material);
      line.frustumCulled = false;
      line.renderOrder = this.renderOrder;
      this.lines.push(line);
      this.root.add(line);
    }

    this.root.visible = strips.some((strip) => strip.length >= 2);

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const strip = strips[i];
      if (!strip || strip.length < 2) {
        line.visible = false;
        continue;
      }
      line.visible = true;
      const geometry = line.geometry as LineGeometry;
      geometry.setPositions(pointsToFlatArray(strip));
      geometry.computeBoundingSphere();
    }
  }

  setColor(rgb: Rgb, opacity: number): void {
    this.rgb = rgb;
    this.opacity = opacity;
    for (const line of this.lines) {
      const material = line.material as LineMaterial;
      material.color.copy(rgbToColor(rgb));
      material.opacity = opacity;
      material.transparent = opacity < 1;
    }
  }

  dispose(): void {
    for (const line of this.lines) {
      line.geometry.dispose();
      (line.material as LineMaterial).dispose();
      this.root.remove(line);
    }
    this.lines = [];
  }
}

/** Wide solid polyline (geodesic, trail). */
export class WidePolylineOverlay {
  readonly line: Line2;
  private readonly geometry = new LineGeometry();
  private readonly material: LineMaterial;
  private baseColor = new Color();

  constructor(
    scene: Scene,
    rgb: Rgb,
    opacity: number,
    lineWidth = OVERLAY_LINE_WIDTH,
    alwaysOnTop = false,
  ) {
    this.baseColor.copy(rgbToColor(rgb));
    this.material = createLineMaterial(rgb, opacity, lineWidth, alwaysOnTop);
    this.line = new Line2(this.geometry, this.material);
    if (alwaysOnTop) {
      this.line.renderOrder = 2;
    }
    scene.add(this.line);
  }

  setPoints(
    points: Vec3[],
    colorFn?: (index: number, total: number) => number,
  ): void {
    if (points.length < 2) {
      this.line.visible = false;
      return;
    }
    this.line.visible = true;
    this.geometry.setPositions(pointsToFlatArray(points));

    if (colorFn) {
      this.material.vertexColors = true;
      const colors = new Float32Array(points.length * 3);
      for (let i = 0; i < points.length; i++) {
        const alpha = colorFn(i, points.length);
        colors[i * 3] = this.baseColor.r * alpha;
        colors[i * 3 + 1] = this.baseColor.g * alpha;
        colors[i * 3 + 2] = this.baseColor.b * alpha;
      }
      this.geometry.setColors(colors);
    } else {
      this.material.vertexColors = false;
    }

    this.geometry.computeBoundingSphere();
  }

  setColor(rgb: Rgb, opacity: number): void {
    this.baseColor.copy(rgbToColor(rgb));
    this.material.color.copy(this.baseColor);
    this.material.opacity = opacity;
    this.material.transparent = opacity < 1;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
