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
      text: 'The spacetime diagram, **laid flat**. **Space** runs up the left edge; **time** runs along the bottom. A body at rest in space sits at one place in space and moves only through time — a line **parallel** to the time axis, slightly offset so we can see it.',
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
      text: 'Now **roll the sheet** into a tube. The same straight worldline wraps into a circle around the rim — one lap for each unit of time.',
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
      type: 'animate',
      target: 'surface.time',
      from: 0.85,
      to: 1.85,
      duration: 5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Watch it orbit again — a full second turn around the time axis. Same motion, new geometry. Next we **pinch** this tube into a cone.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
