import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_CAUSAL_LIMIT: Step = {
  id: 'cosmic-speed-limit',
  title: 'The cosmic speed limit',
  kicker: 'the cosmic · speed limit',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Back to the diagram you will live in for the rest of this journey — Epstein\'s **speed budget**. Time up, space sideways. Every object gets exactly one length of $c$, no more.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The arc is a fence. You can aim your budget anywhere **on** the circle — more through time, more through space — but the tip cannot swing past it.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'tilt', volume: 0.45 },
    {
      type: 'animate',
      target: 'diagram.velocity',
      from: 0.15,
      to: 0.72,
      duration: 1.4,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Everyday motion stays well inside the arc. To outrun your own light you would need a vector **longer** than $c$ — pointing outside the circle. Nothing does.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'tilt', volume: 0.45 },
    {
      type: 'animate',
      target: 'diagram.velocity',
      from: 0.72,
      to: 1,
      duration: 1.2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Light itself sits on the rim — all budget through space, none through time. That direction is the fastest anything can move through space and time.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And $c$ is not just a speed limit for bright things. It is the top speed of **information** — the fastest any influence can travel from here to there.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Nothing outruns the arc. No message, no push, no warning. That single rule is the backbone of cause and effect.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
