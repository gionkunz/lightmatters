import {
  arcSpatialSpeedKms,
  LIGHT_HOUR_KM,
  LIGHT_YEAR_KM,
  ONE_HOUR_YEARS,
  SPEED_OF_LIGHT_KMS,
  speedBudgetComponents,
  speedBudgetTipLabel,
} from './speed-budget';

describe('speedBudgetComponents', () => {
  it('allocates all budget to time at velocity 0', () => {
    const { timeYears, spaceKm } = speedBudgetComponents(0);
    expect(timeYears).toBe(1);
    expect(spaceKm).toBe(0);
  });

  it('allocates all budget to space at velocity 1', () => {
    const { timeYears, spaceKm } = speedBudgetComponents(1);
    expect(timeYears).toBeCloseTo(0, 15);
    expect(spaceKm).toBe(LIGHT_YEAR_KM);
  });

  it('splits evenly at velocity 0.5 (45° on the arc)', () => {
    const { timeYears, spaceKm } = speedBudgetComponents(0.5);
    expect(timeYears).toBe(Math.cos(Math.PI / 4));
    expect(spaceKm).toBe(Math.sin(Math.PI / 4) * LIGHT_YEAR_KM);
  });

  it('allocates one light-hour at velocity 1 on hour scale', () => {
    const { timeYears, spaceKm } = speedBudgetComponents(1, ONE_HOUR_YEARS);
    expect(timeYears).toBeCloseTo(0, 15);
    expect(spaceKm).toBe(LIGHT_HOUR_KM);
  });

  it('does not round component values', () => {
    const { timeYears, spaceKm } = speedBudgetComponents(0.37);
    expect(timeYears).toBe(Math.cos(0.37 * (Math.PI / 2)));
    expect(spaceKm).toBe(Math.sin(0.37 * (Math.PI / 2)) * LIGHT_YEAR_KM);
  });
});

describe('arcSpatialSpeedKms', () => {
  it('returns full-precision speed from arc position', () => {
    expect(arcSpatialSpeedKms(1)).toBe(SPEED_OF_LIGHT_KMS);
    expect(arcSpatialSpeedKms(0.5)).toBe(
      Math.sin(Math.PI / 4) * SPEED_OF_LIGHT_KMS,
    );
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
    expect(label.spaceLine).toMatch(/×10¹¹ km traveled \(23,5\d\d km\/s\)/);
  });

  it('includes relatable speed at mid arc from computed values', () => {
    const label = speedBudgetTipLabel(0.5);
    const expectedSpeed = Math.round(
      arcSpatialSpeedKms(0.5),
    ).toLocaleString('en-US');
    expect(label.spaceLine).toContain(`${expectedSpeed} km/s`);
  });
});
