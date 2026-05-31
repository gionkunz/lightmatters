import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_ALWAYS_AT_C } from './steps/step-01-always-at-c';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_TWO_TRAVELLERS } from './steps/step-02-two-travellers';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_BRIDGE_TO_LIGHT } from './steps/step-03-bridge-to-light';
import { Step03Component } from './steps/step-03.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_02_TOTAL_STEPS = 11;

export const CHAPTER_02_TITLE = 'The speed budget';
/** Journey URL chapter (`/chapter/3/...`). */
export const CHAPTER_02_SPEED_BUDGET_ROUTE_NUMBER = 3;

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_ALWAYS_AT_C, component: Step01Component }],
  [2, { step: STEP_02_TWO_TRAVELLERS, component: Step02Component }],
  [3, { step: STEP_03_BRIDGE_TO_LIGHT, component: Step03Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
