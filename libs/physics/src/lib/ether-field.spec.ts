import {
  circularOrbitPosition,
  circularOrbitVelocity,
  etherDraggedPulseCenter,
  etherDraggedPulseRadii,
  etherDraggedPulseRadius,
  etherWindVector,
} from './ether-field';
import { vec2 } from './light-scene';

describe('ether-field physics', () => {
  describe('etherWindVector', () => {
    it('negates frame velocity', () => {
      const w1 = etherWindVector(vec2(0.4, 0));
      expect(w1.x).toBeCloseTo(-0.4);
      expect(w1.y).toBeCloseTo(0);
      const w2 = etherWindVector(vec2(0, -0.2));
      expect(w2.x).toBeCloseTo(0);
      expect(w2.y).toBeCloseTo(0.2);
    });
  });

  describe('circularOrbitVelocity', () => {
    it('is tangent to the orbit at angle 0 (moving up in SVG coords)', () => {
      const v = circularOrbitVelocity(0, 1, 1);
      expect(v.x).toBeCloseTo(0);
      expect(v.y).toBeCloseTo(-1);
    });

    it('yields ether wind opposing motion at the top of the circle', () => {
      const angle = Math.PI / 2;
      const v = circularOrbitVelocity(angle, 1, 1);
      const wind = etherWindVector(v);
      expect(v.x).toBeLessThan(0);
      expect(wind.x).toBeGreaterThan(0);
    });
  });

  describe('circularOrbitPosition', () => {
    it('places the dot on the circle', () => {
      expect(circularOrbitPosition(0, 2, vec2(10, 20))).toEqual(vec2(12, 20));
    });
  });

  describe('etherDraggedPulseCenter', () => {
    it('drifts with source velocity', () => {
      expect(
        etherDraggedPulseCenter(vec2(0, 0), vec2(0.4, 0), 2),
      ).toEqual(vec2(0.8, 0));
    });
  });

  describe('etherDraggedPulseRadius', () => {
    it('grows linearly with elapsed time', () => {
      expect(etherDraggedPulseRadius(0.5)).toBeCloseTo(0.5);
      expect(etherDraggedPulseRadius(-1)).toBe(0);
    });
  });

  describe('etherDraggedPulseRadii', () => {
    it('stretches forward along motion', () => {
      const { rx, ry } = etherDraggedPulseRadii(0.5, 90, 40);
      expect(rx).toBeGreaterThan(ry);
    });
  });
});
