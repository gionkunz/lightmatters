import { computed, signal } from '@angular/core';
import { interpolate } from './easing';
import type {
  AnimateEvent,
  NarrateEvent,
  SoundEvent,
  TimelineCheckpoint,
  TimelineEvent,
  WaitEvent,
} from './types';
import { narrateTextTypingUnits } from './narrate-text';
import { TargetRegistry } from './target-registry';
import { getTimelineSoundSink } from './timeline-sound-sink';

const canUseTimelineSound =
  typeof globalThis.window !== 'undefined' &&
  typeof globalThis.document !== 'undefined';

const canUseAnimationFrame =
  typeof globalThis.requestAnimationFrame === 'function';

function scheduleAnimationFrame(callback: FrameRequestCallback): number | null {
  if (!canUseAnimationFrame) {
    return null;
  }
  return requestAnimationFrame(callback);
}

function cancelScheduledAnimationFrame(id: number | null): void {
  if (id !== null && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(id);
  }
}

/** @deprecated Timed read pauses replaced by checkpoint hold; kept for authored timelines. */
export const DEFAULT_NARRATE_READ_PAUSE_MS = 4000;

/** Default milliseconds between typewriter character reveals. */
export const DEFAULT_NARRATE_SPEED_MS = 34;

interface NarratePlayback {
  event: NarrateEvent;
  count: number;
  charStartedAt: number;
}

interface AnimatePlayback {
  event: AnimateEvent;
  elapsedMs: number;
}

export class TimelineRunner {
  readonly waitingForUser = signal(false);
  readonly isComplete = signal(false);
  readonly isPaused = signal(false);
  readonly narrationText = signal('');
  readonly narrationVisibleCount = signal(0);
  readonly atExplorationWait = signal(false);
  readonly atCheckpointHold = signal(false);
  readonly completedNarrateTexts = signal<string[]>([]);
  readonly progress = signal(0);
  readonly elapsedMs = signal(0);
  /** @deprecated Use {@link checkpoints} instead. */
  readonly beatMarkers = signal<number[]>([]);
  readonly checkpoints = signal<TimelineCheckpoint[]>([]);
  readonly activeCheckpointIndex = signal(0);
  readonly playbackActive = computed(
    () =>
      this._running() &&
      !this.isPaused() &&
      !this.waitingForUser() &&
      !this.isComplete(),
  );

  private index = 0;
  private readonly _running = signal(false);
  private rafId: number | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private narrateResolve: (() => void) | null = null;
  private animateResolve: (() => void) | null = null;
  private narratePlayback: NarratePlayback | null = null;
  private animatePlayback: AnimatePlayback | null = null;
  private readonly totalDurationMs: number;
  private readonly eventOffsets: number[];
  private readonly checkpointEventIndices: number[];
  private progressRafId: number | null = null;
  private runGeneration = 0;

  constructor(
    private readonly events: TimelineEvent[],
    private readonly registry: TargetRegistry,
  ) {
    const schedule = this.buildTimelineSchedule();
    this.eventOffsets = schedule.offsets;
    this.totalDurationMs = schedule.totalMs;
    this.checkpointEventIndices = schedule.checkpointEventIndices;
    this.checkpoints.set(schedule.checkpoints);
    this.beatMarkers.set(schedule.checkpoints.map((cp) => cp.position));
  }

  getTotalDurationMs(): number {
    return this.totalDurationMs;
  }

  /** Timeline is actively playing (typing or tweening). */
  isPlaying(): boolean {
    return this.playbackActive();
  }

  /** @deprecated Use {@link atCheckpointHold}. */
  atReadPause(): boolean {
    return this.atCheckpointHold();
  }

  /** True when the learner may leave the step via step-chrome forward transport. */
  allowsStepExit(): boolean {
    return this.isComplete() || this.isAtFinalUserAdvanceWait();
  }

