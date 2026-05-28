import { lorentz } from './lorentz';

/** Dilated tick period of a moving light clock: T₀ · γ(v/c). */
export function tickPeriod(restPeriod: number, vOverC: number): number {
  return restPeriod * lorentz(vOverC);
}
