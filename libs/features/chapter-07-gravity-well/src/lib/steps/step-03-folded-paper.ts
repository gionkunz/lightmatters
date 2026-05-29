import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_FOLDED_PAPER: Step = {
  id: 'fall-on-folded-paper',
  title: 'Fall on folded paper',
  kicker: 'a worldline, a crease',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Five segments — two cylinders, two cones, a wide center. Drop a particle in. Watch it spiral inward, cross the weightless middle, and climb out the far side.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'surface.time',
      from: 0,
      to: 1,
      duration: 8,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Curved on the surface. But the cones and cylinders are made of **flat paper** — you can pick up scissors and unroll them.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'arrive', volume: 0.5 },
    {
      type: 'animate',
      target: 'surface.wellUnfold',
      from: 0,
      to: 1,
      duration: 3.5,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Look at the worldline now. **A straight line.** Free fall is what happens when a particle moves in the simplest possible way through spacetime — and the cones merely curl that straight line into orbit.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Gravity is not a force pulling you down. It is the **shape** of the paper.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
