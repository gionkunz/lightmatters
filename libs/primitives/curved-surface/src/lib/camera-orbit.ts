/** Max elevation from the authored base view (radians, ~80°). */
export const MAX_ORBIT_ELEVATION = (80 * Math.PI) / 180;

/** Pointer drag sensitivity (radians per pixel). */
export const ORBIT_SENSITIVITY = 0.005;

export interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

/** Apply user azimuth/elevation deltas on top of an authored base camera position. */
export function applyOrbitOffset(
  target: Vec3Like,
  basePosition: Vec3Like,
  azimuthDelta: number,
  elevationDelta: number,
): Vec3Like {
  const dx = basePosition.x - target.x;
  const dy = basePosition.y - target.y;
  const dz = basePosition.z - target.z;
  const radius = Math.hypot(dx, dy, dz);
  if (radius === 0) {
    return { ...basePosition };
  }

  const theta = Math.atan2(dx, dz) + azimuthDelta;
  const phi = Math.max(
    -MAX_ORBIT_ELEVATION,
    Math.min(MAX_ORBIT_ELEVATION, Math.asin(dy / radius) + elevationDelta),
  );
  const cosPhi = Math.cos(phi);

  return {
    x: target.x + radius * cosPhi * Math.sin(theta),
    y: target.y + radius * Math.sin(phi),
    z: target.z + radius * cosPhi * Math.cos(theta),
  };
}

export function easeOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - (1 - clamped) ** 3;
}
