import {
  Component,
  computed,
  input,
} from '@angular/core';
import {
  lengthContraction,
  lorentz,
} from '@lm/physics';
import { LIGHT_CLOCK_VISUAL_MAX_V_OVER_C } from '@lm/light-clock';

/** Horizontal light clock — derives length contraction: mirrors along motion, L = L₀/γ. */
@Component({
  selector: 'lm-horizontal-light-clock',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
      class="block"
      preserveAspectRatio="xMidYMid meet"
    >
      @if (showGhostProper() && beta() > 0.01) {
        <line
          [attr.x1]="ghostLeftX()"
          [attr.y1]="ghostMirrorY0()"
          [attr.x2]="ghostLeftX()"
          [attr.y2]="ghostMirrorY1()"
          class="stroke-ink-faint"
          stroke-width="1.6"
          stroke-dasharray="5 4"
          opacity="0.7"
        />
        <line
          [attr.x1]="ghostRightX()"
          [attr.y1]="ghostMirrorY0()"
          [attr.x2]="ghostRightX()"
          [attr.y2]="ghostMirrorY1()"
          class="stroke-ink-faint"
          stroke-width="1.6"
          stroke-dasharray="5 4"
          opacity="0.7"
        />
        <line
          [attr.x1]="ghostLeftX()"
          [attr.y1]="ghostBracketY()"
          [attr.x2]="ghostRightX()"
          [attr.y2]="ghostBracketY()"
          class="stroke-ink"
          stroke-width="1.2"
          stroke-dasharray="4 3"
          opacity="0.55"
        />
        <line
          [attr.x1]="ghostLeftX()"
          [attr.y1]="ghostBracketY() - 6"
          [attr.x2]="ghostLeftX()"
          [attr.y2]="ghostBracketY() + 6"
          class="stroke-ink"
          stroke-width="1.2"
          opacity="0.55"
        />
        <line
          [attr.x1]="ghostRightX()"
          [attr.y1]="ghostBracketY() - 6"
          [attr.x2]="ghostRightX()"
          [attr.y2]="ghostBracketY() + 6"
          class="stroke-ink"
          stroke-width="1.2"
          opacity="0.55"
        />
        <text
          [attr.x]="ghostLabelX()"
          [attr.y]="ghostLabelY()"
          text-anchor="middle"
          class="fill-ink font-mono text-[12px] uppercase tracking-wider opacity-75"
        >
          if length stayed L₀
        </text>
      }

      @if (showPaths()) {
        @if (beta() > 0.01) {
          <line
            [attr.x1]="pathRight().x0"
            [attr.y1]="pathRight().y0"
            [attr.x2]="pathRight().x1"
            [attr.y2]="pathRight().y1"
            class="stroke-ink-faint"
            stroke-width="1.2"
            stroke-dasharray="5 4"
            opacity="0.75"
          />
          <line
            [attr.x1]="pathLeft().x0"
            [attr.y1]="pathLeft().y0"
            [attr.x2]="pathLeft().x1"
            [attr.y2]="pathLeft().y1"
            class="stroke-ink-faint"
            stroke-width="1.2"
            stroke-dasharray="5 4"
            opacity="0.75"
          />
        }
        <line
          [attr.x1]="clockFramePath().x0"
          [attr.y1]="clockFramePath().y"
          [attr.x2]="clockFramePath().x1"
          [attr.y2]="clockFramePath().y"
          class="stroke-accent-1"
          stroke-width="1.4"
          stroke-dasharray="3 5"
          opacity="0.85"
        />
      }

      <line
        [attr.x1]="leftMirror().x"
        [attr.y1]="leftMirror().y0"
        [attr.x2]="leftMirror().x"
        [attr.y2]="leftMirror().y1"
        class="stroke-ink"
        stroke-width="1.6"
      />
      <line
        [attr.x1]="rightMirror().x"
        [attr.y1]="rightMirror().y0"
        [attr.x2]="rightMirror().x"
        [attr.y2]="rightMirror().y1"
        class="stroke-ink"
        stroke-width="1.6"
      />

      <circle
        [attr.cx]="photon().x"
        [attr.cy]="photon().y"
        r="4.5"
        class="fill-accent-2"
      />

      <text
        [attr.x]="motionLabelX()"
        [attr.y]="motionLabelY()"
        text-anchor="middle"
        class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-60"
      >
        direction of motion →
      </text>
    </svg>
  `,
})
export class LmHorizontalLightClockComponent {
  readonly width = input(400);
  readonly height = input(320);
  readonly velocity = input(0);
  readonly progress = input(0);
  readonly showPaths = input(true);
  readonly showGhostProper = input(false);

  protected readonly beta = computed(() =>
    Math.min(LIGHT_CLOCK_VISUAL_MAX_V_OVER_C, Math.max(0, this.velocity())),
  );

  protected readonly viewBox = computed(() => {
    const w = this.width();
    const h = this.height();
    return `0 0 ${w} ${h}`;
  });

  /** Fixed label anchors — text only; ghost geometry follows the moving clock. */
  protected readonly motionLabelX = computed(() => this.width() * 0.5);
  protected readonly motionLabelY = computed(() => this.height() * 0.9);
  protected readonly ghostLabelX = computed(() => this.width() * 0.5);
  protected readonly ghostLabelY = computed(
    () => this.layout().cy - this.layout().mirrorHalf - 32,
  );
  protected readonly ghostLeftX = computed(() => {
    const { leftX, contractedL, properL } = this.layout();
    const center = leftX + contractedL / 2;
    return center - properL / 2;
  });
  protected readonly ghostRightX = computed(() => {
    const { leftX, contractedL, properL } = this.layout();
    const center = leftX + contractedL / 2;
    return center + properL / 2;
  });
  protected readonly ghostBracketY = computed(() => this.layout().cy - this.layout().mirrorHalf - 18);
  protected readonly ghostMirrorY0 = computed(() => this.ghostBracketY() + 10);
  protected readonly ghostMirrorY1 = computed(() => this.layout().cy - 6);

  private readonly layout = computed(() => {
    const w = this.width();
    const h = this.height();
    const beta = this.beta();
    const gamma = lorentz(beta);
    const properL = this.fitProperLength(w, beta, gamma);
    const contractedL = lengthContraction(properL, beta);
    const mirrorHalf = properL * 0.12;
    const cy = h * 0.54;
    const driftPerHalfLeg = beta * contractedL * gamma;
    const tickDrift = driftPerHalfLeg * 2;
    const phase = this.tickPhase();
    const midLeftX = w * 0.5 - contractedL / 2;
    const originX = midLeftX - driftPerHalfLeg;
    const assemblyX = originX + phase * tickDrift;
    const leftX = assemblyX;
    const rightX = assemblyX + contractedL;

    return {
      properL,
      contractedL,
      mirrorHalf,
      cy,
      driftPerHalfLeg,
      tickDrift,
      phase,
      originX,
      leftX,
      rightX,
    };
  });

  /** Shrink L₀ so contracted clock + lab drift fits without zooming labels away. */
  private fitProperLength(w: number, beta: number, gamma: number): number {
    const maxSpan = w * 0.72;
    if (beta <= 0.01) {
      return maxSpan * 0.55;
    }
    const contractedFraction = lengthContraction(1, beta);
    const spanPerProper = contractedFraction + 2 * beta * contractedFraction * gamma;
    return maxSpan / spanPerProper;
  }

  protected leftMirror = computed(() => {
    const { leftX, cy, mirrorHalf } = this.layout();
    return { x: leftX, y0: cy - mirrorHalf, y1: cy + mirrorHalf };
  });

  protected rightMirror = computed(() => {
    const { rightX, cy, mirrorHalf } = this.layout();
    return { x: rightX, y0: cy - mirrorHalf, y1: cy + mirrorHalf };
  });

  protected clockFramePath = computed(() => {
    const { leftX, rightX, cy } = this.layout();
    return { x0: leftX, x1: rightX, y: cy };
  });

  protected pathRight = computed(() => {
    const { originX, contractedL, cy, driftPerHalfLeg } = this.layout();
    return {
      x0: originX,
      y0: cy,
      x1: originX + contractedL + driftPerHalfLeg,
      y1: cy,
    };
  });

  protected pathLeft = computed(() => {
    const { originX, cy, driftPerHalfLeg } = this.layout();
    const x0 = this.pathRight().x1;
    return {
      x0,
      y0: cy,
      x1: originX + driftPerHalfLeg * 2,
      y1: cy,
    };
  });

  protected photon = computed(() => {
    const { phase, originX, contractedL, driftPerHalfLeg, cy } = this.layout();

    // Equal half-ticks — photon must hit mirror B at phase 0.5 and mirror A at 1.0.
    if (phase < 0.5) {
      const s = phase / 0.5;
      return {
        x: originX + s * (contractedL + driftPerHalfLeg),
        y: cy,
      };
    }

    const s = (phase - 0.5) / 0.5;
    const xStart = originX + contractedL + driftPerHalfLeg;
    const xEnd = originX + driftPerHalfLeg * 2;
    return {
      x: xStart + s * (xEnd - xStart),
      y: cy,
    };
  });

  private tickPhase(): number {
    const p = this.progress();
    if (!Number.isFinite(p)) {
      return 0;
    }
    const wrapped = p - Math.floor(p);
    return wrapped < 0 ? wrapped + 1 : wrapped;
  }
}
