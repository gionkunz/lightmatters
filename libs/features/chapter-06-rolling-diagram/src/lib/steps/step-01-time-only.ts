import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_TIME_ONLY: Step = {
  id: 'time-only-recap',
  title: 'A point in time',
  kicker: 'a point in time',
  layout: 'intro',
  timeline: [
    {
      type: 'narrate',
      text: 'We return to the spacetime diagram — the same picture from Chapters 1 and 2. Time runs vertically. Space runs horizontally.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'A body **at rest in space** moves only through time. Its worldline is a vertical line — no sideways drift, just aging.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'diagram.time',
      from: 0,
      to: 0.85,
      duration: 4,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Watch the point climb. Pure time motion — the simplest worldline there is. In the next step, we roll this line into a circle.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
