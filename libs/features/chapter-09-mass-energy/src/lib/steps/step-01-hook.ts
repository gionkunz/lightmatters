import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_HOOK: Step = {
  id: 'mass-energy-hook',
  title: 'The equation you already half-know',
  kicker: 'hook · the famous equation',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Everyone knows one equation from physics, even if they know nothing else: $E = mc^2$. Mass times the speed of light, squared, equals energy.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'It looks like it belongs to a different story — bombs, reactors, stars — not to the patient geometry of spacetime we have been drawing all along.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'But it is not a new law bolted on at the end. It has been hiding inside the **speed budget** since Chapter 3, waiting for us to read it the right way.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'In this chapter we earn $E = mc^2$ — not by memorising it, but by watching it fall out of what we already understand.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
