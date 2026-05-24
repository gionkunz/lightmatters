import { Component, input } from '@angular/core';
import { speedBudgetTipLabel } from '@lm/physics';

type DiagramVariant = 'position-only' | 'time-only' | 'full' | 'single' | 'pair';

/** SVG spacetime diagram — position-only, time-only, full, and single variants for Chapter 1. */
@Component({
  selector: 'lm-spacetime-diagram',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      class="block overflow-visible"
    >
      @if (variant() === 'position-only') {
        <g
          class="stroke-ink"
          fill="none"
          stroke-width="1"
          [attr.opacity]="axisOpacity()"
        >
          <line [attr.x1]="left" [attr.y1]="axisY" [attr.x2]="right" [attr.y2]="axisY" />
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
            [attr.x]="right + 8"
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
          <line [attr.x1]="left" [attr.y1]="fullBottom" [attr.x2]="right" [attr.y2]="fullBottom" />
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
            [attr.x]="right + 8"
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

  protected get axisSpan(): number {
    return this.right - this.left;
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
}
