/** Side-view 2D light-bending diagram (mass circle + beam paths). */

export type LightBend2DEdge = 'center' | 'inner' | 'outer';
export type LightBend2DAxis = 'horizontal' | 'vertical';

export interface LightBend2DLayout {
  /** Travel axis: horizontal = left→right beam; vertical = Epstein single-ray (top→down). */
  beamAxis: LightBend2DAxis;
  /** Mass centre x in diagram units (viewBox width = 100). */
  massCx: number;
  /** Mass centre y in diagram units (viewBox height = 72). */
  massCy: number;
  /** Mass radius in diagram-space units. */
  massR: number;
  /** Horizontal: entry x. Vertical: entry y. */
  sourcePos: number;
  /** Horizontal: exit x. Vertical: exit y. */
  targetPos: number;
  /** Horizontal: beam centreline y. Vertical: beam centreline x. */
  beamCenter: number;
  /** Half-width of the beam band perpendicular to travel. */
  beamHalfWidth: number;
  /** How strongly paths bend near the mass (0 = straight, 1 = strong). */
  deflection: number;
}

/** Horizontal beam grazing above a star (Epstein Fig. 9-2). */
export const DEFAULT_LIGHT_BEND_2D_LAYOUT: LightBend2DLayout = {
  beamAxis: 'horizontal',
  massCx: 50,
  massCy: 46,
  massR: 6,
  sourcePos: 8,
  targetPos: 92,
  beamCenter: 28,
  beamHalfWidth: 5,
  deflection: 0.72,
};

/** Single horizontal ray grazing the top of a star (Epstein single-ray sketch). */
export const SINGLE_RAY_LIGHT_BEND_LAYOUT: LightBend2DLayout = {
  beamAxis: 'horizontal',
  massCx: 50,
  massCy: 46,
  massR: 6,
  sourcePos: 8,
  targetPos: 92,
  beamCenter: 28,
  beamHalfWidth: 0,
  deflection: 0.72,
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function lightBend2DEndpoints(
  edge: LightBend2DEdge,
  layout: LightBend2DLayout = DEFAULT_LIGHT_BEND_2D_LAYOUT,
): { start: { x: number; y: number }; end: { x: number; y: number } } {
  return {
    start: lightBend2DPoint(edge, 0, layout),
    end: lightBend2DPoint(edge, 1, layout),
  };
}

/** Signed offset of an edge from beam centre, along local tangent's perpendicular. */
function edgePerpSign(edge: LightBend2DEdge): number {
  if (edge === 'inner') return 1;
  if (edge === 'outer') return -1;
  return 0;
}

/** "Inner" sits on the side of the beam closer to the mass. */
function towardMassSign(layout: LightBend2DLayout): number {
  if (layout.beamAxis === 'vertical') {
    return layout.massCx < layout.beamCenter ? -1 : 1;
  }
  return layout.massCy > layout.beamCenter ? 1 : -1;
}

/** Final centerline deflection angle (rad). */
function bendAngle(layout: LightBend2DLayout): number {
  return layout.deflection * 0.45;
}

/** Width of the bend region (units along travel axis). */
function bendSigma(layout: LightBend2DLayout): number {
  return layout.massR * 1.6;
}

/**
 * One-way deflection: straight before the mass, smooth bend through it,
 * **continues at the new angle** after — never returns to the original line.
 *
 * Uses a softplus-like ramp so the perpendicular offset is ~0 well before the
 * mass, transitions smoothly through it, and grows linearly afterwards.
 */
function softplusRamp(s: number): number {
  return 0.5 * (s + Math.sqrt(s * s + 1));
}
function softplusRampDeriv(s: number): number {
  return 0.5 * (1 + s / Math.sqrt(s * s + 1));
}

/** Centerline perpendicular offset and local slope at a given travel coord. */
function centerlineOffsetAndSlope(
  travel: number,
  layout: LightBend2DLayout,
): { offset: number; slope: number } {
  const massPos =
    layout.beamAxis === 'vertical' ? layout.massCy : layout.massCx;
  const sigma = bendSigma(layout);
  const sourceS = (layout.sourcePos - massPos) / sigma;
  const s = (travel - massPos) / sigma;
  const ramp = softplusRamp(s) - softplusRamp(sourceS);
  const angle = bendAngle(layout);
  return {
    offset: angle * sigma * ramp,
    slope: angle * softplusRampDeriv(s),
  };
}

/**
 * Perpendicular base coordinate of an edge at the source (no bend yet).
 *
 * Sign convention matches {@link lightBend2DPoint}: `inner` sits on the side
 * facing the mass, `outer` on the opposite side, both at `beamHalfWidth`
 * from the centreline.
 */
export function lightBend2DEdgePerp(
  edge: LightBend2DEdge,
  layout: LightBend2DLayout = DEFAULT_LIGHT_BEND_2D_LAYOUT,
): number {
  return (
    layout.beamCenter +
    edgePerpSign(edge) * layout.beamHalfWidth * towardMassSign(layout)
  );
}

/** @deprecated Use {@link lightBend2DEdgePerp} — kept for step-5 clock readout. */
export function lightBend2DEdgeY(
  edge: LightBend2DEdge,
  layout: LightBend2DLayout = DEFAULT_LIGHT_BEND_2D_LAYOUT,
): number {
  return lightBend2DEdgePerp(edge, layout);
}

export function lightBend2DPoint(
  edge: LightBend2DEdge,
  progress: number,
  layout: LightBend2DLayout = DEFAULT_LIGHT_BEND_2D_LAYOUT,
): { x: number; y: number } {
  const t = clamp01(progress);
  const span = layout.targetPos - layout.sourcePos;
  const travel = layout.sourcePos + t * span;
  const { offset, slope } = centerlineOffsetAndSlope(travel, layout);
  const toward = towardMassSign(layout);
  const halfW = layout.beamHalfWidth;
  const sign = edgePerpSign(edge); // +1 inner, -1 outer, 0 center
  const len = Math.sqrt(1 + slope * slope);
  // Perpendicular shift, perpendicular to local tangent (rigid band).
  const perpShift = (sign * halfW) / len;
  const tangShift = (-sign * halfW * slope) / len;

  if (layout.beamAxis === 'vertical') {
    // travel = y; perpendicular axis = x; mass on -x side ⇒ toward = -1.
    // Centerline at x = beamCenter + toward * offset, dx/dy = toward * slope.
    const xCenter = layout.beamCenter + toward * offset;
    return {
      x: xCenter + toward * perpShift,
      y: travel + tangShift,
    };
  }
  // Horizontal: travel = x; perpendicular axis = y; toward = +1 if mass below.
  const yCenter = layout.beamCenter + toward * offset;
  return {
    x: travel + tangShift,
    y: yCenter + toward * perpShift,
  };
}

export function lightBend2DSamples(
  edge: LightBend2DEdge,
  segmentCount: number,
  layout: LightBend2DLayout = DEFAULT_LIGHT_BEND_2D_LAYOUT,
): { x: number; y: number }[] {
  const n = Math.max(2, segmentCount);
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    out.push(lightBend2DPoint(edge, i / (n - 1), layout));
  }
  return out;
}

