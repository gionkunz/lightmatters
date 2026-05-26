import { STEP3_BRIDGE_TIME_AT_A } from '@lm/physics';
import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 7000;

export const STEP_03_BRIDGE_TO_LIGHT: Step = {
  id: 'bridge-to-light',
  title: 'Before we send more signals',
  kicker: 'before we send more signals',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'You have seen the speed budget: everyone moves through spacetime at $c$. Vertical means at rest, all of $c$ spent on time. Horizontal means light, all of $c$ spent on space — no time elapses for the photon.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'A and B stand at rest, far apart in space. B sends a single flash. Because the photon is timeless — no tick of its own clock — we can let its wavefront ride up B\'s worldline as a ring, expanding through space until it touches A.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'wavefront.time',
      from: 0,
      to: STEP3_BRIDGE_TIME_AT_A,
      duration: 3,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'The photon reaches A. Its own clock has not ticked at all. But A — sitting still through this whole crossing — has aged by exactly $\\Delta x / c$. A and B agree: same elapsed time on both clocks.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Two stationary observers, one flash, no disagreement. What changes when someone is moving? When B sends many flashes? Those are spatial questions — best watched from above.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'In the next chapter we step out of the spacetime diagram. We will watch the pulses move through space directly, the way you would see them from above. The rules from this chapter still hold; we are just changing the camera.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
