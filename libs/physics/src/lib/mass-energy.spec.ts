import {
  SPEED_OF_LIGHT_MS,
  kineticEnergy,
  massEnergyEquivalent,
  photonMomentum,
  relativisticMomentum,
  restEnergy,
  totalEnergy,
} from './mass-energy';

describe('restEnergy', () => {
  it('is m in natural units (c = 1)', () => {
    expect(restEnergy(2)).toBe(2);
  });

  it('scales by c² in SI units', () => {
    expect(restEnergy(1, SPEED_OF_LIGHT_MS)).toBeCloseTo(
      SPEED_OF_LIGHT_MS ** 2,
      0,
    );
  });
});

describe('totalEnergy', () => {
  it('equals rest energy at rest', () => {
    expect(totalEnergy(3, 0)).toBe(restEnergy(3));
  });

  it('is γ·mc² (1.25·rest) at 0.6c', () => {
    expect(totalEnergy(1, 0.6)).toBeCloseTo(restEnergy(1) * 1.25, 10);
  });
});

describe('kineticEnergy', () => {
  it('is 0 at rest', () => {
    expect(kineticEnergy(3, 0)).toBe(0);
  });

  it('is (γ − 1)·mc² = 0.25·rest at 0.6c', () => {
    expect(kineticEnergy(1, 0.6)).toBeCloseTo(restEnergy(1) * 0.25, 10);
  });
});

describe('relativisticMomentum', () => {
  it('vanishes at rest', () => {
    expect(relativisticMomentum(2, 0)).toBe(0);
  });

  it('exceeds the classical m·v once moving', () => {
    const v = 0.6;
    const m = 2;
    expect(relativisticMomentum(m, v)).toBeGreaterThan(m * v);
  });

  it('grows monotonically with speed', () => {
    const a = relativisticMomentum(1, 0.3);
    const b = relativisticMomentum(1, 0.6);
    const cc = relativisticMomentum(1, 0.9);
    expect(b).toBeGreaterThan(a);
    expect(cc).toBeGreaterThan(b);
  });
});

describe('photonMomentum', () => {
  it('returns E/c (E in natural units)', () => {
    expect(photonMomentum(5)).toBe(5);
  });

  it('returns E/c in SI units', () => {
    expect(photonMomentum(SPEED_OF_LIGHT_MS, SPEED_OF_LIGHT_MS)).toBe(1);
  });
});

describe('massEnergyEquivalent', () => {
  it('returns E/c² (E in natural units)', () => {
    expect(massEnergyEquivalent(7)).toBe(7);
  });

  it('returns the mass lost: E/c² in SI units', () => {
    expect(massEnergyEquivalent(SPEED_OF_LIGHT_MS ** 2, SPEED_OF_LIGHT_MS)).toBeCloseTo(
      1,
      6,
    );
  });
});
