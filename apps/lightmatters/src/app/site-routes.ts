/* eslint-disable @nx/enforce-module-boundaries -- prerender metadata imports constants from lazy-loaded chapter libs */
import { CHAPTER_01_STEPS } from '@lm/feature-chapter-01-position-time';
import { CHAPTER_02_STEPS } from '@lm/feature-chapter-02-speed-budget';
import { CHAPTER_03_STEPS } from '@lm/feature-chapter-03-light-information';
import { CHAPTER_04_STEPS } from '@lm/feature-chapter-04-ether-was-wrong';
import { CHAPTER_05_STEPS } from '@lm/feature-chapter-05-doppler-seeing-motion';
import { CHAPTER_06_STEPS } from '@lm/feature-chapter-06-rolling-diagram';
import { CHAPTER_07_STEPS } from '@lm/feature-chapter-07-gravity-well';
import { CHAPTER_08_STEPS } from '@lm/feature-chapter-08-light-bending';

export const CHAPTER_09_STEPS = [1] as const;

const CHAPTER_STEP_ROUTES: ReadonlyArray<{
  chapter: string;
  steps: readonly number[];
}> = [
  { chapter: '01', steps: CHAPTER_01_STEPS },
  { chapter: '02', steps: CHAPTER_02_STEPS },
  { chapter: '03', steps: CHAPTER_03_STEPS },
  { chapter: '04', steps: CHAPTER_04_STEPS },
  { chapter: '05', steps: CHAPTER_05_STEPS },
  { chapter: '06', steps: CHAPTER_06_STEPS },
  { chapter: '07', steps: CHAPTER_07_STEPS },
  { chapter: '08', steps: CHAPTER_08_STEPS },
  { chapter: '09', steps: CHAPTER_09_STEPS },
];

/** All site paths that should be prerendered at build time. */
export function allPrerenderPaths(): string[] {
  const paths = ['/'];

  for (const { chapter, steps } of CHAPTER_STEP_ROUTES) {
    for (const step of steps) {
      paths.push(`/ch/${chapter}/step/${step}`);
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
  CHAPTER_06_STEPS,
  CHAPTER_07_STEPS,
  CHAPTER_08_STEPS,
  CHAPTER_STEP_ROUTES,
};
