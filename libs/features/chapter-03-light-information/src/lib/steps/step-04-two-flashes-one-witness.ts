import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_04_TWO_FLASHES_ONE_WITNESS: Step = {
  id: 'two-flashes-one-witness',
  title: 'Two flashes, one witness',
  kicker: 'two flashes, one witness',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Two stationary sources $S_L$ and $S_R$ flash at the same instant. A single witness $W$ stands halfway between them.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'First — $W$ is at rest. When does each flash reach them?',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 0.85,
      duration: 4,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'Both reach $W$ at the same instant. Equal distance — both flashes arrive together.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Predict: if $W$ were drifting rightward when the flashes went off, which one would reach them first?',
    },
    { type: 'wait', for: 'userAdvance' },
    {
      type: 'narrate',
      text: 'Let us run it again — same two flashes at the same instant — but this time $W$ is moving rightward at $0.3\\,c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 0.95,
      duration: 4.5,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'The right flash arrived first. But that is only what **you**, watching from outside, see.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Flip the frame toggle to stand in $W$\'s shoes — $W$ is **at rest**, exactly **halfway** between the sources. The timing control starts on the naïve guess: both flashes fired at the **same instant**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Watch what breaks. Equidistant light from a single instant would reach $W$ **together** — one merged flash. But you just saw the right flash arrive **first**. Both frames must agree on what $W$ witnessed.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The only escape: the flashes were **not** simultaneous for $W$ — the right source fired **earlier**. Switch the timing to **staggered** and the right-then-left order returns.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'When you ask "when did this happen?" — the answer depends on who is moving. Chapter 5 will show why you cannot subtract motion from $c$ and restore a single universal "now."',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'This is **the relativity of simultaneity**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Yet one thing never budged: $W$ met the right flash **first** in every frame. *When* the flashes fired is relative — but the **order** $W$ witnesses them is not. Simultaneity bends; cause and effect hold firm.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};

export const STEP_04_SCENE_DURATION = 0.85;
