import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_05_OUTRO: Step = {
  id: 'chapter-05-outro',
  title: 'Rhythm is colour',
  kicker: 'rhythm is colour',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'We separated rhythm from colour on purpose. In reality, compress the wavefronts and the light shifts blue; stretch them and it shifts red. Your eye and ear both count the ticks.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Chapter 2 told you moving clocks run slow. This chapter showed **why** a distant observer hears that slowness — the source\'s proper rhythm is γ-stretched in scene time, **and** the pulses travel farther between ticks.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Next we leave flat spacetime. We roll the diagram, bend it into a cone, and gravity becomes geometry. Chapter 6 awaits.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
