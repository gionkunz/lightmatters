import type { Step } from '@lm/engine';

/** Hold after each narrate beat so the diagram readout can land before the next line. */
const BEAT_PAUSE_MS = 7000;

export const STEP_01_ALWAYS_AT_C: Step = {
  id: 'always-at-c',
  title: 'Always at c',
  kicker: 'always at c',
  layout: 'intro',
  timeline: [
    {
      type: 'narrate',
      text: 'Welcome to the speed budget. Everything in the universe moves through spacetime at exactly $c$. Not almost — exactly.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Take one year. At one extreme, spend it all on time — stand still, and every bit of $c$ flows through time. Through space, nothing.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: "Not that I'm calling you lazy — but this is how we usually move through spacetime. Nearly all time, almost no space. We never get anywhere near relativistic speeds.",
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'diagram.velocity',
      from: 0,
      to: 1,
      duration: 1.4,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'At the other extreme, spend it all on space. Move at $c$ through space — the vector lies along the spatial axis. Time stops.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: "That's how light moves through spacetime — at $c$ through space, and completely timeless!",
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'diagram.velocity',
      from: 1,
      to: 0.5,
      duration: 1.2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Halfway on the arc is a fifty-fifty split — equal motion through time and through space.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Drag the slider. Watch how one year of budget splits between time and distance — and pay close attention to the speed each split would require.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
