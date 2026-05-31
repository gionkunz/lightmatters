import type { Step } from '@lm/engine';
import {
  EARTH_MOON_DISTANCE_KM,
  EARTH_SUN_DISTANCE_KM,
  earthLapsPerSecond,
  lightTravelTimeSeconds,
} from '@lm/physics';

const BEAT_PAUSE_MS = 6500;

const LAPS_PER_SECOND = earthLapsPerSecond().toFixed(1);
const MOON_SECONDS = lightTravelTimeSeconds(EARTH_MOON_DISTANCE_KM).toFixed(1);
const SUN_SECONDS = lightTravelTimeSeconds(EARTH_SUN_DISTANCE_KM);
const SUN_MINUTES = Math.floor(SUN_SECONDS / 60);
const SUN_REMAINDER = Math.round(SUN_SECONDS - SUN_MINUTES * 60);

/** How far the wavefront sweep runs (scene-time units). */
export const STEP_01_SCENE_DURATION = 0.85;

export const STEP_01_HOW_FAST: Step = {
  id: 'how-fast-is-light',
  title: 'How fast is light?',
  kicker: 'how fast · is light',
  layout: 'chat-feed',
  timeline: [
    {
      type: 'narrate',
      text: 'Light is fast. So fast that, for most of history, people assumed it was simply **instantaneous** — no delay at all between flick and glow.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'It is not instantaneous. It has a speed, written $c$, and that speed is about **300,000 kilometres every second**.',
      pauseAfter: BEAT_PAUSE_MS,
    },
    { type: 'sound', sound: 'expand', volume: 0.45 },
    {
      type: 'animate',
      target: 'scene.time',
      from: 0,
      to: STEP_01_SCENE_DURATION,
      duration: 4,
      easing: 'linear',
    },
    {
      type: 'narrate',
      text: `That is roughly ${LAPS_PER_SECOND} laps around the Earth's equator — in a single second.`,
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: `Even so, it is not infinite. A flash from the Moon takes about ${MOON_SECONDS} seconds to reach us, and sunlight spends roughly ${SUN_MINUTES} minutes ${SUN_REMAINDER} seconds crossing space before it lands on your skin.`,
      pauseAfter: BEAT_PAUSE_MS,
    },
    {
      type: 'narrate',
      text: 'Finite, measurable, the same in every direction. That ordinary-looking number is about to turn the universe inside out.',
    },
    { type: 'wait', for: 'userAdvance' },
  ],
};