  canGoToPreviousCheckpoint(): boolean {
    if (this.checkpointEventIndices.length === 0) {
      return false;
    }
    if (this.isComplete()) {
      return this.checkpointEventIndices.length > 1;
    }
    if (this.waitingForUser()) {
      return this.checkpointArrayIndexBefore(this.index) >= 0;
    }
    const active = this.getActiveCheckpointIndex();
    if (active > 0) {
      return true;
    }
    // First checkpoint: rewind within the step only while mid-event.
    // At a completed hold, defer to step/chapter boundary navigation.
    if (this.atCheckpointHold()) {
      return false;
    }
    return this.hasPartialCurrentEvent();
  }

  canGoToNextCheckpoint(): boolean {
    return !this.isComplete();
  }

  start(): void {
    this.reset();
    this._running.set(true);
    this.startProgressLoop();
    void this.runNext(this.nextRunGeneration());
  }

  reset(): void {
    this.stopProgressLoop();
    this.abortPending();
    this.index = 0;
    this._running.set(false);
    this.waitingForUser.set(false);
    this.isComplete.set(false);
    this.isPaused.set(false);
    this.narrationText.set('');
    this.narrationVisibleCount.set(0);
    this.atExplorationWait.set(false);
    this.atCheckpointHold.set(false);
    this.completedNarrateTexts.set([]);
    this.narratePlayback = null;
    this.animatePlayback = null;
    this.setProgress(0);
    this.syncActiveCheckpoint();
  }

  destroy(): void {
    this.stopProgressLoop();
    this.abortPending();
    this._running.set(false);
  }

  pause(): void {
    if (!this.playbackActive()) {
      return;
    }

    this.cancelTimers();
    this.isPaused.set(true);
  }

  resume(): void {
    if (!this.isPaused() || this.isComplete() || this.waitingForUser()) {
      return;
    }

    if (this.atCheckpointHold()) {
      this.advanceFromCheckpointHold();
      return;
    }

    this.isPaused.set(false);

    if (this.narratePlayback) {
      this.narratePlayback.charStartedAt = performance.now();
      this.continueNarrate();
      return;
    }

    if (this.animatePlayback) {
      this.continueAnimate();
    }
  }

  /** Jump to the previous narrate/animate checkpoint and replay from there. */
  goToPreviousCheckpoint(): void {
    const cps = this.checkpointEventIndices;
    if (cps.length === 0 || !this.canGoToPreviousCheckpoint()) {
      return;
    }

    let targetCpIdx: number;
    if (this.isComplete()) {
      targetCpIdx = cps.length - 1;
    } else if (this.waitingForUser()) {
      targetCpIdx = Math.max(0, this.checkpointArrayIndexBefore(this.index));
    } else {
      const active = this.getActiveCheckpointIndex();
      targetCpIdx = active > 0 ? active - 1 : 0;
    }

    this.goToCheckpoint(cps[targetCpIdx]);
  }

  /** Jump to the next narrate/animate checkpoint, or through to exploration wait. */
  goToNextCheckpoint(): void {
    if (!this.canGoToNextCheckpoint()) {
      return;
    }

    if (this.waitingForUser()) {
      this.advance();
      return;
    }

    if (this.atCheckpointHold()) {
      this.advanceFromCheckpointHold();
      return;
    }

    const cps = this.checkpointEventIndices;
    const active = this.getActiveCheckpointIndex();

    if (active < cps.length - 1) {
      this.goToCheckpoint(cps[active + 1]);
      return;
    }

    this.skipToEndOrWait();
  }

