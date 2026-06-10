import { EQUAL_SPLIT_V_OVER_C } from '@lm/physics';
import type { Step } from '@lm/engine';

/** Hold after each narrate beat so the diagram readout can land before the next line. */
const BEAT_PAUSE_MS = 7000;

export const STEP_01_ALWAYS_AT_C: Step = {
  id: 'always-at-c',
  title: 'Always at c',
  kicker: 'always at c',
  layout: 'intro',
  timeline: [
    {
      type: 'narrate',
      text: 'Welcome to the speed budget — the idea Chapter 1 teased with the tilting vector. Everything in the universe moves through space and time at exactly $c$. Not almost — exactly.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Take one year. At one extreme, spend it all on time — stand still, and every bit of $c$ flows through time. Through space, nothing.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: "Not that I'm calling you lazy — but this is how we usually move through space and time. Nearly all time, almost no space. We never get anywhere near relativistic speeds.",
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'tilt', volume: 0.55 },
    {
      type: 'animate',
      target: 'diagram.velocity',
      from: 0,
      to: 1,
      duration: 1.4,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'At the other extreme, spend it all on space. Move at $c$ through space — the vector lies along the spatial axis. Time stops.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Light is the edge of the budget — all of it spent on space, and completely timeless. (Strictly, the "everything moves at $c$" picture is drawn for things with mass; light is the limit they never quite reach.)',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'tilt', volume: 0.55 },
    {
      type: 'animate',
      target: 'diagram.velocity',
      from: 1,
      to: EQUAL_SPLIT_V_OVER_C,
      duration: 1.2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'When the vector bisects the angle — forty-five degrees on the arc — time and space get equal shares. That takes about seventy-one percent of light speed through space.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Drag the slider. Watch how one year of budget splits between time and distance — and pay close attention to the speed each split would require.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
