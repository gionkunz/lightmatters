import {
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { lorentz } from '@lm/physics';

/** v/c above this is used for geometry only — avoids γ blow-up freezing the diagram. */
export const LIGHT_CLOCK_VISUAL_MAX_V_OVER_C = 0.98;

const MAX_LAB_GRID_LINES = 12;

/** Bouncing-photon light clock — vertical at rest, diagonal zigzag when moving. */
@Component({
  selector: 'lm-light-clock',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
      class="block"
      preserveAspectRatio="xMidYMid meet"
    >
      @for (line of labGridLines(); track line.id) {
        <line
          [attr.x1]="line.x"
          [attr.y1]="line.y0"
          [attr.x2]="line.x"
          [attr.y2]="line.y1"
          class="stroke-ink-faint light-clock-lab-grid"
          stroke-width="0.8"
          opacity="0.28"
        />
      }

      @if (showPaths()) {
        @if (velocity() > 0.01) {
          <line
            [attr.x1]="pathUp().x0"
            [attr.y1]="pathUp().y0"
            [attr.x2]="pathUp().x1"
            [attr.y2]="pathUp().y1"
            class="stroke-ink-faint"
            stroke-width="1.2"
            stroke-dasharray="5 4"
            opacity="0.75"
          />
          <line
            [attr.x1]="pathDown().x0"
            [attr.y1]="pathDown().y0"
            [attr.x2]="pathDown().x1"
            [attr.y2]="pathDown().y1"
            class="stroke-ink-faint"
            stroke-width="1.2"
            stroke-dasharray="5 4"
            opacity="0.75"
          />
          <line
            [attr.x1]="clockFramePath().x"
            [attr.y1]="clockFramePath().y0"
            [attr.x2]="clockFramePath().x"
            [attr.y2]="clockFramePath().y1"
            class="stroke-accent-1"
            stroke-width="1.4"
            stroke-dasharray="3 5"
            opacity="0.85"
          />
        } @else {
          <line
            [attr.x1]="clockFramePath().x"
            [attr.y1]="clockFramePath().y0"
            [attr.x2]="clockFramePath().x"
            [attr.y2]="clockFramePath().y1"
            class="stroke-ink-faint"
            stroke-width="1.2"
            stroke-dasharray="5 4"
            opacity="0.75"
          />
        }
      }

      <line
        [attr.x1]="topMirror().x1"
        [attr.y1]="topMirror().y"
        [attr.x2]="topMirror().x2"
        [attr.y2]="topMirror().y"
        class="stroke-ink light-clock-mirror"
        stroke-width="1.6"
      />
      <line
        [attr.x1]="bottomMirror().x1"
        [attr.y1]="bottomMirror().y"
        [attr.x2]="bottomMirror().x2"
        [attr.y2]="bottomMirror().y"
        class="stroke-ink light-clock-mirror"
        stroke-width="1.6"
      />

      <circle
        [attr.cx]="photon().x"
        [attr.cy]="photon().y"
        r="4.5"
        class="fill-accent-2"
      />
    </svg>
  `,
})
export class LmLightClockComponent {
  readonly width = input(400);
  readonly height = input(320);
  readonly velocity = input(0);
  readonly progress = input(0);
  readonly showPaths = input(true);

  @Output() readonly tickComplete = new EventEmitter<void>();

  private readonly lastPhase = signal(0);

  protected readonly viewBox = computed(() => {
    const b = this.sceneBounds();
    const { topY, bottomY, separation } = this.layout();
    const minY = topY - separation * 0.1;
    const maxY = bottomY + separation * 0.1;
    return `${b.minX} ${minY} ${b.width} ${maxY - minY}`;
  });

  private readonly layout = computed(() => {
    const h = this.height();
    const beta = Math.min(
      LIGHT_CLOCK_VISUAL_MAX_V_OVER_C,
      Math.max(0, this.velocity()),
    );
    const gamma = lorentz(beta);
    const separation = h * 0.42;
    const mirrorHalf = separation * 0.22;
    const padX = separation * 0.16;
    const topY = h * 0.2;
    const bottomY = topY + separation;
    const driftPerHalfLeg = beta * separation * gamma;
    const tickDrift = driftPerHalfLeg * 2;
    const phase = this.tickPhase();
    const tickOriginX = padX + mirrorHalf;
    const clockX = tickOriginX + phase * tickDrift;

    return {
      beta,
      mirrorHalf,
      separation,
      topY,
      bottomY,
      padX,
      driftPerHalfLeg,
      tickDrift,
      phase,
      tickOriginX,
      clockX,
    };
  });

  private readonly sceneBounds = computed(() => {
    const { tickOriginX, tickDrift, mirrorHalf, padX } = this.layout();
    const minX = tickOriginX - mirrorHalf - padX;
    const maxX = tickOriginX + tickDrift + mirrorHalf + padX;
    return {
      minX,
      maxX,
      width: maxX - minX,
    };
  });

  /** Lab-frame grid scrolls as the clock advances through the lab. */
  protected readonly labGridLines = computed(() => {
    const { minX, maxX } = this.sceneBounds();
    const { tickDrift, beta, topY, bottomY, separation } = this.layout();
    const spacing = 44;
    const y0 = topY - separation * 0.05;
    const y1 = bottomY + separation * 0.05;
    const lines: { id: string; x: number; y0: number; y1: number }[] = [];

    const pushLine = (x: number, id: string) => {
      if (x >= minX - 1 && x <= maxX + 1) {
        lines.push({ id, x, y0, y1 });
      }
    };

    if (beta <= 0.01) {
      for (let i = 0, x = minX; i < MAX_LAB_GRID_LINES && x <= maxX; i++, x += spacing) {
        pushLine(x, `g-${Math.round(x)}`);
      }
      return lines;
    }

    const scroll = this.unwrappedProgress() * tickDrift;
    const offset = ((scroll % spacing) + spacing) % spacing;
    for (
      let i = 0, x = minX - offset;
      i < MAX_LAB_GRID_LINES && x <= maxX;
      i++, x += spacing
    ) {
      pushLine(x, `g-${i}-${Math.round(x)}`);
    }
    return lines;
  });

  protected readonly clockFramePath = computed(() => {
    const { clockX, topY, bottomY } = this.layout();
    return { x: clockX, y0: bottomY, y1: topY };
  });

  protected readonly topMirror = computed(() => {
    const { clockX, mirrorHalf, topY } = this.layout();
    return {
      y: topY,
      x1: clockX - mirrorHalf,
      x2: clockX + mirrorHalf,
    };
  });

  protected readonly bottomMirror = computed(() => {
    const { clockX, mirrorHalf, bottomY } = this.layout();
    return {
      y: bottomY,
      x1: clockX - mirrorHalf,
      x2: clockX + mirrorHalf,
    };
  });

  protected readonly pathUp = computed(() => {
    const { tickOriginX, topY, bottomY, driftPerHalfLeg } = this.layout();
    return {
      x0: tickOriginX,
      y0: bottomY,
      x1: tickOriginX + driftPerHalfLeg,
      y1: topY,
    };
  });

  protected readonly pathDown = computed(() => {
    const { topY, bottomY, driftPerHalfLeg } = this.layout();
    const x0 = this.pathUp().x1;
    return {
      x0,
      y0: topY,
      x1: x0 + driftPerHalfLeg,
      y1: bottomY,
    };
  });

  protected readonly photon = computed(() => {
    const { driftPerHalfLeg, phase } = this.layout();
    const up = this.pathUp();
    const down = this.pathDown();

    if (phase < 0.5) {
      const s = phase / 0.5;
      return {
        x: up.x0 + s * driftPerHalfLeg,
        y: up.y0 + s * (up.y1 - up.y0),
      };
    }

    const s = (phase - 0.5) / 0.5;
    return {
      x: down.x0 + s * driftPerHalfLeg,
      y: down.y0 + s * (down.y1 - down.y0),
    };
  });

  constructor() {
    effect(() => {
      const phase = this.tickPhase();
      const prev = this.lastPhase();
      if (prev > 0.85 && phase < 0.15) {
        this.tickComplete.emit();
      }
      this.lastPhase.set(phase);
    });
  }

  private unwrappedProgress(): number {
    const p = this.progress();
    return Number.isFinite(p) ? Math.max(0, p) : 0;
  }

  private tickPhase(): number {
    const p = this.unwrappedProgress();
    const wrapped = p - Math.floor(p);
    return wrapped < 0 ? wrapped + 1 : wrapped;
  }
}
