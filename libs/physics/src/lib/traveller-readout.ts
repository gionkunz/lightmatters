import {
  arcSpatialSpeedKms,
  speedBudgetComponents,
} from './speed-budget';

export interface TravellerReadout {
  vOverCLabel: string;
  clockLabel: string;
  spatialSpeedLabel: string;
}

const NEGLigible_V_OVER_C = 0.02;

function formatVOverC(vOverC: number): string {
  if (vOverC < NEGLigible_V_OVER_C) {
    return 'v / c ≈ 0';
  }
  return `v / c = ${vOverC.toFixed(2)}`;
}

function formatClock(timeYears: number, coordinateYears: number): string {
  if (timeYears >= coordinateYears * 0.995) {
    return coordinateYears === 1 ? '1 year' : `${coordinateYears.toFixed(2)} years`;
  }
  if (timeYears < 0.005) {
    return '0 years';
  }
  return `${timeYears.toFixed(2)} years`;
}

function formatSpatialSpeed(vOverC: number, speedKms: number): string {
  if (vOverC < NEGLigible_V_OVER_C) {
    return 'negligible';
  }
  if (speedKms >= 10_000) {
    return `${Math.round(speedKms).toLocaleString('en-US')} km/s`;
  }
  return `${speedKms.toFixed(1)} km/s`;
}

/** Formatted FactLine values for a twin-traveller readout row. */
export function travellerReadout(
  vOverC: number,
  coordinateYears = 1,
): TravellerReadout {
  const { timeYears } = speedBudgetComponents(vOverC, coordinateYears);
  const speedKms = arcSpatialSpeedKms(vOverC);

  return {
    vOverCLabel: formatVOverC(vOverC),
    clockLabel: formatClock(timeYears, coordinateYears),
    spatialSpeedLabel: formatSpatialSpeed(vOverC, speedKms),
  };
}
