export type EasingName = 'linear' | 'ease-out';

export type WaitCondition = 'userAdvance' | 'animationDone';

export interface NarrateEvent {
  type: 'narrate';
  text: string;
  /** Milliseconds per character. Default 28. */
  speed?: number;
  /** Milliseconds to hold after the full text is revealed. Default 2400. Set 0 to skip. */
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
