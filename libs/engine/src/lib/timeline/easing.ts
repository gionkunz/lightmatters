import type { EasingName } from './types';

export function applyEasing(t: number, easing: EasingName = 'linear'): number {
  const clamped = Math.max(0, Math.min(1, t));
  if (easing === 'ease-out') {
    return 1 - (1 - clamped) ** 3;
  }
  return clamped;
}

export function interpolate(
  from: number,
  to: number,
  t: number,
  easing: EasingName = 'linear',
): number {
  return from + (to - from) * applyEasing(t, easing);
}
