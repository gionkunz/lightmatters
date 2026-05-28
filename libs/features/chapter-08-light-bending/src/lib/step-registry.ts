import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_DEEP_WELL } from './steps/step-01-deep-well';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_ONE_RAY } from './steps/step-02-one-ray';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_WIDEN_BEAM } from './steps/step-03-widen-beam';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_PATH_PUZZLE } from './steps/step-04-path-puzzle';
import { Step04Component } from './steps/step-04.component';
import { STEP_05_TIME_DILATION } from './steps/step-05-time-dilation';
import { Step05Component } from './steps/step-05.component';
import { STEP_06_SYNCHRONIZED } from './steps/step-06-synchronized';
import { Step06Component } from './steps/step-06.component';
import { STEP_07_STRAIGHT_LINES } from './steps/step-07-straight-lines';
import { Step07Component } from './steps/step-07.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_08_TOTAL_STEPS = 7;
export const CHAPTER_08_TITLE = 'Light bending around mass';

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_DEEP_WELL, component: Step01Component }],
  [2, { step: STEP_02_ONE_RAY, component: Step02Component }],
  [3, { step: STEP_03_WIDEN_BEAM, component: Step03Component }],
  [4, { step: STEP_04_PATH_PUZZLE, component: Step04Component }],
  [5, { step: STEP_05_TIME_DILATION, component: Step05Component }],
  [6, { step: STEP_06_SYNCHRONIZED, component: Step06Component }],
  [7, { step: STEP_07_STRAIGHT_LINES, component: Step07Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
