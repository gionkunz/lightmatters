import type { SoundType } from './sound-types';

export interface SoundRecipe {
  oscillatorType: OscillatorType;
  startFreq: number;
  endFreq: number;
  /** Seconds to reach peak amplitude. */
  attack: number;
  /** Seconds from peak to silence. */
  decay: number;
  /** Total voice duration in seconds. */
  duration: number;
  /** Peak gain before per-play volume scaling. */
  peak: number;
}

export const SOUND_PRESETS: Record<SoundType, SoundRecipe> = {
  tick: {
    oscillatorType: 'sine',
    startFreq: 880,
    endFreq: 660,
    attack: 0.005,
    decay: 0.08,
    duration: 0.1,
    peak: 0.12,
  },
  tilt: {
    oscillatorType: 'sine',
    startFreq: 220,
    endFreq: 440,
    attack: 0.02,
    decay: 0.35,
    duration: 0.45,
    peak: 0.18,
  },
  expand: {
    oscillatorType: 'sine',
    startFreq: 180,
    endFreq: 520,
    attack: 0.04,
    decay: 0.55,
    duration: 0.7,
    peak: 0.16,
  },
  snap: {
    oscillatorType: 'sine',
    startFreq: 720,
    endFreq: 280,
    attack: 0.003,
    decay: 0.1,
    duration: 0.12,
    peak: 0.14,
  },
  arrive: {
    oscillatorType: 'sine',
    startFreq: 330,
    endFreq: 660,
    attack: 0.06,
    decay: 0.5,
    duration: 0.65,
    peak: 0.14,
  },
  soft: {
    oscillatorType: 'sine',
    startFreq: 440,
    endFreq: 380,
    attack: 0.03,
    decay: 0.4,
    duration: 0.5,
    peak: 0.1,
  },
};
