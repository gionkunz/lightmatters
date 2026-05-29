import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_01_PULSE_TICKS: Step = {
  id: 'pulse-ticks',
  title: 'Each pulse is a tick',
  kicker: 'each pulse is a tick',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Chapter 4 showed that each flash expands at $c$ regardless of source motion. Now: a source that **pulses** — a regular rhythm of flashes, like a clock.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Every time a wavefront reaches observer $A$, $A$ hears one tick of the emitter\'s clock. One pulse, one tick — the wavefront is the clock\'s hand.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 3.2,
      duration: 5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Both source and observer are at rest. The ticks arrive evenly — the rhythm you send is the rhythm you hear.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'What happens when the source is moving?',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
