import {
  arcSpatialSpeedKms,
  LIGHT_HOUR_KM,
  LIGHT_YEAR_KM,
  ONE_HOUR_YEARS,
  spatialSpeedKms,
  SPEED_OF_LIGHT_KMS,
  speedBudgetComponents,
  speedBudgetTipLabel,
} from './speed-budget';
import { EQUAL_SPLIT_V_OVER_C, properTimeFraction } from './lorentz';

describe('speedBudgetComponents', () => {
  it('allocates all budget to time at rest', () => {
    const { timeYears, spaceKm } = speedBudgetComponents(0);
    expect(timeYears).toBe(1);
    expect(spaceKm).toBe(0);
  });

  it('allocates all budget to space at light speed', () => {
    const { timeYears, spaceKm } = speedBudgetComponents(1);
    expect(timeYears).toBeCloseTo(0, 15);
    expect(spaceKm).toBe(LIGHT_YEAR_KM);
  });

  it('splits at half light speed using Lorentz proper time', () => {
    const { timeYears, spaceKm } = speedBudgetComponents(0.5);
    expect(timeYears).toBeCloseTo(properTimeFraction(0.5), 10);
    expect(spaceKm).toBe(0.5 * LIGHT_YEAR_KM);
  });

  it('splits evenly at equal-split arc velocity (45°)', () => {
    const { timeYears, spaceKm } = speedBudgetComponents(EQUAL_SPLIT_V_OVER_C);
    expect(timeYears).toBeCloseTo(Math.cos(Math.PI / 4), 10);
    expect(spaceKm).toBeCloseTo(EQUAL_SPLIT_V_OVER_C * LIGHT_YEAR_KM, 6);
  });

  it('allocates one light-hour at light speed on hour scale', () => {
    const { timeYears, spaceKm } = speedBudgetComponents(1, ONE_HOUR_YEARS);
    expect(timeYears).toBeCloseTo(0, 15);
    expect(spaceKm).toBe(LIGHT_HOUR_KM);
  });

  it('does not round component values', () => {
    const v = 0.37;
    const { timeYears, spaceKm } = speedBudgetComponents(v);
    expect(timeYears).toBe(properTimeFraction(v));
    expect(spaceKm).toBe(v * LIGHT_YEAR_KM);
  });
});

describe('spatialSpeedKms', () => {
  it('returns physical speed from v/c', () => {
    expect(spatialSpeedKms(1)).toBe(SPEED_OF_LIGHT_KMS);
    expect(spatialSpeedKms(0.5)).toBe(0.5 * SPEED_OF_LIGHT_KMS);
  });
});

describe('arcSpatialSpeedKms', () => {
  it('matches spatialSpeedKms', () => {
    expect(arcSpatialSpeedKms(0.5)).toBe(spatialSpeedKms(0.5));
  });
});

describe('speedBudgetTipLabel', () => {
  it('formats pure-time extreme at year scale', () => {
    expect(speedBudgetTipLabel(0)).toEqual({
      timeLine: '1 year time passed',
      spaceLine: '0 km traveled (0 km/s)',
    });
  });

  it('formats pure-time extreme at hour scale', () => {
    expect(speedBudgetTipLabel(0, ONE_HOUR_YEARS)).toEqual({
      timeLine: '1 hour time passed',
      spaceLine: '0 km traveled (0 km/s)',
    });
  });

  it('formats pure-space extreme at year scale from computed values', () => {
    const label = speedBudgetTipLabel(1);
    expect(label.timeLine).toBe('0 years time passed');
    expect(label.spaceLine).toMatch(/×10¹² km traveled \(299,792 km\/s\)/);
  });

  it('formats pure-space extreme at hour scale from computed values', () => {
    const label = speedBudgetTipLabel(1, ONE_HOUR_YEARS);
    expect(label.timeLine).toBe('0 hours time passed');
    expect(label.spaceLine).toMatch(/×10⁹ km traveled \(299,792 km\/s\)/);
  });

  it('shows continuous readout near rest without snapping to zero space', () => {
    const label = speedBudgetTipLabel(0.05);
    expect(label.timeLine).toBe('1 year time passed');
    expect(label.spaceLine).toMatch(/×10¹¹ km traveled \(14,99\d km\/s\)/);
  });

  it('includes half light speed at v/c = 0.5', () => {
    const label = speedBudgetTipLabel(0.5);
    const expectedSpeed = Math.round(spatialSpeedKms(0.5)).toLocaleString(
      'en-US',
    );
    expect(label.spaceLine).toContain(`${expectedSpeed} km/s`);
    expect(label.timeLine).toContain('0.87');
  });
});