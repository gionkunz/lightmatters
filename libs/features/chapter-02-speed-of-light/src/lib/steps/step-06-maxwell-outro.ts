import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_06_MAXWELL: Step = {
  id: 'maxwell-c',
  title: 'Where c comes from',
  kicker: 'where $c$ · comes from',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'In the 1860s James Clerk Maxwell wrote down the laws of electricity and magnetism. Buried in them was a wave that travelled at one fixed speed.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That speed depended only on two constants of empty space: $\\varepsilon_0$ (epsilon nought), how readily space permits an electric field, and $\\mu_0$ (mu nought), how readily it permits a magnetic one.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Neither is a guess on paper — each can be **measured in a lab**. Capacitor plates for $\\varepsilon_0$ (epsilon nought); a solenoid or inductor for $\\mu_0$ (mu nought). Maxwell combined **measured** numbers.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'snap', volume: 0.4 },
    {
      type: 'narrate',
      text: 'Put them together and the wave speed falls out: $c = 1 / \\sqrt{\\varepsilon_0 \\mu_0}$. No clocks over a kilometre — pure electromagnetism.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And the number it gives matches the one we timed by hand, to the digit. Light *is* an electromagnetic wave — that was the proof.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
