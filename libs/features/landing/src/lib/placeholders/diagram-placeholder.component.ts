import { Component, computed, input } from '@angular/core';
import type { DiagramVariant } from '../data/chapters.data';

/** Static SVG stand-in for spacetime diagram primitives on the landing page. */
@Component({
  selector: 'lm-diagram-placeholder',
  imports: [],
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
      class="block overflow-visible text-ink"
      aria-hidden="true"
    >
      <g stroke="currentColor" stroke-width="1" fill="none" opacity="0.85">
        <line [attr.x1]="pad" [attr.y1]="height() - pad" [attr.x2]="width() - pad" [attr.y2]="height() - pad" />
        <line [attr.x1]="pad" [attr.y1]="height() - pad" [attr.x2]="pad" [attr.y2]="pad" />
      </g>

      @switch (variant()) {
        @case ('single') {
          <line
            [attr.x1]="pad"
            [attr.y1]="height() - pad"
            [attr.x2]="pad"
            [attr.y2]="pad + 20"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
          />
          <circle [attr.cx]="pad" [attr.cy]="pad + 20" r="3.5" fill="currentColor" />
        }
        @case ('axes') {
          <line
            [attr.x1]="pad + 20"
            [attr.y1]="height() - pad - 10"
            [attr.x2]="width() - pad - 20"
            [attr.y2]="height() - pad - 10"
            stroke="currentColor"
            stroke-width="1.5"
            opacity="0.5"
          />
        }
        @case ('pair') {
          <line
            [attr.x1]="pad"
            [attr.y1]="height() - pad"
            [attr.x2]="pad"
            [attr.y2]="pad + 30"
            stroke="var(--lm-accent-1)"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            [attr.x1]="pad + 16"
            [attr.y1]="height() - pad"
            [attr.x2]="pad + 16"
            [attr.y2]="pad + 40"
            stroke="var(--lm-accent-2)"
            stroke-width="2"
            stroke-linecap="round"
          />
        }
        @case ('cone') {
          <path
            [attr.d]="conePath()"
            stroke="currentColor"
            stroke-width="1.5"
            fill="none"
          />
        }
        @case ('well') {
          <path
            [attr.d]="wellPath()"
            stroke="currentColor"
            stroke-width="1.5"
            fill="none"
          />
        }
        @case ('wavefront') {
          @for (r of waveRadii; track r) {
            <circle
              [attr.cx]="width() / 2"
              [attr.cy]="height() / 2"
              [attr.r]="r"
              stroke="currentColor"
              stroke-width="1"
              fill="none"
              opacity="0.55"
            />
          }
        }
        @case ('doppler') {
          @for (x of dopplerLines; track x) {
            <line
              [attr.x1]="x"
              [attr.y1]="pad"
              [attr.x2]="x"
              [attr.y2]="height() - pad"
              stroke="currentColor"
              stroke-width="1"
              opacity="0.45"
            />
          }
        }
        @case ('bend') {
          <path
            [attr.d]="bendPath()"
            stroke="currentColor"
            stroke-width="1.5"
            fill="none"
          />
        }
      }
    </svg>
  `,
})
export class LmDiagramPlaceholderComponent {
  readonly variant = input<DiagramVariant>('axes');
  readonly width = input(180);
  readonly height = input(100);

  readonly pad = 16;
  readonly waveRadii = [18, 30, 42] as const;
  readonly dopplerLines = [40, 52, 68, 88, 116] as const;

  readonly viewBox = computed(
    () => `0 0 ${this.width()} ${this.height()}`,
  );

  readonly conePath = computed(() => {
    const w = this.width();
    const h = this.height();
    const cx = w / 2;
    return `M ${cx - 28} ${h - this.pad} L ${cx} ${this.pad + 8} L ${cx + 28} ${h - this.pad}`;
  });

  readonly wellPath = computed(() => {
    const w = this.width();
    const h = this.height();
    const cx = w / 2;
    return `M ${this.pad} ${h / 2} Q ${cx} ${h - this.pad} ${w - this.pad} ${h / 2}`;
  });

  readonly bendPath = computed(() => {
    const w = this.width();
    const h = this.height();
    return `M ${this.pad} ${h / 2} Q ${w / 2} ${this.pad} ${w - this.pad} ${h / 2}`;
  });
}
