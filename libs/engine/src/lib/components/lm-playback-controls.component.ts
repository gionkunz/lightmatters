import { Component, input, output } from '@angular/core';
import { LmInteractiveDirective, LmKickerComponent } from '@lm/design';

/** Timeline transport: rewind, play/pause, fast-forward. */
@Component({
  selector: 'lm-playback-controls',
  imports: [LmInteractiveDirective, LmKickerComponent],
  template: `
    <div class="flex items-center gap-3">
      <button
        type="button"
        lmInteractive
        class="flex cursor-pointer items-center gap-2 border border-ink-faint bg-transparent px-2.5 py-1 font-mono text-[11px] text-ink opacity-70 transition-opacity hover:opacity-100 disabled:cursor-default disabled:opacity-30"
        [disabled]="!canRewind()"
        (click)="rewind.emit()"
        aria-label="Rewind"
      >
        <span aria-hidden="true">⏮</span>
        <lm-kicker [opacity]="0.45">rewind</lm-kicker>
      </button>

      @if (showPause()) {
        <button
          type="button"
          lmInteractive
          class="flex cursor-pointer items-center gap-2 border border-ink-faint bg-transparent px-2.5 py-1 font-mono text-[11px] text-ink opacity-70 transition-opacity hover:opacity-100"
        (click)="pauseRequested.emit()"
        aria-label="Pause"
      >
        <span aria-hidden="true">⏸</span>
        <lm-kicker [opacity]="0.45">pause</lm-kicker>
      </button>
      }

      @if (showPlay()) {
        <button
          type="button"
          lmInteractive
          class="flex cursor-pointer items-center gap-2 border border-accent-1 bg-transparent px-2.5 py-1 font-mono text-[11px] text-ink opacity-90 transition-opacity hover:opacity-100"
          (click)="playRequested.emit()"
          aria-label="Play"
        >
          <span aria-hidden="true">▶</span>
          <lm-kicker [opacity]="0.55">play</lm-kicker>
        </button>
      }

      <button
        type="button"
        lmInteractive
        class="flex cursor-pointer items-center gap-2 border border-ink-faint bg-transparent px-2.5 py-1 font-mono text-[11px] text-ink opacity-70 transition-opacity hover:opacity-100 disabled:cursor-default disabled:opacity-30"
        [disabled]="!canFastForward()"
        (click)="fastForward.emit()"
        aria-label="Fast forward"
      >
        <span aria-hidden="true">⏭</span>
        <lm-kicker [opacity]="0.45">forward</lm-kicker>
      </button>
    </div>
  `,
})
export class LmPlaybackControlsComponent {
  readonly showPause = input(false);
  readonly showPlay = input(false);
  readonly canRewind = input(false);
  readonly canFastForward = input(false);

  readonly rewind = output<void>();
  readonly pauseRequested = output<void>();
  readonly playRequested = output<void>();
  readonly fastForward = output<void>();
}
