import { Component, computed, input } from '@angular/core';

const VIEW_W = 560;
const VIEW_H = 380;
const SUN_X = 70;
const SUN_Y = VIEW_H / 2;
const SAIL_REST_X = 330;
const SAIL_TRAVEL = 150;
const RAY_YS = [VIEW_H / 2 - 78, VIEW_H / 2 - 26, VIEW_H / 2 + 26, VIEW_H / 2 + 78];

/** Line-art Sun + solar sail: light streams rightward and pushes the sail along. */
@Component({
  selector: 'lm-solar-sail',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox"
      preserveAspectRatio="xMidYMid meet"
      class="text-ink"
    >
      <!-- Sun -->
      <g class="text-accent-1">
        <circle
          [attr.cx]="sunX"
          [attr.cy]="sunY"
          r="26"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        @for (a of sunRays; track a) {
          <line
            [attr.x1]="sunX + 30 * cos(a)"
            [attr.y1]="sunY + 30 * sin(a)"
            [attr.x2]="sunX + 40 * cos(a)"
            [attr.y2]="sunY + 40 * sin(a)"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        }
      </g>

      <!-- Streaming light: dots travelling left to right along each ray -->
      <g class="text-accent-1">
        @for (y of rayYs; track y) {
          <line
            [attr.x1]="sunX + 46"
            [attr.y1]="y"
            [attr.x2]="sailX() - 8"
            [attr.y2]="y"
            stroke="currentColor"
            stroke-width="1"
            stroke-opacity="0.25"
            stroke-dasharray="2 8"
          />
          <circle
            [attr.cx]="photonX(y)"
            [attr.cy]="y"
            r="3.5"
            fill="currentColor"
          />
        }
      </g>

      <!-- Solar sail: a sail plus a small payload, pushed rightward -->
      <g
        [attr.transform]="'translate(' + sailX() + ',0)'"
        stroke="currentColor"
        stroke-width="2.4"
        fill="none"
      >
        <line x1="0" [attr.y1]="sunY - 70" x2="0" [attr.y2]="sunY + 70" />
        <line x1="-10" [attr.y1]="sunY - 70" x2="0" [attr.y2]="sunY - 58" />
        <line x1="-10" [attr.y1]="sunY + 70" x2="0" [attr.y2]="sunY + 58" />
        <line x1="0" [attr.y1]="sunY" x2="26" [attr.y2]="sunY" />
        <circle [attr.cx]="34" [attr.cy]="sunY" r="8" fill="currentColor" />
      </g>

      <!-- Push arrow -->
      <g class="text-ink" stroke="currentColor" fill="currentColor">
        <line
          [attr.x1]="sailX() + 48"
          [attr.y1]="sunY"
          [attr.x2]="sailX() + 84"
          [attr.y2]="sunY"
          stroke-width="2"
          stroke-opacity="0.6"
        />
        <path
          [attr.d]="
            'M' +
            (sailX() + 84) +
            ',' +
            (sunY - 5) +
            ' L' +
            (sailX() + 94) +
            ',' +
            sunY +
            ' L' +
            (sailX() + 84) +
            ',' +
            (sunY + 5) +
            ' Z'
          "
          fill-opacity="0.6"
        />
      </g>
    </svg>
  `,
})
export class SolarSailComponent {
  readonly width = input(560);
  readonly height = input(380);
  /** 0 → 1 timeline progress; advances the photons and the sail. */
  readonly progress = input(0);

  protected readonly viewBox = `0 0 ${VIEW_W} ${VIEW_H}`;
  protected readonly sunX = SUN_X;
  protected readonly sunY = SUN_Y;
  protected readonly rayYs = RAY_YS;
  protected readonly sunRays = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);

  protected readonly sailX = computed(
    () => SAIL_REST_X + SAIL_TRAVEL * this.clamped(),
  );

  protected cos(a: number): number {
    return Math.cos(a);
  }
  protected sin(a: number): number {
    return Math.sin(a);
  }

  /** Photon dot position along a ray, cycling between Sun and sail. */
  protected photonX(y: number): number {
    const start = this.sunX + 46;
    const end = this.sailX() - 8;
    const phase = (this.clamped() * 2 + (y % 2 === 0 ? 0 : 0.5)) % 1;
    return start + (end - start) * phase;
  }

  private clamped(): number {
    return Math.min(1, Math.max(0, this.progress()));
  }
}
