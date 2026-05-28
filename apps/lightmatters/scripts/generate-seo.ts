import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/** Resolve @lm/* imports the same way TypeScript path mapping does. */
function loadChapterSteps(): Array<{ chapter: string; steps: readonly number[] }> {
  return [
    {
      chapter: '01',
      steps: require('../../../libs/features/chapter-01-position-time/src/lib/chapter-steps.ts')
        .CHAPTER_01_STEPS,
    },
    {
      chapter: '02',
      steps: require('../../../libs/features/chapter-02-speed-budget/src/lib/chapter-steps.ts')
        .CHAPTER_02_STEPS,
    },
    {
      chapter: '03',
      steps: require('../../../libs/features/chapter-03-light-information/src/lib/chapter-steps.ts')
        .CHAPTER_03_STEPS,
    },
    {
      chapter: '04',
      steps: require('../../../libs/features/chapter-04-ether-was-wrong/src/lib/chapter-steps.ts')
        .CHAPTER_04_STEPS,
    },
    {
      chapter: '05',
      steps: require('../../../libs/features/chapter-05-doppler-seeing-motion/src/lib/chapter-steps.ts')
        .CHAPTER_05_STEPS,
    },
    {
      chapter: '06',
      steps: require('../../../libs/features/chapter-06-rolling-diagram/src/lib/chapter-steps.ts')
        .CHAPTER_06_STEPS,
    },
    {
      chapter: '07',
      steps: require('../../../libs/features/chapter-07-gravity-well/src/lib/chapter-steps.ts')
        .CHAPTER_07_STEPS,
    },
    {
      chapter: '08',
      steps: require('../../../libs/features/chapter-08-light-bending/src/lib/chapter-steps.ts')
        .CHAPTER_08_STEPS,
    },
    { chapter: '09', steps: [1] },
  ];
}

function allPrerenderPaths(): string[] {
  const paths = ['/'];

  for (const { chapter, steps } of loadChapterSteps()) {
    for (const step of steps) {
      paths.push(`/ch/${chapter}/step/${step}`);
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
