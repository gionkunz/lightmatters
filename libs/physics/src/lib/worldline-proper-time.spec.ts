import { properTimeAlongWorldline } from './worldline-proper-time';

describe('properTimeAlongWorldline', () => {
  it('returns the full coordinate time for an at-rest worldline', () => {
    expect(properTimeAlongWorldline([{ dt: 10, vOverC: 0 }])).toBe(10);
  });

  it('returns T·0.8 for a 0.6c out-and-back journey', () => {
    const T = 10;
    const traveller = properTimeAlongWorldline([
      { dt: T / 2, vOverC: 0.6 },
      { dt: T / 2, vOverC: 0.6 },
    ]);
    expect(traveller).toBeCloseTo(T * 0.8, 10);
  });

  it('makes the traveller strictly younger than the stay-at-home', () => {
    const T = 10;
    const stayHome = properTimeAlongWorldline([{ dt: T, vOverC: 0 }]);
    const traveller = properTimeAlongWorldline([
      { dt: T / 2, vOverC: 0.6 },
      { dt: T / 2, vOverC: 0.6 },
    ]);
    expect(traveller).toBeLessThan(stayHome);
  });

  it('sums proper time across legs with different speeds', () => {
    const total = properTimeAlongWorldline([
      { dt: 4, vOverC: 0 },
      { dt: 6, vOverC: 0.8 },
    ]);
    expect(total).toBeCloseTo(4 + 6 * 0.6, 10);
  });

  it('ignores negative durations', () => {
    expect(properTimeAlongWorldline([{ dt: -5, vOverC: 0 }])).toBe(0);
  });
});
