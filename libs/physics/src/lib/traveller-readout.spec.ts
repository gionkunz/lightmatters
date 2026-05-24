import { travellerReadout } from './traveller-readout';

describe('travellerReadout', () => {
  it('formats half light speed traveller', () => {
    const readout = travellerReadout(0.5);
    expect(readout.vOverCLabel).toBe('v / c = 0.50');
    expect(readout.clockLabel).toBe('0.87 years');
    expect(readout.spatialSpeedLabel).toBe('149,896 km/s');
  });

  it('formats Earth-bound traveller as negligible', () => {
    const readout = travellerReadout(0.01);
    expect(readout.vOverCLabel).toBe('v / c ≈ 0');
    expect(readout.clockLabel).toBe('1 year');
    expect(readout.spatialSpeedLabel).toBe('negligible');
  });
});
