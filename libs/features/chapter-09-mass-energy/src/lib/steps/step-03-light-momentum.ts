import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_LIGHT_MOMENTUM: Step = {
  id: 'mass-energy-light-momentum',
  title: 'Light carries momentum',
  kicker: 'one new fact · light pushes',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'We need one new fact, and only one. Light carries **momentum** — it does not just travel, it *pushes*.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'sail.progress',
      from: 0,
      to: 1,
      duration: 4.5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'A comet\'s tail streams away from the Sun because sunlight presses on its dust. A solar sail rides that same gentle, relentless push.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'How strong is that push? We measure it as **momentum** $p$ — the "oomph" a moving thing delivers. For light, $p$ is its energy $E$ divided by the speed of light $c$: $p = E/c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And what raises a flash\'s energy $E$? Two ways: make it **bluer** — each photon\'s energy climbs with its frequency — or make it **brighter**, packing in more photons. Either way, more $E$ means more push. The derivation only cares about the total $E$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'But hold on — Step 2 said reaching $c$ takes *infinite* energy, yet light cruises at exactly $c$. The loophole is **mass**: that runaway only applies to things with rest mass, and light has none.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'So there is no contradiction, just two faces of one law. A massive thing **at rest** has energy $E = mc^2$. Light, with **no mass**, instead has $E = pc$. Light simply lives on the momentum side of the ledger.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And momentum is the hallmark of something massive on the move. So light, carrying momentum, behaves as if it carries mass with it. That is the thread we follow into the box.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
