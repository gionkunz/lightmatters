import type { Step } from '@lm/engine';

const BEAT_PAUSE_MS = 6500;

export const STEP_02_PIECEWISE: Step = {
  id: 'build-the-bulge',
  title: 'Build the bulge',
  kicker: 'two cylinders, two cones',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Remember the tunnel and the center? Here is Epstein\'s answer — the same cylinder and cone, but read **outward**: gravity pulls where the paper is **widest**, not where it pinches shut.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.wellReveal',
      from: 0,
      to: 0.2,
      duration: 2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: '**Outer space** — a **narrow** cylinder. Flat geometry, far from the planet.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.wellReveal',
      from: 0.2,
      to: 0.4,
      duration: 2.2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'A **cone opening outward** — the circumference **grows** as you fall toward the surface. This is where gravity feels **strongest**: the paper is widest at the rim, not at the center.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.wellReveal',
      from: 0.4,
      to: 0.55,
      duration: 2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'A **wide, flat** cylinder — **Earth** sits here. No slope in any direction. **Weightless.** Nothing pulls you toward a point; there is no point to fall toward.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.wellReveal',
      from: 0.55,
      to: 0.75,
      duration: 2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'A **cone closing inward** — the circumference shrinks again as you climb toward the far surface.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'animate',
      target: 'surface.wellReveal',
      from: 0.75,
      to: 1,
      duration: 2,
      easing: 'ease-out',
    },
    {
      type: 'narrate',
      text: 'And **outer space** again — a narrow cylinder on the far side. Four plain shapes, one complete bulge.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
