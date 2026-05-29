export type DiagramVariant =
  | 'single'
  | 'axes'
  | 'pair'
  | 'cone'
  | 'well'
  | 'wavefront'
  | 'doppler'
  | 'bend';

export interface ChapterPreview {
  readonly n: number;
  readonly title: string;
  readonly blurb: string;
  readonly mini: DiagramVariant;
}

/** Chapters 1–9: flat spacetime (SR). Chapters 10–12: curved spacetime (GR). */
export const CHAPTERS: readonly ChapterPreview[] = [
  {
    n: 1,
    title: 'Position, time, spacetime',
    blurb:
      'A point on an axis. Time on another. The diagram everything else lives on.',
    mini: 'axes',
  },
  {
    n: 2,
    title: 'The speed budget',
    blurb: 'You move through spacetime at c — always. Choose how to spend it.',
    mini: 'pair',
  },
  {
    n: 3,
    title: 'Light and information',
    blurb:
      'Wavefronts and observers. Why simultaneity is in the eye of the beholder.',
    mini: 'wavefront',
  },
  {
    n: 4,
    title: 'The ether was wrong',
    blurb:
      'Light does not inherit the motion of its source. Why c is the same for everyone.',
    mini: 'doppler',
  },
  {
    n: 5,
    title: 'The same speed of light',
    blurb: 'Every observer measures the same c — the postulate made visible.',
    mini: 'wavefront',
  },
  {
    n: 6,
    title: 'Clocks & rulers',
    blurb: 'Moving clocks tick slowly. Moving rulers shrink. Same geometry, two lessons.',
    mini: 'pair',
  },
  {
    n: 7,
    title: 'Doppler and seeing motion',
    blurb: 'Compress the wavefronts and watch the clock change colour.',
    mini: 'doppler',
  },
  {
    n: 8,
    title: 'The twin paradox',
    blurb: 'Two paths through spacetime. Two elapsed times. One reunion.',
    mini: 'pair',
  },
  {
    n: 9,
    title: 'Mass is energy (E=mc²)',
    blurb: 'Rest mass is bottled spacetime motion — energy you can release.',
    mini: 'single',
  },
  {
    n: 10,
    title: 'Rolling the diagram',
    blurb: 'Bend the paper into a cone. Gravity is the geometry, not a force.',
    mini: 'cone',
  },
  {
    n: 11,
    title: 'The center of the Earth',
    blurb:
      'A gravity well that bottoms out in weightlessness. Drop a particle and watch.',
    mini: 'well',
  },
  {
    n: 12,
    title: 'Light bending around mass',
    blurb: 'Two edges of a beam. Two paths. One synchronised arrival.',
    mini: 'bend',
  },
];

/** Authored chapter numbers with live routes. */
const AUTHORED_CHAPTER_NUMBERS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12]);

/** First-step URL when a chapter route exists; `null` for not yet authored. */
export function chapterFirstStepHref(chapterNumber: number): string | null {
  if (!AUTHORED_CHAPTER_NUMBERS.has(chapterNumber)) {
    return null;
  }
  return `/chapter/${chapterNumber}/step/1`;
}
