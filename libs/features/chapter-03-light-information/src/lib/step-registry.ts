import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_LIGHT_THROUGH_SPACE } from './steps/step-01-light-through-space';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_TWO_LISTENERS } from './steps/step-02-two-listeners';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_ONE_OF_THEM_MOVES } from './steps/step-03-one-of-them-moves';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_TWO_FLASHES_ONE_WITNESS } from './steps/step-04-two-flashes-one-witness';
import { Step04Component } from './steps/step-04.component';
import { STEP_05_OUTRO } from './steps/step-05-outro';
import { Step05Component } from './steps/step-05.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_03_TOTAL_STEPS = 5;
export const CHAPTER_03_TITLE = 'Light and information';
/** Journey URL chapter (`/chapter/4/...`). */
export const CHAPTER_03_LIGHT_INFORMATION_ROUTE_NUMBER = 4;

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_LIGHT_THROUGH_SPACE, component: Step01Component }],
  [2, { step: STEP_02_TWO_LISTENERS, component: Step02Component }],
  [3, { step: STEP_03_ONE_OF_THEM_MOVES, component: Step03Component }],
  [4, { step: STEP_04_TWO_FLASHES_ONE_WITNESS, component: Step04Component }],
  [5, { step: STEP_05_OUTRO, component: Step05Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
