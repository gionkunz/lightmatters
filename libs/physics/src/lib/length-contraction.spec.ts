import { lengthContraction } from './length-contraction';

describe('lengthContraction', () => {
  const L0 = 10;

  it('returns proper length at rest', () => {
    expect(lengthContraction(L0, 0)).toBe(L0);
  });

  it('contracts by properTimeFraction at 0.6c', () => {
    expect(lengthContraction(L0, 0.6)).toBeCloseTo(L0 * 0.8, 10);
  });

  it('shrinks strictly for any v/c > 0', () => {
    expect(lengthContraction(L0, 0.3)).toBeLessThan(L0);
  });

  it('approaches 0 as v/c → 1', () => {
    expect(lengthContraction(L0, 0.999999)).toBeCloseTo(0, 1);
  });

  it('increases monotonically with decreasing speed', () => {
    const at06 = lengthContraction(L0, 0.6);
    const at03 = lengthContraction(L0, 0.3);
    expect(at03).toBeGreaterThan(at06);
  });
});
