/** Predefined effect sound cues synthesized from oscillators. */
export type SoundType = 'tick' | 'tilt' | 'expand' | 'snap' | 'arrive' | 'soft';

export interface SoundPlayOptions {
  volume?: number;
  pan?: number;
}
