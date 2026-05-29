import { properTimeAlongWorldline } from './worldline-proper-time';
import { twinReadout } from './twin-readout';

describe('twinReadout', () => {
  it('reports each twin elapsed time and the difference', () => {
    const T = 10;
    const stayHome = properTimeAlongWorldline([{ dt: T, vOverC: 0 }]);
    const traveller = properTimeAlongWorldline([
      { dt: T / 2, vOverC: 0.6 },
      { dt: T / 2, vOverC: 0.6 },
    ]);
    const readout = twinReadout(stayHome, traveller);
    expect(readout.stayHomeLabel).toBe('10 years');
    expect(readout.travellerLabel).toBe('8 years');
    expect(readout.differenceLabel).toBe('2 years');
  });

  it('formats fractional ages with two decimals', () => {
    const readout = twinReadout(10, 8.66);
    expect(readout.travellerLabel).toBe('8.66 years');
    expect(readout.differenceLabel).toBe('1.34 years');
  });

  it('uses the singular year label and zero for tiny values', () => {
    const readout = twinReadout(1, 0);
    expect(readout.stayHomeLabel).toBe('1 year');
    expect(readout.travellerLabel).toBe('0 years');
    expect(readout.differenceLabel).toBe('1 year');
  });
});
