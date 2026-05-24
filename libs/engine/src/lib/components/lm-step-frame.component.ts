import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  LmButtonComponent,
  LmKickerComponent,
  LmThemeToggleComponent,
  LmWordmarkComponent,
} from '@lm/design';
import type { TimelineCheckpoint } from '../timeline/types';
import { LmPlaybackBarComponent } from './lm-playback-bar.component';

/** Step shell: nav, playback bar, content, navigation footer. */
@Component({
  selector: 'lm-step-frame',
  imports: [
    DecimalPipe,
    LmWordmarkComponent,
    LmKickerComponent,
    LmThemeToggleComponent,
    LmButtonComponent,
    LmPlaybackBarComponent,
  ],
  template: `
    <div
      class="relative grid min-h-screen grid-rows-[auto_auto_1fr_auto] bg-paper font-serif text-ink transition-colors duration-400"
    >
      <nav
        class="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-7 border-b border-ink-faint px-10 py-5"
      >
        <lm-wordmark [size]="20" />
        <div class="flex items-center gap-4">
          <lm-kicker [opacity]="0.45"
            >chapter {{ chapter() | number: '2.0-0' }}</lm-kicker
          >
          <span class="font-serif text-[17px] italic opacity-85">{{
            chapterTitle()
          }}</span>
        </div>
        <div class="flex items-center gap-1">
          @for (dot of dots(); track $index) {
            <span
              class="h-[5px] rounded-full transition-all duration-400"
              [class.w-3]="dot.here"
              [class.w-[5px]]="!dot.here"
              [class.bg-accent-1]="dot.here"
              [class.bg-ink]="dot.filled && !dot.here"
              [class.border]="!dot.filled && !dot.here"
              [class.border-ink-faint]="!dot.filled && !dot.here"
              [class.bg-transparent]="!dot.filled && !dot.here"
              [style.box-shadow]="
                dot.here ? '0 0 8px var(--lm-glow-1)' : 'none'
              "
            ></span>
          }
        </div>
        <lm-kicker [opacity]="0.5"
          >{{ step() | number: '2.0-0' }} /
          {{ stepsTotal() | number: '2.0-0' }}</lm-kicker
        >
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
        [canGoPrevious]="canGoPrevious()"
        [canGoNext]="canGoNext()"
        (goPrevious)="goPrevious.emit()"
        (pauseRequested)="pauseRequested.emit()"
        (playRequested)="playRequested.emit()"
        (goNext)="goNext.emit()"
        (checkpointSeek)="checkpointSeek.emit($event)"
      />

      <main class="overflow-hidden">
        <ng-content />
      </main>

      <footer
        class="flex items-center justify-between gap-6 border-t border-ink-faint px-10 py-[18px]"
      >
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <span
              class="inline-flex min-w-[22px] items-center justify-center border border-ink-faint px-1.5 py-0.5 font-mono text-[11px] opacity-70"
              >←</span
            >
            <lm-kicker [opacity]="0.45">back</lm-kicker>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex min-w-[22px] items-center justify-center border border-ink-faint px-1.5 py-0.5 font-mono text-[11px] opacity-70"
              >␣</span
            >
            <lm-kicker [opacity]="0.45">pause / skip</lm-kicker>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-3.5">
          <lm-button [emphasis]="true" (click)="back.emit()">← back</lm-button>
          @if (hasNextStep()) {
            <lm-button
              [primary]="true"
              [emphasis]="true"
              (click)="next.emit()"
              >{{ nextChapter() ? 'next chapter →' : 'continue →' }}</lm-button
            >
          }
        </div>
      </footer>
    </div>
  `,
})
export class LmStepFrameComponent {
  readonly chapter = input.required<number>();
  readonly chapterTitle = input.required<string>();
  readonly step = input.required<number>();
  readonly stepsTotal = input.required<number>();
  readonly hasNextStep = input(false);
  readonly nextChapter = input(false);

  readonly showPlayback = input(false);
  readonly progress = input(0);
  readonly elapsedMs = input(0);
  readonly totalMs = input(0);
  readonly checkpoints = input<TimelineCheckpoint[]>([]);
  readonly activeCheckpointIndex = input(0);
  readonly playbackActive = input(false);
  readonly playbackPaused = input(false);
  readonly canGoPrevious = input(false);
  readonly canGoNext = input(false);

  readonly back = output<void>();
  readonly next = output<void>();
  readonly goPrevious = output<void>();
  readonly pauseRequested = output<void>();
  readonly playRequested = output<void>();
  readonly goNext = output<void>();
  readonly checkpointSeek = output<number>();

  protected dots(): { filled: boolean; here: boolean }[] {
    const current = this.step();
    return Array.from({ length: this.stepsTotal() }, (_, k) => ({
      filled: k < current - 1,
      here: k === current - 1,
    }));
  }
}
