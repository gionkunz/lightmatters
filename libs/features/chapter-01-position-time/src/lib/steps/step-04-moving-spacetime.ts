import type { Step } from '@lm/engine';

export const STEP_04_MOVING_SPACETIME: Step = {
  id: 'moving-spacetime',
  title: 'Moving in space and time',
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
    { type: 'sound', sound: 'tilt', volume: 0.55 },
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
      text: 'It all works like a **budget** — everything moves at $c$, split between space and time. Drag the slider and watch the vector tilt. Chapter 3 will unpack what that budget really means.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
