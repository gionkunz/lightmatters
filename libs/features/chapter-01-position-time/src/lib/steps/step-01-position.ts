import type { Step } from '@lm/engine';

export const STEP_01_POSITION: Step = {
  id: 'position-intro',
  title: 'What is position?',
  kicker: 'position',
  layout: 'intro',
  timeline: [
    {
      type: 'narrate',
      text: 'Before we talk about relativity, we need a place to stand. Position is simply where something is — a location on a line.',
    },
    {
      type: 'animate',
      target: 'diagram.position',
      from: 0,
      to: 0.5,
      duration: 1.2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Drag the slider. The point moves along the axis. That number is its position. Everything we build later starts here.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
