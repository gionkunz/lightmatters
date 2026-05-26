import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_SOURCE_AT_REST: Step = {
  id: 'source-at-rest',
  title: 'Light at rest',
  kicker: 'source at rest',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Back to our spatial scene. A source $S$ at rest sends one flash. The wavefront expands outward at $c$ in every direction — the same picture from Chapter 3.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Watch the circle grow. No medium, no ripples in water — just a pulse born at a point in space and expanding at the one speed light knows.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 0.85,
      duration: 4,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Now the crucial question: what changes if the **source itself** is moving when it flashes?',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The ether picture says the wave should be dragged along. Reality says something else entirely.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
