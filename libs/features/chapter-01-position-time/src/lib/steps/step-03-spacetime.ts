import type { Step } from '@lm/engine';

export const STEP_03_SPACETIME: Step = {
  id: 'spacetime-intro',
  title: 'The spacetime diagram',
  kicker: 'a worldline',
  layout: 'intro',
  timeline: [
    {
      type: 'narrate',
      text: 'Position and time are not separate ideas — they are two axes of the same diagram. Every object traces a line through it.',
    },
    { type: 'sound', sound: 'soft', volume: 0.4 },
    {
      type: 'animate',
      target: 'diagram.position',
      from: 0,
      to: 0.4,
      duration: 1.2,
      easing: 'ease-out',
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
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
      text: 'We call those lines worldlines. Drag the sliders. The point moves through spacetime, and the line from the origin is its worldline so far.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
