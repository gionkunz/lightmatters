import { Component, input } from '@angular/core';

type DiagramVariant = 'position-only' | 'time-only' | 'full' | 'single';

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
      } @else if (variant() === 'full' || variant() === 'single') {
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
        } @else {
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
  readonly width = input(680);
  readonly height = input(200);
  readonly showLabels = input(true);
  readonly axisOpacity = input(1);
  readonly showLightCone = input(true);
  readonly showWorldline = input(true);
  readonly showDot = input(true);
  readonly vectorStroke = input(2.4);

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

  protected get vectorAngleRad(): number {
    return this.velocity() * (Math.PI / 4);
  }

  protected get vectorTipX(): number {
    return this.left + this.vectorLen * Math.sin(this.vectorAngleRad);
  }

  protected get vectorTipY(): number {
    return this.fullBottom - this.vectorLen * Math.cos(this.vectorAngleRad);
  }

  protected get vectorArrowPoints(): string {
    const tipX = this.vectorTipX;
    const tipY = this.vectorTipY;
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
