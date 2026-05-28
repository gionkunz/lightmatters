import {
  DEFAULT_LIGHT_BEND_2D_LAYOUT,
  SINGLE_RAY_LIGHT_BEND_LAYOUT,
  lightBend2DArcLength,
  lightBend2DPoint,
} from './light-bend-2d';
import { DEEP_WELL_PARAMS } from './light-bending';
import { DEFAULT_WELL_PARAMS, wellRadiusAt } from './gravity-well';

describe('light-bend-2d', () => {
  it('outer 2D arc is longer than inner', () => {
    const inner = lightBend2DArcLength('inner', DEFAULT_LIGHT_BEND_2D_LAYOUT);
    const outer = lightBend2DArcLength('outer', DEFAULT_LIGHT_BEND_2D_LAYOUT);
    expect(outer).toBeGreaterThan(inner);
  });

  it('beam stays a rigid band — edges stay 2·halfWidth apart everywhere', () => {
    const layout = DEFAULT_LIGHT_BEND_2D_LAYOUT;
    const expected = 2 * layout.beamHalfWidth;
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const inner = lightBend2DPoint('inner', t, layout);
      const outer = lightBend2DPoint('outer', t, layout);
      const sep = Math.hypot(inner.x - outer.x, inner.y - outer.y);
      expect(sep).toBeCloseTo(expected, 3);
    }
  });

  it('horizontal centerline is straight before, deflected, and continues at new angle', () => {
    const layout = DEFAULT_LIGHT_BEND_2D_LAYOUT;
    const start = lightBend2DPoint('center', 0, layout);
    const nearStart = lightBend2DPoint('center', 0.08, layout);
    const atMass = lightBend2DPoint('center', 0.5, layout);
    const end = lightBend2DPoint('center', 1, layout);
    // Before the mass: still close to original line.
    expect(start.y).toBeCloseTo(nearStart.y, 0);
    // At/after the mass: deflected toward the mass (+y here).
    expect(atMass.y).toBeGreaterThan(start.y + 0.5);
    // End is even further deflected than mid-bend (continues at new angle).
    expect(end.y).toBeGreaterThan(atMass.y + 0.5);
  });

  it('single ray (no width) bends toward the star and continues offset', () => {
    const layout = SINGLE_RAY_LIGHT_BEND_LAYOUT;
    const start = lightBend2DPoint('center', 0, layout);
    const nearStart = lightBend2DPoint('center', 0.1, layout);
    const atMass = lightBend2DPoint('center', 0.5, layout);
    const end = lightBend2DPoint('center', 1, layout);
    // Travel axis matches DEFAULT_LIGHT_BEND_2D_LAYOUT (horizontal).
    expect(start.y).toBeCloseTo(nearStart.y, 0);
    expect(atMass.y).toBeGreaterThan(start.y + 0.5);
    expect(end.y).toBeGreaterThan(atMass.y + 0.5);
  });
});

describe('light-bending well params', () => {
  it('deep well keeps Epstein bulge (center wider than rims)', () => {
    expect(wellRadiusAt(0, 1, DEEP_WELL_PARAMS)).toBeGreaterThan(
      wellRadiusAt(-1, 1, DEEP_WELL_PARAMS),
    );
    expect(wellRadiusAt(0, 1, DEEP_WELL_PARAMS)).toBeGreaterThan(
      DEEP_WELL_PARAMS.spaceRadius,
    );
  });

  it('deep well has steeper rims than earth preset', () => {
    expect(DEEP_WELL_PARAMS.spaceRadius).toBeLessThan(
      DEFAULT_WELL_PARAMS.spaceRadius,
    );
  });
});
