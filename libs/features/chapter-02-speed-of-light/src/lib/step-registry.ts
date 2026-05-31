import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_HOW_FAST } from './steps/step-01-how-fast';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_CAUSAL_LIMIT } from './steps/step-02-causal-limit';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_NO_TIME } from './steps/step-03-no-time';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_MEASURE_C } from './steps/step-04-measure-c';
import { Step04Component } from './steps/step-04.component';
import { STEP_05_EM_WAVE } from './steps/step-05-em-wave';
import { Step05Component } from './steps/step-05.component';
import { STEP_06_MAXWELL } from './steps/step-06-maxwell-outro';
import { Step06Component } from './steps/step-06.component';
import { STEP_07_REALITY } from './steps/step-07-reality';
import { Step07Component } from './steps/step-07.component';
import { STEP_08_SPECTRUM } from './steps/step-08-spectrum';
import { Step08Component } from './steps/step-08.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS = 8;
export const CHAPTER_02_SPEED_OF_LIGHT_TITLE = 'The speed of light';
/** Journey URL chapter (`/chapter/2/...`). */
export const CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER = 2;

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_HOW_FAST, component: Step01Component }],
  [2, { step: STEP_02_CAUSAL_LIMIT, component: Step02Component }],
  [3, { step: STEP_03_NO_TIME, component: Step03Component }],
  [4, { step: STEP_04_MEASURE_C, component: Step04Component }],
  [5, { step: STEP_05_EM_WAVE, component: Step05Component }],
  [6, { step: STEP_06_MAXWELL, component: Step06Component }],
  [7, { step: STEP_07_REALITY, component: Step07Component }],
  [8, { step: STEP_08_SPECTRUM, component: Step08Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
