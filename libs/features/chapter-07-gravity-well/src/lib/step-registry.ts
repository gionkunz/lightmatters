import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_PUZZLE } from './steps/step-01-puzzle';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_PIECEWISE } from './steps/step-02-piecewise';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_FOLDED_PAPER } from './steps/step-03-folded-paper';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_SMOOTH } from './steps/step-04-smooth';
import { Step04Component } from './steps/step-04.component';
import { STEP_05_FALL_THROUGH } from './steps/step-05-fall-through';
import { Step05Component } from './steps/step-05.component';
import { STEP_06_ESCAPE } from './steps/step-06-escape';
import { Step06Component } from './steps/step-06.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_07_TOTAL_STEPS = 6;
export const CHAPTER_07_TITLE = 'The center of the Earth';
/** Journey URL chapter (`/chapter/11/...`). */
export const CHAPTER_07_ROUTE_NUMBER = 11;

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_PUZZLE, component: Step01Component }],
  [2, { step: STEP_02_PIECEWISE, component: Step02Component }],
  [3, { step: STEP_03_FOLDED_PAPER, component: Step03Component }],
  [4, { step: STEP_04_SMOOTH, component: Step04Component }],
  [5, { step: STEP_05_FALL_THROUGH, component: Step05Component }],
  [6, { step: STEP_06_ESCAPE, component: Step06Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
