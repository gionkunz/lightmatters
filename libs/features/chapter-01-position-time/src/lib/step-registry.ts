import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_POSITION } from './steps/step-01-position';
import { Step01Component } from './steps/step-01.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_01_TOTAL_STEPS = 6;

export const CHAPTER_01_TITLE = 'Position, time, spacetime';

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_POSITION, component: Step01Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
