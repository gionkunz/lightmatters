import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_05_OUTRO: Step = {
  id: 'chapter-04-outro',
  title: 'No medium needed',
  kicker: 'no medium needed',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Light does not need a substance to travel through. It propagates itself — electric and magnetic fields generating each other, wave after wave, always at $c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Chapter 3 showed that **when** news arrives depends on motion. This chapter showed two failed pictures — an ether wind we cannot detect, and light that does not inherit its source\'s speed. $c$ belongs to light itself, not to a medium or a parent body.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Next: what happens when a **moving source** sends not one flash but many? The spacing of those wavefronts is what we see as colour and rhythm — the **Doppler shift**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Compress the circles, watch the clock change colour. That is Chapter 7.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
