import {
  lightGeodesicPoint,
  lightGeodesicSamples,
  lightGeodesicClosestApproachX,
  DEFAULT_BEAM_HALF_WIDTH,
  DEEP_WELL_PARAMS,
} from './light-bending';
import { DEFAULT_WELL_PARAMS, wellRadiusAt } from './gravity-well';
import { lightBend2DArcLength } from './light-bend-2d';

describe('light-bending 3D helpers', () => {
  const miss = 0.25;

  it('single ray travels from left to right on bulge well', () => {
    const start = lightGeodesicPoint(miss, 'center', 0, 1, DEEP_WELL_PARAMS);
    const end = lightGeodesicPoint(miss, 'center', 1, 1, DEEP_WELL_PARAMS);
    expect(start.x).toBeLessThan(0);
    expect(end.x).toBeGreaterThan(0);
  });

  it('inner edge passes closer to mass than outer', () => {
    const innerX = lightGeodesicClosestApproachX(miss, 'inner');
    const outerX = lightGeodesicClosestApproachX(miss, 'outer');
    expect(Math.abs(innerX)).toBeLessThan(Math.abs(outerX));
  });

  it('samples form a polyline of requested length', () => {
    const samples = lightGeodesicSamples(miss, 'center', 32, 1, DEEP_WELL_PARAMS);
    expect(samples).toHaveLength(32);
  });

  it('deep well keeps Epstein bulge shape', () => {
    expect(wellRadiusAt(0, 1, DEEP_WELL_PARAMS)).toBeGreaterThan(
      wellRadiusAt(-1, 1, DEEP_WELL_PARAMS),
    );
    expect(DEEP_WELL_PARAMS.spaceRadius).toBeLessThan(
      DEFAULT_WELL_PARAMS.spaceRadius,
    );
  });

  it('inner and outer edge points differ at mid-beam', () => {
    const inner = lightGeodesicPoint(
      miss,
      'inner',
      0.5,
      1,
      DEEP_WELL_PARAMS,
      DEFAULT_BEAM_HALF_WIDTH,
    );
    const outer = lightGeodesicPoint(
      miss,
      'outer',
      0.5,
      1,
      DEEP_WELL_PARAMS,
      DEFAULT_BEAM_HALF_WIDTH,
    );
    expect(inner.x).not.toBeCloseTo(outer.x, 1);
  });
});

describe('2D diagram arc ordering', () => {
  it('outer 2D arc exceeds inner (used in Step 4 readout)', () => {
    expect(lightBend2DArcLength('outer')).toBeGreaterThan(
      lightBend2DArcLength('inner'),
    );
  });
});
