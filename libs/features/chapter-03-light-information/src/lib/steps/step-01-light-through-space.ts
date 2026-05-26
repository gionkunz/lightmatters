import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_LIGHT_THROUGH_SPACE: Step = {
  id: 'light-through-space',
  title: 'Light through space',
  kicker: 'light through space',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'New camera. The spacetime diagram is gone — both axes here are **space**, and we are looking down on it from above. Time is now the animation, not a line on the page.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'A single source $S$ sends one flash. The wavefront expands outward at the speed of light, the same speed in every direction.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 0.85,
      duration: 4,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'It reaches observer $A$. Information crossed the gap from $S$ to $A$ at $c$ — and that is exactly as fast as news can travel.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Now let us add a second listener.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};

export const STEP_01_SCENE_DURATION = 0.85;
