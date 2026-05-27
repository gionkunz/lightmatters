import { Component, input, output } from '@angular/core';
import { LmInteractiveDirective, LmKickerComponent } from '@lm/design';
import type { TimelineCheckpoint } from '../timeline/types';

function formatMs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

/** Music-player-style transport bar: progress track + centered transport controls. */
@Component({
  selector: 'lm-playback-bar',
  imports: [LmInteractiveDirective, LmKickerComponent],
  styles: [
    `
      @keyframes lm-play-pulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 var(--lm-glow-1);
        }
        50% {
          box-shadow: 0 0 0 8px transparent, 0 0 18px var(--lm-glow-1);
        }
      }

      .lm-play-pulse {
        animation: lm-play-pulse 2s ease-in-out infinite;
      }
    `,
  ],
  template: `
    @if (visible()) {
      <div
        class="flex flex-col gap-3 border-b border-ink-faint px-10 py-3"
        role="group"
        aria-label="Step playback"
      >
        <div class="flex min-w-0 items-center gap-3">
          <span
            class="shrink-0 font-mono text-[length:var(--lm-text-mono-sm)] tabular-nums tracking-wide text-ink opacity-35"
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
                class="group absolute top-1/2 z-10 flex size-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full outline-none transition-transform duration-150 hover:scale-110 focus-visible:shadow-[0_0_0_4px_var(--lm-glow-1)]"
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
            class="shrink-0 font-mono text-[length:var(--lm-text-mono-sm)] tabular-nums tracking-wide text-ink opacity-35"
            >{{ formatMs(totalMs()) }}</span
          >
        </div>

        <div class="flex items-center justify-center gap-4">
          <div
            class="flex w-[16rem] shrink-0 items-center justify-end gap-2"
          >
            <div
              class="flex w-[12rem] shrink-0 items-center justify-end whitespace-nowrap"
              data-lm-transport-hint="previous"
              [class.invisible]="!previousHint()"
              [attr.aria-hidden]="!previousHint()"
            >
              <lm-kicker [opacity]="0.45">{{ previousHint() }}</lm-kicker>
            </div>
            <button
              type="button"
              lmInteractive
              class="flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink-faint bg-transparent font-mono text-2xl text-ink opacity-70 transition-opacity hover:opacity-100 disabled:cursor-default disabled:opacity-25"
              [disabled]="!canGoPrevious()"
              (click)="goPrevious.emit()"
              aria-label="Previous checkpoint"
            >
              ⏮
            </button>
          </div>

          <div class="flex shrink-0 items-center gap-4">
            @if (showPause()) {
              <button
                type="button"
                lmInteractive
                class="flex size-14 cursor-pointer items-center justify-center rounded-full border border-ink-faint bg-transparent font-mono text-2xl text-ink opacity-75 transition-opacity hover:opacity-100"
                (click)="pauseRequested.emit()"
                aria-label="Pause"
              >
                ⏸
              </button>
            } @else if (showPlay()) {
              <button
                type="button"
                lmInteractive
                class="lm-play-pulse flex size-14 cursor-pointer items-center justify-center rounded-full border-2 border-accent-1 bg-transparent font-mono text-2xl text-accent-1 transition-opacity hover:opacity-100"
                (click)="playRequested.emit()"
                aria-label="Play"
              >
                ▶
              </button>
            } @else {
              <button
                type="button"
                disabled
                class="flex size-14 cursor-default items-center justify-center rounded-full border border-ink-faint bg-transparent font-mono text-2xl text-ink opacity-25"
                aria-label="Play"
              >
                ▶
              </button>
            }
          </div>

          <div
            class="flex w-[16rem] shrink-0 items-center justify-start gap-2"
          >
            <button
              type="button"
              lmInteractive
              class="flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink-faint bg-transparent font-mono text-2xl text-ink opacity-70 transition-opacity hover:opacity-100 disabled:cursor-default disabled:opacity-25"
              [disabled]="!canGoNext()"
              (click)="goNext.emit()"
              aria-label="Next checkpoint"
            >
              ⏭
            </button>
            <div
              class="flex w-[12rem] shrink-0 items-center justify-start whitespace-nowrap"
              data-lm-transport-hint="next"
              [class.invisible]="!nextHint()"
              [attr.aria-hidden]="!nextHint()"
            >
              <lm-kicker [opacity]="0.45">{{ nextHint() }}</lm-kicker>
            </div>
          </div>
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
  readonly previousHint = input('');
  readonly nextHint = input('');

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
