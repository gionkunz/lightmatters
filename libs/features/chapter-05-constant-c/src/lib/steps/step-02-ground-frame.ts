import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_GROUND_FRAME: Step = {
  id: 'constant-c-ground-frame',
  title: 'The flash in the ground frame',
  kicker: 'ground frame · A at rest',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'At the moment of the flash, $A$ and $B$ are at the same place. $A$ stays put; $B$ glides to the right at $0.5\\,c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 0.95,
      duration: 4,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'In $A$\'s frame the wavefront is a circle centred on the **emission point** — the spot where the flash happened, which never moves. $A$ sits dead centre.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'But look at $B$. By the time the light has spread, $B$ has drifted off-centre. The wall of light is closer behind them and farther ahead.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'So $B$ should clock the light as slow in front and fast behind — a different speed in different directions. If that were the end of the story, $c$ would **not** be the same for everyone. Hold that thought.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
