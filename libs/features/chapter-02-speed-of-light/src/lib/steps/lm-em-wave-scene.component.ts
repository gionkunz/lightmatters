import { Component, computed, input } from '@angular/core';

interface FieldStem {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

/**
 * 2-D depiction of a plane electromagnetic wave travelling along +x.
 *
 * The electric field $E$ (accent-1 / red) oscillates in the vertical plane; the
 * magnetic field $B$ (accent-2 / blue) oscillates in the perpendicular plane,
 * drawn along an isometric "into-the-page" diagonal. Both share one phase, so a
 * single `phase` input — animated by the timeline — slides the locked pair along x.
 */
@Component({
  selector: 'lm-em-wave-scene',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      class="block overflow-visible"
    >
      <!-- propagation axis -->
      <line
        [attr.x1]="axisLeft"
        [attr.y1]="midY()"
        [attr.x2]="axisRight()"
        [attr.y2]="midY()"
        class="stroke-ink"
        stroke-width="1"
        stroke-dasharray="2 5"
        opacity="0.45"
      />

      <!-- B-field stems (perpendicular plane) -->
      @for (stem of bStems(); track $index) {
        <line
          [attr.x1]="stem.x1"
          [attr.y1]="stem.y1"
          [attr.x2]="stem.x2"
          [attr.y2]="stem.y2"
          stroke="var(--lm-accent-2)"
          stroke-width="1"
          opacity="0.3"
        />
      }

      <!-- E-field stems (vertical plane) -->
      @for (stem of eStems(); track $index) {
        <line
          [attr.x1]="stem.x1"
          [attr.y1]="stem.y1"
          [attr.x2]="stem.x2"
          [attr.y2]="stem.y2"
          stroke="var(--lm-accent-1)"
          stroke-width="1"
          opacity="0.32"
        />
      }

      <!-- B-field sinusoid -->
      <polyline
        [attr.points]="bPoints()"
        fill="none"
        stroke="var(--lm-accent-2)"
        stroke-width="1.8"
        stroke-linejoin="round"
        stroke-linecap="round"
        opacity="0.85"
      />

      <!-- E-field sinusoid -->
      <polyline
        [attr.points]="ePoints()"
        fill="none"
        stroke="var(--lm-accent-1)"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <!-- propagation arrowhead -->
      <polyline
        [attr.points]="propArrow()"
        fill="none"
        class="stroke-ink"
        stroke-width="1.4"
        stroke-linejoin="round"
        stroke-linecap="round"
        opacity="0.6"
      />

      <text
        [attr.x]="axisRight() - 6"
        [attr.y]="midY() - 12"
        class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-60"
        text-anchor="end"
      >
        c →
      </text>
      <text
        [attr.x]="axisLeft + 2"
        [attr.y]="midY() - amplitude() - 8"
        class="font-mono text-[12px] uppercase tracking-wider"
        fill="var(--lm-accent-1)"
        opacity="0.9"
      >
        E
      </text>
      <text
        [attr.x]="axisLeft + 2"
        [attr.y]="midY() + amplitude() * 0.7 + 18"
        class="font-mono text-[12px] uppercase tracking-wider"
        fill="var(--lm-accent-2)"
        opacity="0.9"
      >
        B
      </text>
    </svg>
  `,
})
export class LmEmWaveSceneComponent {
  readonly width = input(640);
  readonly height = input(360);
  /** Travelling-wave phase (radians); animate this from the timeline. */
  readonly phase = input(0);
  /** Number of full wavelengths shown across the axis. */
  readonly cycles = input(2.5);

  protected readonly axisLeft = 28;
  private readonly samples = 96;
  private readonly stemEvery = 6;

  protected axisRight = computed(() => this.width() - 16);
  protected midY = computed(() => this.height() / 2);
  protected amplitude = computed(() => this.height() * 0.27);

  /** Isometric unit direction for the B-field "into the page" plane. */
  private readonly bDir = { x: 0.55, y: 0.42 };
  private bAmplitude = computed(() => this.height() * 0.22);

  private readonly samplePoints = computed(() => {
    const left = this.axisLeft;
    const right = this.axisRight();
    const span = right - left;
    const k = (2 * Math.PI * this.cycles()) / span;
    const phase = this.phase();
    const pts: { px: number; s: number }[] = [];
    for (let i = 0; i <= this.samples; i++) {
      const px = left + (span * i) / this.samples;
      const s = Math.sin(k * (px - left) - phase);
      pts.push({ px, s });
    }
    return pts;
  });

  protected ePoints = computed(() => {
    const mid = this.midY();
    const amp = this.amplitude();
    return this.samplePoints()
      .map(({ px, s }) => `${px.toFixed(1)},${(mid - amp * s).toFixed(1)}`)
      .join(' ');
  });

  protected bPoints = computed(() => {
    const mid = this.midY();
    const amp = this.bAmplitude();
    return this.samplePoints()
      .map(
        ({ px, s }) =>
          `${(px + this.bDir.x * amp * s).toFixed(1)},${(mid + this.bDir.y * amp * s).toFixed(1)}`,
      )
      .join(' ');
  });

  protected eStems = computed<FieldStem[]>(() => {
    const mid = this.midY();
    const amp = this.amplitude();
    const stems: FieldStem[] = [];
    const pts = this.samplePoints();
    for (let i = 0; i < pts.length; i += this.stemEvery) {
      const { px, s } = pts[i];
      stems.push({ x1: px, y1: mid, x2: px, y2: mid - amp * s });
    }
    return stems;
  });

  protected bStems = computed<FieldStem[]>(() => {
    const mid = this.midY();
    const amp = this.bAmplitude();
    const stems: FieldStem[] = [];
    const pts = this.samplePoints();
    for (let i = 0; i < pts.length; i += this.stemEvery) {
      const { px, s } = pts[i];
      stems.push({
        x1: px,
        y1: mid,
        x2: px + this.bDir.x * amp * s,
        y2: mid + this.bDir.y * amp * s,
      });
    }
    return stems;
  });

  protected propArrow = computed(() => {
    const x = this.axisRight();
    const y = this.midY();
    return `${x - 9},${y - 5} ${x},${y} ${x - 9},${y + 5}`;
  });
}
