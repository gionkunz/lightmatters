import { pulseReachesStationary, vec2 } from '@lm/physics';

/** Scene layout for Step 3 — keep in sync with `step-03.component.ts`. */
export const STEP_03_M31_X = -0.88;
export const STEP_03_YOU_X = 0.88;
export const STEP_03_SCENE_EXTENT = 1.05;

/** Scene time when the pulse first reaches the stationary observer at c = 1. */
export const STEP_03_RECEPTION_SCENE_TIME = pulseReachesStationary(
  vec2(STEP_03_M31_X, 0),
  vec2(STEP_03_YOU_X, 0),
);
