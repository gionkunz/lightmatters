import { properTimeAlongWorldline } from '@lm/physics';

/** Traveller speed for the chapter's worked example. */
export const TWIN_V_OVER_C = 0.6;

/** Turnaround at the midpoint of the trip. */
export const TWIN_TURNAROUND = 0.5;

/** Total coordinate time of the round trip, in years (stay-at-home's clock). */
export const TWIN_TOTAL_YEARS = 10;

/** Stay-at-home twin: a single at-rest segment over the whole trip. */
export const STAY_HOME_PROPER_YEARS = properTimeAlongWorldline([
  { dt: TWIN_TOTAL_YEARS, vOverC: 0 },
]);

/** Traveller twin: two equal legs out and back at TWIN_V_OVER_C. */
export const TRAVELLER_PROPER_YEARS = properTimeAlongWorldline([
  { dt: TWIN_TOTAL_YEARS / 2, vOverC: TWIN_V_OVER_C },
  { dt: TWIN_TOTAL_YEARS / 2, vOverC: TWIN_V_OVER_C },
]);
