import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_RECALL: Step = {
  id: 'constant-c-recall',
  title: 'A promise to keep',
  kicker: 'recall · the postulate',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'A few chapters ago we made a bold claim and then walked away from it: light does not inherit the motion of its source. Every flash leaves at exactly $c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'But we only ever showed it from the **outside**, watching a single still observer. We never asked the harder question.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 0.85,
      duration: 2.6,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Here is one flash, born at a single point, spreading outward at $c$. The observer $A$ who is standing right there sees it expand as a perfect circle centred on themselves.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Now suppose a second observer goes flying past at the very instant of the flash. Surely **they** must measure the light running faster one way and slower the other? That is what we are here to settle.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
