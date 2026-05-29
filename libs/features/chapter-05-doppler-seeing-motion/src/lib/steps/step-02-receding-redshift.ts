import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_RECEDING_REDSHIFT: Step = {
  id: 'receding-redshift',
  title: 'Receding — redshift',
  kicker: 'receding · redshift',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Same pulse rhythm — but now the source $S$ is moving **away** from $A$ at $0.5\\,c$ while it flashes.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Watch the rings. Each is born at $c$, but the gaps between arrivals at $A$ grow wider — partly because $S$\'s clock runs slow (Chapter 2), partly because each pulse has farther to travel. $A$ hears the clock run **slow**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 3.5,
      duration: 5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'This is **redshift** — not yet about colour, but about **rhythm**. Fewer ticks per second than the source emits. The wavefronts are spaced out.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Run the film backward: what if $S$ comes toward $A$?',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
