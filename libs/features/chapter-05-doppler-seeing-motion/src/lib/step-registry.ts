import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_PULSE_TICKS } from './steps/step-01-pulse-ticks';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_RECEDING_REDSHIFT } from './steps/step-02-receding-redshift';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_APPROACHING_BLUESHIFT } from './steps/step-03-approaching-blueshift';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_EXTREME_RECESSION } from './steps/step-04-extreme-recession';
import { Step04Component } from './steps/step-04.component';
import { STEP_05_OUTRO } from './steps/step-05-outro';
import { Step05Component } from './steps/step-05.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_05_TOTAL_STEPS = 5;
export const CHAPTER_05_TITLE = 'Doppler and seeing motion';
/** Journey URL chapter (`/chapter/7/...`). */
export const CHAPTER_05_ROUTE_NUMBER = 7;

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_PULSE_TICKS, component: Step01Component }],
  [2, { step: STEP_02_RECEDING_REDSHIFT, component: Step02Component }],
  [3, { step: STEP_03_APPROACHING_BLUESHIFT, component: Step03Component }],
  [4, { step: STEP_04_EXTREME_RECESSION, component: Step04Component }],
  [5, { step: STEP_05_OUTRO, component: Step05Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
