import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_07_REALITY: Step = {
  id: 'reality-and-causality',
  title: 'The speed of reality',
  kicker: 'reality · and causality',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'It is tempting to treat light like sound — a carrier of news, just much faster. Shout across a field; the listener hears you after a delay. Flash a lamp; an eye catches it a moment later.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Sound needs air. Its speed is a property of the medium. Slow the wind, change the temperature, and the delay changes. Sound carries **information**, but it is not a law of nature.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Light is different. In empty space there is no medium to tune. $c$ is the fastest any influence can propagate — not just bright things, but **every** electromagnetic signal.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Gravitational waves ripple space and time at the same limit. Nothing outruns $c$. Cause cannot reach effect faster than this — anywhere in the universe.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'So $c$ is not merely “how fast light goes.” It is how fast **reality can update** from one place to another. The delay of light is the delay of causality itself.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
