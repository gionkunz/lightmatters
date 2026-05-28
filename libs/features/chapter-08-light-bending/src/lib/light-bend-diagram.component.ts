import { Component, computed, input } from '@angular/core';
import {
  DEFAULT_LIGHT_BEND_2D_LAYOUT,
  SINGLE_RAY_LIGHT_BEND_LAYOUT,
  lightBend2DPathD,
  type LightBend2DLayout,
} from '@lm/physics';

export type LightBendDiagramMode = 'mass-only' | 'single' | 'dual';

const VB_W = 100;
const VB_H = 72;

@Component({
  selector: 'lm-light-bend-diagram',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="'0 0 ' + vbW + ' ' + vbH"
      preserveAspectRatio="xMidYMid meet"
      class="block max-h-full max-w-full"
      aria-hidden="true"
    >
      <circle
        [attr.cx]="layout().massCx"
        [attr.cy]="layout().massCy"
        [attr.r]="layout().massR"
        class="fill-ink stroke-ink"
        stroke-width="0.6"
      />

      @if (mode() === 'dual') {
        <path
          [attr.d]="outerPathD()"
          class="fill-none stroke-accent-2"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          pathLength="1"
          stroke-dasharray="1"
          [attr.stroke-dashoffset]="1 - progress()"
        />
      }
      @if (mode() === 'single' || mode() === 'dual') {
        <path
          [attr.d]="innerPathD()"
          class="fill-none stroke-accent-1"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          pathLength="1"
          stroke-dasharray="1"
          [attr.stroke-dashoffset]="1 - progress()"
        />
      }

      @if (showPathHints()) {
        <text
          [attr.x]="layout().sourcePos"
          [attr.y]="layout().beamCenter + layout().beamHalfWidth + 4"
          class="fill-accent-1 font-mono uppercase opacity-75"
          font-size="2.6"
        >
          inner · shorter
        </text>
        <text
          [attr.x]="layout().sourcePos"
          [attr.y]="layout().beamCenter - layout().beamHalfWidth - 2"
          class="fill-accent-2 font-mono uppercase opacity-75"
          font-size="2.6"
        >
          outer · longer
        </text>
      }
    </svg>
  `,
})
export class LmLightBendDiagramComponent {
  protected readonly vbW = VB_W;
  protected readonly vbH = VB_H;

  readonly width = input(560);
  readonly height = input(380);
  readonly progress = input(1);
  readonly mode = input<LightBendDiagramMode>('mass-only');
  readonly deflection = input(DEFAULT_LIGHT_BEND_2D_LAYOUT.deflection);
  readonly beamHalfWidth = input(DEFAULT_LIGHT_BEND_2D_LAYOUT.beamHalfWidth);
  readonly showPathHints = input(false);

  protected readonly layout = computed<LightBend2DLayout>(() => {
    const base =
      this.mode() === 'single' || this.mode() === 'mass-only'
        ? SINGLE_RAY_LIGHT_BEND_LAYOUT
        : DEFAULT_LIGHT_BEND_2D_LAYOUT;
    return {
      ...base,
      deflection: this.deflection(),
      beamHalfWidth:
        this.mode() === 'dual' ? this.beamHalfWidth() : base.beamHalfWidth,
    };
  });

  /** Always render the full path; dashoffset reveals it for smooth animation. */
  protected readonly innerPathD = computed(() => {
    if (this.mode() === 'mass-only') return '';
    const edge = this.mode() === 'single' ? 'center' : 'inner';
    return lightBend2DPathD(edge, this.layout(), 96);
  });

  protected readonly outerPathD = computed(() => {
    if (this.mode() !== 'dual') return '';
    return lightBend2DPathD('outer', this.layout(), 96);
  });
}
