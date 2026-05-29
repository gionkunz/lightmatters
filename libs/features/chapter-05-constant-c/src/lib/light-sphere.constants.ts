/** Shared light-sphere scene timing for Chapter 5 (constant c). */

/** Single flash emitted at the origin at scene-time 0. */
export const FLASH_EMISSION = { atTime: 0, pulseId: 'flash' } as const;

/** Speed of observer B relative to the ground frame (fraction of c). */
export const B_SPEED = 0.5;

/** Scene half-extent in scene units. */
export const SCENE_EXTENT = 1.15;

/** How far the wavefront sweep runs (scene-time units). */
export const SWEEP_TIME = 0.95;
