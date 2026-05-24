import { Component, input, output } from '@angular/core';
import { LmInteractiveDirective } from '@lm/design';
import type { TimelineCheckpoint } from '../timeline/types';

function formatMs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

/** Music-player-style transport bar: controls + progress track + elapsed time. */
@Component({
  selector: 'lm-playback-bar',
  imports: [LmInteractiveDirective],
  template: `
    @if (visible()) {
      <div
        class="flex items-center gap-4 border-b border-ink-faint px-10 py-3"
        role="group"
        aria-label="Step playback"
      >
        <div class="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            lmInteractive
            class="flex size-8 cursor-pointer items-center justify-center bg-transparent font-mono text-sm text-ink opacity-40 transition-opacity hover:opacity-75 disabled:cursor-default disabled:opacity-20"
            [disabled]="!canGoPrevious()"
            (click)="goPrevious.emit()"
            aria-label="Previous checkpoint"
          >
            ⏮
          </button>

          @if (showPause()) {
            <button
              type="button"
              lmInteractive
              class="flex size-8 cursor-pointer items-center justify-center bg-transparent font-mono text-sm text-ink opacity-45 transition-opacity hover:opacity-75"
              (click)="pauseRequested.emit()"
              aria-label="Pause"
            >
              ⏸
            </button>
          }

          @if (showPlay()) {
            <button
              type="button"
              lmInteractive
              class="flex size-8 cursor-pointer items-center justify-center bg-transparent font-mono text-sm text-ink opacity-45 transition-opacity hover:opacity-75"
              (click)="playRequested.emit()"
              aria-label="Play"
            >
              ▶
            </button>
          }

          <button
            type="button"
            lmInteractive
            class="flex size-8 cursor-pointer items-center justify-center bg-transparent font-mono text-sm text-ink opacity-40 transition-opacity hover:opacity-75 disabled:cursor-default disabled:opacity-20"
            [disabled]="!canGoNext()"
            (click)="goNext.emit()"
            aria-label="Next checkpoint"
          >
            ⏭
          </button>
        </div>

        <div class="flex min-w-0 flex-1 items-center gap-3">
          <span
            class="shrink-0 font-mono text-[10.5px] tabular-nums tracking-wide text-ink opacity-35"
            >{{ formatMs(elapsedMs()) }}</span
          >
          <div
            class="relative h-2 min-w-0 flex-1 rounded-full bg-ink-very-faint"
            role="progressbar"
            [attr.aria-valuenow]="progressPercent()"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              class="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-ink-faint"
              [style.width.%]="progress() * 100"
            ></div>
            @for (checkpoint of checkpoints(); track checkpoint.eventIndex) {
              <button
                type="button"
                lmInteractive
                class="group absolute top-1/2 z-10 flex size-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition-transform duration-150 hover:scale-110"
                [style.left.%]="checkpoint.position * 100"
                [attr.aria-label]="'Go to checkpoint ' + ($index + 1)"
                [attr.aria-current]="
                  $index === activeCheckpointIndex() ? 'step' : null
                "
                (click)="checkpointSeek.emit(checkpoint.eventIndex)"
              >
                <span
                  class="block rounded-full transition-colors duration-150"
                  [class]="checkpointDotClasses($index)"
                ></span>
              </button>
            }
          </div>
          <span
            class="shrink-0 font-mono text-[10.5px] tabular-nums tracking-wide text-ink opacity-35"
            >{{ formatMs(totalMs()) }}</span
          >
        </div>
      </div>
    }
  `,
})
export class LmPlaybackBarComponent {
  readonly visible = input(false);
  readonly progress = input(0);
  readonly elapsedMs = input(0);
  readonly totalMs = input(0);
  readonly checkpoints = input<TimelineCheckpoint[]>([]);
  readonly activeCheckpointIndex = input(0);
  readonly showPause = input(false);
  readonly showPlay = input(false);
  readonly canGoPrevious = input(false);
  readonly canGoNext = input(false);

  readonly goPrevious = output<void>();
  readonly pauseRequested = output<void>();
  readonly playRequested = output<void>();
  readonly goNext = output<void>();
  readonly checkpointSeek = output<number>();

  protected formatMs = formatMs;

  protected progressPercent(): number {
    return Math.round(Math.max(0, Math.min(1, this.progress())) * 100);
  }

  protected checkpointDotClasses(index: number): string {
    const active = this.activeCheckpointIndex();

    if (index === active) {
      return 'size-4 bg-accent-1';
    }
    if (index < active) {
      return 'size-3.5 bg-ink-soft';
    }
    return 'size-3.5 bg-surface-sunken group-hover:bg-ink-soft';
  }
}
