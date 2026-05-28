import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_THE_ETHER: Step = {
  id: 'the-ether',
  title: 'The ether',
  kicker: 'the ether',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Sound needs air. Throw a stone in a pond and the ripples need water. For centuries, physicists assumed light worked the same way — it had to travel **through something**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'They called it the **luminiferous ether**: an invisible, all-pervading medium that carried light the way air carries sound. Earth moves through it; stars shine into it; every beam of light is a wave *in the ether*.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'If Earth moves through a stationary ether, we should feel an **ether wind** — and light should travel at $c$ relative to that medium, not relative to us. We will test both ideas.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'First: feel what moving through the ether would mean — then the experiment that tried to catch Earth in the act.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