export function lightBend2DPathD(
  edge: LightBend2DEdge,
  layout: LightBend2DLayout = DEFAULT_LIGHT_BEND_2D_LAYOUT,
  sampleCount = 64,
): string {
  return lightBend2DPartialPathD(edge, 1, layout, sampleCount);
}

export function lightBend2DArcLength(
  edge: LightBend2DEdge,
  layout: LightBend2DLayout = DEFAULT_LIGHT_BEND_2D_LAYOUT,
  sampleCount = 64,
): number {
  const samples = lightBend2DSamples(edge, sampleCount, layout);
  let len = 0;
  for (let i = 1; i < samples.length; i++) {
    const dx = samples[i].x - samples[i - 1].x;
    const dy = samples[i].y - samples[i - 1].y;
    len += Math.hypot(dx, dy);
  }
  return len;
}

/** Partial path for animated reveal (progress ∈ [0, 1]). */
export function lightBend2DPartialPathD(
  edge: LightBend2DEdge,
  progress: number,
  layout: LightBend2DLayout = DEFAULT_LIGHT_BEND_2D_LAYOUT,
  sampleCount = 48,
): string {
  const t = clamp01(progress);
  if (t <= 0) {
    return '';
  }
  const samples = lightBend2DSamples(edge, sampleCount, layout);
  const endIndex = Math.max(1, Math.round(t * (samples.length - 1)));
  const slice = samples.slice(0, endIndex + 1);
  if (slice.length < 2) {
    const p = slice[0];
    return p ? `M ${p.x} ${p.y}` : '';
  }
  let d = `M ${slice[0].x} ${slice[0].y}`;
  for (let i = 1; i < slice.length; i++) {
    d += ` L ${slice[i].x} ${slice[i].y}`;
  }
  return d;
}
