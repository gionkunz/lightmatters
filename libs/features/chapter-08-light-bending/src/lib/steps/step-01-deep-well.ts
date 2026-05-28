import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_DEEP_WELL: Step = {
  id: 'deep-well',
  title: 'The deep well',
  kicker: 'extreme gravity',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Around **Earth**, light barely bends — the well is too shallow. But gravity **always** curves geometry, and light always follows it.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Imagine a **massive star**: a heavy circle in space. Send light past it and the deflection is finally **visible**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'We will use the same **Epstein bulge** you met in Chapter 11 — but first, this plain side view: mass in the middle, light skimming past.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
