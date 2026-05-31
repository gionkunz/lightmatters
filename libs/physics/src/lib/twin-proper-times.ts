import { properTimeAlongWorldline } from './worldline-proper-time';

export interface TwinProperTimes {
  stayHomeYears: number;
  travellerYears: number;
}

/** Proper times for the chapter's symmetric out-and-back twin scenario. */
export function twinProperTimes(
  totalCoordinateYears: number,
  vOverC: number,
): TwinProperTimes {
  const leg = totalCoordinateYears / 2;
  return {
    stayHomeYears: properTimeAlongWorldline([{ dt: totalCoordinateYears, vOverC: 0 }]),
    travellerYears: properTimeAlongWorldline([
      { dt: leg, vOverC },
      { dt: leg, vOverC },
    ]),
  };
}
