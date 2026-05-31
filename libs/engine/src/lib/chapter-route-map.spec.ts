import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  CHAPTER_MAX,
  CHAPTER_MIN,
  CHAPTER_ROUTE_BY_TOPIC,
  type ChapterTopicSlug,
} from './chapter-route-map';

const WORKSPACE_ROOT = path.resolve(__dirname, '../../../../');

/**
 * Explicit phrase patterns that link a topic to a "Chapter N" cross-reference.
 * Avoids false positives when one sentence names two different chapters.
 */
const LINKED_CHAPTER_REFERENCES: ReadonlyArray<{
  regex: RegExp;
  topic: ChapterTopicSlug;
}> = [
  { regex: /speed budget in Chapter\s+(\d+)/gi, topic: 'speed-budget' },
  { regex: /the Chapter\s+(\d+)\s+speed budget/gi, topic: 'speed-budget' },
  { regex: /speed budget since Chapter\s+(\d+)/gi, topic: 'speed-budget' },
  { regex: /rest energy of Chapter\s+(\d+)/gi, topic: 'speed-budget' },
  {
    regex: /In Chapter\s+(\d+) we saw that motion through space steals/gi,
    topic: 'speed-budget',
  },
  {
    regex: /Chapter\s+(\d+) will unpack what that budget/gi,
    topic: 'speed-budget',
  },
  {
    regex: /Chapter\s+(\d+) explains why the old idea of an "ether"/gi,
    topic: 'ether-was-wrong',
  },
  {
    regex: /Chapter\s+(\d+) will show why you cannot subtract motion/gi,
    topic: 'ether-was-wrong',
  },
  { regex: /same picture from Chapter\s+(\d+)/gi, topic: 'light-information' },
  {
    regex: /Chapter\s+(\d+) showed that \*\*when\*\* news arrives/gi,
    topic: 'light-information',
  },
  { regex: /Recall the rule from Chapter\s+(\d+)/gi, topic: 'light-information' },
  {
    regex: /Chapter\s+(\d+) showed that each flash expands/gi,
    topic: 'constant-c',
  },
  {
    regex: /Chapter\s+(\d+) told you moving clocks/gi,
    topic: 'clocks-and-rulers',
  },
  {
    regex: /clock runs (?:slow|fast) \(Chapter\s+(\d+)\)/gi,
    topic: 'clocks-and-rulers',
  },
  { regex: /Doppler shift[\s\S]{0,100}Chapter\s+(\d+)/gi, topic: 'doppler' },
  { regex: /That is Chapter\s+(\d+)\./gi, topic: 'doppler' },
  {
    regex: /roll the diagram, bend it into a cone[\s\S]{0,80}Chapter\s+(\d+) awaits/gi,
    topic: 'rolling-diagram',
  },
  {
    regex: /In Chapter\s+(\d+) we bent the paper into a \*\*cone\*\*/gi,
    topic: 'rolling-diagram',
  },
  {
    regex: /center of the Earth[\s\S]{0,60}Chapter\s+(\d+) awaits/gi,
    topic: 'gravity-well',
  },
  { regex: /Epstein bulge[\s\S]{0,60}Chapter\s+(\d+)/gi, topic: 'gravity-well' },
  {
    regex: /light visibly \*\*bend\*\*[\s\S]{0,120}Chapter\s+(\d+) lives/gi,
    topic: 'light-bending',
  },
  { regex: /Chapter\s+(\d+) teased/gi, topic: 'position-time' },
];

const REGISTRY_ROUTE_CHECKS: ReadonlyArray<{
  libDir: string;
  exportPattern: RegExp;
  topic: ChapterTopicSlug;
}> = [
  {
    libDir: 'chapter-01-position-time',
    exportPattern: /CHAPTER_01_POSITION_TIME_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'position-time',
  },
  {
    libDir: 'chapter-02-speed-of-light',
    exportPattern: /CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'speed-of-light',
  },
  {
    libDir: 'chapter-02-speed-budget',
    exportPattern: /CHAPTER_02_SPEED_BUDGET_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'speed-budget',
  },
  {
    libDir: 'chapter-03-light-information',
    exportPattern: /CHAPTER_03_LIGHT_INFORMATION_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'light-information',
  },
  {
    libDir: 'chapter-04-ether-was-wrong',
    exportPattern: /CHAPTER_04_ETHER_WAS_WRONG_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'ether-was-wrong',
  },
  {
    libDir: 'chapter-05-constant-c',
    exportPattern: /CHAPTER_05_CONSTANT_C_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'constant-c',
  },
  {
    libDir: 'chapter-06-clocks-and-rulers',
    exportPattern: /CHAPTER_06_CLOCKS_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'clocks-and-rulers',
  },
  {
    libDir: 'chapter-05-doppler-seeing-motion',
    exportPattern: /CHAPTER_05_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'doppler',
  },
  {
    libDir: 'chapter-08-twin-paradox',
    exportPattern: /CHAPTER_08_TWIN_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'twin-paradox',
  },
  {
    libDir: 'chapter-09-mass-energy',
    exportPattern: /CHAPTER_09_MASS_ENERGY_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'mass-energy',
  },
  {
    libDir: 'chapter-06-rolling-diagram',
    exportPattern: /CHAPTER_06_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'rolling-diagram',
  },
  {
    libDir: 'chapter-07-gravity-well',
    exportPattern: /CHAPTER_07_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'gravity-well',
  },
  {
    libDir: 'chapter-08-light-bending',
    exportPattern: /CHAPTER_08_ROUTE_NUMBER\s*=\s*(\d+)/,
    topic: 'light-bending',
  },
];

