import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_APPARENT_PARADOX: Step = {
  id: 'twin-apparent-paradox',
  title: 'The apparent paradox',
  kicker: 'paradox · who is slow?',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Here is what makes it a *paradox*. We learned that a moving clock runs slow. So $A$ watches $B$ race away and concludes: $B$\'s clock is the slow one.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'But motion is relative. From $B$\'s rocket, it is **$A$** who is moving. By the very same rule, $B$ concludes that $A$\'s clock is running slow.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'They cannot both be right when they meet and compare. Someone has to be younger. So the symmetry has to break somewhere — but where?',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
