import { Component, computed, input } from '@angular/core';
import {
  circularOrbitPosition,
  circularOrbitVelocity,
  etherDraggedPulseCenter,
  etherDraggedPulseRadii,
  etherWindVector,
  vec2,
} from '@lm/physics';

/** Matches timeline `ether.frameSpeed` animate `to` value. */
const MAX_FRAME_SPEED = 0.4;
const GRID_COLS = 12;
const GRID_ROWS = 8;
const ORBIT_RADIUS = 0.28;
const PULSE_INTERVAL = 0.18;
/** Pulse expansion rate in SVG pixels per scene-time unit. */
const PULSE_SCENE_C = 42;
const PULSE_SCENE_DURATION = 2.8;
const ORBIT_ANIM_DURATION = 4;
/** Phase 2 ends here (three-quarters lap); phase 3 continues the arc. */
const ORBIT_END_PHASE2 = (3 * Math.PI) / 2;
const ORBIT_ARC_PHASE3 = Math.PI / 2;

interface GridCell {
  x: number;
  y: number;
}

interface FieldArrow {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  head: string;
}

interface DraggedPulse {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  emitX: number;
  emitY: number;
  opacity: number;
}

interface OrbitMarker {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface EarthDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

@Component({
  selector: 'lm-ether-field-scene',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox"
      class="block h-auto max-w-full overflow-visible"
      aria-label="Ether vector field visualization"
      role="img"
    >
      @if (phase() < 4) {
        @if (showDots()) {
          @for (cell of gridCells(); track cell.x + ',' + cell.y) {
            <circle
              [attr.cx]="cell.x"
              [attr.cy]="cell.y"
              r="2.2"
              class="fill-ink"
              opacity="0.35"
            />
          }
        } @else {
          @for (arrow of fieldArrows(); track arrow.x1 + ',' + arrow.y1) {
            <line
              [attr.x1]="arrow.x1"
              [attr.y1]="arrow.y1"
              [attr.x2]="arrow.x2"
              [attr.y2]="arrow.y2"
              class="stroke-ink"
              stroke-width="1.2"
              stroke-linecap="round"
              opacity="0.38"
            />
            <polyline
              [attr.points]="arrow.head"
              class="stroke-ink"
              fill="none"
              stroke-width="1.2"
              stroke-linejoin="round"
              stroke-linecap="round"
              opacity="0.38"
            />
          }
        }

        @if (phase() <= 1) {
          <circle
            [attr.cx]="linearDotPosition().x"
            [attr.cy]="linearDotPosition().y"
            r="6"
            class="fill-accent-1"
            [style.filter]="'drop-shadow(0 0 6px var(--lm-glow-1))'"
          />
        } @else {
          <circle
            [attr.cx]="dotPosition().x"
            [attr.cy]="dotPosition().y"
            r="6"
            class="fill-accent-1"
            [style.filter]="'drop-shadow(0 0 6px var(--lm-glow-1))'"
          />

          @if (phase() >= 3) {
            @for (pulse of draggedPulses(); track $index) {
              <circle
                [attr.cx]="pulse.emitX"
                [attr.cy]="pulse.emitY"
                r="3"
                class="fill-accent-1"
                [attr.opacity]="pulse.opacity * 0.55"
              />
              <ellipse
                [attr.cx]="pulse.cx"
                [attr.cy]="pulse.cy"
                [attr.rx]="pulse.rx"
                [attr.ry]="pulse.ry"
                [attr.transform]="'rotate(' + pulse.rotation + ' ' + pulse.cx + ' ' + pulse.cy + ')'"
                fill="none"
                stroke="var(--lm-accent-1)"
                stroke-width="1.8"
                [attr.opacity]="pulse.opacity"
              />
            }
          }
        }
      } @else {
        <!-- Earth orbit + abstract fringe readout -->
        <ellipse
          [attr.cx]="centerX"
          [attr.cy]="centerY + 8"
          rx="118"
          ry="68"
          class="stroke-ink"
          fill="none"
          stroke-width="1"
          opacity="0.35"
        />

        @for (marker of orbitMarkers(); track $index) {
          <line
            [attr.x1]="marker.x"
            [attr.y1]="marker.y"
            [attr.x2]="marker.x + marker.vx * 22"
            [attr.y2]="marker.y + marker.vy * 22"
            class="stroke-ink"
            stroke-width="1.2"
            stroke-linecap="round"
            opacity="0.3"
          />
          <circle
            [attr.cx]="marker.x"
            [attr.cy]="marker.y"
            r="4"
            class="fill-ink"
            opacity="0.25"
          />
        }

        <line
          [attr.x1]="earthDot().x"
          [attr.y1]="earthDot().y"
          [attr.x2]="earthDot().x + earthDot().vx * 22"
          [attr.y2]="earthDot().y + earthDot().vy * 22"
          class="stroke-ink"
          stroke-width="1.2"
          stroke-linecap="round"
          opacity="0.75"
        />
        <circle
          [attr.cx]="earthDot().x"
          [attr.cy]="earthDot().y"
          r="7"
          class="fill-accent-1"
          [style.filter]="'drop-shadow(0 0 5px var(--lm-glow-1))'"
        />

        <text
          [attr.x]="centerX"
          [attr.y]="36"
          text-anchor="middle"
          class="fill-ink font-mono text-[10px] uppercase tracking-wider"
          opacity="0.55"
        >
          earth · four seasons
        </text>

        <text
          x="72"
          y="318"
          class="fill-accent-1 font-mono text-[9px] uppercase tracking-wider"
        >
          observed: null
        </text>
        @for (i of fringeBars; track i) {
          <rect
            [attr.x]="60 + i * 9"
            y="274"
            width="5"
            [attr.height]="38"
            class="fill-accent-1"
            [attr.opacity]="i % 2 === 0 ? 0.85 : 0.35"
          />
        }

        <text
          x="328"
          y="318"
          class="fill-ink font-mono text-[9px] uppercase tracking-wider"
          opacity="0.45"
        >
          expected shift
        </text>
        @for (i of fringeBars; track i) {
          <rect
            [attr.x]="expectedFringeOffset() + 328 + i * 9"
            y="274"
            width="5"
            height="38"
            class="fill-ink"
            [attr.opacity]="i % 2 === 0 ? 0.22 : 0.08"
          />
        }
      }
    </svg>
  `,
})
export class LmEtherFieldSceneComponent {
  readonly width = input(560);
  readonly height = input(380);
  readonly phase = input(0);
  readonly frameSpeed = input(0);
  readonly orbitAngle = input(0);
  readonly phase3OrbitOrigin = input(ORBIT_END_PHASE2);
  readonly time = input(0);
  readonly earthOrbitIndex = input(0);

  /** Dot angle during phase 3 — tied to dragScene time so the ball tracks the expanding pulses. */
  private readonly effectiveOrbitAngle = computed(() => {
    if (this.phase() >= 3 && this.phase() < 4) {
      return this.phase3OrbitOrigin() + this.time() * ORBIT_ARC_PHASE3;
    }
    return this.orbitAngle();
  });

  protected readonly fringeBars = [0, 1, 2, 3, 4];
  protected readonly viewBox = '0 0 560 380';
  protected readonly centerX = 280;
  protected readonly centerY = 188;

  private readonly plotLeft = 48;
  private readonly plotRight = 512;
  private readonly plotTop = 36;
  private readonly plotBottom = 332;

  protected readonly showDots = computed(() => {
    if (this.phase() >= 4) return false;
    if (this.phase() === 0) return true;
    if (this.phase() === 1) return this.frameSpeed() < 0.02;
    return false;
  });

  protected readonly windVelocity = computed(() => {
    if (this.phase() === 1) {
      return etherWindVector(vec2(this.frameSpeed(), 0));
    }
    if (this.phase() >= 2 && this.phase() < 4) {
      const radius = this.orbitPixelRadius();
      const angle = this.effectiveOrbitAngle();
      const angularSpeed =
        this.phase() >= 3
          ? ORBIT_ARC_PHASE3 / PULSE_SCENE_DURATION
          : ORBIT_END_PHASE2 / ORBIT_ANIM_DURATION;
      const v = circularOrbitVelocity(angle, radius, angularSpeed);
      return etherWindVector(v);
    }
    return vec2(0, 0);
  });

  protected readonly gridCells = computed((): GridCell[] => {
    const cells: GridCell[] = [];
    const spanX = this.plotRight - this.plotLeft;
    const spanY = this.plotBottom - this.plotTop;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        cells.push({
          x: this.plotLeft + (spanX * (col + 0.5)) / GRID_COLS,
          y: this.plotTop + (spanY * (row + 0.5)) / GRID_ROWS,
        });
      }
    }
    return cells;
  });

  protected readonly fieldArrows = computed((): FieldArrow[] => {
    if (this.showDots() || this.phase() >= 4) return [];
    const wind = this.windVelocity();
    const speed = Math.hypot(wind.x, wind.y);
    if (speed < 0.02) return [];

    const maxLen = 14;
    const len = Math.min(maxLen, maxLen * (speed / MAX_FRAME_SPEED));

    return this.gridCells().map((cell) => {
      const nx = wind.x / speed;
      const ny = wind.y / speed;
      const x2 = cell.x + nx * len;
      const y2 = cell.y + ny * len;
      return {
        x1: cell.x,
        y1: cell.y,
        x2,
        y2,
        head: this.arrowHead(x2, y2, nx, ny),
      };
    });
  });

  protected readonly dotPosition = computed(() =>
    circularOrbitPosition(
      this.effectiveOrbitAngle(),
      this.orbitPixelRadius(),
      vec2(this.centerX, this.centerY),
    ),
  );

  /** Phase 1: frame moves right through the ether; wind arrows point left. */
  protected readonly linearDotPosition = computed(() => {
    const t = Math.min(1, Math.max(0, this.frameSpeed() / MAX_FRAME_SPEED));
    const radius = this.orbitPixelRadius();
    return {
      x: this.centerX + t * radius,
      y: this.centerY,
    };
  });

  protected readonly draggedPulses = computed((): DraggedPulse[] => {
    if (this.phase() < 3) return [];
    const sceneTime = this.time() * PULSE_SCENE_DURATION;
    if (sceneTime <= 0) return [];

    const pulses: DraggedPulse[] = [];
    const radius = this.orbitPixelRadius();
    const angularSpeed = ORBIT_ARC_PHASE3 / PULSE_SCENE_DURATION;
    const currentAngle = this.effectiveOrbitAngle();

    for (let emitAt = 0; emitAt <= sceneTime + 0.001; emitAt += PULSE_INTERVAL) {
      const elapsed = sceneTime - emitAt;
      if (elapsed <= 0.02) continue;

      const emitAngle = currentAngle - elapsed * angularSpeed;
      const emitPos = circularOrbitPosition(
        emitAngle,
        radius,
        vec2(this.centerX, this.centerY),
      );
      const v = circularOrbitVelocity(emitAngle, radius, angularSpeed);
      const speed = Math.hypot(v.x, v.y);
      const center = etherDraggedPulseCenter(emitPos, v, elapsed);
      const { rx, ry } = etherDraggedPulseRadii(elapsed, speed, PULSE_SCENE_C);
      if (rx < 3) continue;

      const rotation = (Math.atan2(v.y, v.x) * 180) / Math.PI;
      const ageFade = Math.max(0.4, 1 - elapsed / (PULSE_SCENE_DURATION * 1.1));

      pulses.push({
        cx: center.x,
        cy: center.y,
        rx,
        ry,
        rotation,
        emitX: emitPos.x,
        emitY: emitPos.y,
        opacity: 0.88 * ageFade,
      });
    }
    return pulses;
  });

  protected readonly orbitMarkers = computed((): OrbitMarker[] => {
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const center = vec2(this.centerX, this.centerY + 8);
    return angles.map((angle) => {
      const pos = circularOrbitPosition(angle, 68, center);
      const v = circularOrbitVelocity(angle, 68, 1);
      const vLen = Math.hypot(v.x, v.y) || 1;
      return {
        x: pos.x,
        y: pos.y,
        vx: v.x / vLen,
        vy: v.y / vLen,
      };
    });
  });

  /** Earth travels three-quarters of its orbit across the four seasonal checkpoints. */
  protected readonly earthDot = computed((): EarthDot => {
    const t = Math.min(3, Math.max(0, this.earthOrbitIndex()));
    const angle = (t / 3) * ((3 * Math.PI) / 2);
    const center = vec2(this.centerX, this.centerY + 8);
    const pos = circularOrbitPosition(angle, 68, center);
    const v = circularOrbitVelocity(angle, 68, 1);
    const vLen = Math.hypot(v.x, v.y) || 1;
    return {
      x: pos.x,
      y: pos.y,
      vx: v.x / vLen,
      vy: v.y / vLen,
    };
  });

  protected readonly expectedFringeOffset = computed(() => {
    const index = Math.round(Math.min(3, Math.max(0, this.earthOrbitIndex())));
    return [-6, 0, 6, 0][index] ?? 0;
  });

  private orbitPixelRadius(): number {
    const span = Math.min(this.plotRight - this.plotLeft, this.plotBottom - this.plotTop);
    return span * ORBIT_RADIUS;
  }

  private arrowHead(tipX: number, tipY: number, dx: number, dy: number): string {
    const px = -dy;
    const py = dx;
    const wing = 4.5;
    const back = 7;
    return [
      `${tipX - dx * back + px * wing},${tipY - dy * back + py * wing}`,
      `${tipX},${tipY}`,
      `${tipX - dx * back - px * wing},${tipY - dy * back - py * wing}`,
    ].join(' ');
  }
}
