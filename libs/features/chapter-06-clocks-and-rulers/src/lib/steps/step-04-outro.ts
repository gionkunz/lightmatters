import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_OUTRO: Step = {
  id: 'clocks-rulers-outro',
  title: 'Two faces of one geometry',
  kicker: 'outro',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'The light clock gave us time dilation: a longer diagonal path at $c$ means fewer ticks per second.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Length contraction is the same geometry seen from another angle — space and time adjust together so that everyone measures the same speed of light.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Neither effect is a glitch in the instruments. They are how flat space and time reconcile a single invariant speed.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Next: what you **see** when a source moves toward or away — the Doppler shift and the colour of a moving clock.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
