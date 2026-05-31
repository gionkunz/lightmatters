import type { Step } from '@lm/engine';
import { STEP_03_RECEPTION_SCENE_TIME } from './step-03-layout';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_NO_TIME: Step = {
  id: 'light-has-no-time',
  title: 'Light has no time',
  kicker: 'light has · no time',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'On a dark night you can see the **Andromeda galaxy** — M31 — as a faint smear. It is about **2.5 million light-years** away.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The photons landing on your retina tonight left Andromeda long before humans existed. The light you see is **millions of years old** — that travel time is real for you.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'soft', volume: 0.35 },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: STEP_03_RECEPTION_SCENE_TIME,
      duration: 2.2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Watch one pulse leave the galaxy and cross the gulf. When it reaches **you**, your eye records an image of Andromeda as it was when that light departed.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'For **you**, that journey took about **2.5 million years**. But light travels at the absolute speed limit — every bit of the spacetime budget spent on space, none on time.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Push any speed toward $c$ and proper time between two events shrinks toward zero. Light sits at that edge. We will not pretend to ride along with a photon — that frame does not exist.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'We only note where the trend points: along a light path, the elapsed proper time is **zero**. Emission and arrival are one instant on that limit — even when we measure millions of years between them.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Why would going faster cost you time? The next chapter makes that geometric — every object spends a fixed budget of $c$, shared between space and time.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
