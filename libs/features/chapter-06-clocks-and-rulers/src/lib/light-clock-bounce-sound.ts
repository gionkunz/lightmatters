import type { AudioService } from '@lm/design';

/** Progress jump larger than this is treated as timeline seek (no bounce sounds). */
const SEEK_JUMP = 0.25;

function tickPhase(progress: number): number {
  const p = Number.isFinite(progress) ? progress : 0;
  const wrapped = p - Math.floor(p);
  return wrapped < 0 ? wrapped + 1 : wrapped;
}

/** Plays a tick when clock progress crosses each mirror impact (phase 0.5 and 1.0). */
export class LightClockBounceSound {
  private lastPhase = 0;
  private lastProgress = 0;

  constructor(private readonly audio: AudioService) {}

  onProgress(progress: number): void {
    const phase = tickPhase(progress);
    const delta = progress - this.lastProgress;

    if (Math.abs(delta) > SEEK_JUMP) {
      this.lastPhase = phase;
      this.lastProgress = progress;
      return;
    }

    const prev = this.lastPhase;

    if (prev < 0.5 && phase >= 0.5) {
      this.playBounce();
    }

    if (prev > 0.85 && phase < 0.15) {
      this.playBounce();
    }

    this.lastPhase = phase;
    this.lastProgress = progress;
  }

  reset(): void {
    this.lastPhase = 0;
    this.lastProgress = 0;
  }

  private playBounce(): void {
    this.audio.play('tick', { volume: 0.45 });
  }
}
