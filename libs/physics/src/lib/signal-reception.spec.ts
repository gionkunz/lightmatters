import {
  coordinateTimeAtProperTime,
  observerPositionAtProperTime,
  observerProperTimeAtCoordinate,
  receptionCoordinateTime,
  receptionProperTime,
  receptionTimeMoving,
  receptionTimeStationary,
  STEP3_BRIDGE_LAYOUT,
  STEP3_BRIDGE_TIME_AT_A,
  STEP3_SEPARATION,
  STEP3_TIME_AT_A,
  STEP3_TIME_AT_C,
  STEP3_WAVEFRONT_LAYOUT,
  wavefrontRadiusAtObserver,
} from './signal-reception';

describe('signal-reception', () => {
  const layout = STEP3_WAVEFRONT_LAYOUT;

  it('places A and C equidistant from B', () => {
    expect(layout.xB - layout.xA).toBeCloseTo(STEP3_SEPARATION);
    expect(layout.xC - layout.xB).toBeCloseTo(STEP3_SEPARATION);
  });

  it('stationary reception time is spatial separation at c = 1', () => {
    expect(receptionTimeStationary(layout.xB, 0, layout.xA)).toBeCloseTo(
      STEP3_SEPARATION,
    );
  });

  it('moving observer reception time exceeds stationary for positive layout', () => {
    const tA = receptionTimeStationary(layout.xB, 0, layout.xA);
    const tC = receptionTimeMoving(layout.xB, 0, layout.xC, layout.vOverC);
    expect(tC).toBeGreaterThan(tA);
    expect(tC).toBeCloseTo(0.5);
  });

  it('reception at A is before reception at C', () => {
    expect(STEP3_TIME_AT_A).toBeCloseTo(0.25);
    expect(STEP3_TIME_AT_C).toBeCloseTo(0.5);
    expect(STEP3_TIME_AT_A).toBeLessThan(STEP3_TIME_AT_C);
  });

  it('wavefrontRadiusAtObserver alias matches receptionCoordinateTime', () => {
    expect(wavefrontRadiusAtObserver(layout, 'a')).toBeCloseTo(0.25);
    expect(receptionCoordinateTime(layout, 'c')).toBeCloseTo(0.5);
  });

  it('proper times differ for A and C at reception', () => {
    const tauA = receptionProperTime(layout, 'a');
    const tauC = receptionProperTime(layout, 'c');
    expect(tauA).toBeCloseTo(0.25);
    expect(tauC).toBeCloseTo(0.433, 2);
    expect(tauA).not.toBeCloseTo(tauC);
  });

  it('proper time lags coordinate time for moving observer', () => {
    expect(observerProperTimeAtCoordinate(0.25, 0.5)).toBeCloseTo(0.217, 2);
    expect(observerProperTimeAtCoordinate(0.25, 0)).toBeCloseTo(0.25);
  });

  it('C worldline position at proper time matches coordinate-time motion', () => {
    const tau = 0.2;
    const t = coordinateTimeAtProperTime(tau, layout.vOverC);
    expect(observerPositionAtProperTime(layout, 'c', tau)).toBeCloseTo(
      layout.xC + layout.vOverC * t,
    );
  });
});

describe('signal-reception bridge layout', () => {
  it('two stationary observers receive at equal proper time', () => {
    const tauA = receptionProperTime(STEP3_BRIDGE_LAYOUT, 'a');
    expect(STEP3_BRIDGE_TIME_AT_A).toBeCloseTo(0.25);
    expect(tauA).toBeCloseTo(0.25);
  });
});
