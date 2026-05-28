import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_WIDEN_BEAM: Step = {
  id: 'widen-beam',
  title: 'Widen the beam',
  kicker: 'no skew',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Real light arrives as a **beam** — two parallel edges, inner and outer. Light cannot **skew**: the band stays a band, never a parallelogram.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'bend.progress',
      from: 0,
      to: 1,
      duration: 8,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Both edges bend **together**. The whole beam curves as one rigid strip — still parallel at the ends.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
