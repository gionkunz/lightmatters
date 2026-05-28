import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_MOVING_CLOCK: Step = {
  id: 'moving-clock',
  title: 'A moving clock runs slow',
  kicker: 'time dilation',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Set the clock moving. In your frame the mirrors drift sideways while the photon shuttles between them — the path becomes a **longer diagonal**, still at $c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'clock.velocity',
      from: 0,
      to: 0.6,
      duration: 1.4,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Longer path at the same speed means each tick takes **more time**. The moving clock runs slow — not because anything is wrong with the clock, but because light insists on $c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'This is the concrete mechanism behind the Chapter 2 speed budget: motion through space steals from motion through time. The tick readout shows the Lorentz factor directly.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Drag $v/c$ and compare the rest tick period to the dilated one. At $0.6c$, each tick takes $25\\%$ longer.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
