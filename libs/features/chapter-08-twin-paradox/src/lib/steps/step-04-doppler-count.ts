import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_DOPPLER_COUNT: Step = {
  id: 'twin-doppler-count',
  title: 'Count the light',
  kicker: 'doppler-counting · flashes',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'There is another way to feel the asymmetry: have each twin flash a light once a year and let the other simply **count** the flashes that arrive.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'While the twins are separating, each flash has farther to travel than the last, so arrivals come **slowly** (redshift). While they are closing again, arrivals **bunch up** (blueshift). Counting is just adding up the slow stretch and the fast stretch.',
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
      text: 'Each twin counts exactly the years the other has lived. Drag the traveller\'s speed and watch the totals move together — at $0.6\\,c$ the split lands near eight years versus ten, but you can discover the numbers yourself.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And it lines up with the diagram: the flash counts are nothing but the lengths of the two paths through proper time.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
