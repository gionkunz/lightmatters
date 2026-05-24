import type { Step } from '@lm/engine';

export const STEP_04_MOVING_SPACETIME: Step = {
  id: 'moving-spacetime',
  title: 'Moving in spacetime',
  kicker: 'the speed budget',
  layout: 'intro',
  timeline: [
    {
      type: 'narrate',
      text: 'Did you know you are traveling at the speed of light right now? Maybe not the way you imagine it.',
    },
    {
      type: 'narrate',
      text: 'When you are at rest — and relativistically, almost everything around you is too — you are moving through time at nearly the full speed of light. Through space, barely at all.',
    },
    {
      type: 'animate',
      target: 'diagram.velocity',
      from: 0,
      to: 0.15,
      duration: 1.2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Spacetime works like a budget. Everything in the universe moves at $c$. You can spend it on motion through space, or motion through time — but the total is always the same.',
    },
    {
      type: 'narrate',
      text: 'Drag the slider. Watch the vector tilt. More through space means less through time — and vice versa.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
