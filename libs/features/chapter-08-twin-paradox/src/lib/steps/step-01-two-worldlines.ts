import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_TWO_WORLDLINES: Step = {
  id: 'twin-two-worldlines',
  title: 'Two twins, two paths',
  kicker: 'setup · two worldlines',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Two twins, $A$ and $B$, start at the same place and time. $A$ stays home; $B$ rockets off at $0.6\\,c$, turns around, and flies back.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Draw it on the spacetime diagram — time running **up**, space across. $A$\'s path is a straight vertical line: standing still is still moving through time.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'twin.progress',
      from: 0,
      to: 1,
      duration: 4.5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: '$B$\'s path bends. Out to the right, then a sharp **corner** at the turnaround, then back to meet $A$ again. Same two endpoints, two very different routes.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'When they reunite, their watches disagree. The question is simple to ask and surprisingly deep: which twin is older?',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
