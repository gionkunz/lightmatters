import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_OUTRO: Step = {
  id: 'constant-c-outro',
  title: 'The rock everything rests on',
  kicker: 'c-invariance · the foundation',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'One stubborn fact — every observer measures light at the same $c$ — and the whole of special relativity tumbles out of it.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Time dilation, length contraction, the relativity of simultaneity: none of them are separate rules to memorise. They are the price the universe pays to keep that one speed fixed for everyone.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'We have argued it with expanding spheres. Next we make it concrete: a clock built from a single bouncing photon, where the slowing of time is something you can literally watch and measure.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
