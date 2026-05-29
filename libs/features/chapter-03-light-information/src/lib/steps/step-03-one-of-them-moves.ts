import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_ONE_OF_THEM_MOVES: Step = {
  id: 'one-of-them-moves',
  title: 'One of them moves',
  kicker: 'one of them moves',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Same scene — but now $B$ is moving toward $S$ at $0.4\\,c$ from the moment the flash leaves the source.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Watch the wavefront expand. Watch when each of them is reached.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
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
      text: '$B$ saw the flash earlier than $A$. Motion changed when the news arrived — not because the signal sped up or slowed down, but because $B$ moved into it.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Now: two flashes, one witness.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};

export const STEP_03_SCENE_DURATION = 0.85;
