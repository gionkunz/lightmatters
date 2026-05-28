import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_05_TIME_DILATION: Step = {
  id: 'time-dilation',
  title: 'Time runs slower inside',
  kicker: 'gravitational clocks',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'A clock placed near the mass ticks **more slowly** than one far away. Same lesson as the speed budget in Chapter 2 — only this time it is **gravity** stealing time from space.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'So along the **inner** edge of the beam, less subjective time passes per metre of travel. Along the **outer** edge, time runs nearly as fast as a far-away clock.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Two edges. Two clocks. One running slow — a **clock contribution** to what comes next, not the whole story by itself. Hold that picture; next we let the band move and watch what happens.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
