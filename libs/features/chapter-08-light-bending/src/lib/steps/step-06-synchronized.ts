import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_06_SYNCHRONIZED: Step = {
  id: 'synchronized-arrival',
  title: 'The wavefront stays square',
  kicker: 'no light may skew',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Recall the rule from Chapter 3: **a wavefront is always perpendicular to its direction of travel.** Light cannot move obliquely — wavelets are circles, never ellipses.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'bend.progress',
      from: 0,
      to: 1,
      duration: 8,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'If the inner edge moved at the **same speed** as the outer, it would arrive **first** — the band would skew. Forbidden.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The only way out: the inner edge\'s **clock runs slow**. Less proper time per metre, so the inner edge falls behind in the right amount to keep the band square. Gravitational time dilation is what **buys a square wavefront** — one essential piece of why light bends at all.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
