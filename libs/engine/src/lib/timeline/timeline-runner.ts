import { computed, signal } from '@angular/core';
import { interpolate } from './easing';
import type {
  AnimateEvent,
  NarrateEvent,
  TimelineCheckpoint,
  TimelineEvent,
  WaitEvent,
} from './types';
import { narrateTextTypingUnits } from './narrate-text';
import { TargetRegistry } from './target-registry';

/** Default hold after a narrate beat finishes typing (not applied before exploration wait). */
export const DEFAULT_NARRATE_READ_PAUSE_MS = 4000;

interface NarratePlayback {
  event: NarrateEvent;
  count: number;
  phase: 'typing' | 'read';
  readRemainingMs: number;
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
  readonly atReadPause = signal(false);
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
  private readPauseStartedAt = 0;
  private readPauseTotalMs = 0;
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

  /** Timeline is actively playing (typing, tweening, or read pause). */
  isPlaying(): boolean {
    return this.playbackActive();
  }

  canGoToPreviousCheckpoint(): boolean {
    if (this.isComplete() || this.checkpointEventIndices.length === 0) {
      return false;
    }
    if (this.waitingForUser()) {
      return true;
    }
    return (
      this.getActiveCheckpointIndex() > 0 || this.hasPartialCurrentEvent()
    );
  }

  canGoToNextCheckpoint(): boolean {
    return !this.isComplete() && !this.waitingForUser();
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
    this.atReadPause.set(false);
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

    if (this.narratePlayback?.phase === 'read') {
      const elapsed = performance.now() - this.readPauseStartedAt;
      this.narratePlayback = {
        ...this.narratePlayback,
        readRemainingMs: Math.max(0, this.readPauseTotalMs - elapsed),
      };
    }

    this.cancelTimers();
    this.isPaused.set(true);
  }