  /** Seek to the start of a checkpoint event and replay from there. */
  goToCheckpoint(eventIndex: number): void {
    if (!this.checkpointEventIndices.includes(eventIndex)) {
      return;
    }

    this.abortPending();
    this.registry.resetAll();

    for (let i = 0; i < eventIndex; i++) {
      this.executeEventInstantly(this.events[i]);
    }

    this.index = eventIndex;
    this._running.set(true);
    this.isPaused.set(false);
    this.isComplete.set(false);
    this.waitingForUser.set(false);
    this.atExplorationWait.set(false);
    this.atCheckpointHold.set(false);
    this.rebuildCompletedNarrateTexts();
    this.narratePlayback = null;
    this.animatePlayback = null;
    this.setProgress(this.eventOffsets[eventIndex] ?? 0);
    this.syncActiveCheckpoint();
    this.startProgressLoop();
    this.#playSoundsLeadingInto(eventIndex);
    void this.runNext(this.nextRunGeneration());
  }

  /** @deprecated Use {@link goToPreviousCheckpoint}. */
  rewind(): void {
    this.goToPreviousCheckpoint();
  }

  /** @deprecated Use {@link goToNextCheckpoint}. */
  fastForward(): void {
    this.goToNextCheckpoint();
  }

  advanceFromCheckpointHold(): void {
    if (!this.atCheckpointHold()) {
      return;
    }
    this.atCheckpointHold.set(false);
    this.isPaused.set(false);
    this.narratePlayback = null;
    this.animatePlayback = null;
    this.cancelTimers();
    this.narrateResolve?.();
    this.narrateResolve = null;
    this.animateResolve?.();
    this.animateResolve = null;
  }

  /** @deprecated Use {@link advanceFromCheckpointHold}. */
  skipReadPause(): void {
    this.advanceFromCheckpointHold();
  }

  advance(): void {
    if (!this.waitingForUser()) {
      return;
    }
    this.waitingForUser.set(false);
    this.atExplorationWait.set(false);
    this.index++;
    void this.runNext(this.nextRunGeneration());
  }

  /** Complete the current event and fast-forward to the next exploration wait. */
  skip(): void {
    if (this.isComplete()) {
      return;
    }

    this.skipToEndOrWait();
  }

  private skipToEndOrWait(): void {
    this.abortPending();
    this.completeCurrentEvent();

    while (this.index < this.events.length) {
      const event = this.events[this.index];
      if (event.type === 'wait') {
        this.rebuildCompletedNarrateTexts();
        this.handleWait(event);
        return;
      }
      this.executeEventInstantly(event);
      this.index++;
    }

    this.rebuildCompletedNarrateTexts();
    this.finish();
  }

  private async runNext(generation: number): Promise<void> {
    if (generation !== this.runGeneration || !this._running()) {
      return;
    }

    if (this.index >= this.events.length) {
      this.finish();
      return;
    }

    const event = this.events[this.index];

    if (event.type === 'wait') {
      this.handleWait(event);
      return;
    }

    this.syncActiveCheckpoint();
    await this.executeEvent(event);
    if (generation !== this.runGeneration) {
      return;
    }

    this.narratePlayback = null;
    this.animatePlayback = null;
    this.index++;
    this.rebuildCompletedNarrateTexts();
    await this.runNext(generation);
  }

  private handleWait(event: WaitEvent): void {
    if (event.for === 'userAdvance') {
      this.waitingForUser.set(true);
      this.atExplorationWait.set(true);
      this.setProgress(this.totalDurationMs);
      this.syncActiveCheckpoint();
      this.stopProgressLoop();
      return;
    }
    this.index++;
    void this.runNext(this.runGeneration);
  }

  private nextRunGeneration(): number {
    this.runGeneration++;
    return this.runGeneration;
  }

  private executeEventInstantly(event: TimelineEvent): void {
    if (event.type === 'narrate') {
      this.atCheckpointHold.set(false);
      this.narrationText.set(event.text);
      this.narrationVisibleCount.set(narrateTextTypingUnits(event.text));
      return;
    }

    if (event.type === 'animate') {
      const target = this.registry.get(event.target);
      target?.set(event.to);
    }
  }

