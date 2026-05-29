import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_05_BALANCE: Step = {
  id: 'mass-energy-balance',
  title: 'Balancing the see-saw',
  kicker: 'derivation · the see-saw',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Two things moved: the heavy box a tiny step left, the light a long way right. For the balance point to stay put, they must balance like a **see-saw**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'On a level see-saw, $\\text{mass} \\times \\text{distance}$ matches on both sides — a heavy child close to the pivot balances a light child far out. We call $\\text{mass} \\times \\text{distance}$ a **moment** (units: kg·m — *not* energy).',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Left side — the box: mass $M$, shifted left by the small distance $\\Delta x$. Its moment is $M \\times \\Delta x$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Right side — the light: mass $m$ (the unknown we are chasing), carried right across the whole length $L$. Its moment is $m \\times L$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'A level see-saw means the moments are equal: $M \\times \\Delta x = m \\times L$. Drag the energy and watch — both moments grow together, the beam stays level.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'We just need $\\Delta x$. The photon\'s momentum is $p = E/c$; the box recoils with the same momentum, so $M v = E/c$, giving speed $v = E/(Mc)$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The light needs time $t = L/c$ to cross, and in that time the box drifts $\\Delta x = v \\times t = \\dfrac{E}{Mc} \\times \\dfrac{L}{c} = \\dfrac{EL}{Mc^2}$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Drop that into the see-saw: $M \\times \\dfrac{EL}{Mc^2} = m \\times L$. The $M$ cancels on the left, the $L$ cancels on both sides…',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: '…and out falls $m = E/c^2$. The two $c$\'s — one from the push $E/c$, one from the crossing time $L/c$ — are exactly why it is $c$ **squared**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Rearranged, that is $E = mc^2$. Energy has mass; mass is concentrated energy. We forced the universe to admit it — just by watching a box slide.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
