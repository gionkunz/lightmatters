import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_MOVING_SOURCE: Step = {
  id: 'moving-source',
  title: 'The moving source',
  kicker: 'moving source',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Same scene — but $S$ is already moving rightward at $0.4\\,c$ when it flashes. The dot keeps moving; the pulse is born **where the source was** at that instant.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'If light needed a medium, the expanding circle would be dragged forward with the source — a faster forward edge, a slower trailing edge. Watch what actually happens.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 0.95,
      duration: 4.5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'The circle stays anchored at the **birth point** and expands at $c$ in all directions. The source sailed on, but the light did not inherit its velocity. Each photon is a self-propagating electromagnetic wave — oscillating fields that sustain each other — launched into spacetime at $c$, period.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That is why Michelson and Morley saw nothing: there is no ether to move through, and no way to "add" your speed to light.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
