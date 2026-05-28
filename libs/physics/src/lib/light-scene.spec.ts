import {
  buildPeriodicEmissions,
  buildRelativisticPeriodicEmissions,
  classicalDopplerFactor,
  distance,
  emissionPosition,
  lightCircleRadius,
  meanPulseInterval,
  pulseArrivalSceneTimes,
  pulseReachesMoving,
  pulseReachesStationary,
  relativisticDopplerApproachingFactor,
  relativisticDopplerRecedingFactor,
  sourcePositionAt,
  vec2,
} from './light-scene';

describe('light-scene physics', () => {
  describe('distance', () => {
    it('returns Euclidean distance between two points', () => {
      expect(distance(vec2(0, 0), vec2(3, 4))).toBeCloseTo(5);
      expect(distance(vec2(1, 1), vec2(1, 1))).toBe(0);
    });
  });

  describe('sourcePositionAt', () => {
    it('returns start when velocity is zero', () => {
      expect(sourcePositionAt(vec2(1, 2), vec2(0, 0), 5)).toEqual(vec2(1, 2));
    });
    it('advances uniformly', () => {
      expect(sourcePositionAt(vec2(0, 0), vec2(0.5, -0.2), 2)).toEqual(
        vec2(1, -0.4),
      );
    });
  });

  describe('emissionPosition', () => {
    it('matches sourcePositionAt at emit time', () => {
      expect(emissionPosition(vec2(0, 0), { x: 0.3, y: 0 }, 1)).toEqual(
        vec2(0.3, 0),
      );
    });
  });

  describe('pulseReachesStationary', () => {
    it('returns |O − S| / c at c = 1', () => {
      expect(pulseReachesStationary(vec2(0, 0), vec2(0.5, 0))).toBeCloseTo(0.5);
      expect(pulseReachesStationary(vec2(0, 0), vec2(3, 4))).toBeCloseTo(5);
    });

    it('scales with c', () => {
      expect(pulseReachesStationary(vec2(0, 0), vec2(2, 0), 2)).toBeCloseTo(1);
    });
  });

  describe('pulseReachesMoving', () => {
    it('matches stationary case when velocity is zero', () => {
      const t = pulseReachesMoving(vec2(0, 0), vec2(0.5, 0), vec2(0, 0));
      expect(t).toBeCloseTo(0.5);
    });

    it('observer moving toward source receives earlier than stationary', () => {
      const tStill = pulseReachesStationary(vec2(0, 0), vec2(1, 0));
      const tToward = pulseReachesMoving(vec2(0, 0), vec2(1, 0), vec2(-0.4, 0));
      expect(tToward).not.toBeNull();
      expect(tToward as number).toBeLessThan(tStill);
    });

    it('observer moving away from source receives later than stationary', () => {
      const tStill = pulseReachesStationary(vec2(0, 0), vec2(1, 0));
      const tAway = pulseReachesMoving(vec2(0, 0), vec2(1, 0), vec2(0.4, 0));
      expect(tAway).not.toBeNull();
      expect(tAway as number).toBeGreaterThan(tStill);
    });

    it('returns null when |v| >= c', () => {
      expect(pulseReachesMoving(vec2(0, 0), vec2(1, 0), vec2(1, 0))).toBeNull();
      expect(
        pulseReachesMoving(vec2(0, 0), vec2(1, 0), vec2(1.5, 0)),
      ).toBeNull();
    });

    it('returns null when no positive solution exists', () => {
      const t = pulseReachesMoving(vec2(1, 0), vec2(0, 0), vec2(-0.5, 0));
      expect(t).toBeCloseTo(2);
    });
  });

  describe('lightCircleRadius', () => {
    it('is zero before emission', () => {
      expect(lightCircleRadius(0.5, 0.2)).toBe(0);
    });

    it('grows linearly after emission', () => {
      expect(lightCircleRadius(0, 0.3)).toBeCloseTo(0.3);
      expect(lightCircleRadius(0.1, 0.5)).toBeCloseTo(0.4);
    });

    it('respects custom c', () => {
      expect(lightCircleRadius(0, 0.5, 2)).toBeCloseTo(1);
    });
  });

  describe('buildPeriodicEmissions', () => {
    it('creates evenly spaced emissions', () => {
      const e = buildPeriodicEmissions(3, 0.5);
      expect(e).toHaveLength(3);
      expect(e[0].atTime).toBe(0);
      expect(e[1].atTime).toBe(0.5);
      expect(e[2].atTime).toBe(1);
    });
  });

  describe('pulseArrivalSceneTimes', () => {
    it('spaces arrivals evenly for stationary source and observer', () => {
      const emissions = buildPeriodicEmissions(4, 0.4);
      const arrivals = pulseArrivalSceneTimes(
        vec2(0.4, 0),
        undefined,
        emissions,
        vec2(-0.4, 0),
        undefined,
      );
      expect(arrivals.length).toBe(4);
      const mean = meanPulseInterval(arrivals);
      expect(mean).toBeCloseTo(0.4, 1);
    });

    it('widens intervals when source recedes', () => {
      const emissions = buildPeriodicEmissions(4, 0.4);
      const still = pulseArrivalSceneTimes(
        vec2(0.3, 0),
        undefined,
        emissions,
        vec2(-0.5, 0),
        undefined,
      );
      const receding = pulseArrivalSceneTimes(
        vec2(-0.2, 0),
        { x: 0.45, y: 0 },
        emissions,
        vec2(-0.5, 0),
        undefined,
      );
      const recedingMean = meanPulseInterval(receding);
      const stillMean = meanPulseInterval(still);
      expect(recedingMean).not.toBeNull();
      expect(stillMean).not.toBeNull();
      expect(recedingMean as number).toBeGreaterThan(stillMean as number);
    });
  });

  describe('buildRelativisticPeriodicEmissions', () => {
    const properInterval = 0.4;
    const observer = vec2(-0.5, 0);
    const beta = 0.5;

    it('mean recession interval matches relativistic Doppler factor', () => {
      const emissions = buildRelativisticPeriodicEmissions(
        6,
        properInterval,
        beta,
      );
      const arrivals = pulseArrivalSceneTimes(
        vec2(-0.2, 0),
        { x: beta, y: 0 },
        emissions,
        observer,
        undefined,
      );
      const mean = meanPulseInterval(arrivals);
      const expected =
        properInterval * relativisticDopplerRecedingFactor(beta);
      expect(mean).not.toBeNull();
      expect(mean as number).toBeCloseTo(expected, 2);
      expect(mean as number).toBeGreaterThan(
        properInterval * classicalDopplerFactor(beta, true),
      );
    });

    it('mean approach interval matches relativistic Doppler factor', () => {
      const emissions = buildRelativisticPeriodicEmissions(
        6,
        properInterval,
        beta,
      );
      const arrivals = pulseArrivalSceneTimes(
        vec2(2, 0),
        { x: -beta, y: 0 },
        emissions,
        observer,
        undefined,
      );
      const mean = meanPulseInterval(arrivals);
      const expected =
        properInterval * relativisticDopplerApproachingFactor(beta);
      expect(mean).not.toBeNull();
      expect(mean as number).toBeCloseTo(expected, 2);
      expect(mean as number).toBeGreaterThan(
        properInterval * classicalDopplerFactor(beta, false),
      );
    });

    it('differs from classical coordinate-time emissions by γ', () => {
      const classical = buildPeriodicEmissions(6, properInterval);
      const relativistic = buildRelativisticPeriodicEmissions(
        6,
        properInterval,
        beta,
      );
      const classicalArrivals = pulseArrivalSceneTimes(
        vec2(-0.2, 0),
        { x: beta, y: 0 },
        classical,
        observer,
        undefined,
      );
      const relativisticArrivals = pulseArrivalSceneTimes(
        vec2(-0.2, 0),
        { x: beta, y: 0 },
        relativistic,
        observer,
        undefined,
      );
      const classicalMean = meanPulseInterval(classicalArrivals);
      const relativisticMean = meanPulseInterval(relativisticArrivals);
      expect(classicalMean).not.toBeNull();
      expect(relativisticMean).not.toBeNull();
      expect((relativisticMean as number) / (classicalMean as number)).toBeCloseTo(
        relativisticDopplerRecedingFactor(beta) /
          classicalDopplerFactor(beta, true),
        1,
      );
    });
  });
});
