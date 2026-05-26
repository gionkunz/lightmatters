import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_THE_ETHER } from './steps/step-01-the-ether';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_MICHELSON_MORLEY } from './steps/step-02-michelson-morley';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_SOURCE_AT_REST } from './steps/step-03-source-at-rest';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_MOVING_SOURCE } from './steps/step-04-moving-source';
import { Step04Component } from './steps/step-04.component';
import { STEP_05_OUTRO } from './steps/step-05-outro';
import { Step05Component } from './steps/step-05.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_04_TOTAL_STEPS = 5;
export const CHAPTER_04_TITLE = 'The ether was wrong';

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_THE_ETHER, component: Step01Component }],
  [2, { step: STEP_02_MICHELSON_MORLEY, component: Step02Component }],
  [3, { step: STEP_03_SOURCE_AT_REST, component: Step03Component }],
  [4, { step: STEP_04_MOVING_SOURCE, component: Step04Component }],
  [5, { step: STEP_05_OUTRO, component: Step05Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
