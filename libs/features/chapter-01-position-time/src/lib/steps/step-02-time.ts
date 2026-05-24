import type { Step } from '@lm/engine';

export const STEP_02_TIME: Step = {
  id: 'time-intro',
  title: 'What is time?',
  kicker: 'time',
  layout: 'intro',
  timeline: [
    {
      type: 'narrate',
      text: 'Position tells us where something is. Time tells us when. It is another axis — not a clock on the wall, but a dimension things move through.',
    },
    {
      type: 'animate',
      target: 'diagram.time',
      from: 0,
      to: 0.5,
      duration: 1.2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Drag the slider. The point climbs the axis. That is time passing. In the next step, we put both axes together.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