function collectStepDefinitionFiles(): string[] {
  const featuresDir = path.join(WORKSPACE_ROOT, 'libs/features');
  const results: string[] = [];

  for (const entry of fs.readdirSync(featuresDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith('chapter-')) {
      continue;
    }

    const stepsDir = path.join(featuresDir, entry.name, 'src/lib/steps');
    if (!fs.existsSync(stepsDir)) {
      continue;
    }

    for (const file of fs.readdirSync(stepsDir)) {
      if (file.endsWith('.ts') && !file.endsWith('.component.ts')) {
        results.push(path.join(stepsDir, file));
      }
    }
  }

  return results.sort();
}

function extractNarrateTexts(source: string): string[] {
  const texts: string[] = [];
  const textRegex = /text:\s*'((?:\\'|[^'])*)'/g;

  for (const match of source.matchAll(textRegex)) {
    texts.push(match[1].replace(/\\'/g, "'"));
  }

  return texts;
}

describe('chapter-route-map', () => {
  it('maps every topic slug to a unique route in 1..13', () => {
    const routes = Object.values(CHAPTER_ROUTE_BY_TOPIC);
    expect(routes).toHaveLength(13);
    expect(new Set(routes).size).toBe(13);
    for (const route of routes) {
      expect(route).toBeGreaterThanOrEqual(CHAPTER_MIN);
      expect(route).toBeLessThanOrEqual(CHAPTER_MAX);
    }
  });

  it('matches *_ROUTE_NUMBER exports in chapter step registries', () => {
    for (const { libDir, exportPattern, topic } of REGISTRY_ROUTE_CHECKS) {
      const registryPath = path.join(
        WORKSPACE_ROOT,
        'libs/features',
        libDir,
        'src/lib/step-registry.ts',
      );
      const source = fs.readFileSync(registryPath, 'utf8');
      const match = source.match(exportPattern);
      expect(match).not.toBeNull();
      if (!match) {
        continue;
      }
      expect(Number(match[1])).toBe(CHAPTER_ROUTE_BY_TOPIC[topic]);
    }
  });
});

describe('narration cross-references', () => {
  const stepFiles = collectStepDefinitionFiles();

  it('finds step definition files to scan', () => {
    expect(stepFiles.length).toBeGreaterThan(0);
  });

  it('uses only valid chapter route numbers in narrate text', () => {
    const violations: string[] = [];

    for (const filePath of stepFiles) {
      const relPath = path.relative(WORKSPACE_ROOT, filePath);

      for (const text of extractNarrateTexts(fs.readFileSync(filePath, 'utf8'))) {
        for (const match of text.matchAll(/Chapter\s+(\d+)/g)) {
          const chapterNum = Number(match[1]);
          if (chapterNum < CHAPTER_MIN || chapterNum > CHAPTER_MAX) {
            violations.push(
              `${relPath}: "Chapter ${chapterNum}" is outside ${CHAPTER_MIN}–${CHAPTER_MAX}: ${text}`,
            );
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('aligns topic-tagged chapter references with the route map', () => {
    const violations: string[] = [];

    for (const filePath of stepFiles) {
      const relPath = path.relative(WORKSPACE_ROOT, filePath);

      for (const text of extractNarrateTexts(fs.readFileSync(filePath, 'utf8'))) {
        for (const { regex, topic } of LINKED_CHAPTER_REFERENCES) {
          regex.lastIndex = 0;

          for (const match of text.matchAll(regex)) {
            const chapterNum = Number(match[1]);
            const expected = CHAPTER_ROUTE_BY_TOPIC[topic];

            if (chapterNum !== expected) {
              violations.push(
                `${relPath}: expected Chapter ${expected} for topic "${topic}" but found Chapter ${chapterNum}: ${text}`,
              );
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
