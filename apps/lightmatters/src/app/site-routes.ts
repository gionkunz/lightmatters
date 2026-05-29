/* eslint-disable @nx/enforce-module-boundaries -- prerender metadata imports constants from lazy-loaded chapter libs */
import { CHAPTER_01_STEPS } from '@lm/feature-chapter-01-position-time';
import { CHAPTER_02_STEPS } from '@lm/feature-chapter-02-speed-budget';
import { CHAPTER_03_STEPS } from '@lm/feature-chapter-03-light-information';
import { CHAPTER_04_STEPS } from '@lm/feature-chapter-04-ether-was-wrong';
import { CHAPTER_05_STEPS } from '@lm/feature-chapter-05-doppler-seeing-motion';
import { CHAPTER_05_CONSTANT_C_STEPS } from '@lm/feature-chapter-05-constant-c';
import { CHAPTER_06_STEPS } from '@lm/feature-chapter-06-rolling-diagram';
import { CHAPTER_06_CLOCKS_STEPS } from '@lm/feature-chapter-06-clocks-and-rulers';
import { CHAPTER_07_STEPS } from '@lm/feature-chapter-07-gravity-well';
import { CHAPTER_08_STEPS } from '@lm/feature-chapter-08-light-bending';
import { CHAPTER_08_TWIN_STEPS } from '@lm/feature-chapter-08-twin-paradox';
import { chapterStepHref } from '@lm/engine';

export const CHAPTER_13_STEPS = [1] as const;

const CHAPTER_STEP_ROUTES: ReadonlyArray<{
  chapter: number;
  steps: readonly number[];
}> = [
  { chapter: 1, steps: CHAPTER_01_STEPS },
  { chapter: 2, steps: CHAPTER_02_STEPS },
  { chapter: 3, steps: CHAPTER_03_STEPS },
  { chapter: 4, steps: CHAPTER_04_STEPS },
  { chapter: 5, steps: CHAPTER_05_CONSTANT_C_STEPS },
  { chapter: 6, steps: CHAPTER_06_CLOCKS_STEPS },
  { chapter: 7, steps: CHAPTER_05_STEPS },
  { chapter: 8, steps: CHAPTER_08_TWIN_STEPS },
  { chapter: 10, steps: CHAPTER_06_STEPS },
  { chapter: 11, steps: CHAPTER_07_STEPS },
  { chapter: 12, steps: CHAPTER_08_STEPS },
  { chapter: 13, steps: CHAPTER_13_STEPS },
];

/** All site paths that should be prerendered at build time. */
export function allPrerenderPaths(): string[] {
  const paths = ['/'];

  for (const { chapter, steps } of CHAPTER_STEP_ROUTES) {
    for (const step of steps) {
      paths.push(chapterStepHref(chapter, step));
    }
  }

  return paths;
}

export function stepPrerenderParams(
  steps: readonly number[],
): () => Promise<Record<string, string>[]> {
  return () =>
    Promise.resolve(steps.map((step) => ({ step: String(step) })));
}

export {
  CHAPTER_01_STEPS,
  CHAPTER_02_STEPS,
  CHAPTER_03_STEPS,
  CHAPTER_04_STEPS,
  CHAPTER_05_STEPS,
  CHAPTER_05_CONSTANT_C_STEPS,
  CHAPTER_06_CLOCKS_STEPS,
  CHAPTER_06_STEPS,
  CHAPTER_07_STEPS,
  CHAPTER_08_STEPS,
  CHAPTER_08_TWIN_STEPS,
  CHAPTER_STEP_ROUTES,
};
