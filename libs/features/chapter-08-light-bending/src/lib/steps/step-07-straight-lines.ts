import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_07_STRAIGHT_LINES: Step = {
  id: 'straight-lines',
  title: 'Straight lines, curved canvas',
  kicker: 'no force on light',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'There is no **force** on light. Each ray follows the **straightest line the geometry allows** — a geodesic.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Epstein\'s trick: take a flat sheet of paper, glue a paper **cone** onto it where the mass sits. Draw a straight line across the cone. Look at it from above and the line **looks bent** — but on the cone itself it never turned.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Slide the **mass**. The cone gets steeper, the top-down view bends harder. The line never moves on the flat plane — only the geometry between the source and you changes.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Watch what "straight" really means: we **unfold** the cone back to a flat sector. The geodesic becomes one straight chord. The bend was never in the line; it was always in the page.',
      pauseAfter: 1200,
    },
    {
      type: 'animate',
      target: 'bump.unfold',
      from: 0,
      to: 1,
      duration: 2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'The clocks alone would bend light by only **half** the measured amount. Einstein\'s full picture also curves **space** itself — both halves together. We will go deeper into that geometry later.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Bent light is geometry, not a pull. From here it is a short walk to black holes — same picture, just a steeper bump.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
