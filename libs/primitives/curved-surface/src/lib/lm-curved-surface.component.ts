import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { ThemeService } from '@lm/design';
import type { WorldlineMode } from '@lm/physics';
import {
  CurvedSurfaceRenderer,
  type CurvedSurfaceState,
} from './curved-surface-renderer';
import { readThemeColors } from './read-theme-colors';

/** Three.js wireframe cylinder / cone with worldline dot and fading trail. */
@Component({
  selector: 'lm-curved-surface',
  template: `
    <div
      class="relative inline-block max-h-full max-w-full"
      [style.width.px]="width()"
      [style.height.px]="height()"
    >
      <canvas
        #canvas
        class="block max-h-full max-w-full"
        [attr.width]="width()"
        [attr.height]="height()"
        [style.width.px]="width()"
        [style.height.px]="height()"
      ></canvas>
      @if (showAxisLabels() && fold() <= 0.45 && unfold() < 0.5) {
        <svg
          class="pointer-events-none absolute inset-0 overflow-visible"
          [attr.width]="width()"
          [attr.height]="height()"
          [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
          aria-hidden="true"
        >
          <text
            [attr.x]="width() * 0.54"
            [attr.y]="height() * 0.9"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            x
          </text>
          <text
            [attr.x]="width() * 0.54"
            [attr.y]="height() * 0.1"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            t
          </text>
        </svg>
      }
      @if (showAxisLabels() && fold() > 0.45 && unfold() < 0.5) {
        <svg
          class="pointer-events-none absolute inset-0 overflow-visible"
          [attr.width]="width()"
          [attr.height]="height()"
          [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
          aria-hidden="true"
        >
          <text
            [attr.x]="width() * 0.82"
            [attr.y]="height() * 0.52"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            x
          </text>
          <text
            [attr.x]="width() * 0.12"
            [attr.y]="height() * 0.42"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            t
          </text>
        </svg>
      }
    </div>
  `,
})
export class LmCurvedSurfaceComponent implements OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  readonly fold = input(1);
  readonly curvature = input(0);
  readonly time = input(0);
  readonly unfold = input(0);
  readonly showTrail = input(true);
  readonly trailLength = input(96);
  readonly trailSpan = input(1);
  readonly worldlineMode = input<WorldlineMode>('orbit');
  readonly showAppleTree = input(false);
  readonly showGeodesic = input(false);
  readonly showAxisLabels = input(false);
  readonly width = input(720);
  readonly height = input(520);

  private renderer: CurvedSurfaceRenderer | null = null;

  constructor() {
    afterNextRender(() => {
      const canvas = this.canvasRef().nativeElement;
      this.renderer = new CurvedSurfaceRenderer(canvas);
      this.renderer.resize(this.width(), this.height());
      this.renderer.setThemeColors(readThemeColors());
      this.renderer.update({
        fold: this.fold(),
        curvature: this.curvature(),
        time: this.time(),
        unfold: this.unfold(),
        showTrail: this.showTrail(),
        trailLength: this.trailLength(),
        trailSpan: this.trailSpan(),
        worldlineMode: this.worldlineMode(),
        showAppleTree: this.showAppleTree(),
        showGeodesic: this.showGeodesic(),
        showAxisLabels: this.showAxisLabels(),
      });
    });

    effect(() => {
      this.themeService.theme();
      this.renderer?.setThemeColors(readThemeColors());
    });

    effect(() => {
      this.width();
      this.height();
      this.renderer?.resize(this.width(), this.height());
    });

    effect(() => {
      const state: Partial<CurvedSurfaceState> = {
        fold: this.fold(),
        curvature: this.curvature(),
        time: this.time(),
        unfold: this.unfold(),
        showTrail: this.showTrail(),
        trailLength: this.trailLength(),
        trailSpan: this.trailSpan(),
        worldlineMode: this.worldlineMode(),
        showAppleTree: this.showAppleTree(),
        showGeodesic: this.showGeodesic(),
        showAxisLabels: this.showAxisLabels(),
      };
      this.renderer?.update(state);
    });
  }

  ngOnDestroy(): void {
    this.renderer?.dispose();
    this.renderer = null;
  }
}
