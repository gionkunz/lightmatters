import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_06_PAYOFF: Step = {
  id: 'mass-energy-payoff',
  title: 'Mass is frozen energy',
  kicker: 'payoff · and the bridge to gravity',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'So mass and energy are one thing, written in two units. The exchange rate is $c^2$ — and $c^2$ is an enormous number.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That is why a sliver of mass holds a vast amount of energy. The Sun shines by converting four million tonnes of mass into light **every second**, and will do so for billions of years.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Mass is simply energy that is standing still — bottled spacetime motion, the rest energy of Chapter 3 given a name.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'And this is the hinge of the whole journey. If mass and energy are the same thing, then it is **mass-energy** — not mass alone — that bends spacetime.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'We have wrung everything we can from flat spacetime. Next, we let it curve. Time to roll the diagram — and meet gravity.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
