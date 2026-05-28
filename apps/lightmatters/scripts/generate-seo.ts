import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CHAPTER_01_STEPS } from '../../../libs/features/chapter-01-position-time/src/lib/chapter-steps';
import { CHAPTER_02_STEPS } from '../../../libs/features/chapter-02-speed-budget/src/lib/chapter-steps';
import { CHAPTER_03_STEPS } from '../../../libs/features/chapter-03-light-information/src/lib/chapter-steps';
import { CHAPTER_04_STEPS } from '../../../libs/features/chapter-04-ether-was-wrong/src/lib/chapter-steps';
import { CHAPTER_05_STEPS } from '../../../libs/features/chapter-05-doppler-seeing-motion/src/lib/chapter-steps';
import { CHAPTER_06_STEPS } from '../../../libs/features/chapter-06-rolling-diagram/src/lib/chapter-steps';
import { CHAPTER_06_CLOCKS_STEPS } from '../../../libs/features/chapter-06-clocks-and-rulers/src/lib/chapter-steps';
import { CHAPTER_07_STEPS } from '../../../libs/features/chapter-07-gravity-well/src/lib/chapter-steps';
import { CHAPTER_08_STEPS } from '../../../libs/features/chapter-08-light-bending/src/lib/chapter-steps';

const CHAPTER_STEP_ROUTES: ReadonlyArray<{
  chapter: number;
  steps: readonly number[];
}> = [
  { chapter: 1, steps: CHAPTER_01_STEPS },
  { chapter: 2, steps: CHAPTER_02_STEPS },
  { chapter: 3, steps: CHAPTER_03_STEPS },
  { chapter: 4, steps: CHAPTER_04_STEPS },
  { chapter: 5, steps: [1] },
  { chapter: 6, steps: CHAPTER_06_CLOCKS_STEPS },
  { chapter: 7, steps: CHAPTER_05_STEPS },
  { chapter: 10, steps: CHAPTER_06_STEPS },
  { chapter: 11, steps: CHAPTER_07_STEPS },
  { chapter: 12, steps: CHAPTER_08_STEPS },
  { chapter: 13, steps: [1] },
];

function chapterStepHref(chapter: number, step: number): string {
  return `/chapter/${chapter}/step/${step}`;
}

function allPrerenderPaths(): string[] {
  const paths = ['/'];

  for (const { chapter, steps } of CHAPTER_STEP_ROUTES) {
    for (const step of steps) {
      paths.push(chapterStepHref(chapter, step));
    }
  }

  return paths;
}

const publicDir = join(import.meta.dirname, '../public');
const siteOrigin = 'https://lightmatters.app';

const paths = allPrerenderPaths();

writeFileSync(
  join(publicDir, 'robots.txt'),
  ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteOrigin}/sitemap.xml`, ''].join(
    '\n',
  ),
);

const urlEntries = paths
  .map((path) => {
    const loc = path === '/' ? siteOrigin : `${siteOrigin}${path}`;
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
  })
  .join('\n');

writeFileSync(
  join(publicDir, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n'),
);

console.log(`Wrote robots.txt and sitemap.xml (${paths.length} URLs)`);
