import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_LIGHT_CLOCK_AT_REST: Step = {
  id: 'light-clock-at-rest',
  title: 'The light clock',
  kicker: 'the light clock',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Here is the simplest clock imaginable: two mirrors facing each other, and a photon bouncing between them. Each round trip — up and back down — is **one tick**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The photon always travels at $c$. At rest, the path is straight up and down — as short as it can be.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'clock.progress',
      from: 0,
      to: 1,
      duration: 2.4,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Watch one full tick. This is what "one second" means for this clock — one complete bounce at the speed of light.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Now ask what happens when the whole clock starts moving.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
