import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_EXTREME_RECESSION: Step = {
  id: 'extreme-recession',
  title: 'Almost frozen',
  kicker: 'extreme recession',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Same pulsing source — now receding at $0.9\\,c$. Still emitting at the same rhythm in its own frame. What does $A$ hear?',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Watch how rarely a ring reaches $A$. At high recession, the clock nearly **stops** — one long gap between ticks, then another.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 6.5,
      duration: 6,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Push to $0.999\\,c$ and the last wavefront you will ever receive can take the rest of your life to arrive. Doppler shift, time dilation, and what moving sources **look** like — all the same spacing of wavefronts.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Flat space and time has one more trick: bend the diagram.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
