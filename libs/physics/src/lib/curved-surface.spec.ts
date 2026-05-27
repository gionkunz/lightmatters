import {
  appleFallPoint,
  buildAppleTreeScene,
  coneFromUnrolledPoint,
  coneSurfacePoint,
  cylinderSurfacePoint,
  DEFAULT_CURVED_SURFACE_PARAMS,
  morphSurfacePoint,
  unrolledSurfacePoint,
  worldlineTrailSamples,
  APPLE_TREE_THETA,
  APPLE_RELEASE_SPACE_T,
} from './curved-surface';
import { APPLE_TREE_STROKES } from './apple-tree-glyph';

describe('curved-surface physics', () => {
  it('places a point on the cylinder at θ = 0 on the +y rim', () => {
    const p = cylinderSurfacePoint(0, 0, 1);
    expect(p.x).toBe(0);
    expect(p.y).toBeCloseTo(1);
    expect(p.z).toBeCloseTo(0);
  });

  it('returns to the same point after a full revolution', () => {
    const a = cylinderSurfacePoint(0, 0.2, 1.2);
    const b = cylinderSurfacePoint(2 * Math.PI, 0.2, 1.2);
    expect(a.x).toBeCloseTo(b.x);
    expect(a.y).toBeCloseTo(b.y);
    expect(a.z).toBeCloseTo(b.z);
  });

  it('uses the top radius at t = 0 on the cone', () => {
    const p = coneSurfacePoint(0, 0, 280, 90, 400);
    expect(Math.hypot(p.y, p.z)).toBeCloseTo(280);
  });

  it('uses the bottom radius at t = 1 on the cone', () => {
    const p = coneSurfacePoint(0, 1, 280, 90, 400);
    expect(Math.hypot(p.y, p.z)).toBeCloseTo(90);
  });

  it('is a vertical flat line at fold = 0', () => {
    const low = morphSurfacePoint(0, 0, 0, DEFAULT_CURVED_SURFACE_PARAMS);
    const high = morphSurfacePoint(0, 0, 1, DEFAULT_CURVED_SURFACE_PARAMS);
    expect(low.x).toBeCloseTo(high.x);
    expect(low.z).toBeCloseTo(0);
    expect(high.y).toBeGreaterThan(low.y);
  });

  it('completes one loop around the cylinder at fold = 1', () => {
    const start = morphSurfacePoint(1, 0, 0, DEFAULT_CURVED_SURFACE_PARAMS);
    const end = morphSurfacePoint(1, 0, 1, DEFAULT_CURVED_SURFACE_PARAMS);
    expect(start.x).toBeCloseTo(end.x, 1);
    expect(start.y).toBeCloseTo(end.y, 1);
    expect(start.z).toBeCloseTo(end.z, 1);
  });

  it('moves along the bottom time edge when time-only and fully unrolled', () => {
    const start = morphSurfacePoint(
      1,
      0,
      0,
      DEFAULT_CURVED_SURFACE_PARAMS,
      'time-only',
      1,
    );
    const end = morphSurfacePoint(
      1,
      0,
      0.85,
      DEFAULT_CURVED_SURFACE_PARAMS,
      'time-only',
      1,
    );
    expect(start.z).toBeCloseTo(0, 5);
    expect(end.z).toBeCloseTo(0, 5);
    expect(Math.abs(end.y - start.y)).toBeLessThan(0.08);
    expect(Math.hypot(end.x - start.x, end.y - start.y)).toBeGreaterThan(0.15);
  });

  it('returns the requested number of trail samples with increasing age', () => {
    const samples = worldlineTrailSamples(1, 0, 0.5, 32);
    expect(samples).toHaveLength(32);
    expect(samples[0].age).toBeLessThan(samples[samples.length - 1].age);
  });

  it('round-trips cone surface points through the unrolled net', () => {
    const theta = Math.PI * 0.55;
    const spaceT = 0.12;
    const { top, bottom } = { top: 1, bottom: 0.52 };
    const p = coneSurfacePoint(theta, spaceT, top, bottom, 1.4);
    const u = unrolledSurfacePoint(theta, spaceT, 0.4, DEFAULT_CURVED_SURFACE_PARAMS);
    const back = coneFromUnrolledPoint(u, 0.4, DEFAULT_CURVED_SURFACE_PARAMS);
    expect(back.x).toBeCloseTo(p.x, 1);
    expect(back.y).toBeCloseTo(p.y, 1);
    expect(back.z).toBeCloseTo(p.z, 1);
  });

  it('builds an apple geodesic from the stem apple to the same tree projected in proper time', () => {
    const scene = buildAppleTreeScene(0.4, DEFAULT_CURVED_SURFACE_PARAMS);
    expect(scene.nearTreeStrips.length).toBe(APPLE_TREE_STROKES.length);
    expect(scene.projectedTreeStrips.length).toBe(APPLE_TREE_STROKES.length);
    expect(scene.treeStrips.length).toBe(
      scene.nearTreeStrips.length + scene.projectedTreeStrips.length,
    );
    expect(scene.appleGeodesic.length).toBeGreaterThan(10);
    const start = appleFallPoint(0.4, 0, DEFAULT_CURVED_SURFACE_PARAMS);
    const end = appleFallPoint(0.4, 1, DEFAULT_CURVED_SURFACE_PARAMS);
    expect(start.x).not.toBeCloseTo(end.x, 1);
    expect(Math.hypot(end.y - start.y, end.z - start.z)).toBeGreaterThan(0.05);

    const { top, bottom } = { top: 1, bottom: 1 + (0.32 - 1) * 0.4 };
    const eps = 1e-4;
    const p0 = coneSurfacePoint(
      APPLE_TREE_THETA,
      APPLE_RELEASE_SPACE_T,
      top,
      bottom,
      DEFAULT_CURVED_SURFACE_PARAMS.height,
    );
    const pMer = coneSurfacePoint(
      APPLE_TREE_THETA,
      APPLE_RELEASE_SPACE_T + eps,
      top,
      bottom,
      DEFAULT_CURVED_SURFACE_PARAMS.height,
    );
    const mer = {
      x: (pMer.x - p0.x) / eps,
      y: (pMer.y - p0.y) / eps,
      z: (pMer.z - p0.z) / eps,
    };
    const tan = {
      x: scene.appleGeodesic[1].x - scene.appleGeodesic[0].x,
      y: scene.appleGeodesic[1].y - scene.appleGeodesic[0].y,
      z: scene.appleGeodesic[1].z - scene.appleGeodesic[0].z,
    };
    const merLen = Math.hypot(mer.x, mer.y, mer.z);
    const tanLen = Math.hypot(tan.x, tan.y, tan.z);
    const dotMer =
      (tan.x * mer.x + tan.y * mer.y + tan.z * mer.z) / (tanLen * merLen);
    expect(Math.abs(dotMer)).toBeLessThan(0.05);
  });
});
