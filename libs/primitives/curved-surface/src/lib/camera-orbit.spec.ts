import {
  applyOrbitOffset,
  easeOutCubic,
  MAX_ORBIT_ELEVATION,
} from './camera-orbit';

describe('camera-orbit', () => {
  const target = { x: 0, y: 0, z: 0 };
  const base = { x: 0, y: 0.5, z: 3.2 };

  it('returns base position when orbit deltas are zero', () => {
    expect(applyOrbitOffset(target, base, 0, 0)).toEqual(base);
  });

  it('preserves camera distance from target', () => {
    const baseRadius = Math.hypot(base.x, base.y, base.z);
    const orbited = applyOrbitOffset(target, base, 0.4, 0.2);
    const radius = Math.hypot(orbited.x, orbited.y, orbited.z);
    expect(radius).toBeCloseTo(baseRadius, 5);
  });

  it('clamps elevation beyond the pole limit', () => {
    const orbited = applyOrbitOffset(target, base, 0, Math.PI);
    const elevation = Math.asin(orbited.y / Math.hypot(orbited.x, orbited.y, orbited.z));
    expect(elevation).toBeLessThanOrEqual(MAX_ORBIT_ELEVATION + 1e-6);
    expect(elevation).toBeGreaterThanOrEqual(-MAX_ORBIT_ELEVATION - 1e-6);
  });

  it('easeOutCubic reaches zero at start and one at end', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});
