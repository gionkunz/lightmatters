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
      text: '**Emission theory** says light inherits the source\'s velocity — the **dashed circle** is that guess: a wavefront dragged along with $S$, its leading edge racing ahead at $c + v$. Watch what actually happens.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
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
      text: 'The **solid** circle stays anchored at the **birth point** and expands at $c$ in all directions — while the dashed prediction sails off with the source and never matches reality. The light did not inherit the source\'s velocity. Each photon is a self-propagating electromagnetic wave — oscillating fields that sustain each other — launched into spacetime at $c$, period.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Light does not inherit its source\'s speed — that kills **emission theory**. $c$ is a property of light itself, not something you add your motion to. A later chapter will show that $c$ is the same in every frame; for now, remember: no inheritance.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
