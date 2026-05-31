import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

/** Total phase swept (radians) as the locked wave slides along +x. */
export const STEP_05_PHASE_SWEEP = 2 * Math.PI * 4;

export const STEP_05_EM_WAVE: Step = {
  id: 'what-light-is',
  title: 'What light is',
  kicker: 'what light · is',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'So light has a speed. But what *is* the thing that is moving? Not a substance, not a stream of pellets — a self-sustaining ripple in the electric and magnetic fields.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Watch the two waves. The **electric** field $E$ (red) and the **magnetic** field $B$ (blue) sit at right angles, and both point square to the direction of travel.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.4 },
    {
      type: 'animate',
      target: 'wave.phase',
      from: 0,
      to: STEP_05_PHASE_SWEEP,
      duration: 7,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Here is the trick that keeps it alive: a **changing electric field creates a magnetic field**, and a **changing magnetic field creates an electric field**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Each field is forever regenerating the other. Neither needs a medium to lean on — they hold each other up, and the whole pattern hauls itself forward through empty space.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That is light: a wave with nothing underneath it. And the speed it runs at is fixed by the fields themselves — which is exactly where $c$ comes from.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
