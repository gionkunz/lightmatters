import { Component, computed, input } from '@angular/core';

const VIEW_W = 560;
const VIEW_H = 380;
const COM_X = VIEW_W / 2;
const BOX_W = 250;
const BOX_H = 150;
const BOX_TOP = (VIEW_H - BOX_H) / 2;
const BOX_BOTTOM = BOX_TOP + BOX_H;
const WALL_INSET = 16;
const EMIT_END = 0.12;
const ABSORB_START = 0.85;
const MAX_RECOIL = 72;

/**
 * Photon-in-a-box (center-of-mass) derivation. A floating box emits a photon
 * from its left wall; the box recoils left while the photon crosses to the
 * right wall. The dashed center-of-mass line stays fixed throughout — so the
 * light must have carried mass `m = E/c²` to the right to balance the books.
 */
@Component({
  selector: 'lm-photon-box',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox"
      preserveAspectRatio="xMidYMid meet"
      class="text-ink"
    >
      <!-- Fixed spatial reference: a baseline with tick marks (never moves) -->
      <g class="text-ink" stroke="currentColor" stroke-opacity="0.18">
        <line
          [attr.x1]="40"
          [attr.y1]="baselineY"
          [attr.x2]="viewW - 40"
          [attr.y2]="baselineY"
          stroke-width="1"
        />
        @for (t of ticks; track t) {
          <line
            [attr.x1]="t"
            [attr.y1]="baselineY - 4"
            [attr.x2]="t"
            [attr.y2]="baselineY + 4"
            stroke-width="1"
          />
        }
      </g>

      <!-- Ghost of the box's starting position (fixed reference) -->
      <g class="text-ink" stroke="currentColor" fill="none" stroke-opacity="0.22">
        <rect
          [attr.x]="boxLeft"
          [attr.y]="boxTop"
          [attr.width]="boxW"
          [attr.height]="boxH"
          stroke-width="1.5"
          stroke-dasharray="2 6"
        />
        <text
          [attr.x]="boxLeft + 5"
          [attr.y]="boxBottom - 7"
          class="fill-ink font-mono"
          font-size="10"
          fill-opacity="0.5"
          stroke="none"
        >
          start
        </text>
      </g>

      <!-- Fixed center-of-mass reference -->
      <g class="text-ink">
        <line
          [attr.x1]="comX"
          y1="40"
          [attr.x2]="comX"
          [attr.y2]="viewH - 40"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-dasharray="4 5"
          stroke-opacity="0.55"
        />
        <text
          [attr.x]="comX"
          y="30"
          text-anchor="middle"
          class="fill-ink font-mono"
          font-size="11"
          fill-opacity="0.55"
        >
          center of mass
        </text>
      </g>

      <!-- Box length L (fixed dimension over the starting frame, drawn on top) -->
      <g class="text-ink" stroke="currentColor" stroke-opacity="0.6">
        <line
          [attr.x1]="boxLeft"
          [attr.y1]="boxTop - 16"
          [attr.x2]="boxRight"
          [attr.y2]="boxTop - 16"
          stroke-width="1.25"
        />
        <line [attr.x1]="boxLeft" [attr.y1]="boxTop - 20" [attr.x2]="boxLeft" [attr.y2]="boxTop - 12" stroke-width="1.25" />
        <line [attr.x1]="boxRight" [attr.y1]="boxTop - 20" [attr.x2]="boxRight" [attr.y2]="boxTop - 12" stroke-width="1.25" />
        <text
          [attr.x]="comX + 12"
          [attr.y]="boxTop - 21"
          text-anchor="middle"
          class="fill-ink font-serif italic"
          font-size="15"
          fill-opacity="0.9"
          stroke="none"
        >
          L
        </text>
      </g>

      <!-- The floating box (recoils left) -->
      <g
        [attr.transform]="'translate(' + boxShift() + ',0)'"
        stroke="currentColor"
        stroke-width="2.4"
        fill="none"
      >
        <rect
          [attr.x]="boxLeft"
          [attr.y]="boxTop"
          [attr.width]="boxW"
          [attr.height]="boxH"
        />
        <!-- emitting / absorbing walls highlighted -->
        <line
          class="text-accent-1"
          stroke="currentColor"
          [attr.x1]="boxLeft"
          [attr.y1]="boxTop"
          [attr.x2]="boxLeft"
          [attr.y2]="boxBottom"
          [attr.stroke-width]="emitGlow() ? 4 : 2.4"
        />
        <line
          class="text-accent-2"
          stroke="currentColor"
          [attr.x1]="boxRight"
          [attr.y1]="boxTop"
          [attr.x2]="boxRight"
          [attr.y2]="boxBottom"
          [attr.stroke-width]="absorbGlow() ? 4 : 2.4"
        />
      </g>

      <!-- Recoil velocity arrow (left, labelled v), shown while in flight -->
      @if (inFlight()) {
        <g class="text-accent-1" stroke="currentColor" fill="currentColor">
          <line
            [attr.x1]="comX + boxShift() - 26"
            [attr.y1]="recoilY"
            [attr.x2]="comX + boxShift() - 26 - recoilArrow()"
            [attr.y2]="recoilY"
            stroke-width="2"
          />
          <path [attr.d]="recoilHead()" />
          <text
            [attr.x]="comX + boxShift() - 26 - recoilArrow() / 2"
            [attr.y]="recoilY - 7"
            text-anchor="middle"
            class="fill-ink font-serif italic"
            font-size="13"
            stroke="none"
          >
            v
          </text>
        </g>
      }

      <!-- Δx bracket: leftward shift of the box from its starting outline -->
      @if (showShift()) {
        <g class="text-accent-1" stroke="currentColor" stroke-opacity="0.8">
          <line [attr.x1]="boxLeft" [attr.y1]="shiftY - 5" [attr.x2]="boxLeft" [attr.y2]="shiftY + 5" stroke-width="1" />
          <line
            [attr.x1]="boxLeft + boxShift()"
            [attr.y1]="shiftY - 5"
            [attr.x2]="boxLeft + boxShift()"
            [attr.y2]="shiftY + 5"
            stroke-width="1"
          />
          <line
            [attr.x1]="boxLeft + boxShift()"
            [attr.y1]="shiftY"
            [attr.x2]="boxLeft"
            [attr.y2]="shiftY"
            stroke-width="1"
          />
          <text
            [attr.x]="boxLeft + boxShift() / 2"
            [attr.y]="shiftY - 6"
            text-anchor="middle"
            class="fill-ink font-serif italic"
            font-size="12"
            stroke="none"
            fill-opacity="0.85"
          >
            Δx
          </text>
        </g>
      }

      <!-- The photon: travels left wall → right wall -->
      @if (photonVisible()) {
        <circle
          class="text-accent-2"
          [attr.cx]="photonX()"
          [attr.cy]="midY"
          [attr.r]="photonR()"
          fill="currentColor"
        />
        <circle
          class="text-accent-2"
          [attr.cx]="photonX()"
          [attr.cy]="midY"
          [attr.r]="photonR() + 6"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-opacity="0.4"
        />
      }
    </svg>
  `,
})
export class PhotonBoxComponent {
  readonly width = input(560);
  readonly height = input(380);
  /** 0 → 1 timeline progress: emit → cross → absorb. */
  readonly progress = input(0);
  /** 0 → 1 photon energy: scales recoil distance and photon size. */
  readonly energy = input(0.5);

  protected readonly viewBox = `0 0 ${VIEW_W} ${VIEW_H}`;
  protected readonly viewH = VIEW_H;
  protected readonly viewW = VIEW_W;
  protected readonly baselineY = VIEW_H - 20;
  protected readonly ticks = Array.from(
    { length: Math.floor((VIEW_W - 80) / 36) + 1 },
    (_, i) => 40 + i * 36,
  );
  protected readonly comX = COM_X;
  protected readonly midY = VIEW_H / 2;
  protected readonly boxW = BOX_W;
  protected readonly boxH = BOX_H;
  protected readonly boxTop = BOX_TOP;
  protected readonly boxBottom = BOX_BOTTOM;
  protected readonly boxLeft = COM_X - BOX_W / 2;
  protected readonly boxRight = COM_X + BOX_W / 2;
  protected readonly recoilY = BOX_BOTTOM + 32;
  protected readonly shiftY = BOX_BOTTOM + 14;

  /** Fraction of the crossing completed, in [0, 1]. */
  private readonly travelT = computed(() => {
    const p = this.clampedProgress();
    return Math.min(1, Math.max(0, (p - EMIT_END) / (ABSORB_START - EMIT_END)));
  });

  /** Box recoils left, proportional to photon energy and crossing progress. */
  protected readonly boxShift = computed(
    () => -MAX_RECOIL * this.clampedEnergy() * this.travelT(),
  );

  protected readonly inFlight = computed(() => {
    const p = this.clampedProgress();
    return p > EMIT_END && p < ABSORB_START;
  });

  protected readonly emitGlow = computed(
    () => this.clampedProgress() <= EMIT_END + 0.06,
  );
  protected readonly absorbGlow = computed(
    () => this.clampedProgress() >= ABSORB_START - 0.04,
  );

  protected readonly photonVisible = computed(
    () => this.clampedProgress() > EMIT_END * 0.4 && this.clampedProgress() < ABSORB_START + 0.02,
  );

  protected readonly photonR = computed(() => 4 + 8 * this.clampedEnergy());

  protected readonly recoilArrow = computed(() => 18 + 40 * this.clampedEnergy());

  protected readonly showShift = computed(() => this.boxShift() < -3);

  protected photonX(): number {
    const innerLeft = this.boxLeft + WALL_INSET;
    const innerRight = this.boxRight - WALL_INSET;
    return innerLeft + (innerRight - innerLeft) * this.travelT() + this.boxShift();
  }

  protected recoilHead(): string {
    const tipX = this.comX + this.boxShift() - 26 - this.recoilArrow();
    const y = this.recoilY;
    return `M${tipX},${y} L${tipX + 9},${y - 5} L${tipX + 9},${y + 5} Z`;
  }

  private clampedProgress(): number {
    return Math.min(1, Math.max(0, this.progress()));
  }

  private clampedEnergy(): number {
    return Math.min(1, Math.max(0, this.energy()));
  }
}
