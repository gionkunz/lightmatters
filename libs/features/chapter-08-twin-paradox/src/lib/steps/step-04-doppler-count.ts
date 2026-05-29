import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_DOPPLER_COUNT: Step = {
  id: 'twin-doppler-count',
  title: 'Count the light',
  kicker: 'doppler-counting · pulses',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Want to *watch* the asymmetry happen? Have each twin flash a light pulse once a year and let the other count the flashes arriving.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Each pulse is a beam of light — a 45° line on the diagram. Going out, the gap between arrivals stretches (redshift); coming back, it compresses (blueshift).',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Here is the trick. $B$ sees $A$\'s flashes switch from slow to fast **exactly at the turnaround** — halfway through. $B$ spends half the trip seeing slow, half seeing fast.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'But $A$ keeps seeing $B$\'s flashes arrive slowly long **after** $B$ has turned — the "I turned around" light is still crossing the gap. $A$ only sees the fast flashes in the final stretch. More slow time, less fast time: $A$ counts fewer of $B$\'s years than $B$ counts of $A$\'s.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Count them up and the totals land exactly where the proper time said they would: $B$ aged 8 years, $A$ aged 10. The light delay on the return signal **is** the asymmetry, made visible.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