  private completeCurrentEvent(): void {
    const event = this.events[this.index];
    if (!event) {
      return;
    }

    if (event.type === 'narrate') {
      this.atCheckpointHold.set(false);
      this.narrationText.set(event.text);
      this.narrationVisibleCount.set(narrateTextTypingUnits(event.text));
      this.narratePlayback = null;
      this.narrateResolve?.();
      this.narrateResolve = null;
    }

    if (event.type === 'animate') {
      const target = this.registry.get(event.target);
      target?.set(event.to);
      this.animatePlayback = null;
      this.animateResolve?.();
      this.animateResolve = null;
    }
  }

  private executeEvent(event: TimelineEvent): Promise<void> {
    if (event.type === 'narrate') {
      return this.beginNarrate(event);
    }
    if (event.type === 'animate') {
      return this.beginAnimate(event);
    }
    if (event.type === 'sound') {
      this.playSoundEvent(event);
    }
    return Promise.resolve();
  }

  private playSoundEvent(event: SoundEvent): void {
    if (!canUseTimelineSound) {
      return;
    }

    const sink = getTimelineSoundSink();
    sink?.play(event.sound, {
      volume: event.volume,
      pan: event.pan,
    });
  }

  /** Play sound cues authored immediately before a checkpoint beat. */
  #playSoundsLeadingInto(eventIndex: number): void {
    for (let i = eventIndex - 1; i >= 0 && this.events[i].type === 'sound'; i--) {
      this.playSoundEvent(this.events[i] as SoundEvent);
    }
  }

  private beginNarrate(event: NarrateEvent): Promise<void> {
    this.maybeEnableExplorationControls();
    this.narrationText.set(event.text);
    if (!this.narratePlayback) {
      this.narrationVisibleCount.set(0);
      this.narratePlayback = {
        event,
        count: 0,
        charStartedAt: performance.now(),
      };
    }

    return new Promise((resolve) => {
      this.narrateResolve = resolve;
      this.continueNarrate();
    });
  }

  private continueNarrate(): void {
    if (this.isPaused() || !this.narratePlayback) {
      return;
    }

    const { event } = this.narratePlayback;
    const speed = event.speed ?? DEFAULT_NARRATE_SPEED_MS;

    const count = this.narratePlayback.count;
    const totalUnits = narrateTextTypingUnits(event.text);
    if (count >= totalUnits) {
      if (this.shouldHoldAfterEvent(this.index, event)) {
        this.startCheckpointHold();
      } else {
        this.narratePlayback = null;
        this.narrateResolve?.();
        this.narrateResolve = null;
      }
      return;
    }

    this.narratePlayback.count = count + 1;
    this.narratePlayback.charStartedAt = performance.now();
    this.narrationVisibleCount.set(this.narratePlayback.count);
    this.timeoutId = setTimeout(() => this.continueNarrate(), speed);
  }

  private beginAnimate(event: AnimateEvent): Promise<void> {
    this.maybeEnableExplorationControls();
    const target = this.registry.get(event.target);
    if (!target) {
      return Promise.resolve();
    }

    if (!this.animatePlayback) {
      this.animatePlayback = { event, elapsedMs: 0 };
      target.set(event.from);
    } else {
      const t = Math.min(
        1,
        this.animatePlayback.elapsedMs / (event.duration * 1000),
      );
      target.set(
        interpolate(event.from, event.to, t, event.easing ?? 'ease-out'),
      );
    }

    return new Promise((resolve) => {
      this.animateResolve = resolve;
      this.continueAnimate();
    });
  }

  private continueAnimate(): void {
    if (this.isPaused() || !this.animatePlayback) {
      return;
    }

    const { event, elapsedMs } = this.animatePlayback;
    const target = this.registry.get(event.target);
    if (!target) {
      return;
    }

    const easing = event.easing ?? 'ease-out';
    const durationMs = event.duration * 1000;
    const startWall = performance.now() - elapsedMs;

    const frame = (now: number) => {
      if (this.isPaused()) {
        this.animatePlayback = {
          event,
          elapsedMs: Math.min(durationMs, now - startWall),
        };
        return;
      }

      const elapsed = now - startWall;
      const t = Math.min(1, elapsed / durationMs);
      target.set(interpolate(event.from, event.to, t, easing));
      this.animatePlayback = { event, elapsedMs: elapsed };

      if (t >= 1) {
        if (this.shouldHoldAfterEvent(this.index, event)) {
          this.startCheckpointHold();
        } else {
          this.animatePlayback = null;
          this.animateResolve?.();
          this.animateResolve = null;
        }
        return;
      }

      this.rafId = scheduleAnimationFrame(frame);
    };

    this.rafId = scheduleAnimationFrame(frame);
  }

  private startCheckpointHold(): void {
    this.atCheckpointHold.set(true);
    this.isPaused.set(true);
    this.cancelTimers();
    this.syncProgress();
  }

  private finish(): void {
    this._running.set(false);
    this.isComplete.set(true);
    this.isPaused.set(false);
    this.atCheckpointHold.set(false);
    this.waitingForUser.set(false);
    this.narratePlayback = null;
    this.animatePlayback = null;
    this.setProgress(this.totalDurationMs);
    this.syncActiveCheckpoint();
    this.stopProgressLoop();
  }

  private getActiveCheckpointIndex(): number {
    if (this.isComplete()) {
      return Math.max(0, this.checkpointEventIndices.length - 1);
    }

    if (this.waitingForUser()) {
      const before = this.checkpointArrayIndexBefore(this.index);
      return before >= 0 ? before : 0;
    }

    const idx = this.checkpointEventIndices.indexOf(this.index);
    return idx >= 0 ? idx : 0;
  }

  /** Index in checkpointEventIndices for the last narrate/animate before `eventIndex`. */
  private checkpointArrayIndexBefore(eventIndex: number): number {
    let cpIdx = -1;
    for (let i = 0; i < this.checkpointEventIndices.length; i++) {
      if (this.checkpointEventIndices[i] < eventIndex) {
        cpIdx = i;
      } else {
        break;
      }
    }
    return cpIdx;
  }

  private isAtFinalUserAdvanceWait(): boolean {
    if (!this.waitingForUser()) {
      return false;
    }
    const event = this.events[this.index];
    if (event?.type !== 'wait' || event.for !== 'userAdvance') {
      return false;
    }
    for (let i = this.index + 1; i < this.events.length; i++) {
      if (this.events[i].type !== 'wait') {
        return false;
      }
    }
    return true;
  }

  private hasPartialCurrentEvent(): boolean {
    if (this.narratePlayback) {
      return this.narratePlayback.count > 0;
    }
    if (this.animatePlayback) {
      return this.animatePlayback.elapsedMs > 0;
    }
    return false;
  }

  private syncActiveCheckpoint(): void {
    this.activeCheckpointIndex.set(this.getActiveCheckpointIndex());
  }

  private buildTimelineSchedule(): {
    offsets: number[];
    totalMs: number;
    checkpointEventIndices: number[];
    checkpoints: TimelineCheckpoint[];
  } {
    const offsets: number[] = [];
    let offset = 0;

    for (let i = 0; i < this.events.length; i++) {
      offsets.push(offset);
      offset += this.eventDurationMs(this.events[i]);
    }

    const totalMs = offset;
    const checkpointEventIndices: number[] = [];
    const checkpoints: TimelineCheckpoint[] = [];

    for (let i = 0; i < this.events.length; i++) {
      const type = this.events[i].type;
      if (type === 'wait' || type === 'sound') {
        continue;
      }
      checkpointEventIndices.push(i);
      checkpoints.push({
        eventIndex: i,
        position: totalMs > 0 ? (offsets[i] ?? 0) / totalMs : 0,
      });
    }

    return { offsets, totalMs, checkpointEventIndices, checkpoints };
  }

  private eventDurationMs(event: TimelineEvent): number {
    if (event.type === 'narrate') {
      return (
        narrateTextTypingUnits(event.text) *
        (event.speed ?? DEFAULT_NARRATE_SPEED_MS)
      );
    }
    if (event.type === 'animate') {
      return event.duration * 1000;
    }
    return 0;
  }

  private isPreExplorationEvent(eventIndex: number): boolean {
    const next = this.events[eventIndex + 1];
    return next?.type === 'wait' && next.for === 'userAdvance';
  }

  private maybeEnableExplorationControls(): void {
    if (this.isPreExplorationEvent(this.index)) {
      this.atExplorationWait.set(true);
    }
  }

  private shouldHoldAfterEvent(
    eventIndex: number,
    event: NarrateEvent | AnimateEvent,
  ): boolean {
    if (this.isPreExplorationEvent(eventIndex)) {
      return false;
    }
    if (event.type === 'narrate' && event.pauseAfter === 0) {
      return false;
    }
    if (event.type === 'animate') {
      const next = this.events[eventIndex + 1];
      // Setup chains (snap targets, then run the visible tween) are one beat.
      if (next?.type === 'animate') {
        return false;
      }
    }
    return true;
  }

  private setProgress(ms: number): void {
    const clamped = Math.max(0, Math.min(this.totalDurationMs, ms));
    this.elapsedMs.set(Math.round(clamped));
    this.progress.set(
      this.totalDurationMs > 0 ? clamped / this.totalDurationMs : 0,
    );
    this.syncActiveCheckpoint();
  }

  private syncProgress(): void {
    if (this.waitingForUser() || this.isComplete()) {
      this.setProgress(this.totalDurationMs);
      return;
    }

    let ms = this.eventOffsets[this.index] ?? 0;
    const event = this.events[this.index];

    if (this.atCheckpointHold() && event) {
      ms += this.eventDurationMs(event);
      this.setProgress(ms);
      return;
    }

    if (event?.type === 'narrate' && this.narratePlayback) {
      const speed = this.narratePlayback.event.speed ?? DEFAULT_NARRATE_SPEED_MS;
      const count = this.narratePlayback.count;
      ms += Math.max(0, count - 1) * speed;
      if (count > 0) {
        ms += Math.min(
          speed,
          performance.now() - this.narratePlayback.charStartedAt,
        );
      }
    } else if (event?.type === 'animate' && this.animatePlayback) {
      ms += this.animatePlayback.elapsedMs;
    }

    this.setProgress(ms);
  }

  private startProgressLoop(): void {
    this.stopProgressLoop();
    const tick = () => {
      this.syncProgress();
      if (this._running() && !this.isComplete() && !this.waitingForUser()) {
        this.progressRafId = scheduleAnimationFrame(tick);
      }
    };
    this.progressRafId = scheduleAnimationFrame(tick);
  }

  private stopProgressLoop(): void {
    cancelScheduledAnimationFrame(this.progressRafId);
    this.progressRafId = null;
  }

  private cancelTimers(): void {
    cancelScheduledAnimationFrame(this.rafId);
    this.rafId = null;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private abortPending(): void {
    this.cancelTimers();
    this.atCheckpointHold.set(false);
    this.narrateResolve = null;
    this.animateResolve = null;
  }

  private rebuildCompletedNarrateTexts(): void {
    const texts: string[] = [];
    for (let i = 0; i < this.index; i++) {
      const event = this.events[i];
      if (event.type === 'narrate') {
        texts.push(event.text);
      }
    }

    const current = this.events[this.index];
    if (current && current.type !== 'narrate' && texts.length > 0) {
      // Animate/wait between narrate beats: keep the last line in the current slot.
      texts.pop();
    }

    this.completedNarrateTexts.set(texts);
  }
}
