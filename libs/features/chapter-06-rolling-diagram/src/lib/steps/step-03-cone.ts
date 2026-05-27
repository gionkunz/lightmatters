import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_CONE: Step = {
  id: 'bend-into-cone',
  title: 'Bend into a cone',
  kicker: 'flat → cylinder → cone',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'The cylinder can bend further. Pinch one end and you get a **cone** — the same diagram, rolled and tapered.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.curvature',
      from: 0,
      to: 1,
      duration: 2.5,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'The wide end is where gravity is **strong**. The point is where gravity is **weak**. Rim width encodes gravitational strength — Epstein\'s trick.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'We have not added a force yet. Only geometry.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
