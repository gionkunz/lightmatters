import { DecimalPipe } from '@angular/common';
import { Component, HostListener, inject, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LmInteractiveDirective,
  LmKickerComponent,
  LmThemeToggleComponent,
  LmWordmarkComponent,
} from '@lm/design';
import type { TimelineCheckpoint } from '../timeline/types';
import { LmPlaybackBarComponent } from './lm-playback-bar.component';
import { parseStepUrl } from './step-url';

/** Step shell: nav, playback bar, and content. */
@Component({
  selector: 'lm-step-frame',
  imports: [
    DecimalPipe,
    RouterLink,
    LmWordmarkComponent,
    LmKickerComponent,
    LmThemeToggleComponent,
    LmPlaybackBarComponent,
    LmInteractiveDirective,
  ],
  template: `
    <div
      class="relative grid h-dvh max-h-dvh min-h-0 grid-rows-[auto_auto_1fr] overflow-hidden bg-paper font-serif text-ink transition-colors duration-400"
    >
      <nav
        class="grid grid-cols-[auto_1fr_auto] items-center gap-8 border-b border-ink-faint px-10 py-5"
      >
        <a
          routerLink="/"
          lmInteractive
          class="shrink-0 rounded-sm no-underline outline-none"
          aria-label="Light Matters home"
        >
          <lm-wordmark [size]="26" [bold]="true" />
        </a>

        <div
          class="flex min-w-0 flex-wrap items-baseline gap-x-6 gap-y-1"
        >
          <lm-kicker [opacity]="0.45"
            >chapter {{ chapter() | number: '2.0-0' }}</lm-kicker
          >
          <span
            class="font-serif text-[length:var(--lm-text-chrome)] italic opacity-85"
            >{{ chapterTitle() }}</span
          >
          <lm-kicker [opacity]="0.45"
            >step {{ step() | number: '2.0-0' }}</lm-kicker
          >
          <span
            class="min-w-0 font-serif text-[length:var(--lm-text-chrome)] italic opacity-85"
            >{{ stepTitle() }}</span
          >
        </div>

        <lm-theme-toggle />
      </nav>

      <lm-playback-bar
        [visible]="showPlayback()"
        [progress]="progress()"
        [elapsedMs]="elapsedMs()"
        [totalMs]="totalMs()"
        [checkpoints]="checkpoints()"
        [activeCheckpointIndex]="activeCheckpointIndex()"
        [showPause]="playbackActive()"
        [showPlay]="playbackPaused()"
        [canGoPrevious]="transportCanGoPrevious()"
        [canGoNext]="transportCanGoNext()"
        [previousHint]="previousHint()"
        [nextHint]="nextHint()"
        (goPrevious)="onGoPrevious()"
        (pauseRequested)="pauseRequested.emit()"
        (playRequested)="playRequested.emit()"
        (goNext)="onGoNext()"
        (checkpointSeek)="checkpointSeek.emit($event)"
      />

      <main class="min-h-0 overflow-hidden">
        <ng-content />
      </main>
    </div>
  `,
})
export class LmStepFrameComponent {
  private readonly router = inject(Router);

  readonly chapter = input.required<number>();
  readonly chapterTitle = input.required<string>();
  readonly stepTitle = input.required<string>();
  readonly step = input.required<number>();
  readonly stepsTotal = input.required<number>();
  readonly hasNextStep = input(false);
  readonly nextChapter = input(false);
  readonly prevStepUrl = input<string | null>(null);
  readonly nextStepUrl = input<string | null>(null);
  readonly advanceDisabled = input(false);

  readonly showPlayback = input(false);
  readonly progress = input(0);
  readonly elapsedMs = input(0);
  readonly totalMs = input(0);
  readonly checkpoints = input<TimelineCheckpoint[]>([]);
  readonly activeCheckpointIndex = input(0);
  readonly playbackActive = input(false);
  readonly playbackPaused = input(false);
  /** Runner can seek to a prior checkpoint within the current step. */
  readonly canGoPrevious = input(false);
  /** Runner can advance to the next checkpoint within the current step. */
  readonly canGoNext = input(false);

  readonly goPrevious = output<void>();
  readonly pauseRequested = output<void>();
  readonly playRequested = output<void>();
  readonly goNext = output<void>();
  readonly checkpointSeek = output<number>();

  @HostListener('document:keydown', ['$event'])
  onTransportKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }
    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') {
      return;
    }
    event.preventDefault();
    if (event.key === 'ArrowLeft') {
      this.onGoPrevious();
    } else {
      this.onGoNext();
    }
  }

  transportPrevious(): void {
    this.onGoPrevious();
  }

  transportNext(): void {
    this.onGoNext();
  }

  protected onGoPrevious(): void {
    if (this.atFirstCheckpoint()) {
      const url = this.prevStepUrl();
      if (url !== null && url !== '') {
        void this.router.navigateByUrl(url);
      }
      return;
    }
    if (this.canGoPrevious()) {
      this.goPrevious.emit();
    }
  }

  protected onGoNext(): void {
    if (
      this.atLastCheckpoint() &&
      this.hasNextStep() &&
      !this.advanceDisabled()
    ) {
      const url = this.nextStepUrl();
      if (url) {
        void this.router.navigateByUrl(url);
      }
      return;
    }
    if (this.canGoNext()) {
      this.goNext.emit();
    }
  }

  protected transportCanGoPrevious(): boolean {
    if (this.atFirstCheckpoint()) {
      return !!this.prevStepUrl();
    }
    return this.canGoPrevious();
  }

  protected transportCanGoNext(): boolean {
    if (this.atLastCheckpoint()) {
      return (
        (this.hasNextStep() && !this.advanceDisabled() && !!this.nextStepUrl()) ||
        this.canGoNext()
      );
    }
    return this.canGoNext();
  }

  protected previousHint(): string {
    if (!this.atFirstCheckpoint() || !this.prevStepUrl()) {
      return '';
    }
    const url = this.prevStepUrl();
    if (!url) {
      return '';
    }
    if (url === '/') {
      return 'home';
    }
    const parsed = parseStepUrl(url);
    if (parsed && parsed.chapter !== this.chapter()) {
      return 'previous chapter';
    }
    return `step ${this.step() - 1}`;
  }

  protected nextHint(): string {
    if (
      !this.atLastCheckpoint() ||
      !this.hasNextStep() ||
      this.advanceDisabled() ||
      !this.nextStepUrl()
    ) {
      return '';
    }
    if (this.nextChapter()) {
      return 'next chapter';
    }
    return `step ${this.step() + 1}`;
  }

  protected atFirstCheckpoint(): boolean {
    return this.activeCheckpointIndex() === 0;
  }

  protected atLastCheckpoint(): boolean {
    const total = this.checkpoints().length;
    return total > 0 && this.activeCheckpointIndex() >= total - 1;
  }
}
