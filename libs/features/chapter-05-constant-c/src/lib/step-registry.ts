import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_RECALL } from './steps/step-01-recall';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_GROUND_FRAME } from './steps/step-02-ground-frame';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_FRAME_SWITCH } from './steps/step-03-frame-switch';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_OUTRO } from './steps/step-04-outro';
import { Step04Component } from './steps/step-04.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_05_CONSTANT_C_TOTAL_STEPS = 4;
export const CHAPTER_05_CONSTANT_C_TITLE = 'The same speed of light';
/** Journey URL chapter (`/chapter/5/...`). */
export const CHAPTER_05_CONSTANT_C_ROUTE_NUMBER = 5;

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_RECALL, component: Step01Component }],
  [2, { step: STEP_02_GROUND_FRAME, component: Step02Component }],
  [3, { step: STEP_03_FRAME_SWITCH, component: Step03Component }],
  [4, { step: STEP_04_OUTRO, component: Step04Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
