import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_TWO_WORLDLINES } from './steps/step-01-two-worldlines';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_APPARENT_PARADOX } from './steps/step-02-apparent-paradox';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_ASYMMETRY } from './steps/step-03-asymmetry';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_DOPPLER_COUNT } from './steps/step-04-doppler-count';
import { Step04Component } from './steps/step-04.component';
import { STEP_05_OUTRO } from './steps/step-05-outro';
import { Step05Component } from './steps/step-05.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_08_TWIN_TOTAL_STEPS = 5;
export const CHAPTER_08_TWIN_TITLE = 'The twin paradox';
/** Journey URL chapter (`/chapter/9/...`). */
export const CHAPTER_08_TWIN_ROUTE_NUMBER = 9;

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_TWO_WORLDLINES, component: Step01Component }],
  [2, { step: STEP_02_APPARENT_PARADOX, component: Step02Component }],
  [3, { step: STEP_03_ASYMMETRY, component: Step03Component }],
  [4, { step: STEP_04_DOPPLER_COUNT, component: Step04Component }],
  [5, { step: STEP_05_OUTRO, component: Step05Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
