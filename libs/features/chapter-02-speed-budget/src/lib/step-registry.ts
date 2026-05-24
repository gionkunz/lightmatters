import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_ALWAYS_AT_C } from './steps/step-01-always-at-c';
import { Step01Component } from './steps/step-01.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_02_TOTAL_STEPS = 11;

export const CHAPTER_02_TITLE = 'The speed budget';

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_ALWAYS_AT_C, component: Step01Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
