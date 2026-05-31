import { properTimeAlongWorldline } from './worldline-proper-time';
import { twinProperTimes } from './twin-proper-times';

describe('twinProperTimes', () => {
  it('matches the chapter worked example at v = 0.6', () => {
    const { stayHomeYears, travellerYears } = twinProperTimes(10, 0.6);
    expect(stayHomeYears).toBeCloseTo(10, 5);
    expect(travellerYears).toBeCloseTo(8, 0);
  });

  it('traveller ages less as speed increases', () => {
    const slow = twinProperTimes(10, 0.3);
    const fast = twinProperTimes(10, 0.8);
    expect(fast.travellerYears).toBeLessThan(slow.travellerYears);
    expect(slow.stayHomeYears).toBe(10);
    expect(fast.stayHomeYears).toBe(10);
  });
});

describe('properTimeAlongWorldline', () => {
  it('re-exports stay-home and traveller totals used by twinReadout', () => {
    const { stayHomeYears, travellerYears } = twinProperTimes(10, 0.6);
    expect(properTimeAlongWorldline([{ dt: 10, vOverC: 0 }])).toBe(
      stayHomeYears,
    );
    expect(
      properTimeAlongWorldline([
        { dt: 5, vOverC: 0.6 },
        { dt: 5, vOverC: 0.6 },
      ]),
    ).toBeCloseTo(travellerYears, 5);
  });
});
