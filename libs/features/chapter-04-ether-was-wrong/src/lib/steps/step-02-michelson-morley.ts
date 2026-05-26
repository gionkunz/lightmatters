import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_MICHELSON_MORLEY: Step = {
  id: 'michelson-morley',
  title: 'Michelson–Morley',
  kicker: 'michelson–morley',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Michelson and Morley split a beam of light into two paths — one along Earth\'s motion through the ether, one across it — then recombined them. If Earth ploughs through a stationary ether, the two arms should take **different times**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Different times mean **interference fringes** — bright and dark bands where the waves add or cancel. Shift the apparatus and the fringes should slide. That was the expected signal.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'They saw **nothing**. Rotate the table, repeat at different seasons — the fringes stayed put. No ether wind. No detectable motion through any medium at all.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'So if there is no medium, how does light travel? And why is its speed always $c$?',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
