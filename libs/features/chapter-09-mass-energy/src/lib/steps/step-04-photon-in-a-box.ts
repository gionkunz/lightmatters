import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_PHOTON_IN_A_BOX: Step = {
  id: 'mass-energy-photon-in-a-box',
  title: 'Setting the trap',
  kicker: 'thought experiment · the box',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: '**What if** we could prove that energy carries mass — without ever putting it on a scale — just by measuring how far a box slides? That is exactly what this thought experiment does.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The trap is one unbreakable rule. A system\'s **center of mass** is its balance point: average every piece\'s position, weighted by its mass. With no push from outside, that balance point **cannot move** — ever.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'So picture a sealed box — mass $M$, length $L$ — floating at rest in deep space. The faint outline is where it starts; the dashed line is its balance point. Nothing outside will touch it.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The left wall acts like an **atom**: it emits a photon, giving up a sliver of mass as energy $E$ (picture an atom — or an electron — shedding mass as light). The photon flies right with momentum $p = E/c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Momentum has to stay balanced, so the box **recoils** the opposite way — drifting slowly left at some speed $v$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'box.progress',
      from: 0,
      to: 1,
      duration: 5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'The photon crosses the box and is absorbed on the right wall, where that sliver of mass arrives. The box halts — now sitting clearly **left** of its starting outline (that gap is $\\Delta x$).',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And there it is: the box moved left, but its balance point did **not**. The only way that holds is if something carried mass to the **right** as the box slid left. The one thing that crossed was the light.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'So light really did ferry mass across the box. Next we set it on a see-saw and work out exactly *how much*.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
