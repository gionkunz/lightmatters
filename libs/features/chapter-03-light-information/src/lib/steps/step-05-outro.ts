import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_05_OUTRO: Step = {
  id: 'chapter-03-outro',
  title: 'What we just learned',
  kicker: 'what we just learned',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'In Chapter 3 we saw that motion through space steals from time on each clock. Here we saw the consequence: when news arrives — and even **whether two things were simultaneous** — depends on who is moving.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'We have not yet asked: does the source\'s motion change the speed of its light? (No — and Chapter 5 explains why the old idea of an "ether" had to go.)',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Nor have we touched colour and rhythm — the **Doppler shift** that makes a moving source sound, and look, different. That is Chapter 8, along with the way starlight tilts forward when you accelerate.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'For now: light carries information at $c$, in space, and what counts as "now" is not the same for everyone. Onward.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
