import { Component, input } from '@angular/core';

/** SVG spacetime diagram — position-only variant for Chapter 1 Step 1. */
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
      }
    </svg>
  `,
})
export class LmSpacetimeDiagramComponent {
  readonly variant = input<'position-only'>('position-only');
  readonly position = input(0.5);
  readonly width = input(680);
  readonly height = input(200);
  readonly showLabels = input(true);
  readonly axisOpacity = input(1);

  protected readonly left = 70;
  protected readonly right = 610;
  protected readonly axisY = 100;
  protected readonly ticks = [0, 0.2, 0.4, 0.6, 0.8, 1];

  protected get axisSpan(): number {
    return this.right - this.left;
  }

  protected get pointX(): number {
    return this.left + this.position() * this.axisSpan;
  }
}
