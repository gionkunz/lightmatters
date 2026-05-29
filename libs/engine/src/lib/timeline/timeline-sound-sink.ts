/** Predefined effect sound types (mirrors design AudioService palette). */
export type TimelineSoundType =
  | 'tick'
  | 'tilt'
  | 'expand'
  | 'snap'
  | 'arrive'
  | 'soft';

export interface TimelineSoundPlayOptions {
  volume?: number;
  pan?: number;
}

export interface TimelineSoundSink {
  play(sound: TimelineSoundType, options?: TimelineSoundPlayOptions): void;
}

let timelineSoundSink: TimelineSoundSink | null = null;

export function setTimelineSoundSink(sink: TimelineSoundSink | null): void {
  timelineSoundSink = sink;
}

export function getTimelineSoundSink(): TimelineSoundSink | null {
  return timelineSoundSink;
}
