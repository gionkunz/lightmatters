/** Lorentz factor γ = 1/√(1 − v²/c²) for physical v/c in [0, 1). */
export function lorentz(vOverC: number): number {
  const v = Math.min(Math.max(0, vOverC), 1 - Number.EPSILON);
  return 1 / Math.sqrt(1 - v * v);
}

/** Proper time per unit coordinate time: √(1 − v²/c²) = 1/γ. */
export function properTimeFraction(vOverC: number): number {
  const v = Math.min(1, Math.max(0, vOverC));
  if (v >= 1) {
    return 0;
  }
  return Math.sqrt(1 - v * v);
}

/** Equal-split velocity on the budget arc (45°): sin(45°) = √2/2. */
export const EQUAL_SPLIT_V_OVER_C = Math.SQRT1_2;
