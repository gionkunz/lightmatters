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
      text: 'Chapter 3 showed that **when** news arrives depends on motion. This chapter showed that **how fast** it travels does not — not for the source, not for the observer. $c$ is the same for everyone because that is how light is born.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Next: what happens when a **moving source** sends not one flash but many? The spacing of those wavefronts is what we see as colour and rhythm — the **Doppler shift**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Compress the circles, watch the clock change colour. That is Chapter 5.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
