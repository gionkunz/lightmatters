import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_LENGTH_CONTRACTION: Step = {
  id: 'length-contraction',
  title: 'Length contraction',
  kicker: 'length contraction',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'In Step 2 the clock moved **across** the photon path — sideways drift made the bounce diagonal and **stretched time**. Turn the same clock on its side: motion now runs **along** the line the photon travels.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'At rest, the photon crosses proper length $L_0$ each half-tick at $c$. The red dashed line is the path in the clock\'s own frame — straight across $L_0$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'clock.velocity',
      from: 0,
      to: 0.6,
      duration: 1.4,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Set the clock moving. The photon still travels at $c$ — but the far mirror slides **forward on the same axis**. While light crosses the gap, the target keeps running ahead.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'clock.showGhost',
      from: 0,
      to: 1,
      duration: 0.4,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'If the mirrors stayed $L_0$ apart in our frame, the photon would **miss**. Motion along the path does not stretch the tick the way Step 2 did — it steals **distance**. The grey ghost marks that impossible spacing.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Pull the mirrors to $L = L_0\\sqrt{1-v^2/c^2}$ and the bounce closes at $c$ again. Same $\\gamma$ as before — but on this axis it appears as **length**, not time. Perpendicular motion ate time; parallel motion eats length.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That is why cosmic-ray **muons** reach the ground: in our frame their path through the atmosphere is contracted *and* their clocks run slow — two faces of one correction.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
