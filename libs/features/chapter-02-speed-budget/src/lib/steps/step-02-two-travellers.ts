import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 7000;

export const STEP_02_TWO_TRAVELLERS: Step = {
  id: 'two-travellers',
  title: 'Two travellers',
  kicker: 'two travellers',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Imagine two people who agree to travel for exactly one year — each in their own way.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'One stays on Earth, moving through space as slowly as we ever do — almost all motion through time.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The other launches at half the speed of light — still moving through time, but a significant share of $c$ goes to space.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'tilt', volume: 0.55 },
    {
      type: 'animate',
      target: 'diagram.velocityB',
      from: 0,
      to: 0.5,
      duration: 1.4,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'After one year passes on Earth, how much time has the traveller experienced? Watch the vectors — the geometry tells you.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: "Drag the traveller's slider. See how spending more of the budget on space steals from time.",
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
