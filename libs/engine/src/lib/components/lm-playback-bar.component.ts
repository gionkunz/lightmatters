import { Component, input, output } from '@angular/core';
import { LmInteractiveDirective } from '@lm/design';

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
            class="flex size-8 cursor-pointer items-center justify-center border border-ink-faint bg-transparent font-mono text-sm text-ink opacity-70 transition-opacity hover:opacity-100 disabled:cursor-default disabled:opacity-25"
            [disabled]="!canRewind()"
            (click)="rewind.emit()"
            aria-label="Rewind"
          >
            ⏮
          </button>

          @if (showPause()) {
            <button
              type="button"
              lmInteractive
              class="flex size-8 cursor-pointer items-center justify-center border border-ink-faint bg-transparent font-mono text-sm text-ink opacity-80 transition-opacity hover:opacity-100"
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
              class="flex size-8 cursor-pointer items-center justify-center border border-accent-1 bg-transparent font-mono text-sm text-ink opacity-90 transition-opacity hover:opacity-100"
              (click)="playRequested.emit()"
              aria-label="Play"
            >
              ▶
            </button>
          }

          <button
            type="button"
            lmInteractive
            class="flex size-8 cursor-pointer items-center justify-center border border-ink-faint bg-transparent font-mono text-sm text-ink opacity-70 transition-opacity hover:opacity-100 disabled:cursor-default disabled:opacity-25"
            [disabled]="!canFastForward()"
            (click)="fastForward.emit()"
            aria-label="Fast forward"
          >
            ⏭
          </button>
        </div>

        <div class="flex min-w-0 flex-1 items-center gap-3">
          <span
            class="shrink-0 font-mono text-[10.5px] tabular-nums tracking-wide text-ink opacity-50"
            >{{ formatMs(elapsedMs()) }}</span
          >
          <div
            class="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-ink opacity-[0.12]"
            role="progressbar"
            [attr.aria-valuenow]="progressPercent()"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              class="absolute inset-y-0 left-0 rounded-full bg-accent-1 transition-[width] duration-150 ease-linear"
              [style.width.%]="progressPercent()"
            ></div>
            @for (marker of beatMarkers(); track $index) {
              <span
                class="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink opacity-25"
                [style.left.%]="marker * 100"
              ></span>
            }
          </div>
          <span
            class="shrink-0 font-mono text-[10.5px] tabular-nums tracking-wide text-ink opacity-50"
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
  readonly beatMarkers = input<number[]>([]);
  readonly showPause = input(false);
  readonly showPlay = input(false);
  readonly canRewind = input(false);
  readonly canFastForward = input(false);

  readonly rewind = output<void>();
  readonly pauseRequested = output<void>();
  readonly playRequested = output<void>();
  readonly fastForward = output<void>();

  protected formatMs = formatMs;

  protected progressPercent(): number {
    return Math.round(Math.max(0, Math.min(1, this.progress())) * 100);
  }
}
