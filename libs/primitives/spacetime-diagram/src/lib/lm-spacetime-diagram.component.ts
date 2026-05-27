import { Component, input } from '@angular/core';
import {
  observerPositionAtProperTime,
  observerPositionAtTime,
  observerProperTimeAtCoordinate,
  speedBudgetTipLabel,
  STEP3_MAX_TIME,
  type WavefrontLayout,
} from '@lm/physics';

type DiagramVariant =
  | 'position-only'
  | 'time-only'
  | 'full'
  | 'single'
  | 'pair'
  | 'wavefront';

/** SVG spacetime diagram — position-only, time-only, full, and single variants for Chapter 1. */
@Component({
  selector: 'lm-spacetime-diagram',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="svgViewBox"
      class="block overflow-visible"
    >
      @if (variant() === 'position-only') {
        <g
          class="stroke-ink"
          fill="none"
          stroke-width="1"
          [attr.opacity]="axisOpacity()"
        >
          <line [attr.x1]="left" [attr.y1]="axisY" [attr.x2]="plotRight" [attr.y2]="axisY" />
          @for (tick of ticks; track tick) {
            <line
              [attr.x1]="left + tick * axisSpan"
              [attr.y1]="axisY"
              [attr.x2]="left + tick * axisSpan"
              [attr.y2]="axisY + 5"
            />
          }
        </g>

        <circle
          [attr.cx]="pointX"
          [attr.cy]="axisY"
          r="5"
          class="fill-ink"
        />

        @if (showLabels()) {
          <text
            [attr.x]="plotRight + 8"
            [attr.y]="axisY + 4"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            x
          </text>
        }
      } @else if (variant() === 'time-only') {
        <g
          class="stroke-ink"
          fill="none"
          stroke-width="1"
          [attr.opacity]="axisOpacity()"
        >
          <line
            [attr.x1]="axisX"
            [attr.y1]="timeBottom"
            [attr.x2]="axisX"
            [attr.y2]="timeTop"
          />
          @for (tick of ticks; track tick) {
            <line
              [attr.x1]="axisX"
              [attr.y1]="timeBottom - tick * timeAxisSpan"
              [attr.x2]="axisX - 5"
              [attr.y2]="timeBottom - tick * timeAxisSpan"
            />
          }
        </g>

        <circle
          [attr.cx]="axisX"
          [attr.cy]="pointY"
          r="5"
          class="fill-ink"
        />

        @if (showLabels()) {
          <text
            [attr.x]="axisX + 8"
            [attr.y]="timeTop - 4"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            t
          </text>
        }
      } @else if (variant() === 'full' || variant() === 'single' || variant() === 'pair') {
        <g
          class="stroke-ink"
          fill="none"
          stroke-width="1"
          [attr.opacity]="axisOpacity()"
        >
          <line [attr.x1]="left" [attr.y1]="fullBottom" [attr.x2]="plotRight" [attr.y2]="fullBottom" />
          <line [attr.x1]="left" [attr.y1]="fullBottom" [attr.x2]="left" [attr.y2]="fullTop" />
          @for (tick of ticks; track tick) {
            <line
              [attr.x1]="left + tick * axisSpan"
              [attr.y1]="fullBottom"
              [attr.x2]="left + tick * axisSpan"
              [attr.y2]="fullBottom + 5"
            />
          }
          @for (tick of ticks; track tick) {
            <line
              [attr.x1]="left - 5"
              [attr.y1]="fullBottom - tick * fullTimeAxisSpan"
              [attr.x2]="left"
              [attr.y2]="fullBottom - tick * fullTimeAxisSpan"
            />
          }
        </g>

        @if (showLightCone()) {
          <line
            [attr.x1]="left"
            [attr.y1]="fullBottom"
            [attr.x2]="lightConeEndX"
            [attr.y2]="fullTop"
            class="stroke-ink"
            fill="none"
            stroke-width="1"
            stroke-dasharray="3 4"
            [attr.opacity]="axisOpacity() * 0.55"
          />
        }

        @if (variant() === 'full') {
          @if (showWorldline()) {
            <line
              [attr.x1]="left"
              [attr.y1]="fullBottom"
              [attr.x2]="fullPointX"
              [attr.y2]="fullPointY"
              class="stroke-ink"
              fill="none"
              stroke-width="1.5"
            />
          }

          <circle
            [attr.cx]="fullPointX"
            [attr.cy]="fullPointY"
            r="5"
            class="fill-ink"
          />
        } @else if (variant() === 'single') {
          @if (budgetArc()) {
            <path
              [attr.d]="budgetArcPath"
              class="stroke-ink"
              fill="none"
              stroke-width="1"
              stroke-linecap="round"
              [attr.opacity]="axisOpacity() * 0.45"
            />
          }

          <line
            [attr.x1]="left"
            [attr.y1]="fullBottom"
            [attr.x2]="vectorTipX"
            [attr.y2]="vectorTipY"
            class="stroke-ink"
            fill="none"
            [attr.stroke-width]="vectorStroke()"
            stroke-linecap="round"
          />
          <polyline
            [attr.points]="vectorArrowPoints"
            class="stroke-ink"
            fill="none"
            [attr.stroke-width]="vectorStroke()"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          @if (showDot()) {
            <circle
              [attr.cx]="vectorTipX"
              [attr.cy]="vectorTipY"
              r="3.5"
              class="fill-ink"
            />
          }

          @if (showTipLabel()) {
            <g [attr.transform]="tipLabelTransform">
              <rect
                x="-4"
                y="-22"
                [attr.width]="tipLabelWidth"
                height="50"
                rx="2"
                fill="var(--lm-paper)"
                fill-opacity="0.6"
              />
              <text
                x="4"
                y="-4"
                class="fill-ink font-mono text-[14px] leading-snug tracking-wide"
                opacity="0.9"
              >
                <tspan x="4">{{ tipLabel().timeLine }}</tspan>
                <tspan x="4" dy="18">{{ tipLabel().spaceLine }}</tspan>
              </text>
            </g>
          }
        } @else {
          @if (budgetArc()) {
            <path
              [attr.d]="budgetArcPath"
              class="stroke-ink"
              fill="none"
              stroke-width="1"
              stroke-linecap="round"
              [attr.opacity]="axisOpacity() * 0.45"
            />
          }

          @for (vector of pairVectors(); track vector.id) {
            <line
              [attr.x1]="left"
              [attr.y1]="fullBottom"
              [attr.x2]="vector.tipX"
              [attr.y2]="vector.tipY"
              fill="none"
              [attr.stroke]="vector.color"
              [attr.stroke-width]="vectorStroke() + 0.2"
              stroke-linecap="round"
            />
            <polyline
              [attr.points]="vector.arrowPoints"
              fill="none"
              [attr.stroke]="vector.color"
              [attr.stroke-width]="vectorStroke() + 0.2"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
            @if (showTipLabel()) {
              <g [attr.transform]="vector.tipLabelTransform">
                <rect
                  x="-4"
                  y="-22"
                  [attr.width]="vector.tipLabelWidth"
                  height="50"
                  rx="2"
                  fill="var(--lm-paper)"
                  fill-opacity="0.6"
                />
                <text
                  x="4"
                  y="-4"
                  class="font-mono text-[14px] leading-snug tracking-wide"
                  [attr.fill]="vector.color"
                  opacity="0.9"
                >
                  <tspan x="4">{{ vector.tipLabel.timeLine }}</tspan>
                  <tspan x="4" dy="18">{{ vector.tipLabel.spaceLine }}</tspan>
                </text>
              </g>
            }
          }
        }

        @if (showLabels()) {
          <text
            [attr.x]="plotRight + 8"
            [attr.y]="fullBottom + 4"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            x
          </text>
          <text
            [attr.x]="left - 4"
            [attr.y]="fullTop - 8"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            t
          </text>
        }
      } @else if (variant() === 'wavefront') {
        <g
          class="stroke-ink"
          fill="none"
          stroke-width="1"
          [attr.opacity]="axisOpacity()"
        >
          <line [attr.x1]="left" [attr.y1]="fullBottom" [attr.x2]="plotRight" [attr.y2]="fullBottom" />
          <line [attr.x1]="left" [attr.y1]="fullBottom" [attr.x2]="left" [attr.y2]="fullTop" />
          @for (tick of ticks; track tick) {
            <line
              [attr.x1]="left + tick * axisSpan"
              [attr.y1]="fullBottom"
              [attr.x2]="left + tick * axisSpan"
              [attr.y2]="fullBottom + 5"
            />
          }
          @for (tick of ticks; track tick) {
            <line
              [attr.x1]="left - 5"
              [attr.y1]="fullBottom - tick * fullTimeAxisSpan"
              [attr.x2]="left"
              [attr.y2]="fullBottom - tick * fullTimeAxisSpan"
            />
          }
        </g>

        @for (wl of wavefrontWorldlines(); track wl.id) {
          <line
            [attr.x1]="wl.x1"
            [attr.y1]="wl.y1"
            [attr.x2]="wl.x2"
            [attr.y2]="wl.y2"
            fill="none"
            [attr.stroke]="wl.color"
            [attr.stroke-width]="wl.id === 'b' ? 1.2 : 1.5"
            stroke-linecap="round"
            [attr.opacity]="wl.id === 'b' ? 0.75 : 1"
          />
          <text
            [attr.x]="wl.labelX"
            [attr.y]="wl.labelY"
            class="font-mono text-[11px] uppercase tracking-wider"
            [attr.fill]="wl.color"
            opacity="0.7"
          >
            {{ wl.id }}
          </text>
        }

        @if (wavefrontSignal() === 'ray' && wavefrontLightRayPx(); as ray) {
          <line
            [attr.x1]="ray.x1"
            [attr.y1]="ray.y1"
            [attr.x2]="ray.x2"
            [attr.y2]="ray.y2"
            class="stroke-ink"
            fill="none"
            stroke-width="1.4"
            opacity="0.85"
          />
        }

        @if (wavefrontSignal() === 'horizontal' && wavefrontHorizontalLightPx(); as seg) {
          <line
            [attr.x1]="seg.x1"
            [attr.y1]="seg.y1"
            [attr.x2]="seg.x2"
            [attr.y2]="seg.y2"
            class="stroke-ink"
            fill="none"
            stroke-width="1.4"
            opacity="0.85"
          />
          @if (seg.lift) {
            <line
              [attr.x1]="seg.lift.x1"
              [attr.y1]="seg.lift.y1"
              [attr.x2]="seg.lift.x2"
              [attr.y2]="seg.lift.y2"
              class="stroke-ink"
              fill="none"
              stroke-width="1"
              stroke-dasharray="3 4"
              opacity="0.4"
            />
          }
        }

        @if (wavefrontSignal() === 'ring' && wavefrontCirclePx(); as ring) {
          <circle
            [attr.cx]="ring.cx"
            [attr.cy]="ring.cy"
            [attr.r]="ring.r"
            class="stroke-ink"
            fill="none"
            stroke-width="1.4"
            opacity="0.85"
          />
        }

        @for (dot of wavefrontObserverDots(); track dot.id) {
          <circle
            [attr.cx]="dot.x"
            [attr.cy]="dot.y"
            r="4.5"
            [attr.class]="dot.dotClass"
          />
        }

        @if (showWavefrontReceptionA()) {
          <circle
            [attr.cx]="wavefrontReceptionAPx().x"
            [attr.cy]="wavefrontReceptionAPx().y"
            r="5"
            class="fill-accent-1"
            [style.filter]="'drop-shadow(0 0 4px var(--lm-glow-1))'"
          />
        }

        @if (wavefrontShowObserverC() && showWavefrontReceptionC()) {
          <circle
            [attr.cx]="wavefrontReceptionCPx().x"
            [attr.cy]="wavefrontReceptionCPx().y"
            r="5"
            class="fill-accent-2"
            [style.filter]="'drop-shadow(0 0 4px var(--lm-glow-2))'"
          />
        }

        @if (showLabels()) {
          <text
            [attr.x]="plotRight + 8"
            [attr.y]="fullBottom + 4"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            x
          </text>
          <text
            [attr.x]="left - 4"
            [attr.y]="fullTop - 8"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            t
          </text>
        }
      }
    </svg>
  `,
})
export class LmSpacetimeDiagramComponent {
  readonly variant = input<DiagramVariant>('position-only');
  readonly position = input(0.5);
  readonly time = input(0.5);
  readonly velocity = input(0);
  readonly velocityA = input(0.01);
  readonly velocityB = input(0);
  readonly width = input(680);
  readonly height = input(200);
  readonly showLabels = input(true);
  readonly axisOpacity = input(1);
  readonly showLightCone = input(true);
  readonly showWorldline = input(true);
  readonly showDot = input(true);
  readonly vectorStroke = input(2.4);
  /** Sweep from pure time to pure space (0→90°) with tip readout; Ch 2 speed budget. */
  readonly budgetArc = input(false);
  readonly showTipLabel = input(false);
  readonly tipProperYears = input(1);
  /** Elapsed coordinate time (c = 1); observers and light cone advance together. */
  readonly wavefrontTime = input(0);
  /** @deprecated Use wavefrontTime */
  readonly wavefrontRadius = input(0);
  readonly observerXA = input(0.25);
  readonly observerXB = input(0.5);
  readonly observerXC = input(0.75);
  readonly observerVOverC = input(0.5);
  readonly wavefrontTimeAtA = input(0.25);
  readonly wavefrontTimeAtC = input(0.5);
  /** @deprecated Use wavefrontTimeAtA */
  readonly wavefrontRadiusAtA = input(0.25);
  /** @deprecated Use wavefrontTimeAtC */
  readonly wavefrontRadiusAtC = input(0.5);
  readonly wavefrontTMax = input(STEP3_MAX_TIME);
  readonly wavefrontShowObserverC = input(true);
  readonly wavefrontSignal = input<'ray' | 'ring' | 'horizontal'>('ring');

  protected readonly left = 70;
  protected readonly right = 610;
  protected readonly axisY = 100;
  protected readonly axisX = 340;
  protected readonly timeTop = 40;
  protected readonly timeBottom = 280;
  protected readonly fullTop = 40;
  protected readonly fullBottom = 360;
  protected readonly vectorLen = 240;
  protected readonly ticks = [0, 0.2, 0.4, 0.6, 0.8, 1];

  protected get plotRight(): number {
    const variant = this.variant();
    if (variant === 'pair') {
      return this.pairPlotRight();
    }
    if (variant === 'single' && (this.budgetArc() || this.showTipLabel())) {
      return this.singlePlotRight();
    }
    if (variant === 'wavefront') {
      return this.wavefrontPlotRight();
    }
    return this.right;
  }

  protected get axisSpan(): number {
    return this.plotRight - this.left;
  }

  /** Tight viewBox in design coordinates; width/height scale to the layout slot. */
  protected get svgViewBox(): string {
    const pad = 10;
    const b = this.contentBounds();
    return `${b.minX - pad} ${b.minY - pad} ${b.width + pad * 2} ${b.height + pad * 2}`;
  }

  private contentBounds(): {
    minX: number;
    minY: number;
    width: number;
    height: number;
  } {
    const variant = this.variant();
    if (variant === 'position-only') {
      return {
        minX: this.left - 20,
        minY: this.axisY - 14,
        width: this.plotRight - this.left + 36,
        height: 28,
      };
    }
    if (variant === 'time-only') {
      return {
        minX: this.axisX - 24,
        minY: this.timeTop - 12,
        width: 48,
        height: this.timeBottom - this.timeTop + 28,
      };
    }
    if (variant === 'pair') {
      return this.pairContentBounds();
    }
    if (variant === 'single') {
      return this.singleContentBounds();
    }
    if (variant === 'wavefront') {
      return this.wavefrontContentBounds();
    }
    return {
      minX: this.left - 24,
      minY: this.fullTop - 16,
      width: this.plotRight - this.left + 36,
      height: this.fullBottom - this.fullTop + 28,
    };
  }

  private pairPlotRight(): number {
    let maxX = this.left + this.vectorLen + 16;
    if (this.showTipLabel()) {
      for (const vector of this.pairVectors()) {
        maxX = Math.max(maxX, vector.tipX + 16 + vector.tipLabelWidth);
      }
    } else {
      for (const vector of this.pairVectors()) {
        maxX = Math.max(maxX, vector.tipX + 12);
      }
    }
    return maxX;
  }

  private pairContentBounds(): {
    minX: number;
    minY: number;
    width: number;
    height: number;
  } {
    let maxX = this.pairPlotRight();
    let minY = this.fullTop;
    let maxY = this.fullBottom + 8;
    for (const vector of this.pairVectors()) {
      maxX = Math.max(maxX, vector.tipX + (this.showTipLabel() ? vector.tipLabelWidth + 16 : 12));
      if (this.showTipLabel()) {
        minY = Math.min(minY, vector.tipY - 28);
        maxY = Math.max(maxY, vector.tipY + 30);
      } else {
        minY = Math.min(minY, vector.tipY - 10);
        maxY = Math.max(maxY, vector.tipY + 10);
      }
    }
    const minX = this.left - 24;
    return {
      minX,
      minY: minY - (this.showLabels() ? 14 : 6),
      width: maxX - minX + (this.showLabels() ? 28 : 12),
      height: maxY - minY + (this.showLabels() ? 18 : 10),
    };
  }

  private singlePlotRight(): number {
    let maxX = this.left + this.vectorLen + 16;
    if (this.showTipLabel()) {
      maxX = Math.max(maxX, this.vectorTipX + 16 + this.tipLabelWidth);
    } else {
      maxX = Math.max(maxX, this.vectorTipX + 12);
    }
    return maxX;
  }

  private singleContentBounds(): {
    minX: number;
    minY: number;
    width: number;
    height: number;
  } {
    let maxX = this.singlePlotRight();
    let minY = this.fullTop;
    let maxY = this.fullBottom + 8;
    maxX = Math.max(maxX, this.vectorTipX + (this.showTipLabel() ? this.tipLabelWidth + 16 : 12));
    if (this.showTipLabel()) {
      minY = Math.min(minY, this.vectorTipY - 28);
      maxY = Math.max(maxY, this.vectorTipY + 30);
    } else {
      minY = Math.min(minY, this.vectorTipY - 10);
      maxY = Math.max(maxY, this.vectorTipY + 10);
    }
    const minX = this.left - 24;
    return {
      minX,
      minY: minY - (this.showLabels() ? 14 : 6),
      width: maxX - minX + (this.showLabels() ? 28 : 12),
      height: maxY - minY + (this.showLabels() ? 18 : 10),
    };
  }

  private wavefrontPlotRight(): number {
    const layout = this.wavefrontLayout();
    const tMax = this.wavefrontTMax();
    const signal = this.wavefrontSignal();
    let maxX = layout.xB;
    if (signal === 'ring') {
      maxX = Math.max(maxX, layout.xB + tMax);
    }
    if (this.wavefrontShowObserverC()) {
      maxX = Math.max(
        maxX,
        observerPositionAtTime(layout, 'c', tMax),
      );
    }
    const px = this.left + maxX * this.wavefrontUnit + 20;
    const worldlines = this.wavefrontWorldlines();
    let maxPx = px;
    for (const wl of worldlines) {
      maxPx = Math.max(maxPx, wl.x2 + 12, wl.labelX + 16);
    }
    const ring = this.wavefrontCirclePx();
    if (ring) {
      maxPx = Math.max(maxPx, ring.cx + ring.r + 8);
    }
    const ray = this.wavefrontLightRayPx();
    if (ray) {
      maxPx = Math.max(maxPx, ray.x2 + 8);
    }
    const seg = this.wavefrontHorizontalLightPx();
    if (seg) {
      maxPx = Math.max(maxPx, seg.x2 + 8, seg.lift?.x2 ?? 0);
    }
    return Math.max(maxPx, this.left + 80);
  }

  private wavefrontContentBounds(): {
    minX: number;
    minY: number;
    width: number;
    height: number;
  } {
    let minX = this.left - 24;
    let minY = this.fullTop - 16;
    let maxX = this.wavefrontPlotRight();
    let maxY = this.fullBottom + 8;

    for (const wl of this.wavefrontWorldlines()) {
      minX = Math.min(minX, wl.x1, wl.x2, wl.labelX - 8);
      maxX = Math.max(maxX, wl.x2 + 12, wl.labelX + 16);
      minY = Math.min(minY, wl.y1, wl.y2, wl.labelY - 12);
      maxY = Math.max(maxY, wl.y2 + 8, wl.labelY + 4);
    }
    for (const dot of this.wavefrontObserverDots()) {
      minX = Math.min(minX, dot.x - 8);
      maxX = Math.max(maxX, dot.x + 8);
      minY = Math.min(minY, dot.y - 8);
      maxY = Math.max(maxY, dot.y + 8);
    }
    const ring = this.wavefrontCirclePx();
    if (ring) {
      minX = Math.min(minX, ring.cx - ring.r);
      maxX = Math.max(maxX, ring.cx + ring.r);
      minY = Math.min(minY, ring.cy - ring.r);
      maxY = Math.max(maxY, ring.cy + ring.r);
    }
    if (this.showWavefrontReceptionA()) {
      const a = this.wavefrontReceptionAPx();
      maxX = Math.max(maxX, a.x + 8);
      maxY = Math.max(maxY, a.y + 8);
    }
    if (this.wavefrontShowObserverC() && this.showWavefrontReceptionC()) {
      const c = this.wavefrontReceptionCPx();
      maxX = Math.max(maxX, c.x + 8);
      maxY = Math.max(maxY, c.y + 8);
    }

    return {
      minX,
      minY,
      width: maxX - minX + 12,
      height: maxY - minY + 12,
    };
  }

  protected get timeAxisSpan(): number {
    return this.timeBottom - this.timeTop;
  }

  protected get fullTimeAxisSpan(): number {
    return this.fullBottom - this.fullTop;
  }

  protected get pointX(): number {
    return this.left + this.position() * this.axisSpan;
  }

  protected get pointY(): number {
    return this.timeBottom - this.time() * this.timeAxisSpan;
  }

  protected get fullPointX(): number {
    return this.left + this.position() * this.axisSpan;
  }

  protected get fullPointY(): number {
    return this.fullBottom - this.time() * this.fullTimeAxisSpan;
  }

  protected get lightConeEndX(): number {
    return this.left + this.fullTimeAxisSpan;
  }

  protected get maxVectorAngleRad(): number {
    return this.budgetArc() || this.variant() === 'pair' ? Math.PI / 2 : Math.PI / 4;
  }

  protected budgetVelocityAngleRad(vOverC: number): number {
    return Math.asin(Math.min(1, Math.max(0, vOverC)));
  }

  protected get vectorAngleRad(): number {
    if (this.budgetArc() || this.variant() === 'pair') {
      return this.budgetVelocityAngleRad(this.velocity());
    }
    return this.velocity() * (Math.PI / 4);
  }

  protected pairVectors(): {
    id: string;
    tipX: number;
    tipY: number;
    arrowPoints: string;
    color: string;
    tipLabel: ReturnType<typeof speedBudgetTipLabel>;
    tipLabelTransform: string;
    tipLabelWidth: number;
  }[] {
    const specs = [
      { id: 'a', v: this.velocityA(), color: 'var(--lm-accent-1)' },
      { id: 'b', v: this.velocityB(), color: 'var(--lm-accent-2)' },
    ];
    return specs.map(({ id, v, color }) => {
      const angle = this.budgetVelocityAngleRad(v);
      const tipX = this.left + this.vectorLen * Math.sin(angle);
      const tipY = this.fullBottom - this.vectorLen * Math.cos(angle);
      const tipLabel = speedBudgetTipLabel(v, this.tipProperYears());
      return {
        id,
        tipX,
        tipY,
        arrowPoints: this.arrowPointsForTip(tipX, tipY),
        color,
        tipLabel,
        tipLabelTransform: `translate(${tipX + 16}, ${tipY - 4})`,
        tipLabelWidth: this.tipLabelWidthFor(tipLabel.timeLine, tipLabel.spaceLine),
      };
    });
  }

  protected get budgetArcPath(): string {
    const endX = this.left + this.vectorLen * Math.sin(this.maxVectorAngleRad);
    const endY = this.fullBottom - this.vectorLen * Math.cos(this.maxVectorAngleRad);
    return [
      `M ${this.left} ${this.fullBottom - this.vectorLen}`,
      `A ${this.vectorLen} ${this.vectorLen} 0 0 1 ${endX} ${endY}`,
    ].join(' ');
  }

  protected tipLabel() {
    return speedBudgetTipLabel(this.velocity(), this.tipProperYears());
  }

  protected get tipLabelTransform(): string {
    return `translate(${this.tipLabelX}, ${this.tipLabelY})`;
  }

  protected get tipLabelWidth(): number {
    const label = this.tipLabel();
    return this.tipLabelWidthFor(label.timeLine, label.spaceLine);
  }

  protected tipLabelWidthFor(timeLine: string, spaceLine: string): number {
    const longest = Math.max(timeLine.length, spaceLine.length);
    return Math.min(380, Math.max(260, longest * 8.2 + 12));
  }

  protected get tipLabelX(): number {
    return this.vectorTipX + 16;
  }

  protected get tipLabelY(): number {
    return this.vectorTipY - 4;
  }

  protected get vectorTipX(): number {
    return this.left + this.vectorLen * Math.sin(this.vectorAngleRad);
  }

  protected get vectorTipY(): number {
    return this.fullBottom - this.vectorLen * Math.cos(this.vectorAngleRad);
  }

  protected get vectorArrowPoints(): string {
    return this.arrowPointsForTip(this.vectorTipX, this.vectorTipY);
  }

  protected arrowPointsForTip(tipX: number, tipY: number): string {
    const backX = this.left - tipX;
    const backY = this.fullBottom - tipY;
    const backLen = Math.hypot(backX, backY);
    const bx = backX / backLen;
    const by = backY / backLen;
    const px = -by;
    const py = bx;
    const wing = 6;
    const back = 9;

    return [
      `${tipX + bx * back + px * wing},${tipY + by * back + py * wing}`,
      `${tipX},${tipY}`,
      `${tipX + bx * back - px * wing},${tipY + by * back - py * wing}`,
    ].join(' ');
  }

  protected wavefrontWorldlines(): {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    labelX: number;
    labelY: number;
  }[] {
    const layout = this.wavefrontLayout();
    const tauMax = this.wavefrontTMax();
    const a0 = this.spacetimePx(layout.xA, 0);
    const a1 = this.spacetimePx(layout.xA, tauMax);
    const b0 = this.spacetimePx(layout.xB, 0);
    const b1 = this.spacetimePx(layout.xB, tauMax);
    const c0 = this.spacetimePx(layout.xC, 0);
    const cEndX = observerPositionAtProperTime(layout, 'c', tauMax);
    const c1 = this.spacetimePx(cEndX, tauMax);

    const lines = [
      {
        id: 'a',
        x1: a0.x,
        y1: a0.y,
        x2: a1.x,
        y2: a1.y,
        color: 'var(--lm-accent-1)',
        labelX: a1.x - 4,
        labelY: a1.y - 4,
      },
      {
        id: 'b',
        x1: b0.x,
        y1: b0.y,
        x2: b1.x,
        y2: b1.y,
        color: 'var(--lm-ink)',
        labelX: b1.x - 4,
        labelY: b1.y - 4,
      },
    ];

    if (this.wavefrontShowObserverC()) {
      lines.push({
        id: 'c',
        x1: c0.x,
        y1: c0.y,
        x2: c1.x,
        y2: c1.y,
        color: 'var(--lm-accent-2)',
        labelX: c1.x - 4,
        labelY: c1.y - 4,
      });
    }

    return lines;
  }

  protected wavefrontObserverDots(): {
    id: string;
    x: number;
    y: number;
    dotClass: string;
  }[] {
    const tCoord = this.effectiveWavefrontTime();
    const specs = [
      { id: 'a' as const, dotClass: 'fill-accent-1' },
      { id: 'b' as const, dotClass: 'fill-ink' },
      ...(this.wavefrontShowObserverC()
        ? [{ id: 'c' as const, dotClass: 'fill-accent-2' }]
        : []),
    ];

    return specs.map(({ id, dotClass }) => {
      const event = this.wavefrontObserverEvent(id, tCoord);
      const dotPx = this.spacetimePx(event.x, event.tau);
      return { id, x: dotPx.x, y: dotPx.y, dotClass };
    });
  }

  protected wavefrontArcLeftData(t: number): { x: number; y: number } {
    const layout = this.wavefrontLayout();
    const xLeft = layout.xB - t;
    if (xLeft >= 0) {
      return { x: xLeft, y: t };
    }
    const yAtOrigin =
      t - Math.sqrt(Math.max(0, t * t - layout.xB * layout.xB));
    return { x: 0, y: yAtOrigin };
  }

  protected wavefrontLightRayPx(): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null {
    const t = this.effectiveWavefrontTime();
    if (t <= 0) {
      return null;
    }
    const layout = this.wavefrontLayout();
    const tReach = this.milestoneTimeAtA();
    const tTip = Math.min(t, tReach);
    const from = this.spacetimePx(layout.xB, 0);
    const to = this.spacetimePx(layout.xB - tTip, tTip);
    return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
  }

  /**
   * Epstein-style light: the photon spends its full c on space — proper time τ stays at 0
   * along its worldline. We draw a horizontal segment from B at the bottom, growing in −x.
   * After reception, a faint dashed line "lifts" from the segment tip to A's reception event
   * on A's worldline at τ = Δx/c, marking the transition from the photon-frame to A's frame.
   */
  protected wavefrontHorizontalLightPx(): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    lift?: { x1: number; y1: number; x2: number; y2: number };
  } | null {
    const t = this.effectiveWavefrontTime();
    if (t <= 0) {
      return null;
    }
    const layout = this.wavefrontLayout();
    const tReach = this.milestoneTimeAtA();
    const tip = Math.min(t, tReach);
    const from = this.spacetimePx(layout.xB, 0);
    const to = this.spacetimePx(layout.xB - tip, 0);
    const segment = { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
    if (t < tReach) {
      return segment;
    }
    const liftTop = this.spacetimePx(layout.xA, tReach);
    return {
      ...segment,
      lift: { x1: to.x, y1: to.y, x2: liftTop.x, y2: liftTop.y },
    };
  }

  protected wavefrontCirclePx(): { cx: number; cy: number; r: number } | null {
    const t = this.effectiveWavefrontTime();
    if (t <= 0) {
      return null;
    }
    const layout = this.wavefrontLayout();
    const center = this.spacetimePx(layout.xB, t);
    return { cx: center.x, cy: center.y, r: t * this.wavefrontUnit };
  }

  protected showWavefrontReceptionA(): boolean {
    return this.effectiveWavefrontTime() >= this.milestoneTimeAtA() - 1e-6;
  }

  protected showWavefrontReceptionC(): boolean {
    return this.effectiveWavefrontTime() >= this.milestoneTimeAtC() - 1e-6;
  }

  protected wavefrontReceptionAPx(): { x: number; y: number } {
    const t = this.milestoneTimeAtA();
    const left = this.wavefrontArcLeftData(t);
    return this.spacetimePx(left.x, left.y);
  }

  protected wavefrontReceptionCPx(): { x: number; y: number } {
    const t = this.milestoneTimeAtC();
    const layout = this.wavefrontLayout();
    const x = observerPositionAtTime(layout, 'c', t);
    return this.spacetimePx(x, t);
  }

  private wavefrontObserverEvent(
    id: 'a' | 'b' | 'c',
    tCoord: number,
  ): { x: number; tWorld: number; tau: number } {
    const layout = this.wavefrontLayout();
    const tA = this.milestoneTimeAtA();
    const tC = this.milestoneTimeAtC();
    let tWorld = tCoord;
    if (id === 'a' && tCoord >= tA) {
      tWorld = tA;
    }
    if (id === 'c' && tCoord >= tC) {
      tWorld = tC;
    }
    const v = id === 'c' ? layout.vOverC : 0;
    const tau = observerProperTimeAtCoordinate(tWorld, v);
    const x = observerPositionAtTime(layout, id, tWorld);
    return { x, tWorld, tau };
  }

  protected get wavefrontUnit(): number {
    const layout = this.wavefrontLayout();
    const tMax = this.wavefrontTMax();
    const signal = this.wavefrontSignal();
    const xExtent =
      Math.max(
        layout.xB + (signal === 'ring' ? tMax : 0),
        this.wavefrontShowObserverC()
          ? observerPositionAtTime(layout, 'c', tMax)
          : layout.xB,
      ) + 0.05;
    const timeExtent = signal === 'ring' ? 2 * tMax : tMax;
    const designAxisSpan = this.right - this.left;
    return Math.min(designAxisSpan / xExtent, this.fullTimeAxisSpan / timeExtent);
  }

  protected effectiveWavefrontTime(): number {
    return this.wavefrontTime() > 0
      ? this.wavefrontTime()
      : this.wavefrontRadius();
  }

  protected milestoneTimeAtA(): number {
    return this.wavefrontTimeAtA() || this.wavefrontRadiusAtA();
  }

  protected milestoneTimeAtC(): number {
    return this.wavefrontTimeAtC() || this.wavefrontRadiusAtC();
  }

  protected wavefrontLayout(): WavefrontLayout {
    return {
      xA: this.observerXA(),
      xB: this.observerXB(),
      xC: this.observerXC(),
      vOverC: this.observerVOverC(),
      tEmit: 0,
    };
  }

  protected spacetimePx(x: number, t: number): { x: number; y: number } {
    return {
      x: this.left + x * this.wavefrontUnit,
      y: this.fullBottom - t * this.wavefrontUnit,
    };
  }
}
