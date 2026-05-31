import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

/** Scene-time the wavefront sweep runs (detector sits at scene distance 1.7). */
export const STEP_04_SCENE_DURATION = 1.85;

export const STEP_04_MEASURE_C: Step = {
  id: 'measuring-c-by-hand',
  title: 'Measuring c by hand',
  kicker: 'measuring $c$ · by hand',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'How do you measure a speed? The same way you always have: a known distance, a clock, and a flash to time.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Set up two stations exactly **1 kilometre** apart. The emitter on the left fires a pulse; the detector on the right starts its clock the instant the light arrives.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: STEP_04_SCENE_DURATION,
      duration: 4.5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Caught it. The flight took only a few millionths of a second — far too quick for a stopwatch, but modern electronics read it easily.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Divide and you have the speed: $c = d / t$. One kilometre over that tiny interval lands right where every measurement lands — about 300,000 km/s.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'No assumptions, no theory — just a ruler and a clock. The number is real, and it is the same for everyone who tries it.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
