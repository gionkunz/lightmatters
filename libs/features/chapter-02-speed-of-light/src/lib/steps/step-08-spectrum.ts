import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

/** Band index (0–6) to highlight when each narrate beat begins; `null` = overview. */
export const STEP_08_BAND_FOR_NARRATE: readonly (number | null)[] = [
  null, // intro — full spectrum, nothing selected yet
  0, // radio
  1, // microwave
  2, // infrared
  3, // visible
  4, // ultraviolet
  5, // X-ray
  6, // gamma
  null, // recap — all bands equal again
  null, // mass tease
  null, // bridge to speed budget
];

export const STEP_08_SPECTRUM: Step = {
  id: 'all-electromagnetic-light',
  title: 'All of it is light',
  kicker: 'all of it · is light',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'We have been saying “light” — but the wave we drew is only one slice of something much larger: the **electromagnetic spectrum**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'soft', volume: 0.35 },
    {
      type: 'narrate',
      text: 'At the long-wavelength end: **radio** — the signal in your phone, the hiss of a distant pulsar. Same physics, lower frequency.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: '**Microwaves** — radar, satellite links, the oven that heats your lunch.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: '**Infrared** — body heat, the warmth of a fire on your skin. You feel it because it *is* light, just not visible to your eyes.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The thin band we call **visible** — red through violet — is where our eyes happened to evolve. A sliver of the whole.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Beyond violet: **ultraviolet** — sunburn, sterilising lamps. Still the same $c$ in vacuum.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: '**X-rays** — bones on a medical scan, seeing through flesh.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: '**Gamma rays** — the shortest waves, the highest energy, born in nuclear fire.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Wi‑Fi, sunshine, a campfire, a medical scan — all electromagnetic. All bounded by the same speed limit. That is why $c$ feels like **reality**, not just brightness.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'The same $c$ governs radio, heat, and the forces that hold atoms together. Later we will see that **mass itself is bottled energy** — and energy is motion through spacetime at $c$.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'For now, hold one idea: every object shares a single, fixed budget of speed through spacetime — and next we will see how to spend it.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};

export const STEP_08_NARRATE_TEXTS: readonly string[] = STEP_08_SPECTRUM.timeline
  .filter((event) => event.type === 'narrate')
  .map((event) => event.text);
