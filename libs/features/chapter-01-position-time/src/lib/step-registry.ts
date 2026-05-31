import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_POSITION } from './steps/step-01-position';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_TIME } from './steps/step-02-time';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_SPACETIME } from './steps/step-03-spacetime';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_MOVING_SPACETIME } from './steps/step-04-moving-spacetime';
import { Step04Component } from './steps/step-04.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_01_TOTAL_STEPS = 6;

export const CHAPTER_01_TITLE = 'Position, time, spacetime';
/** Journey URL chapter (`/chapter/1/...`). */
export const CHAPTER_01_POSITION_TIME_ROUTE_NUMBER = 1;

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_POSITION, component: Step01Component }],
  [2, { step: STEP_02_TIME, component: Step02Component }],
  [3, { step: STEP_03_SPACETIME, component: Step03Component }],
  [4, { step: STEP_04_MOVING_SPACETIME, component: Step04Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
