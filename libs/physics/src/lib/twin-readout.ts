export interface TwinReadout {
  stayHomeLabel: string;
  travellerLabel: string;
  differenceLabel: string;
}

/** Years label matching the traveller-readout rounding (whole vs. 2-decimal). */
function formatYears(years: number): string {
  if (years < 0.005) {
    return '0 years';
  }
  const rounded = Math.round(years * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 1e-9) {
    const whole = Math.round(rounded);
    return whole === 1 ? '1 year' : `${whole} years`;
  }
  return `${rounded.toFixed(2)} years`;
}

/**
 * Twin-paradox readout: each twin's elapsed proper time and the age difference
 * on reunion. Rounding follows the existing physics readout conventions.
 */
export function twinReadout(
  stayHomeProperYears: number,
  travellerProperYears: number,
): TwinReadout {
  const difference = Math.abs(stayHomeProperYears - travellerProperYears);
  return {
    stayHomeLabel: formatYears(stayHomeProperYears),
    travellerLabel: formatYears(travellerProperYears),
    differenceLabel: formatYears(difference),
  };
}
