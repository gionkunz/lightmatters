import {
  EQUAL_SPLIT_V_OVER_C,
  lorentz,
  properTimeFraction,
} from './lorentz';
import { spatialSpeedKms } from './speed-budget';

describe('lorentz', () => {
  it('returns 1 at rest', () => {
    expect(lorentz(0)).toBe(1);
  });

  it('returns γ ≈ 1.155 at half light speed', () => {
    expect(lorentz(0.5)).toBeCloseTo(1.1547005383792515, 10);
  });
});

describe('properTimeFraction', () => {
  it('returns 1 at rest', () => {
    expect(properTimeFraction(0)).toBe(1);
  });

  it('returns √(3/4) at half light speed', () => {
    expect(properTimeFraction(0.5)).toBeCloseTo(Math.sqrt(0.75), 10);
  });

  it('returns cos(45°) at equal split velocity', () => {
    expect(properTimeFraction(EQUAL_SPLIT_V_OVER_C)).toBeCloseTo(
      Math.cos(Math.PI / 4),
      10,
    );
  });

  it('returns 0 at light speed', () => {
    expect(properTimeFraction(1)).toBe(0);
  });
});

describe('spatialSpeedKms', () => {
  it('returns half c at v/c = 0.5', () => {
    expect(spatialSpeedKms(0.5)).toBeCloseTo(149_896.229, 0);
  });
});
