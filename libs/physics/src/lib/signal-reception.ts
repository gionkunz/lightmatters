import { properTimeFraction } from './lorentz';
export interface WavefrontLayout {
  xA: number;
  xB: number;
  xC: number;
  vOverC: number;
  tEmit?: number;
}

/** Equal spatial separation between A–B and B–C (c = 1 diagram units). */
export const STEP3_SEPARATION = 0.25;

/** Chapter 2 Step 3 bridge: two stationary observers, one flash toward A. */
export const STEP3_BRIDGE_LAYOUT: WavefrontLayout = {
  xA: STEP3_SEPARATION,
  xB: STEP3_SEPARATION * 2,
  xC: STEP3_SEPARATION * 3,
  vOverC: 0,
  tEmit: 0,
};

/** Default Chapter 2 Step 3 layout: A, B, C at equal positive x spacing; C at half light speed from t = 0. */
export const STEP3_WAVEFRONT_LAYOUT: WavefrontLayout = {
  xA: STEP3_SEPARATION,
  xB: STEP3_SEPARATION * 2,
  xC: STEP3_SEPARATION * 3,
  vOverC: 0.5,
  tEmit: 0,
};

/** Spatial x position of an observer at coordinate time t (c = 1). */
export function observerPositionAtTime(
  layout: WavefrontLayout,
  observer: 'a' | 'b' | 'c',
  t: number,
): number {
  switch (observer) {
    case 'a':
      return layout.xA;
    case 'b':
      return layout.xB;
    case 'c':
      return layout.xC + layout.vOverC * t;
  }
}

/**
 * Coordinate time when light from B reaches a stationary observer to the left (c = 1).
 * Flash at tEmit; light travels left from xB.
 */
export function receptionTimeStationary(
  xEmit: number,
  tEmit: number,
  xObs: number,
  c = 1,
): number {
  return tEmit + Math.abs(xEmit - xObs) / c;
}

/**
 * Coordinate time when right-going light from B reaches C moving at v from xC at t = 0.
 */
export function receptionTimeMoving(
  xEmit: number,
  tEmit: number,
  x0: number,
  vOverC: number,
  c = 1,
): number {
  const v = vOverC * c;
  const denom = c - v;
  if (denom <= 0) {
    return Infinity;
  }
  return tEmit + (x0 - xEmit) / denom;
}

/** Coordinate reception time for observer a or c. */
export function receptionCoordinateTime(
  layout: WavefrontLayout,
  observer: 'a' | 'c',
): number {
  const tEmit = layout.tEmit ?? 0;
  if (observer === 'a') {
    return receptionTimeStationary(layout.xB, tEmit, layout.xA);
  }
  return receptionTimeMoving(
    layout.xB,
    tEmit,
    layout.xC,
    layout.vOverC,
  );
}

/** @deprecated Use receptionCoordinateTime — kept for timeline milestone naming. */
export function wavefrontRadiusAtObserver(
  layout: WavefrontLayout,
  observer: 'a' | 'c',
): number {
  return receptionCoordinateTime(layout, observer);
}

/** Proper time elapsed on an observer's clock from t = 0 to coordinate reception time. */
export function properTimeAtReception(tCoord: number, vOverC: number): number {
  if (tCoord <= 0) {
    return 0;
  }
  return tCoord * properTimeFraction(vOverC);
}

export function receptionProperTime(
  layout: WavefrontLayout,
  observer: 'a' | 'c',
): number {
  const tCoord = receptionCoordinateTime(layout, observer);
  const v = observer === 'a' ? 0 : layout.vOverC;
  return properTimeAtReception(tCoord, v);
}

/** Proper time on an observer's clock at coordinate time t since t = 0. */
export function observerProperTimeAtCoordinate(
  tCoord: number,
  vOverC: number,
): number {
  return properTimeAtReception(tCoord, vOverC);
}

/** Coordinate time elapsed when an observer's proper time reaches τ (constant v from t = 0). */
export function coordinateTimeAtProperTime(
  properTime: number,
  vOverC: number,
): number {
  const frac = properTimeFraction(vOverC);
  if (frac <= 0) {
    return properTime;
  }
  return properTime / frac;
}

/** Spatial x on an observer's worldline at proper time τ. */
export function observerPositionAtProperTime(
  layout: WavefrontLayout,
  observer: 'a' | 'b' | 'c',
  properTime: number,
): number {
  switch (observer) {
    case 'a':
      return layout.xA;
    case 'b':
      return layout.xB;
    case 'c': {
      const t = coordinateTimeAtProperTime(properTime, layout.vOverC);
      return layout.xC + layout.vOverC * t;
    }
  }
}

/** FactLine-friendly elapsed-time label in diagram coordinate units. */
export function signalClockLabel(properTime: number): string {
  if (properTime <= 0) {
    return '—';
  }
  if (properTime < 0.01) {
    return '0.00 t';
  }
  return `${properTime.toFixed(2)} t`;
}

/** Max coordinate time on the Step 3 bridge diagram (two observers, one pulse). */
export const STEP3_BRIDGE_MAX_TIME = 0.35;

export const STEP3_BRIDGE_TIME_AT_A = receptionCoordinateTime(
  STEP3_BRIDGE_LAYOUT,
  'a',
);

/** Max coordinate time shown on the Step 3 diagram. */
export const STEP3_MAX_TIME = 0.55;

export const STEP3_TIME_AT_A = receptionCoordinateTime(
  STEP3_WAVEFRONT_LAYOUT,
  'a',
);
export const STEP3_TIME_AT_C = receptionCoordinateTime(
  STEP3_WAVEFRONT_LAYOUT,
  'c',
);

/** @deprecated Use STEP3_TIME_AT_A */
export const STEP3_RADIUS_AT_A = STEP3_TIME_AT_A;
/** @deprecated Use STEP3_TIME_AT_C */
export const STEP3_RADIUS_AT_C = STEP3_TIME_AT_C;
