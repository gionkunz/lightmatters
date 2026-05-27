import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_TIME_ONLY: Step = {
  id: 'time-only-unroll',
  title: 'A point in time',
  kicker: 'laid flat, then rolled',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'The spacetime diagram, **laid flat**. **Space** runs up the left edge; **time** runs along the bottom. A body at rest in space moves only through time — a straight line parallel to the time axis.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.time',
      from: 0,
      to: 0.85,
      duration: 4,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Now **roll the sheet** into a tube — the reverse of unrolling. The same straight worldline becomes a circle around the rim: one lap, one unit of time.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.unfold',
      from: 1,
      to: 0,
      duration: 3,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Same motion, new geometry. Next we meet the classic Epstein strip and roll it the other way — from a vertical worldline into the same cylinder.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
