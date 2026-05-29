import { Component, computed, input } from '@angular/core';

const VIEW_W = 560;
const VIEW_H = 380;
const PIVOT_X = VIEW_W / 2;
const BEAM_Y = 196;
const PIVOT_BASE_Y = 250;
const BLOCK = 50;
const LIGHT_ARM = 178;
const BOX_ARM_MIN = 30;
const BOX_ARM_MAX = 130;
const LIGHT_R_MIN = 5;
const LIGHT_R_MAX = 22;

/**
 * See-saw view of the photon-in-a-box balance: a heavy box close to the pivot
 * (small lever arm Δx) balances the feather-light photon far out (long arm L).
 * The beam stays level because the moments match: M·Δx = m·L. Raising the
 * photon energy grows both Δx (box arm) and m (photon size) together, so the
 * beam holds level — the visual proof that the balance survives any energy.
 */
@Component({
  selector: 'lm-balance-beam',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox"
      preserveAspectRatio="xMidYMid meet"
      class="text-ink"
    >
      <!-- Level reference -->
      <line
        [attr.x1]="60"
        [attr.y1]="beamY"
        [attr.x2]="viewW - 60"
        [attr.y2]="beamY"
        stroke="currentColor"
        stroke-width="1"
        stroke-opacity="0.18"
        stroke-dasharray="3 6"
      />

      <!-- Fulcrum -->
      <g class="text-ink" stroke="currentColor" fill="currentColor">
        <path
          [attr.d]="
            'M' + pivotX + ',' + beamY + ' L' + (pivotX - 22) + ',' + pivotBaseY + ' L' + (pivotX + 22) + ',' + pivotBaseY + ' Z'
          "
          fill-opacity="0.12"
          stroke-width="1.5"
        />
      </g>

      <!-- Beam (level) -->
      <rect
        [attr.x]="pivotX - 200"
        [attr.y]="beamY - 4"
        width="400"
        height="8"
        rx="4"
        class="text-ink"
        fill="currentColor"
        fill-opacity="0.85"
      />

      <!-- Arm measures -->
      <g class="text-ink" stroke="currentColor" stroke-opacity="0.4" fill="none">
        <line [attr.x1]="pivotX" [attr.y1]="armY" [attr.x2]="pivotX - boxArm()" [attr.y2]="armY" stroke-width="1" />
        <line [attr.x1]="pivotX" [attr.y1]="armY" [attr.x2]="pivotX + lightArm" [attr.y2]="armY" stroke-width="1" />
      </g>
      <text [attr.x]="pivotX - boxArm() / 2" [attr.y]="armY + 18" text-anchor="middle" class="fill-ink font-serif italic" font-size="14" fill-opacity="0.7">Δx</text>
      <text [attr.x]="pivotX + lightArm / 2" [attr.y]="armY + 18" text-anchor="middle" class="fill-ink font-serif italic" font-size="14" fill-opacity="0.7">L</text>

      <!-- Box weight (heavy, near pivot) -->
      <g class="text-accent-1">
        <rect
          [attr.x]="pivotX - boxArm() - block / 2"
          [attr.y]="beamY - block - 4"
          [attr.width]="block"
          [attr.height]="block"
          fill="currentColor"
          fill-opacity="0.16"
          stroke="currentColor"
          stroke-width="2.2"
        />
        <text
          [attr.x]="pivotX - boxArm()"
          [attr.y]="beamY - block / 2 + 1"
          text-anchor="middle"
          dominant-baseline="middle"
          class="fill-ink font-serif italic"
          font-size="18"
        >
          M
        </text>
      </g>

      <!-- Photon weight (light, far out) -->
      <g class="text-accent-2">
        <circle
          [attr.cx]="pivotX + lightArm"
          [attr.cy]="beamY - lightR() - 4"
          [attr.r]="lightR()"
          fill="currentColor"
        />
        <text
          [attr.x]="pivotX + lightArm"
          [attr.y]="beamY - lightR() - 4 - lightR() - 8"
          text-anchor="middle"
          class="fill-ink font-serif italic"
          font-size="16"
        >
          m
        </text>
      </g>
    </svg>
  `,
})
export class BalanceBeamComponent {
  readonly width = input(560);
  readonly height = input(380);
  /** 0 → 1 photon energy: grows the box arm (Δx) and the photon mass (m) together. */
  readonly energy = input(0.5);

  protected readonly viewBox = `0 0 ${VIEW_W} ${VIEW_H}`;
  protected readonly viewW = VIEW_W;
  protected readonly pivotX = PIVOT_X;
  protected readonly beamY = BEAM_Y;
  protected readonly pivotBaseY = PIVOT_BASE_Y;
  protected readonly armY = PIVOT_BASE_Y + 16;
  protected readonly block = BLOCK;
  protected readonly lightArm = LIGHT_ARM;

  protected readonly boxArm = computed(
    () => BOX_ARM_MIN + (BOX_ARM_MAX - BOX_ARM_MIN) * this.clamped(),
  );
  protected readonly lightR = computed(
    () => LIGHT_R_MIN + (LIGHT_R_MAX - LIGHT_R_MIN) * this.clamped(),
  );

  private clamped(): number {
    return Math.min(1, Math.max(0, this.energy()));
  }
}
