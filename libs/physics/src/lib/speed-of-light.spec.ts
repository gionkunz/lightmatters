import {
  cFromMaxwellConstants,
  cFromMaxwellConstantsKms,
  earthLapsPerSecond,
  EARTH_MOON_DISTANCE_KM,
  EARTH_SUN_DISTANCE_KM,
  formatMillionsOfYears,
  ANDROMEDA_DISTANCE_LY,
  lightTravelTimeSeconds,
  SPEED_OF_LIGHT_KMS,
  speedFromFlight,
  VACUUM_PERMEABILITY,
  VACUUM_PERMITTIVITY,
} from './speed-of-light';

describe('speed-of-light helpers', () => {
  it('Earth to Moon travel time', () => {
    expect(lightTravelTimeSeconds(EARTH_MOON_DISTANCE_KM)).toBeCloseTo(1.28, 2);
  });

  it('Sun to Earth travel time', () => {
    expect(lightTravelTimeSeconds(EARTH_SUN_DISTANCE_KM)).toBeCloseTo(499, 0);
  });

  it('Earth laps per second', () => {
    expect(earthLapsPerSecond()).toBeCloseTo(7.5, 1);
  });

  it('one-kilometre baseline returns c', () => {
    const seconds = 1 / SPEED_OF_LIGHT_KMS;
    expect(speedFromFlight(1, seconds)).toBeCloseTo(SPEED_OF_LIGHT_KMS, 3);
  });

  it('Maxwell constants yield c in m/s', () => {
    expect(cFromMaxwellConstants()).toBeCloseTo(299_792_458, -3);
  });

  it('Maxwell constants agree with SPEED_OF_LIGHT_KMS', () => {
    expect(cFromMaxwellConstantsKms()).toBeCloseTo(SPEED_OF_LIGHT_KMS, 0);
  });

  it('Andromeda travel time in millions of years', () => {
    expect(formatMillionsOfYears(ANDROMEDA_DISTANCE_LY)).toBe('2.5 million years');
  });

  it('accepts explicit epsilon0 and mu0', () => {
    expect(
      cFromMaxwellConstants(VACUUM_PERMITTIVITY, VACUUM_PERMEABILITY),
    ).toBeCloseTo(299_792_458, -3);
  });
});
