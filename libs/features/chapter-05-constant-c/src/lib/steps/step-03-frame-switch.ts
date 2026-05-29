import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_03_FRAME_SWITCH: Step = {
  id: 'constant-c-frame-switch',
  title: "Stand in B's shoes",
  kicker: "B's frame · the light sphere",
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Now climb aboard $B$ and call **yourself** the one at rest. From here it is $A$ who slides away — to the left at $0.5\\,c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: 0.95,
      duration: 4,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: 'And the experiment answers honestly: in $B$\'s frame the wavefront is *also* a perfect circle, expanding at $c$ — centred on **$B$**. The light never picked a favourite.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Both pictures are true at once: the same flash centred on $A$ **and** centred on $B$. The only way that can hold is if $A$ and $B$ disagree about distance and time themselves.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'To keep $c$ fixed, a moving clock must run **slow**, a moving ruler must **shrink**, and the two cannot even agree on what counts as "now". Constancy of $c$ does not sit beside those effects — it **forces** them.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'That settles the simultaneity puzzle from "Light and information": there is no universal now to disagree about. Next chapter, a clock made of light will let us measure exactly how much time bends.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
