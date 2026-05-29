import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_05_OUTRO: Step = {
  id: 'twin-outro',
  title: 'Straightest is oldest',
  kicker: 'outro · path-dependent time',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'The twin paradox was never really a paradox. It is the deepest lesson of flat spacetime: **proper time is the length of your path through it.**',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And unlike ordinary distance, the **straight** path is the **longest** in time. Move through space and you spend your speed budget; the twin who never veers ages the most. Straightest is oldest.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That single idea — clocks measure path length — is the doorway out of flat spacetime. Next we let gravity bend the paths themselves, and the same rule keeps working.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
