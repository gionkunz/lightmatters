import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { ThemeService } from '@lm/design';
import type { WellLaunchMode, WellTrajectoryMode, WorldlineMode } from '@lm/physics';
import { axisArrowPoints, type AxisLabelAnchor } from './axis-labels';
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
      @if (showAxisLabels() && axisAnchors().length > 0) {
        <svg
          class="pointer-events-none absolute inset-0 overflow-visible"
          [attr.width]="width()"
          [attr.height]="height()"
          [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
          aria-hidden="true"
        >
          @for (anchor of axisAnchors(); track anchor.id) {
            <polyline
              [attr.points]="arrowPoints(anchor)"
              class="fill-none stroke-ink"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity="0.65"
            />
            <text
              [attr.x]="anchor.x"
              [attr.y]="anchor.y"
              [attr.text-anchor]="textAnchor(anchor)"
              [attr.dominant-baseline]="textBaseline(anchor)"
              class="fill-ink font-mono text-[11px] tracking-wider opacity-65"
            >
              {{ anchor.label }}
            </text>
          }
        </svg>
      }
      <button
        type="button"
        class="absolute right-2 top-2 flex size-9 cursor-pointer items-center justify-center rounded-full border border-ink-faint bg-paper/90 text-ink opacity-70 transition hover:border-accent-1 hover:opacity-100 hover:shadow-[0_0_12px_var(--color-accent-1-glow)]"
        aria-label="Reset view"
        (click)="resetCamera($event)"
      >
        <svg
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>
    </div>
  `,
})
export class LmCurvedSurfaceComponent implements OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  readonly surfaceProfile = input<'cone' | 'well'>('cone');
  readonly fold = input(1);
  readonly curvature = input(0);
  readonly time = input(0);
  readonly unfold = input(0);
  readonly wellReveal = input(1);
  readonly wellMorph = input(1);
  readonly wellUnfold = input(0);
  readonly energy = input(0.35);
  readonly wellLaunchMode = input<WellLaunchMode>('energy');
  readonly spatialFraction = input(0.28);
  readonly wellStartXNorm = input(-1);
  readonly showTrail = input(true);
  readonly trailLength = input(96);
  readonly trailSpan = input(1);
  readonly worldlineMode = input<WorldlineMode>('orbit');
  readonly wellTrajectoryMode = input<WellTrajectoryMode>('pass-through');
  readonly showAppleTree = input(false);
  readonly showProjectedTree = input(true);
  readonly showGeodesic = input(false);
  readonly showAxisLabels = input(false);
  readonly showEarthSphere = input(false);
  readonly wellDepth = input<'earth' | 'deep'>('earth');
  readonly showLightBeam = input(false);
  readonly lightBeamProgress = input(0);
  readonly lightBeamMissDistance = input(0.25);
  readonly lightBeamHalfWidth = input(0.08);
  readonly lightBeamMode = input<'single' | 'dual' | 'filled'>('single');
  readonly width = input(720);
  readonly height = input(520);

  protected readonly axisAnchors = signal<AxisLabelAnchor[]>([]);

  private renderer: CurvedSurfaceRenderer | null = null;

  constructor() {
    afterNextRender(() => {
      const canvas = this.canvasRef().nativeElement;
      this.renderer = new CurvedSurfaceRenderer(canvas);
      this.renderer.onAxisLabelsUpdated = (anchors) =>
        this.axisAnchors.set(anchors);
      this.renderer.resize(this.width(), this.height());
      this.renderer.setThemeColors(readThemeColors());
      this.renderer.update({
        surfaceProfile: this.surfaceProfile(),
        fold: this.fold(),
        curvature: this.curvature(),
        time: this.time(),
        unfold: this.unfold(),
        wellReveal: this.wellReveal(),
        wellMorph: this.wellMorph(),
        wellUnfold: this.wellUnfold(),
        energy: this.energy(),
        wellLaunchMode: this.wellLaunchMode(),
        spatialFraction: this.spatialFraction(),
        wellStartXNorm: this.wellStartXNorm(),
        showTrail: this.showTrail(),
        trailLength: this.trailLength(),
        trailSpan: this.trailSpan(),
        worldlineMode: this.worldlineMode(),
        wellTrajectoryMode: this.wellTrajectoryMode(),
        showAppleTree: this.showAppleTree(),
        showProjectedTree: this.showProjectedTree(),
        showGeodesic: this.showGeodesic(),
        showAxisLabels: this.showAxisLabels(),
        showEarthSphere: this.showEarthSphere(),
        wellDepth: this.wellDepth(),
        showLightBeam: this.showLightBeam(),
        lightBeamProgress: this.lightBeamProgress(),
        lightBeamMissDistance: this.lightBeamMissDistance(),
        lightBeamHalfWidth: this.lightBeamHalfWidth(),
        lightBeamMode: this.lightBeamMode(),
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
        surfaceProfile: this.surfaceProfile(),
        fold: this.fold(),
        curvature: this.curvature(),
        time: this.time(),
        unfold: this.unfold(),
        wellReveal: this.wellReveal(),
        wellMorph: this.wellMorph(),
        wellUnfold: this.wellUnfold(),
        energy: this.energy(),
        wellLaunchMode: this.wellLaunchMode(),
        spatialFraction: this.spatialFraction(),
        wellStartXNorm: this.wellStartXNorm(),
        showTrail: this.showTrail(),
        trailLength: this.trailLength(),
        trailSpan: this.trailSpan(),
        worldlineMode: this.worldlineMode(),
        wellTrajectoryMode: this.wellTrajectoryMode(),
        showAppleTree: this.showAppleTree(),
        showProjectedTree: this.showProjectedTree(),
        showGeodesic: this.showGeodesic(),
        showAxisLabels: this.showAxisLabels(),
        showEarthSphere: this.showEarthSphere(),
        wellDepth: this.wellDepth(),
        showLightBeam: this.showLightBeam(),
        lightBeamProgress: this.lightBeamProgress(),
        lightBeamMissDistance: this.lightBeamMissDistance(),
        lightBeamHalfWidth: this.lightBeamHalfWidth(),
        lightBeamMode: this.lightBeamMode(),
      };
      this.renderer?.update(state);
    });
  }

  ngOnDestroy(): void {
    this.renderer?.dispose();
    this.renderer = null;
  }

  protected arrowPoints(anchor: AxisLabelAnchor): string {
    return axisArrowPoints(anchor);
  }

  protected textAnchor(anchor: AxisLabelAnchor): 'start' | 'middle' | 'end' {
    if (anchor.dirX > 0.35) return 'start';
    if (anchor.dirX < -0.35) return 'end';
    return 'middle';
  }

  protected textBaseline(anchor: AxisLabelAnchor): 'auto' | 'middle' | 'hanging' {
    if (anchor.dirY > 0.35) return 'hanging';
    if (anchor.dirY < -0.35) return 'auto';
    return 'middle';
  }

  protected resetCamera(event: MouseEvent): void {
    event.stopPropagation();
    this.renderer?.animateReset();
  }
}
