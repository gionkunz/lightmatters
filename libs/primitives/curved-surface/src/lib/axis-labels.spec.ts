import {
  buildAxisStrips,
  buildWellAxisStrips,
  computeAxisLabelAnchors,
} from './axis-labels';
import * as THREE from 'three';

describe('buildAxisStrips', () => {
  it('returns horizontal space and vertical time on the flat strip', () => {
    const { space, time } = buildAxisStrips(0, 0, 0);
    expect(space).toHaveLength(2);
    expect(time).toHaveLength(2);
    expect(space[0].y).toBeCloseTo(space[1].y);
    expect(time[0].x).toBeCloseTo(time[1].x);
  });

  it('returns meridian and bottom rim on a folded cylinder', () => {
    const { space, time } = buildAxisStrips(1, 0, 0);
    expect(space.length).toBeGreaterThan(2);
    expect(time.length).toBeGreaterThan(2);
  });

  it('returns sector edges when unfolded', () => {
    const { space, time } = buildAxisStrips(1, 0.4, 1);
    expect(space.length).toBeGreaterThan(2);
    expect(time.length).toBeGreaterThan(2);
    for (const p of [...space, ...time]) {
      expect(p.z).toBeCloseTo(0, 5);
    }
  });
});

describe('buildWellAxisStrips', () => {
  it('runs space along the tunnel axis and time around the near end', () => {
    const { space, time } = buildWellAxisStrips(1, 1);
    expect(space.length).toBeGreaterThan(2);
    expect(time.length).toBeGreaterThan(2);
    expect(space[0].y).toBeCloseTo(0);
    expect(space[0].z).toBeCloseTo(0);
    expect(space[space.length - 1].x).toBeGreaterThan(space[0].x);
    for (const p of time) {
      expect(p.x).toBeCloseTo(-1.7, 1);
    }
  });

  it('grows the space axis as the bulge is revealed', () => {
    const partial = buildWellAxisStrips(0.4, 0);
    const full = buildWellAxisStrips(1, 0);
    expect(partial.space[partial.space.length - 1].x).toBeLessThan(
      full.space[full.space.length - 1].x,
    );
  });
});

describe('computeAxisLabelAnchors', () => {
  it('projects axis tips into canvas coordinates', () => {
    const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 50);
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();

    const strips = buildAxisStrips(1, 0, 1);
    const anchors = computeAxisLabelAnchors(strips, camera, 400, 300);
    expect(anchors.length).toBe(2);
    for (const a of anchors) {
      expect(Number.isFinite(a.x)).toBe(true);
      expect(Number.isFinite(a.y)).toBe(true);
      expect(Number.isFinite(a.tipX)).toBe(true);
      expect(Number.isFinite(a.tipY)).toBe(true);
    }
  });
});
