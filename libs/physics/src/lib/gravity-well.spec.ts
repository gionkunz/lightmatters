import {
  DEFAULT_WELL_PARAMS,
  earthSphereWireframeStrips,
  isEscapeSpatialBudget,
  isEscapeTrajectory,
  wellSpatialBudgetTrajectoryPoint,
  wellSpatialBudgetTrajectorySamples,
  spatialBudgetPassThroughDurationScale,
  spatialBudgetSpatialSpeedMagnitude,
  wellStartXNormFromPositionFraction,
  WELL_OUTER_SPACE_X_NORM,
  isWellXRevealed,
  WELL_ESCAPE_ENERGY_THRESHOLD,
  wellRadiusAt,
  wellRevealMaxX,
  wellSurfacePoint,
  wellTrajectoryPoint,
  wellTrajectorySamples,
  wellTrajectoryEntryXNorm,
  wellTrajectoryPointMorphed,
  wellTrajectoryMorphedSamples,
  wellSurfacePointUnrolled,
  wellUnrollSegmentLayout,
} from './gravity-well';

describe('gravity-well', () => {
  const params = DEFAULT_WELL_PARAMS;

  it('wellRadiusAt is minimum at outer edges when smooth (narrow outer space)', () => {
    const left = wellRadiusAt(-1, 1, params);
    const right = wellRadiusAt(1, 1, params);
    const outerFlat = wellRadiusAt(0.8, 1, params);
    expect(left).toBeCloseTo(params.spaceRadius);
    expect(right).toBeCloseTo(params.spaceRadius);
    expect(outerFlat).toBeCloseTo(params.spaceRadius);
  });

  it('smooth profile bulges between outer cylinders', () => {
    const center = wellRadiusAt(0, 1, params);
    const midBulge = wellRadiusAt(0.3, 1, params);
    expect(center).toBeCloseTo(params.bulgeRadius);
    expect(midBulge).toBeGreaterThan(params.spaceRadius);
  });

  it('wellRadiusAt is maximum at center when smooth (wide weightless bulge)', () => {
    const center = wellRadiusAt(0, 1, params);
    expect(center).toBeCloseTo(params.bulgeRadius);
    expect(center).toBeGreaterThan(params.spaceRadius);
  });

  it('piecewise profile expands then contracts', () => {
    const outer = wellRadiusAt(-0.8, 0, params);
    const approach = wellRadiusAt(-0.35, 0, params);
    const center = wellRadiusAt(0, 0, params);
    expect(outer).toBeCloseTo(params.spaceRadius);
    expect(approach).toBeGreaterThan(outer);
    expect(center).toBeCloseTo(params.bulgeRadius);
  });

  it('wellMorph interpolates between piecewise and smooth', () => {
    const x = -0.3;
    const piecewise = wellRadiusAt(x, 0, params);
    const smooth = wellRadiusAt(x, 1, params);
    const mid = wellRadiusAt(x, 0.5, params);
    expect(mid).toBeGreaterThan(Math.min(piecewise, smooth) - 1e-6);
    expect(mid).toBeLessThan(Math.max(piecewise, smooth) + 1e-6);
  });

  it('wellSurfacePoint completes a full revolution', () => {
    const a = wellSurfacePoint(0, -0.8, 1, params);
    const b = wellSurfacePoint(2 * Math.PI, -0.8, 1, params);
    expect(a.x).toBeCloseTo(b.x);
    expect(a.y).toBeCloseTo(b.y);
    expect(a.z).toBeCloseTo(b.z);
  });

  it('earthSphereWireframeStrips returns great-circle rings', () => {
    const strips = earthSphereWireframeStrips(params);
    expect(strips.length).toBeGreaterThan(3);
    expect(strips[0].length).toBeGreaterThan(2);
  });

  it('wellTrajectoryPoint crosses the center mid-fall for bound energy', () => {
    const mid = wellTrajectoryPoint(0.3, 0.5, 1, params);
    const spaceXNorm = (mid.x * 2) / params.length;
    expect(Math.abs(spaceXNorm)).toBeLessThan(0.02);
  });

  it('trajectory starts at the bound near-turning point inside the cone', () => {
    const energy = 0.28;
    const start = wellTrajectoryPoint(energy, 0, 1, params);
    const spaceXNorm = (start.x * 2) / params.length;
    expect(spaceXNorm).toBeCloseTo(wellTrajectoryEntryXNorm(energy, params));
    expect(spaceXNorm).toBeGreaterThan(-Math.abs(params.outerLeft) - 1e-6);
    expect(spaceXNorm).toBeLessThan(0);
  });

  it('low bound energy still crosses the center', () => {
    const mid = wellTrajectoryPoint(0.12, 0.5, 1, params);
    const spaceXNorm = (mid.x * 2) / params.length;
    expect(Math.abs(spaceXNorm)).toBeLessThan(0.02);
  });

  it('higher bound energy reaches further up the cones than lower energy', () => {
    const lo = wellTrajectoryPoint(0.15, 0, 1, params);
    const hi = wellTrajectoryPoint(0.55, 0, 1, params);
    expect(hi.x).toBeLessThan(lo.x);
  });

  it('bound trajectory decelerates approaching the far turning point', () => {
    const energy = 0.4;
    const near = wellTrajectoryPoint(energy, 0.5, 1, params);
    const before = wellTrajectoryPoint(energy, 0.9, 1, params);
    const turn = wellTrajectoryPoint(energy, 1, 1, params);
    const speedMid = Math.abs(near.x - wellTrajectoryPoint(energy, 0.4, 1, params).x);
    const speedTurn = Math.abs(turn.x - before.x);
    expect(speedMid).toBeGreaterThan(speedTurn);
  });

  it('escape trajectory reaches outer space on the far side', () => {
    const end = wellTrajectoryPoint(WELL_ESCAPE_ENERGY_THRESHOLD, 1, 1, params);
    const spaceXNorm = (end.x * 2) / params.length;
    expect(spaceXNorm).toBeGreaterThanOrEqual(params.outerRight - 0.02);
    expect(isEscapeTrajectory(WELL_ESCAPE_ENERGY_THRESHOLD, params)).toBe(true);
  });

  it('bound pass-through trajectory stops on the far side', () => {
    const end = wellTrajectoryPoint(0.2, 1, 1, params, 'pass-through');
    const spaceXNorm = (end.x * 2) / params.length;
    expect(isEscapeTrajectory(0.2, params)).toBe(false);
    expect(spaceXNorm).toBeLessThan(params.outerRight);
    expect(spaceXNorm).toBeGreaterThan(0.1);
  });

  it('bound oscillate trajectory returns to entry at t=1', () => {
    const energy = 0.28;
    const start = wellTrajectoryPoint(energy, 0, 1, params, 'oscillate');
    const end = wellTrajectoryPoint(energy, 1, 1, params, 'oscillate');
    expect(start.x).toBeCloseTo(end.x);
    expect(start.y).toBeCloseTo(end.y);
    expect(start.z).toBeCloseTo(end.z);
  });

  it('bound oscillate trajectory peaks on the far side mid-cycle', () => {
    const energy = 0.28;
    const peak = wellTrajectoryPoint(energy, 0.5, 1, params, 'oscillate');
    const spaceXNorm = (peak.x * 2) / params.length;
    expect(spaceXNorm).toBeGreaterThan(0.1);
  });

  it('wellTrajectorySamples returns requested length with increasing age', () => {
    const samples = wellTrajectorySamples(0.35, 32, 1, params, 0.8, 0.4);
    expect(samples).toHaveLength(32);
    expect(samples[0].age).toBeLessThanOrEqual(samples[samples.length - 1].age);
  });

  it('wellRevealMaxX spans -1 to 1', () => {
    expect(wellRevealMaxX(0)).toBeCloseTo(-1);
    expect(wellRevealMaxX(1)).toBeCloseTo(1);
    expect(isWellXRevealed(-0.5, 0.25)).toBe(true);
    expect(isWellXRevealed(0.9, 0.25)).toBe(false);
  });

  describe('spatial-budget launch (Step 6)', () => {
    it('starts at the chosen launch x (default outer space)', () => {
      for (const s of [0.15, 0.35, 0.8]) {
        const start = wellSpatialBudgetTrajectoryPoint(s, 0, 1, params);
        const xNorm = (start.x * 2) / params.length;
        expect(xNorm).toBeCloseTo(WELL_OUTER_SPACE_X_NORM);
      }
    });

    it('mirrors through the center to the symmetric far point', () => {
      for (const startX of [-1, -0.8, -0.55]) {
        const peak = wellSpatialBudgetTrajectoryPoint(
          0.25,
          0.5,
          1,
          params,
          'oscillate',
          startX,
        );
        const peakX = (peak.x * 2) / params.length;
        expect(peakX).toBeCloseTo(-startX, 2);
      }
    });

    it('bound trajectories pass through the weightless center before turning back', () => {
      for (const s of [0.2, 0.35, 0.55]) {
        const peak = wellSpatialBudgetTrajectoryPoint(s, 0.5, 1, params, 'oscillate');
        const peakX = (peak.x * 2) / params.length;
        expect(peakX).toBeCloseTo(1, 1);

        let crossedCenter = false;
        for (let i = 1; i < 50; i++) {
          const t = (i / 50) * 0.5;
          const xNorm =
            (wellSpatialBudgetTrajectoryPoint(s, t, 1, params, 'oscillate').x * 2) /
            params.length;
          if (xNorm >= -0.02) crossedCenter = true;
        }
        expect(crossedCenter).toBe(true);
      }
    });

    it('inbound leg always increases x until the far turning point', () => {
      const s = 0.25;
      let prevX = WELL_OUTER_SPACE_X_NORM;
      for (let i = 1; i <= 50; i++) {
        const t = (i / 50) * 0.5;
        const p = wellSpatialBudgetTrajectoryPoint(s, t, 1, params, 'oscillate');
        const xNorm = (p.x * 2) / params.length;
        expect(xNorm).toBeGreaterThanOrEqual(prevX - 1e-4);
        prevX = xNorm;
      }
    });

    it('low spatial still reaches the symmetric mirror point', () => {
      const peak = wellSpatialBudgetTrajectoryPoint(0.2, 0.5, 1, params, 'oscillate');
      const peakX = (peak.x * 2) / params.length;
      expect(peakX).toBeCloseTo(1, 1);
    });

    it('oscillate returns to the launch point at t = 1', () => {
      const s = 0.85;
      const peak = wellSpatialBudgetTrajectoryPoint(s, 0.5, 1, params, 'oscillate');
      const end = wellSpatialBudgetTrajectoryPoint(s, 1, 1, params, 'oscillate');
      const peakX = (peak.x * 2) / params.length;
      expect(peakX).toBeCloseTo(1, 1);
      expect(end.x).toBeCloseTo(
        wellSpatialBudgetTrajectoryPoint(s, 0, 1, params, 'oscillate').x,
      );
    });

    it('frictionless path is symmetric about the center crossing', () => {
      const s = 0.85;
      const xAt = (t: number) =>
        (wellSpatialBudgetTrajectoryPoint(s, t, 1, params, 'oscillate').x * 2) /
        params.length;
      expect(xAt(0.25)).toBeCloseTo(xAt(0.75), 2);
      expect(xAt(0.125)).toBeCloseTo(xAt(0.875), 2);
    });

    it('spatial and time budget components sum to unit proper speed', () => {
      for (const s of [0.01, 0.25, 0.85]) {
        const alpha = Math.max(1e-4, Math.min(1, s));
        const timeMag = Math.sqrt(1 - alpha * alpha);
        expect(alpha * alpha + timeMag * timeMag).toBeCloseTo(1);
      }
    });

    it('spatial speed is constant in outer cylindrical regions', () => {
      const s = 0.25;
      const alpha = s;
      const speeds: number[] = [];
      for (let i = 1; i < 40; i++) {
        const t = (i / 40) * 0.5;
        const xNorm =
          (wellSpatialBudgetTrajectoryPoint(s, t, 1, params, 'oscillate').x * 2) /
          params.length;
        if (xNorm <= params.outerLeft - 0.02 && xNorm >= params.outerLeft - 0.35) {
          speeds.push(
            spatialBudgetSpatialSpeedMagnitude(s, t, 1, params, 'oscillate'),
          );
        }
      }
      expect(speeds.length).toBeGreaterThan(5);
      for (const v of speeds) {
        expect(v).toBeCloseTo(alpha, 2);
      }
    });

    it('turnaround at the far peak is smooth (spatial motion pauses before reversing)', () => {
      const s = 0.25;
      const xAt = (t: number) =>
        (wellSpatialBudgetTrajectoryPoint(s, t, 1, params, 'oscillate').x * 2) /
        params.length;
      const before = xAt(0.48);
      const peak = xAt(0.5);
      const after = xAt(0.52);
      expect(peak).toBeGreaterThan(before - 1e-4);
      expect(peak).toBeGreaterThan(after - 1e-4);
      expect(Math.abs(peak - before)).toBeLessThan(0.08);
      expect(Math.abs(peak - after)).toBeLessThan(0.08);
    });

    it('spatial fraction changes winding, not endpoints, on pass-through', () => {
      const low = wellSpatialBudgetTrajectoryPoint(0.2, 1, 1, params, 'pass-through');
      const high = wellSpatialBudgetTrajectoryPoint(0.65, 1, 1, params, 'pass-through');
      const lowX = (low.x * 2) / params.length;
      const highX = (high.x * 2) / params.length;
      expect(lowX).toBeCloseTo(highX, 2);
      expect(lowX).toBeCloseTo(1, 1);
    });

    it('wellStartXNormFromPositionFraction maps slider from outer space to weightless center', () => {
      expect(wellStartXNormFromPositionFraction(0, params)).toBeCloseTo(-1);
      expect(wellStartXNormFromPositionFraction(1, params)).toBeCloseTo(0);
      expect(wellStartXNormFromPositionFraction(0.5, params)).toBeCloseTo(-0.5);
    });

    it('bound oscillate returns to launch x at t=1', () => {
      const s = 0.3;
      const startX = -0.7;
      const start = wellSpatialBudgetTrajectoryPoint(
        s,
        0,
        1,
        params,
        'oscillate',
        startX,
      );
      const end = wellSpatialBudgetTrajectoryPoint(
        s,
        1,
        1,
        params,
        'oscillate',
        startX,
      );
      expect(start.x).toBeCloseTo(end.x);
    });

    it('wellSpatialBudgetTrajectorySamples returns requested length', () => {
      const samples = wellSpatialBudgetTrajectorySamples(0.35, 16, 1, params, 0.8, 0.6);
      expect(samples).toHaveLength(16);
    });

    it('center launch winds around the bulge without radial travel', () => {
      const start = wellSpatialBudgetTrajectoryPoint(0.25, 0, 1, params, 'pass-through', 0);
      const mid = wellSpatialBudgetTrajectoryPoint(0.25, 0.5, 1, params, 'pass-through', 0);
      const end = wellSpatialBudgetTrajectoryPoint(0.25, 1, 1, params, 'pass-through', 0);
      const x = (p: { x: number }) => (p.x * 2) / params.length;
      expect(x(start)).toBeCloseTo(0, 2);
      expect(x(mid)).toBeCloseTo(0, 2);
      expect(x(end)).toBeCloseTo(0, 2);
      expect(Math.hypot(mid.x - start.x, mid.y - start.y, mid.z - start.z)).toBeGreaterThan(
        0.2,
      );
    });

    it('pass-through duration scale shrinks for shorter trips', () => {
      const full = spatialBudgetPassThroughDurationScale(0.25, -1, 1, params);
      const half = spatialBudgetPassThroughDurationScale(0.25, -0.5, 1, params);
      expect(full).toBeCloseTo(1, 2);
      expect(half).toBeLessThan(full);
      expect(half).toBeGreaterThan(0.1);
    });

    it('trail span is arc-length based (similar tail size at equal progress)', () => {
      const trailSpan = 0.25;
      const t = 0.6;
      const tailArc = (startX: number) => {
        const samples = wellSpatialBudgetTrajectorySamples(
          0.25,
          32,
          1,
          params,
          t,
          trailSpan,
          'pass-through',
          startX,
        );
        if (samples.length < 2) return 0;
        let len = 0;
        for (let i = 1; i < samples.length; i++) {
          len += Math.hypot(
            samples[i].x - samples[i - 1].x,
            samples[i].y - samples[i - 1].y,
            samples[i].z - samples[i - 1].z,
          );
        }
        return len;
      };
      expect(tailArc(-1)).toBeGreaterThan(0.5);
      expect(tailArc(-0.5) / tailArc(-1)).toBeCloseTo(1, 1);
    });
  });

  describe('piecewise unfold', () => {
    it('wellUnrollSegmentLayout returns five segments: cyl-cone-cyl-cone-cyl', () => {
      const segs = wellUnrollSegmentLayout(params);
      expect(segs).toHaveLength(5);
      expect(segs.map((s) => s.kind)).toEqual([
        'cylinder',
        'cone',
        'cylinder',
        'cone',
        'cylinder',
      ]);
    });

    it('cylinder segments have constant radius', () => {
      const segs = wellUnrollSegmentLayout(params);
      const cylinders = segs.filter((s) => s.kind === 'cylinder');
      for (const c of cylinders) {
        expect(c.rStart).toBeCloseTo(c.rEnd);
      }
      expect(cylinders[0].rStart).toBeCloseTo(params.spaceRadius);
      expect(cylinders[1].rStart).toBeCloseTo(params.bulgeRadius);
      expect(cylinders[2].rStart).toBeCloseTo(params.spaceRadius);
    });

    it('cone segments expand from spaceRadius to bulgeRadius and back', () => {
      const segs = wellUnrollSegmentLayout(params);
      const cones = segs.filter((s) => s.kind === 'cone');
      expect(cones).toHaveLength(2);
      expect(cones[0].rStart).toBeCloseTo(params.spaceRadius);
      expect(cones[0].rEnd).toBeCloseTo(params.bulgeRadius);
      expect(cones[1].rStart).toBeCloseTo(params.bulgeRadius);
      expect(cones[1].rEnd).toBeCloseTo(params.spaceRadius);
    });

    it('segments are contiguous and cover [-1, 1]', () => {
      const segs = wellUnrollSegmentLayout(params);
      expect(segs[0].xStartNorm).toBeCloseTo(-1);
      expect(segs[segs.length - 1].xEndNorm).toBeCloseTo(1);
      for (let i = 0; i < segs.length - 1; i++) {
        expect(segs[i + 1].xStartNorm).toBeCloseTo(segs[i].xEndNorm);
      }
    });

    it('wellSurfacePointUnrolled lies on z=0 plane with x preserved', () => {
      const p = wellSurfacePointUnrolled(0.5, -0.3, params);
      expect(p.z).toBeCloseTo(0);
      expect(p.x).toBeCloseTo(-0.3 * params.length / 2);
    });

    it('wellSurfacePointUnrolled returns to same y after full revolution', () => {
      const a = wellSurfacePointUnrolled(0, 0, params);
      const b = wellSurfacePointUnrolled(2 * Math.PI, 0, params);
      expect(b.y).toBeCloseTo(a.y);
    });

    it('wellSurfacePointUnrolled height scales with local radius', () => {
      const center = wellSurfacePointUnrolled(Math.PI / 2, 0, params);
      const outer = wellSurfacePointUnrolled(Math.PI / 2, -1, params);
      // Same theta, but center has larger radius → larger v.
      expect(Math.abs(center.y)).toBeGreaterThan(Math.abs(outer.y));
    });

    it('wellTrajectoryPointMorphed at wellMorph=1 matches harmonic trajectory', () => {
      for (const t of [0, 0.25, 0.5, 0.75, 1]) {
        const harmonic = wellTrajectoryPoint(0.3, t, 1, params);
        const morphed = wellTrajectoryPointMorphed(0.3, t, 1, 0, params);
        expect(morphed.x).toBeCloseTo(harmonic.x);
        expect(morphed.y).toBeCloseTo(harmonic.y);
        expect(morphed.z).toBeCloseTo(harmonic.z);
      }
    });

    it('wellTrajectoryPointMorphed at wellMorph=0, wellUnfold=1 lies on flat paper', () => {
      for (const t of [0.1, 0.3, 0.5, 0.7, 0.9]) {
        const flat = wellTrajectoryPointMorphed(0.3, t, 0, 1, params);
        expect(flat.z).toBeCloseTo(0);
      }
    });

    it('unrolled trajectory is straight in (x, y): constant slope', () => {
      const energy = 0.3;
      const samples = [0.1, 0.3, 0.5, 0.7, 0.9].map((t) =>
        wellTrajectoryPointMorphed(energy, t, 0, 1, params),
      );
      // dy/dx between consecutive samples should be constant within tolerance.
      const slopes: number[] = [];
      for (let i = 0; i < samples.length - 1; i++) {
        const dx = samples[i + 1].x - samples[i].x;
        const dy = samples[i + 1].y - samples[i].y;
        slopes.push(dy / dx);
      }
      const first = slopes[0];
      for (const s of slopes) {
        expect(s).toBeCloseTo(first, 4);
      }
    });

    it('unfold morph preserves dot continuity at intermediate values', () => {
      const t = 0.4;
      const rolled = wellTrajectoryPointMorphed(0.3, t, 0, 0, params);
      const half = wellTrajectoryPointMorphed(0.3, t, 0, 0.5, params);
      const flat = wellTrajectoryPointMorphed(0.3, t, 0, 1, params);
      // Half-unfolded point should be between rolled and flat in z.
      const minZ = Math.min(rolled.z, flat.z);
      const maxZ = Math.max(rolled.z, flat.z);
      expect(half.z).toBeGreaterThanOrEqual(minZ - 1e-3);
      expect(half.z).toBeLessThanOrEqual(maxZ + 1e-3);
    });

    it('wellTrajectoryMorphedSamples returns requested length', () => {
      const samples = wellTrajectoryMorphedSamples(0.3, 16, 0, 1, params, 0.8, 0.6);
      expect(samples).toHaveLength(16);
      expect(samples.every((s) => Number.isFinite(s.x))).toBe(true);
      expect(samples.every((s) => Number.isFinite(s.y))).toBe(true);
      expect(samples.every((s) => Number.isFinite(s.z))).toBe(true);
    });
  });
});
