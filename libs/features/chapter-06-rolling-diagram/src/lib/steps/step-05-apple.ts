import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_05_APPLE: Step = {
  id: 'newtons-apple',
  title: "Newton's apple",
  kicker: 'the same fall',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'A tree on the wide rim — where gravity is strongest. Its roots grip the big opening; the stem grows along space, toward the narrow end.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Project the **same tree** further around the cone — the same shape, but farther along **proper time**. Not a second tree: one tree, two moments.',
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
      text: 'Release the apple. Its worldline is a **geodesic**, curving across the cone when rolled up. It lands at the foot of that **same tree**, projected forward in proper time.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Cut along the seam and **unroll** the cone. The same fall is a perfectly straight line — gravity is the geometry, not the apple.',
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
      text: 'Next we compose the full gravity well — cylinder, cone, and the weightless center of the Earth. Chapter 11 awaits.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
