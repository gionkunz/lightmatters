export type EasingName = 'linear' | 'ease-out';

export type WaitCondition = 'userAdvance' | 'animationDone';

export interface NarrateEvent {
  type: 'narrate';
  text: string;
  /** Milliseconds per character. Default 34. */
  speed?: number;
  /** Milliseconds to hold after the full text is revealed. Default 4000. Skipped automatically on the narrate beat immediately before an exploration wait. Set 0 to skip. */
  pauseAfter?: number;
}

export interface AnimateEvent {
  type: 'animate';
  target: string;
  from: number;
  to: number;
  duration: number;
  easing?: EasingName;
}

export interface WaitEvent {
  type: 'wait';
  for: WaitCondition;
}

export type TimelineEvent = NarrateEvent | AnimateEvent | WaitEvent;

/** A seekable beat on the timeline progress bar (start of a narrate or animate event). */
export interface TimelineCheckpoint {
  /** Index into the step's timeline events array. */
  eventIndex: number;
  /** Normalized start position on the progress track (0–1). */
  position: number;
}

export interface Step {
  id: string;
  title: string;
  kicker?: string;
  layout: 'intro';
  timeline: TimelineEvent[];
}

export interface AnimatableTarget {
  get: () => number;
  set: (value: number) => void;
  /** Value restored on timeline rewind. Defaults to 0. */
  initial?: number;
}
