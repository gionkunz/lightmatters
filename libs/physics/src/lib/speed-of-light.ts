import { SPEED_OF_LIGHT_KMS } from './speed-budget';

export { SPEED_OF_LIGHT_KMS } from './speed-budget';

/** Mean Earth equatorial circumference, km (WGS84). */
export const EARTH_CIRCUMFERENCE_KM = 40_075;

/** Earth–Moon distance (mean), km. */
export const EARTH_MOON_DISTANCE_KM = 384_400;

/** Earth–Sun distance (1 AU), km. */
export const EARTH_SUN_DISTANCE_KM = 149_600_000;

/** Andromeda galaxy (M31) distance, light-years. */
export const ANDROMEDA_DISTANCE_LY = 2_537_000;

/** Light-travel time in years for a distance in light-years (by definition). */
export function lightTravelTimeYears(distanceLy: number): number {
  return distanceLy;
}

/** Human-readable millions of years from light-years. */
export function formatMillionsOfYears(distanceLy: number): string {
  const millions = distanceLy / 1_000_000;
  if (millions >= 10) {
    return `${Math.round(millions)} million years`;
  }
  return `${millions.toFixed(1)} million years`;
}

/** SI vacuum permittivity, F/m. */
export const VACUUM_PERMITTIVITY = 8.854_187_8128e-12;

/** SI vacuum permeability, H/m. */
export const VACUUM_PERMEABILITY = 1.256_637_062_12e-6;

/** Light-travel time in seconds for a given distance in km. */
export function lightTravelTimeSeconds(distanceKm: number): number {
  return distanceKm / SPEED_OF_LIGHT_KMS;
}

/** How many laps around the equator light travels each second. */
export function earthLapsPerSecond(): number {
  return SPEED_OF_LIGHT_KMS / EARTH_CIRCUMFERENCE_KM;
}

/** Speed from a known distance and elapsed time (km/s). */
export function speedFromFlight(distanceKm: number, seconds: number): number {
  return distanceKm / seconds;
}

/** Speed of light from Maxwell's relation, m/s. */
export function cFromMaxwellConstants(
  epsilon0 = VACUUM_PERMITTIVITY,
  mu0 = VACUUM_PERMEABILITY,
): number {
  return 1 / Math.sqrt(epsilon0 * mu0);
}

/** Speed of light from Maxwell's relation, km/s. */
export function cFromMaxwellConstantsKms(
  epsilon0 = VACUUM_PERMITTIVITY,
  mu0 = VACUUM_PERMEABILITY,
): number {
  return cFromMaxwellConstants(epsilon0, mu0) / 1000;
}
