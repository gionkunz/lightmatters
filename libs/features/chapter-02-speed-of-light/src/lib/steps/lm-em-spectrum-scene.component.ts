import { Component, computed, input } from '@angular/core';
import { EM_SPECTRUM_BANDS, type EmSpectrumBandId } from './em-spectrum-data';

export type { EmSpectrumBandId };

/** Horizontal EM spectrum strip; `highlightIndex` is -1 for overview or 0–6 for the active band. */
@Component({
  selector: 'lm-em-spectrum-scene',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      class="block overflow-visible"
    >
      <text
        [attr.x]="padX"
        [attr.y]="padY"
        [attr.font-size]="axisLabelFontSize()"
        dominant-baseline="hanging"
        class="fill-ink font-mono uppercase opacity-50"
        [attr.letter-spacing]="labelTracking()"
      >
        low frequency
      </text>
      <text
        [attr.x]="width() - padX"
        [attr.y]="padY"
        [attr.font-size]="axisLabelFontSize()"
        dominant-baseline="hanging"
        text-anchor="end"
        class="fill-ink font-mono uppercase opacity-50"
        [attr.letter-spacing]="labelTracking()"
      >
        high frequency
      </text>

      <line
        [attr.x1]="padX"
        [attr.y1]="axisY()"
        [attr.x2]="width() - padX"
        [attr.y2]="axisY()"
        class="stroke-ink"
        stroke-width="1"
        opacity="0.35"
      />

      @for (band of bands; track band.id; let i = $index) {
        <rect
          [attr.x]="bandRect(i).x"
          [attr.y]="bandRect(i).y"
          [attr.width]="bandRect(i).w"
          [attr.height]="bandRect(i).h"
          [attr.rx]="3"
          [attr.fill]="bandFill(i)"
          [attr.opacity]="bandOpacity(i)"
        />
        @if (isActive(i)) {
          <rect
            [attr.x]="bandRect(i).x - 2"
            [attr.y]="bandRect(i).y - 3"
            [attr.width]="bandRect(i).w + 4"
            [attr.height]="bandRect(i).h + 6"
            [attr.rx]="4"
            fill="none"
            stroke="var(--lm-accent-2)"
            stroke-width="2"
            [style.filter]="'drop-shadow(0 0 8px var(--lm-glow-2))'"
          />
        }

        <text
          [attr.x]="bandCenter(i)"
          [attr.y]="bandLabelAnchorY(i)"
          [attr.dy]="bandLabelDy()"
          [attr.font-size]="bandLabelFontSize(i)"
          [attr.font-weight]="isActive(i) ? 600 : 400"
          text-anchor="middle"
          class="font-mono uppercase"
          [attr.fill]="bandTextFill(i)"
          [attr.opacity]="bandOpacity(i)"
          [attr.letter-spacing]="labelTracking()"
        >
          {{ bandLabel(i) }}
        </text>
      }
    </svg>
  `,
})
export class LmEmSpectrumSceneComponent {
  readonly width = input(640);
  readonly height = input(200);
  /** -1 = overview; 0–6 selects one band. */
  readonly highlightIndex = input(-1);

  protected readonly bands = EM_SPECTRUM_BANDS;
  protected readonly padX = 24;
  protected readonly padY = 14;

  protected axisY = computed(() => this.height() * 0.38);
  protected innerWidth = computed(() => this.width() - this.padX * 2);
  protected barHeight = computed(() => this.height() * 0.156);
  protected activeBarHeight = computed(() => this.barHeight() * 1.12);
  protected labelFontSize = computed(() => this.height() * 0.058);
  protected axisLabelFontSize = computed(() => this.height() * 0.052);
  protected labelGap = computed(() => this.height() * 0.05);
  protected labelTracking = computed(() => this.labelFontSize() * 0.14);

  protected isActive(index: number): boolean {
    return this.highlightIndex() === index;
  }

  protected bandLabel(index: number): string {
    return this.isActive(index)
      ? EM_SPECTRUM_BANDS[index].label
      : EM_SPECTRUM_BANDS[index].short;
  }

  protected bandLabelFontSize(index: number): number {
    return this.isActive(index)
      ? this.labelFontSize() * 1.06
      : this.labelFontSize();
  }

  protected bandLabelAnchorY(index: number): number {
    const rect = this.bandRect(index);
    return rect.y + rect.h;
  }

  protected bandLabelDy(): number {
    return this.labelGap() + this.labelFontSize() * 0.95;
  }

  protected bandRect(index: number): { x: number; y: number; w: number; h: number } {
    const band = EM_SPECTRUM_BANDS[index];
    const w = this.innerWidth();
    const x = this.padX + band.x0 * w;
    const bw = (band.x1 - band.x0) * w - 2;
    const h = this.isActive(index) ? this.activeBarHeight() : this.barHeight();
    const y = this.axisY() - h / 2;
    return { x, y, w: Math.max(8, bw), h };
  }

  protected bandCenter(index: number): number {
    const r = this.bandRect(index);
    return r.x + r.w / 2;
  }

  protected bandOpacity(index: number): number {
    const hi = this.highlightIndex();
    if (hi < 0) {
      return 0.72;
    }
    return this.isActive(index) ? 1 : 0.22;
  }

  protected bandFill(index: number): string {
    if (EM_SPECTRUM_BANDS[index].id === 'visible') {
      return 'var(--lm-accent-1)';
    }
    if (this.isActive(index)) {
      return 'var(--lm-accent-2)';
    }
    return 'var(--lm-ink)';
  }

  protected bandTextFill(index: number): string {
    if (this.isActive(index)) {
      return 'var(--lm-accent-2)';
    }
    return 'var(--lm-ink)';
  }
}
