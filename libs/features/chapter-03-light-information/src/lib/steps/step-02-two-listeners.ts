import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_TWO_LISTENERS: Step = {
  id: 'two-listeners',
  title: 'Two observers',
  kicker: 'two observers',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Same source, two observers. $A$ sits to the left and $B$ to the right — equally far from $S$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'When does each of them see the flash?',
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
      text: 'At the same instant. Equal distance, equal travel time — symmetry does the work.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'What changes if one of them is moving?',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};

export const STEP_02_SCENE_DURATION = 0.85;
