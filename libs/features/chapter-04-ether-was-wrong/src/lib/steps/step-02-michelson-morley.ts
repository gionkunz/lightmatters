import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;
const ORBIT_END_PHASE2 = (3 * Math.PI) / 2;

export const STEP_02_MICHELSON_MORLEY: Step = {
  id: 'michelson-morley',
  title: 'Michelson–Morley',
  kicker: 'michelson–morley',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Imagine the ether as a stationary sea filling all of space. When we share its rest frame, we feel nothing — no wind, no resistance.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Move forward through the ether and the medium pushes back. Everywhere you look, the wind points **against** your motion — a headwind you can never outrun.',
      pauseAfter: 0,
    },
    { type: 'sound', sound: 'arrive', volume: 0.5 },
    {
      type: 'animate',
      target: 'ether.frameSpeed',
      from: 0,
      to: 0.4,
      duration: 3.5,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Follow a circular path and the wind keeps changing direction — but it always blows **against** how you are moving right now.',
      pauseAfter: 0,
    },
    { type: 'sound', sound: 'arrive', volume: 0.5 },
    {
      type: 'animate',
      target: 'ether.orbitAngle',
      from: 0,
      to: ORBIT_END_PHASE2,
      duration: 4,
      easing: 'linear',
    },
    { type: 'sound', sound: 'arrive', volume: 0.5 },
    {
      type: 'animate',
      target: 'ether.dragScene',
      from: 0,
      to: 1,
      duration: 5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'If the ether is a medium and Earth moves through it, light should travel at $c$ **relative to the ether** — but the whole medium streams past the apparatus like a wind. Each flash is carried along with that **ether wind**, not with the speed of whatever emitted it.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Michelson and Morley looked for that ether wind in Earth\'s orbit. At different seasons, our motion through the ether should favor one direction over another — the interference pattern should **shift**.',
      pauseAfter: 0,
    },
    { type: 'sound', sound: 'snap', volume: 0.5 },
    {
      type: 'animate',
      target: 'ether.earthOrbitIndex',
      from: 0,
      to: 3,
      duration: 5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'They saw **nothing**. Repeat at every season — the pattern stayed put. No ether wind. No detectable motion through any medium at all.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'So if there is no medium, how does light travel? And why is its speed always $c$?',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
