export type {
  Step,
  TimelineEvent,
  TimelineCheckpoint,
  NarrateEvent,
  AnimateEvent,
  WaitEvent,
  WaitCondition,
  AnimatableTarget,
  EasingName,
} from './lib/timeline/types';
export { applyEasing, interpolate } from './lib/timeline/easing';
export {
  buildNarrateRenderPieces,
  MATH_TYPING_UNIT_CHARS,
  narrateTextTypingUnits,
  narrateTypingUnits,
  parseNarrateText,
  type NarrateRenderPiece,
  type NarrateSegment,
} from './lib/timeline/narrate-text';
export { TargetRegistry } from './lib/timeline/target-registry';
export { TimelineRunner, DEFAULT_NARRATE_READ_PAUSE_MS, DEFAULT_NARRATE_SPEED_MS } from './lib/timeline/timeline-runner';
export { LmChapterShellComponent } from './lib/components/lm-chapter-shell.component';
export { LmNarratorComponent } from './lib/components/lm-narrator.component';
export { LmNarratorChatFeedComponent } from './lib/components/lm-narrator-chat-feed.component';
export { LmDiagramViewportComponent } from './lib/components/lm-diagram-viewport.component';
export { computeDiagramFit } from './lib/diagram/compute-diagram-fit';
export { LmStepFrameComponent } from './lib/components/lm-step-frame.component';
export { chapterStepHref, parseStepUrl } from './lib/components/step-url';
export type { ParsedStepUrl } from './lib/components/step-url';
export { LmPlaybackControlsComponent } from './lib/components/lm-playback-controls.component';
export { LmPlaybackBarComponent } from './lib/components/lm-playback-bar.component';
