import type { Type } from '@angular/core';
import type { Step } from '@lm/engine';
import { STEP_01_HOOK } from './steps/step-01-hook';
import { Step01Component } from './steps/step-01.component';
import { STEP_02_REST_ENERGY } from './steps/step-02-rest-energy';
import { Step02Component } from './steps/step-02.component';
import { STEP_03_LIGHT_MOMENTUM } from './steps/step-03-light-momentum';
import { Step03Component } from './steps/step-03.component';
import { STEP_04_PHOTON_IN_A_BOX } from './steps/step-04-photon-in-a-box';
import { Step04Component } from './steps/step-04.component';
import { STEP_05_BALANCE } from './steps/step-05-balance';
import { Step05Component } from './steps/step-05.component';
import { STEP_06_PAYOFF } from './steps/step-06-payoff';
import { Step06Component } from './steps/step-06.component';

export interface StepEntry {
  step: Step;
  component: Type<unknown>;
}

export const CHAPTER_09_MASS_ENERGY_TOTAL_STEPS = 6;
export const CHAPTER_09_MASS_ENERGY_TITLE = 'Mass is energy (E=mc²)';
/** Journey URL chapter (`/chapter/10/...`). */
export const CHAPTER_09_MASS_ENERGY_ROUTE_NUMBER = 10;

const REGISTRY = new Map<number, StepEntry>([
  [1, { step: STEP_01_HOOK, component: Step01Component }],
  [2, { step: STEP_02_REST_ENERGY, component: Step02Component }],
  [3, { step: STEP_03_LIGHT_MOMENTUM, component: Step03Component }],
  [4, { step: STEP_04_PHOTON_IN_A_BOX, component: Step04Component }],
  [5, { step: STEP_05_BALANCE, component: Step05Component }],
  [6, { step: STEP_06_PAYOFF, component: Step06Component }],
]);

export function resolveStep(stepNumber: number): StepEntry | undefined {
  return REGISTRY.get(stepNumber);
}

export function hasNextStep(stepNumber: number): boolean {
  return REGISTRY.has(stepNumber + 1);
}
