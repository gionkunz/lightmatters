import { properTimeFraction } from './lorentz';

/** Contracted length along the direction of motion: L₀ · √(1 − v²/c²) = L₀/γ. */
export function lengthContraction(
  properLength: number,
  vOverC: number,
): number {
  return properLength * properTimeFraction(vOverC);
}
