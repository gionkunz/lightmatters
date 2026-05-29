import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_05_FALL_THROUGH: Step = {
  id: 'fall-through-earth',
  title: 'Fall through Earth',
  kicker: 'the tunnel, answered',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Back to the tunnel. Drop a particle into the smooth bulge — the same jump you imagined at the start, the same straight-line worldline you saw on the unrolled paper.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'surface.time',
      from: 0,
      to: 1,
      duration: 9,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'It spirals inward, crosses the **flat center** — weightless, but not trapped — and climbs the far side. Momentum carries you **through**, not into, the middle.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That is what the tunnel would feel like in this geometry. You fall toward the surface slopes, sail through the center, and rise on the other cone.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
