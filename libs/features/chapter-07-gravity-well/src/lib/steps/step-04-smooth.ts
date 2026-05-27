import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_SMOOTH: Step = {
  id: 'smooth-the-shape',
  title: 'Smooth the shape',
  kicker: 'one continuous bulge',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'The folded paper made the truth clear: free fall is a **straight line** when you let the geometry curl. Now smooth those four creases into one continuous **bulge**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.wellMorph',
      from: 0,
      to: 1,
      duration: 4,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: '**Wide** at the center where Earth sits, **narrow** in outer space. The weightless middle is still there — the geometry just flows. The smooth bulge can\'t lay perfectly flat, but the straight-line truth from the folded paper still holds.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
