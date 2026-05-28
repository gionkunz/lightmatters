import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_LIGHT_CLOCK_AT_REST } from './steps/step-01-light-clock-at-rest';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_MOVING_CLOCK } from './steps/step-02-moving-clock';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_LENGTH_CONTRACTION } from './steps/step-03-length-contraction';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_OUTRO } from './steps/step-04-outro';
import { Step04Component } from './steps/step-04.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_06_CLOCKS_TOTAL_STEPS = 4;
export const CHAPTER_06_CLOCKS_TITLE = 'Clocks & rulers';

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_LIGHT_CLOCK_AT_REST, component: Step01Component }],
  [2, { step: STEP_02_MOVING_CLOCK, component: Step02Component }],
  [3, { step: STEP_03_LENGTH_CONTRACTION, component: Step03Component }],
  [4, { step: STEP_04_OUTRO, component: Step04Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
