import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_CYLINDER: Step = {
  id: 'roll-the-paper',
  title: 'Roll the paper',
  kicker: 'roll the paper',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'The same vertical worldline — but now we **roll the paper** around the time axis. Time bends into a circle around the tube; space stays straight along the cylinder.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.fold',
      from: 0,
      to: 1,
      duration: 2.5,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: '**x** runs along the cylinder — up and down its length. **t** wraps around the rim. The dot that climbed vertically now orbits: one lap, one unit of time.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.time',
      from: 0,
      to: 1,
      duration: 5.5,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'It leaves a trace behind — a fading memory of where it has been. Same worldline, new geometry.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
