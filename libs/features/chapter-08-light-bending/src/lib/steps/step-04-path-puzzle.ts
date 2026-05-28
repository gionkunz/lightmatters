import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_PATH_PUZZLE: Step = {
  id: 'path-puzzle',
  title: 'The path puzzle',
  kicker: 'two paths',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Measure the paths. The **outer** edge sweeps a **longer** arc than the **inner** edge — it swings wider around the star.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'So how can both edges arrive at the same target **together**? The outer edge would have to move **faster** than *c* — and that is forbidden.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Something else must be going on. Hold that puzzle — we have not answered it yet.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