  resume(): void {
    if (!this.isPaused() || this.isComplete() || this.waitingForUser()) {
      return;
    }

    this.isPaused.set(false);

    if (this.narratePlayback) {
      if (this.narratePlayback.phase === 'typing') {
        this.narratePlayback.charStartedAt = performance.now();
      }
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
    if (this.waitingForUser()) {
      targetCpIdx = cps.length - 1;
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
    this.atReadPause.set(false);
    this.narratePlayback = null;
    this.animatePlayback = null;
    this.setProgress(this.eventOffsets[eventIndex] ?? 0);
    this.syncActiveCheckpoint();
    this.startProgressLoop();
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

  skipReadPause(): void {
    if (!this.atReadPause()) {
      return;
    }
    this.atReadPause.set(false);
    this.narratePlayback = null;
    this.cancelTimers();
    this.narrateResolve?.();
    this.narrateResolve = null;
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
        this.handleWait(event);
        return;
      }
      this.executeEventInstantly(event);
      this.index++;
    }

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
      this.atReadPause.set(false);
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
      this.atReadPause.set(false);
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
    return Promise.resolve();
  }

  private beginNarrate(event: NarrateEvent): Promise<void> {
    this.narrationText.set(event.text);
    if (!this.narratePlayback) {
      this.narrationVisibleCount.set(0);
      this.narratePlayback = {
        event,
        count: 0,
        phase: 'typing',
        readRemainingMs: 0,
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

    const { event, phase } = this.narratePlayback;
    const speed = event.speed ?? 28;
    const pauseAfter = this.narratePauseAfter(event, this.index);

    if (phase === 'typing') {
      const count = this.narratePlayback.count;
      const totalUnits = narrateTextTypingUnits(event.text);
      if (count >= totalUnits) {
        if (this.isPreExplorationNarrate(this.index)) {
          this.atExplorationWait.set(true);
        }
        this.startReadPause(event, pauseAfter);
        return;
      }

      this.narratePlayback.count = count + 1;
      this.narratePlayback.charStartedAt = performance.now();
      this.narrationVisibleCount.set(this.narratePlayback.count);
      this.timeoutId = setTimeout(() => this.continueNarrate(), speed);
      return;
    }

    const remaining = this.narratePlayback.readRemainingMs;
    this.readPauseStartedAt = performance.now();
    this.readPauseTotalMs = remaining;
    this.timeoutId = setTimeout(() => {
      this.atReadPause.set(false);
      this.narratePlayback = null;
      this.narrateResolve?.();
      this.narrateResolve = null;
    }, remaining);
  }

  private startReadPause(event: NarrateEvent, pauseAfter: number): void {
    if (pauseAfter <= 0) {
      this.narratePlayback = null;
      this.narrateResolve?.();
      this.narrateResolve = null;
      return;
    }

    this.narratePlayback = {
      event,
      count: narrateTextTypingUnits(event.text),
      phase: 'read',
      readRemainingMs: pauseAfter,
      charStartedAt: performance.now(),
    };
    this.readPauseTotalMs = pauseAfter;
    this.readPauseStartedAt = performance.now();
    this.atReadPause.set(true);
    this.continueNarrate();
  }

  private beginAnimate(event: AnimateEvent): Promise<void> {
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
        this.animatePlayback = null;
        this.animateResolve?.();
        this.animateResolve = null;
        return;
      }

      this.rafId = requestAnimationFrame(frame);
    };

    this.rafId = requestAnimationFrame(frame);
  }

  private finish(): void {
    this._running.set(false);
    this.isComplete.set(true);
    this.isPaused.set(false);
    this.waitingForUser.set(false);
    this.narratePlayback = null;
    this.animatePlayback = null;
    this.setProgress(this.totalDurationMs);
    this.syncActiveCheckpoint();
    this.stopProgressLoop();
  }

  private getActiveCheckpointIndex(): number {
    if (this.waitingForUser() || this.isComplete()) {
      return Math.max(0, this.checkpointEventIndices.length - 1);
    }

    const idx = this.checkpointEventIndices.indexOf(this.index);
    return idx >= 0 ? idx : 0;
  }

  private hasPartialCurrentEvent(): boolean {
    if (this.narratePlayback) {
      return (
        this.narratePlayback.count > 0 || this.narratePlayback.phase === 'read'
      );
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
      offset += this.eventDurationMs(this.events[i], i);
    }

    const totalMs = offset;
    const checkpointEventIndices: number[] = [];
    const checkpoints: TimelineCheckpoint[] = [];

    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].type === 'wait') {
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

  private eventDurationMs(event: TimelineEvent, eventIndex: number): number {
    if (event.type === 'narrate') {
      const pauseAfter = this.narratePauseAfter(event, eventIndex);
      return (
        narrateTextTypingUnits(event.text) * (event.speed ?? 28) +
        (pauseAfter > 0 ? pauseAfter : 0)
      );
    }
    if (event.type === 'animate') {
      return event.duration * 1000;
    }
    return 0;
  }

  private isPreExplorationNarrate(eventIndex: number): boolean {
    const next = this.events[eventIndex + 1];
    return next?.type === 'wait' && next.for === 'userAdvance';
  }

  private narratePauseAfter(event: NarrateEvent, eventIndex: number): number {
    if (this.isPreExplorationNarrate(eventIndex)) {
      return 0;
    }
    return event.pauseAfter ?? DEFAULT_NARRATE_READ_PAUSE_MS;
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

    if (event?.type === 'narrate' && this.narratePlayback) {
      const speed = this.narratePlayback.event.speed ?? 28;
      if (this.narratePlayback.phase === 'typing') {
        const count = this.narratePlayback.count;
        ms += Math.max(0, count - 1) * speed;
        if (count > 0) {
          ms += Math.min(
            speed,
            performance.now() - this.narratePlayback.charStartedAt,
          );
        }
      } else {
        ms += this.narratePlayback.count * speed;
        ms += Math.min(
          this.readPauseTotalMs,
          performance.now() - this.readPauseStartedAt,
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
        this.progressRafId = requestAnimationFrame(tick);
      }
    };
    this.progressRafId = requestAnimationFrame(tick);
  }

  private stopProgressLoop(): void {
    if (this.progressRafId !== null) {
      cancelAnimationFrame(this.progressRafId);
      this.progressRafId = null;
    }
  }

  private cancelTimers(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private abortPending(): void {
    this.cancelTimers();
    this.narrateResolve = null;
    this.animateResolve = null;
  }
}
