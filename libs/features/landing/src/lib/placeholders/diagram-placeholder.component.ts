import { Component, computed, input } from '@angular/core';
import type { DiagramVariant } from '../data/chapters.data';

/** Static SVG stand-in for space and proper-time diagram primitives on the landing page. */
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
        @case ('vector') {
          <line
            [attr.x1]="vectorGeom().sx"
            [attr.y1]="vectorGeom().sy"
            [attr.x2]="vectorGeom().ex"
            [attr.y2]="vectorGeom().ey"
            stroke="var(--lm-accent-1)"
            stroke-width="2.2"
            stroke-linecap="round"
          />
          <path
            [attr.d]="vectorGeom().head"
            stroke="var(--lm-accent-1)"
            stroke-width="2.2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        }
        @case ('source') {
          @for (r of waveRadii; track r) {
            <circle
              [attr.cx]="sourceGeom().cx"
              [attr.cy]="sourceGeom().cy"
              [attr.r]="r"
              stroke="currentColor"
              stroke-width="1"
              fill="none"
              opacity="0.5"
            />
          }
          <circle
            [attr.cx]="sourceGeom().cx"
            [attr.cy]="sourceGeom().cy"
            r="2.5"
            fill="currentColor"
          />
          <circle
            [attr.cx]="sourceGeom().dotX"
            [attr.cy]="sourceGeom().cy"
            r="3.5"
            fill="var(--lm-accent-1)"
          />
        }
        @case ('emwave') {
          <polyline
            [attr.points]="emWaveE()"
            stroke="var(--lm-accent-1)"
            stroke-width="1.8"
            fill="none"
            stroke-linejoin="round"
          />
          <polyline
            [attr.points]="emWaveB()"
            stroke="var(--lm-accent-2)"
            stroke-width="1.5"
            fill="none"
            stroke-linejoin="round"
            opacity="0.85"
          />
        }
        @case ('contraction') {
          <path
            [attr.d]="contractionGeom().top"
            stroke="currentColor"
            stroke-width="1.5"
            fill="none"
            opacity="0.55"
          />
          <path
            [attr.d]="contractionGeom().bottom"
            stroke="var(--lm-accent-2)"
            stroke-width="2"
            fill="none"
          />
        }
        @case ('twin') {
          <line
            [attr.x1]="twinGeom().cx"
            [attr.y1]="twinGeom().yBottom"
            [attr.x2]="twinGeom().cx"
            [attr.y2]="twinGeom().yTop"
            stroke="var(--lm-accent-1)"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            [attr.d]="twinGeom().travel"
            stroke="var(--lm-accent-2)"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle
            [attr.cx]="twinGeom().cx"
            [attr.cy]="twinGeom().yBottom"
            r="3"
            fill="currentColor"
          />
          <circle
            [attr.cx]="twinGeom().cx"
            [attr.cy]="twinGeom().yTop"
            r="3"
            fill="var(--lm-accent-1)"
          />
          <circle
            [attr.cx]="twinGeom().cx"
            [attr.cy]="twinGeom().yTravellerTop"
            r="3"
            fill="var(--lm-accent-2)"
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

  /** Single speed vector rising from the origin, with arrowhead. */
  readonly vectorGeom = computed(() => {
    const w = this.width();
    const h = this.height();
    const sx = this.pad;
    const sy = h - this.pad;
    const ex = this.pad + (w - 2 * this.pad) * 0.5;
    const ey = this.pad + (h - 2 * this.pad) * 0.18;
    const dx = ex - sx;
    const dy = ey - sy;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const head = 11;
    const wing = head * 0.55;
    const b1x = ex - ux * head + -uy * wing;
    const b1y = ey - uy * head + ux * wing;
    const b2x = ex - ux * head - -uy * wing;
    const b2y = ey - uy * head - ux * wing;
    return {
      sx,
      sy,
      ex,
      ey,
      head: `M ${b1x} ${b1y} L ${ex} ${ey} L ${b2x} ${b2y}`,
    };
  });

  /** Wavefronts centred on an emission point, with the source dot moved on. */
  readonly sourceGeom = computed(() => {
    const w = this.width();
    const h = this.height();
    return {
      cx: w * 0.4,
      cy: h / 2,
      dotX: w * 0.66,
    };
  });

  /** Two rulers: full rest length on top, contracted length below. */
  readonly contractionGeom = computed(() => {
    const w = this.width();
    const h = this.height();
    const x0 = this.pad + 12;
    const x1 = w - this.pad - 12;
    const yTop = h / 2 - 14;
    const yBottom = h / 2 + 14;
    const xc = x0 + (x1 - x0) * 0.62;
    return {
      top: `M ${x0} ${yTop - 4} L ${x0} ${yTop + 4} M ${x0} ${yTop} L ${x1} ${yTop} M ${x1} ${yTop - 4} L ${x1} ${yTop + 4}`,
      bottom: `M ${x0} ${yBottom - 4} L ${x0} ${yBottom + 4} M ${x0} ${yBottom} L ${xc} ${yBottom} M ${xc} ${yBottom - 4} L ${xc} ${yBottom + 4}`,
    };
  });

  /**
   * Epstein space-proper-time twin: A (proper time vertical) climbs straight to the
   * top; B's bent path banks less proper time, so it returns to the axis below A.
   */
  readonly twinGeom = computed(() => {
    const w = this.width();
    const h = this.height();
    const cx = w / 2 - 6;
    const yBottom = h - this.pad;
    const yTop = this.pad;
    // B reunites in space (x = cx) but lower on the proper-time axis than A.
    const yTravellerTop = yBottom - (yBottom - yTop) * 0.72;
    const apexX = cx + 44;
    const apexY = (yBottom + yTravellerTop) / 2;
    return {
      cx,
      yBottom,
      yTop,
      yTravellerTop,
      travel: `M ${cx} ${yBottom} L ${apexX} ${apexY} L ${cx} ${yTravellerTop}`,
    };
  });

  readonly emWaveE = computed(() => {
    const w = this.width();
    const h = this.height();
    const mid = h / 2;
    const amp = h * 0.22;
    const left = this.pad;
    const right = w - this.pad;
    const pts: string[] = [];
    for (let i = 0; i <= 24; i++) {
      const x = left + ((right - left) * i) / 24;
      const y = mid - amp * Math.sin((i / 24) * Math.PI * 3);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  });

  readonly emWaveB = computed(() => {
    const w = this.width();
    const h = this.height();
    const mid = h / 2;
    const amp = h * 0.16;
    const left = this.pad;
    const right = w - this.pad;
    const pts: string[] = [];
    for (let i = 0; i <= 24; i++) {
      const x = left + ((right - left) * i) / 24;
      const s = Math.sin((i / 24) * Math.PI * 3);
      pts.push(`${(x + amp * s * 0.55).toFixed(1)},${(mid + amp * s * 0.42).toFixed(1)}`);
    }
    return pts.join(' ');
  });
}
