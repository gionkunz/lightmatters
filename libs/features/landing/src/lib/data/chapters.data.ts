export type DiagramVariant =
  | 'single'
  | 'axes'
  | 'pair'
  | 'cone'
  | 'well'
  | 'wavefront'
  | 'doppler'
  | 'bend'
  | 'vector'
  | 'source'
  | 'contraction'
  | 'twin'
  | 'emwave';

export interface ChapterPreview {
  readonly n: number;
  readonly title: string;
  readonly blurb: string;
  readonly mini: DiagramVariant;
  /** Approximate minutes to work through the chapter (~1.5 min per step). */
  readonly minutes: number;
}

/** Chapters 1–10: flat spacetime (SR). Chapters 11–13: curved spacetime (GR). */
export const CHAPTERS: readonly ChapterPreview[] = [
  {
    n: 1,
    title: 'Position, time, spacetime',
    blurb:
      'A point on an axis. Time on another. The diagram everything else lives on.',
    mini: 'axes',
    minutes: 6,
  },
  {
    n: 2,
    title: 'The speed of light',
    blurb:
      'How fast is c? The limit of causality. What light is — and two ways to measure it.',
    mini: 'emwave',
    minutes: 12,
  },
  {
    n: 3,
    title: 'The speed budget',
    blurb: 'You move through spacetime at c — always. Choose how to spend it.',
    mini: 'vector',
    minutes: 5,
  },
  {
    n: 4,
    title: 'Light and information',
    blurb:
      'Wavefronts and observers. Why simultaneity is in the eye of the beholder.',
    mini: 'wavefront',
    minutes: 8,
  },
  {
    n: 5,
    title: 'The ether was wrong',
    blurb:
      'Light does not inherit the motion of its source. Why c is the same for everyone.',
    mini: 'source',
    minutes: 8,
  },
  {
    n: 6,
    title: 'The same speed of light',
    blurb: 'Every observer measures the same c — the postulate made visible.',
    mini: 'wavefront',
    minutes: 7,
  },
  {
    n: 7,
    title: 'Clocks & rulers',
    blurb: 'Moving clocks tick slowly. Moving rulers shrink. Same geometry, two lessons.',
    mini: 'contraction',
    minutes: 6,
  },
  {
    n: 8,
    title: 'Doppler and seeing motion',
    blurb: 'Compress the wavefronts and watch the clock change colour.',
    mini: 'doppler',
    minutes: 8,
  },
  {
    n: 9,
    title: 'The twin paradox',
    blurb: 'Two paths through spacetime. Two elapsed times. One reunion.',
    mini: 'twin',
    minutes: 8,
  },
  {
    n: 10,
    title: 'Mass is energy (E=mc²)',
    blurb: 'Rest mass is bottled spacetime motion — energy you can release.',
    mini: 'single',
    minutes: 9,
  },
  {
    n: 11,
    title: 'Rolling the diagram',
    blurb: 'Bend the paper into a cone. Gravity is the geometry, not a force.',
    mini: 'cone',
    minutes: 6,
  },
  {
    n: 12,
    title: 'The center of the Earth',
    blurb:
      'A gravity well that bottoms out in weightlessness. Drop a particle and watch.',
    mini: 'well',
    minutes: 9,
  },
  {
    n: 13,
    title: 'Light bending around mass',
    blurb: 'Two edges of a beam. Two paths. One synchronised arrival.',
    mini: 'bend',
    minutes: 10,
  },
];

/** Total approximate minutes across every chapter. */
export const TOTAL_CHAPTER_MINUTES = CHAPTERS.reduce(
  (sum, chapter) => sum + chapter.minutes,
  0,
);

/** Number of chapters in the journey. */
export const CHAPTER_COUNT = CHAPTERS.length;

/** Authored chapter numbers with live routes. */
const AUTHORED_CHAPTER_NUMBERS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
]);

/** First-step URL when a chapter route exists; `null` for not yet authored. */
export function chapterFirstStepHref(chapterNumber: number): string | null {
  if (!AUTHORED_CHAPTER_NUMBERS.has(chapterNumber)) {
    return null;
  }
  return `/chapter/${chapterNumber}/step/1`;
}
