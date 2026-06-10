import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_ASYMMETRY: Step = {
  id: 'twin-asymmetry',
  title: 'The corner breaks the tie',
  kicker: 'resolution · the turnaround',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'The two stories are not mirror images. $A$ never changes course — one straight worldline, one frame, the whole time. $B$ does something $A$ never does: **turns around**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That corner is the asymmetry. At the turnaround $B$ switches frames; $A$ stays in one. Only $B$ feels the change. So the "each sees the other slow" argument simply does not apply to $B$ across the whole trip.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Now measure the paths. The same geometry as the speed budget: every bit of motion through space is borrowed from motion through time, so a bent path banks **less** proper time than a straight one.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Stay-at-home $A$ logs the full **10 years**. Traveller $B$, at $0.6\\,c$, logs only **8**. The straight worldline wins. $B$ comes home genuinely **2 years younger** — no clock was broken, the paths were just different lengths through space and time.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And to be clear: it is not the acceleration that "causes" the ageing. The turnaround only marks which twin changed frames. The ageing is the geometry — the length of each path.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
