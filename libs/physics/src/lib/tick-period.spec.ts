import { tickPeriod } from './tick-period';

describe('tickPeriod', () => {
  const T0 = 1;

  it('returns rest period at v/c = 0', () => {
    expect(tickPeriod(T0, 0)).toBe(T0);
  });

  it('dilates by γ at 0.6c (γ = 1.25)', () => {
    expect(tickPeriod(T0, 0.6)).toBeCloseTo(T0 / 0.8, 10);
  });

  it('increases monotonically with v/c', () => {
    const at03 = tickPeriod(T0, 0.3);
    const at06 = tickPeriod(T0, 0.6);
    const at09 = tickPeriod(T0, 0.9);
    expect(at06).toBeGreaterThan(at03);
    expect(at09).toBeGreaterThan(at06);
  });

  it('grows without bound as v/c → 1', () => {
    expect(tickPeriod(T0, 0.999)).toBeGreaterThan(10 * T0);
  });
});
