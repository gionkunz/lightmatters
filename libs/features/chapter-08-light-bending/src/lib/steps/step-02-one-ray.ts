import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_ONE_RAY: Step = {
  id: 'one-ray',
  title: 'One ray',
  kicker: 'visible deflection',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'One ray of light — a single line approaching the star.',
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
      text: 'It does not cut straight through. Gravity **curves** the path — a slight bend around the mass.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
