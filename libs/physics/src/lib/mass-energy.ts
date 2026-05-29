import { lorentz } from './lorentz';

/**
 * Relativistic energy & momentum helpers, built on {@link lorentz}.
 *
 * ## Unit convention for `c`
 *
 * Every helper takes an optional speed-of-light `c` that defaults to **1**
 * (natural units). In natural units energy, momentum and mass share the same
 * scale, which is what the diagrams want: `restEnergy(m) === m`,
 * `photonMomentum(E) === E`, `massEnergyEquivalent(E) === E`. Pass an explicit
 * `c` (e.g. {@link SPEED_OF_LIGHT_MS}) when you need human-scale SI readouts —
 * the "tiny mass, huge energy" payoff comes from the `c²` factor.
 */

/** Speed of light in m/s (SI definition) — for human-scale `E = mc²` readouts. */
export const SPEED_OF_LIGHT_MS = 299_792_458;

/** Rest energy `E₀ = m·c²`. In natural units (`c = 1`) this is just `m`. */
export function restEnergy(mass: number, c = 1): number {
  return mass * c * c;
}

/** Total relativistic energy `E = γ·m·c²`. Equals {@link restEnergy} at rest. */
export function totalEnergy(mass: number, vOverC: number, c = 1): number {
  return lorentz(vOverC) * restEnergy(mass, c);
}

/** Kinetic energy `(γ − 1)·m·c²` — the budget shifted out of rest energy by motion. */
export function kineticEnergy(mass: number, vOverC: number, c = 1): number {
  return (lorentz(vOverC) - 1) * restEnergy(mass, c);
}

/** Relativistic momentum `p = γ·m·v`. Zero at rest, exceeds classical `m·v` once moving. */
export function relativisticMomentum(
  mass: number,
  vOverC: number,
  c = 1,
): number {
  const v = Math.min(Math.max(0, vOverC), 1 - Number.EPSILON);
  return lorentz(v) * mass * (v * c);
}

/** Momentum carried by light of energy `E`: `p = E/c`. */
export function photonMomentum(energy: number, c = 1): number {
  return energy / c;
}

/**
 * Mass equivalent of radiated energy `E`: `Δm = E/c²` — the mass carried by, or
 * lost as, radiation of energy `E` (the photon-in-a-box result).
 */
export function massEnergyEquivalent(energy: number, c = 1): number {
  return energy / (c * c);
}
