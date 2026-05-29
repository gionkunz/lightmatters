import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_REST_ENERGY: Step = {
  id: 'mass-energy-rest-energy',
  title: 'Rest energy is motion through time',
  kicker: 'speed budget · in energy',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Recall the speed budget: everything moves through spacetime at the same speed, $c$. Standing still, you spend all of that budget moving through **time**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Now read the budget as **energy**. At rest, all your energy is this motion through time — and *that* is your rest energy, $E_0 = mc^2$: the energy locked inside mass just for existing.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And it is a staggering amount. A single **gram** of anything — a paperclip\'s worth of matter — holds about 25 million kilowatt-hours of rest energy: enough to power a home for roughly **2,500 years**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That enormous number is the $c^2$ at work. Light is fast, so $c^2$ is huge — multiplying even a crumb of mass by it yields a colossal energy. (*Why* squared and not just $c$ — the box, two steps from now, will show $c$ entering twice.)',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'tilt', volume: 0.55 },
    {
      type: 'animate',
      target: 'rest.velocity',
      from: 0,
      to: 0.6,
      duration: 1.6,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'Now start moving. The vector tips over: part of the budget shifts from time into **space**. Moving through space costs energy, so the total climbs to $E = \\gamma mc^2$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That $\\gamma$ is the same **stretch factor** we met with moving clocks. It equals $1$ when you are still and grows without bound as you approach $c$. At rest, $\\gamma = 1$, so the total is simply $mc^2$ again.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The amount *above* $mc^2$ — written $(\\gamma - 1)mc^2$ — is the **kinetic energy**: the energy of motion, stacked on top of the rest energy that was always there. Total = rest + kinetic.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Push $v/c$ toward $1$ and both run away to **infinity**. That is why nothing **with mass** can ever reach $c$: it would take infinite energy. Light is the loophole — with no mass to drag along, it already travels at $c$. We will see how in a moment.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Drag $v/c$ and read the panel. Rest energy never changes; kinetic energy is whatever you add on top. Mass, it turns out, is just energy that is standing still.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
