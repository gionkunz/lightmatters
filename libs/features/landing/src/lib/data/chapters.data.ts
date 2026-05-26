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

/** Chapters 1–5: flat spacetime (SR). Chapters 6–8: curved spacetime (GR). */
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
    title: 'Doppler and seeing motion',
    blurb: 'Compress the wavefronts and watch the clock change colour.',
    mini: 'doppler',
  },
  {
    n: 6,
    title: 'Rolling the diagram',
    blurb: 'Bend the paper into a cone. Gravity is the geometry, not a force.',
    mini: 'cone',
  },
  {
    n: 7,
    title: 'The center of the Earth',
    blurb:
      'A gravity well that bottoms out in weightlessness. Drop a particle and watch.',
    mini: 'well',
  },
  {
    n: 8,
    title: 'Light bending around mass',
    blurb: 'Two edges of a beam. Two paths. One synchronised arrival.',
    mini: 'bend',
  },
];
