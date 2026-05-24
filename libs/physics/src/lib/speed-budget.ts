import { properTimeFraction } from './lorentz';

/** Speed of light in km/s (SI definition). */
export const SPEED_OF_LIGHT_KMS = 299_792.458;

export const HOURS_PER_YEAR = 8760;

export const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;

/** Distance light travels in one year, in km — derived, not rounded. */
export const LIGHT_YEAR_KM = SPEED_OF_LIGHT_KMS * SECONDS_PER_YEAR;

/** One hour as a fraction of a year — use for hour-scale budget examples. */
export const ONE_HOUR_YEARS = 1 / HOURS_PER_YEAR;

/** Light-travel distance in one hour, in km — derived, not rounded. */
export const LIGHT_HOUR_KM = LIGHT_YEAR_KM / HOURS_PER_YEAR;

export interface SpeedBudgetComponents {
  timeYears: number;
  spaceKm: number;
}

/** Spatial speed in km/s for physical v/c (0 = rest, 1 = c). */
export function spatialSpeedKms(vOverC: number): number {
  return Math.min(1, Math.max(0, vOverC)) * SPEED_OF_LIGHT_KMS;
}

/** Time/space split for a fixed-c budget vector; vOverC is physical velocity. */
export function speedBudgetComponents(
  vOverC: number,
  coordinateYears = 1,
): SpeedBudgetComponents {
  const v = Math.min(1, Math.max(0, vOverC));
  return {
    timeYears: coordinateYears * properTimeFraction(v),
    spaceKm: coordinateYears * v * LIGHT_YEAR_KM,
  };
}

/** @deprecated Use {@link spatialSpeedKms}. Kept for diagram tip labels. */
export function arcSpatialSpeedKms(vOverC: number): number {
  return spatialSpeedKms(vOverC);
}

export interface SpeedBudgetTipLabel {
  timeLine: string;
  spaceLine: string;
}

const HOUR_SCALE_THRESHOLD_YEARS = 1 / 365;

function toSuperscript(n: number): string {
  return String(n)
    .split('')
    .map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)] ?? d)
    .join('');
}

function formatHours(hours: number): string {
  if (hours < 0.005) {
    return '0 hours';
  }
  if (Math.abs(hours - 1) < 0.05) {
    return '1 hour';
  }
  if (hours < 10) {
    return `${hours.toFixed(1)} hours`;
  }
  return `${Math.round(hours)} hours`;
}

function formatYears(years: number): string {
  if (years < 0.005) {
    return '0 years';
  }
  if (Math.abs(years - 1) < 0.005) {
    return '1 year';
  }
  if (years < 0.1) {
    return `${years.toFixed(2)} years`;
  }
  return `${years.toFixed(2)} years`;
}

function formatElapsedTime(timeYears: number, budgetYears: number): string {
  if (budgetYears < HOUR_SCALE_THRESHOLD_YEARS) {
    return formatHours(timeYears * HOURS_PER_YEAR);
  }
  return formatYears(timeYears);
}

/** Display-only: format a distance in km for the tip readout. */
function formatKm(km: number): string {
  if (km < 0.5) {
    return '0 km';
  }
  if (km >= 1e9) {
    const exponent = Math.floor(Math.log10(km));
    const mantissa = km / 10 ** exponent;
    const roundedMantissa =
      mantissa >= 10
        ? mantissa.toFixed(0)
        : mantissa >= 1
          ? mantissa.toFixed(2).replace(/\.?0+$/, '')
          : mantissa.toFixed(2);
    return `${roundedMantissa}×10${toSuperscript(exponent)} km`;
  }
  if (km >= 1e6) {
    return `${Math.round(km).toLocaleString('en-US')} km`;
  }
  return `${Math.round(km).toLocaleString('en-US')} km`;
}

/** Display-only: format a speed in km/s for the tip readout. */
function formatSpeedKms(speedKms: number): string {
  if (speedKms < 1) {
    return '0 km/s';
  }
  if (speedKms >= 10_000) {
    return `${Math.round(speedKms).toLocaleString('en-US')} km/s`;
  }
  if (speedKms >= 100) {
    return `${Math.round(speedKms).toLocaleString('en-US')} km/s`;
  }
  return `${speedKms.toFixed(1)} km/s`;
}

function formatSpaceLine(spaceKm: number, speedKms: number): string {
  return `${formatKm(spaceKm)} traveled (${formatSpeedKms(speedKms)})`;
}

/** Two-line readout for the vector tip. Calculations stay in full precision; only strings are rounded. */
export function speedBudgetTipLabel(
  velocity: number,
  properYears = 1,
): SpeedBudgetTipLabel {
  const { timeYears, spaceKm } = speedBudgetComponents(velocity, properYears);
  const speedKms = arcSpatialSpeedKms(velocity);

  return {
    timeLine: `${formatElapsedTime(timeYears, properYears)} time passed`,
    spaceLine: formatSpaceLine(spaceKm, speedKms),
  };
}
