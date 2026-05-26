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
      text: 'The right flash arrived first. Same pair of flashes — but for a moving witness, they did not happen "at the same time." This is **the relativity of simultaneity**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'When you ask "when did this happen?" — the answer depends on who is moving.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};

export const STEP_04_SCENE_DURATION = 0.85;
