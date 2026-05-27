import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_GEODESICS: Step = {
  id: 'gravity-as-geometry',
  title: 'Gravity as geometry',
  kicker: 'gravity, geometrically',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Draw a **straight line** on the cone — as straight as the surface allows. That is a geodesic: the natural path through curved spacetime.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.time',
      from: 0,
      to: 1,
      duration: 10,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'On the cone the path looks curved — a spiral. But cut along the seam and **unroll** the cone, and the same path is a perfectly straight line.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.unfold',
      from: 0,
      to: 1,
      duration: 3,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Straight on the surface, curved in space. That is gravity — not a force pulling inward, just the shape of spacetime decides.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
