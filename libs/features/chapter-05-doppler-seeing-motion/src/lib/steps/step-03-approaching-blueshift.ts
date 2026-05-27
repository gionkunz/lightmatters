import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_APPROACHING_BLUESHIFT: Step = {
  id: 'approaching-blueshift',
  title: 'Approaching — blueshift',
  kicker: 'approaching · blueshift',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Same pulse rate from $S$ — but now $S$ drifts **toward** $A$ at $0.5\\,c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The wavefronts pile up. $A$ hears ticks arriving closer together — the clock sounds **fast**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 1.75,
      duration: 4.5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'This is **blueshift** — again, rhythm first. More ticks per second than the source emits. Compressed wavefronts in space become compressed ticks in time.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Push the recession to the extreme.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
