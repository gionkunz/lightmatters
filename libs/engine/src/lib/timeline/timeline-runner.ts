import { computed, signal } from '@angular/core';
import { interpolate } from './easing';
import type {
  AnimateEvent,
  NarrateEvent,
  TimelineEvent,
  WaitEvent,
} from './types';
import { TargetRegistry } from './target-registry';

interface NarratePlayback {
  event: NarrateEvent;
  count: number;
  phase: 'typing' | 'read';
  readRemainingMs: number;
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
  readonly beatMarkers = signal<number[]>([]);
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
  private progressRafId: number | null = null;

  constructor(
    private readonly events: TimelineEvent[],
    private readonly registry: TargetRegistry,
  ) {
    const schedule = this.buildTimelineSchedule();
    this.eventOffsets = schedule.offsets;
    this.totalDurationMs = schedule.totalMs;
    this.beatMarkers.set(schedule.markers);
  }

  getTotalDurationMs(): number {
    return this.totalDurationMs;
  }

  /** Timeline is actively playing (typing, tweening, or read pause). */
  isPlaying(): boolean {
    return this.playbackActive();
  }

  start(): void {
    this.reset();
    this._running.set(true);
    this.startProgressLoop();
    void this.runNext();
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
      this.continueNarrate();
      return;
    }

    if (this.animatePlayback) {
      this.continueAnimate();
    }
  }

  rewind(): void {
    if (this.isComplete() && this.index >= this.events.length) {
      // allow replay from end
    }

    this.abortPending();
    this.registry.resetAll();
    this.index = 0;
    this._running.set(true);
    this.isPaused.set(false);
    this.isComplete.set(false);
    this.waitingForUser.set(false);
    this.atExplorationWait.set(false);
    this.atReadPause.set(false);
    this.narrationText.set('');
    this.narrationVisibleCount.set(0);
    this.narratePlayback = null;
    this.animatePlayback = null;
    this.setProgress(0);
    this.startProgressLoop();
    void this.runNext();
  }

  fastForward(): void {
    this.skip();
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
    void this.runNext();
  }

  skip(): void {
    if (this.isComplete()) {
      return;
    }

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

  private async runNext(): Promise<void> {
    if (!this._running() || this.index >= this.events.length) {
      this.finish();
      return;
    }

    const event = this.events[this.index];

    if (event.type === 'wait') {
      this.handleWait(event);
      return;
    }

    await this.executeEvent(event);
    this.narratePlayback = null;
    this.animatePlayback = null;
    this.index++;
    await this.runNext();
  }

  private handleWait(event: WaitEvent): void {
    if (event.for === 'userAdvance') {
      this.waitingForUser.set(true);
      this.atExplorationWait.set(true);
      this.setProgress(this.totalDurationMs);
      this.stopProgressLoop();
      return;
    }
    this.index++;
    void this.runNext();
  }

  private executeEventInstantly(event: TimelineEvent): void {
    if (event.type === 'narrate') {
      this.atReadPause.set(false);
      this.narrationText.set(event.text);
      this.narrationVisibleCount.set(event.text.length);
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
      this.narrationVisibleCount.set(event.text.length);
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
    const pauseAfter = event.pauseAfter ?? 2400;

    if (phase === 'typing') {
      const count = this.narratePlayback.count;
      if (count >= event.text.length) {
        this.startReadPause(event, pauseAfter);
        return;
      }

      this.narratePlayback.count = count + 1;
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
      count: event.text.length,
      phase: 'read',
      readRemainingMs: pauseAfter,
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
    this.stopProgressLoop();
  }

  private buildTimelineSchedule(): {
    offsets: number[];
    totalMs: number;
    markers: number[];
  } {
    const offsets: number[] = [];
    let offset = 0;

    for (const event of this.events) {
      offsets.push(offset);
      offset += this.eventDurationMs(event);
    }

    const totalMs = offset;
    const markers = offsets
      .filter((_, i) => this.events[i].type !== 'wait')
      .map((o) => (totalMs > 0 ? o / totalMs : 0));

    return { offsets, totalMs, markers };
  }

  private eventDurationMs(event: TimelineEvent): number {
    if (event.type === 'narrate') {
      const pauseAfter = event.pauseAfter ?? 2400;
      return (
        event.text.length * (event.speed ?? 28) +
        (pauseAfter > 0 ? pauseAfter : 0)
      );
    }
    if (event.type === 'animate') {
      return event.duration * 1000;
    }
    return 0;
  }

  private setProgress(ms: number): void {
    const clamped = Math.max(0, Math.min(this.totalDurationMs, ms));
    this.elapsedMs.set(Math.round(clamped));
    this.progress.set(
      this.totalDurationMs > 0 ? clamped / this.totalDurationMs : 0,
    );
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
      ms += this.narratePlayback.count * speed;
      if (this.narratePlayback.phase === 'read') {
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
