import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_TIME_ONLY } from './steps/step-01-time-only';
import { Step01Component } from './steps/step-01.component';
import { STEP_03_CONE } from './steps/step-03-cone';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_GEODESICS } from './steps/step-04-geodesics';
import { Step04Component } from './steps/step-04.component';
import { STEP_05_APPLE } from './steps/step-05-apple';
import { Step05Component } from './steps/step-05.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_06_TOTAL_STEPS = 4;
export const CHAPTER_06_TITLE = 'Rolling the diagram: gravity as geometry';
/** Journey URL chapter (`/chapter/11/...`). */
export const CHAPTER_06_ROUTE_NUMBER = 11;

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_TIME_ONLY, component: Step01Component }],
  [2, { step: STEP_03_CONE, component: Step03Component }],
  [3, { step: STEP_04_GEODESICS, component: Step04Component }],
  [4, { step: STEP_05_APPLE, component: Step05Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
