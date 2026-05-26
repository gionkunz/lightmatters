import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  Output,
  input,
  signal,
} from '@angular/core';
import {
  emissionPosition,
  lightCircleRadius,
  pulseReachesMoving,
  pulseReachesStationary,
  type Vec2,
} from '@lm/physics';

export interface LightSceneObserver {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly label?: string;
  readonly color?: 'accent-1' | 'accent-2' | 'neutral';
  readonly velocity?: Vec2;
}

export interface LightSceneEmission {
  readonly atTime: number;
  readonly pulseId: string;
}

export interface LightSceneSource {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly label?: string;
  readonly velocity?: Vec2;
  readonly emissions: readonly LightSceneEmission[];
}

export interface LightSceneReception {
  readonly observerId: string;
  readonly sourceId: string;
  readonly pulseId: string;
  readonly atTime: number;
}

interface PulseRender {
  readonly id: string;
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly opacity: number;
}

interface ObserverRender {
  readonly id: string;
  readonly cx: number;
  readonly cy: number;
  readonly label: string;
  readonly fillClass: string;
  readonly received: boolean;
}

interface SourceRender {
  readonly id: string;
  readonly cx: number;
  readonly cy: number;
  readonly label: string;
}

/**
 * Top-down 2-D space scene for Chapter 3+.
 *
 * Both axes are SPACE — there is no time axis. Pulses are rendered as expanding
 * circles centered on their source. Time is the animation variable, not a spatial
 * dimension. See `openspec/specs/light-scene/spec.md` for the contract.
 */
@Component({
  selector: 'lm-light-scene',
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="'0 0 ' + width() + ' ' + height()"
      class="block"
    >
      @for (pulse of pulses(); track pulse.id) {
        <circle
          [attr.cx]="pulse.cx"
          [attr.cy]="pulse.cy"
          [attr.r]="pulse.r"
          class="stroke-ink"
          fill="none"
          stroke-width="1.4"
          [attr.opacity]="pulse.opacity"
        />
      }

      @for (src of renderedSources(); track src.id) {
        <circle
          [attr.cx]="src.cx"
          [attr.cy]="src.cy"
          r="3.5"
          class="fill-ink"
          stroke="var(--lm-paper)"
          stroke-width="1.5"
        />
        @if (showLabels() && src.label) {
          <text
            [attr.x]="src.cx + 8"
            [attr.y]="src.cy - 8"
            class="fill-ink font-mono text-[11px] uppercase tracking-wider opacity-65"
          >
            {{ src.label }}
          </text>
        }
      }

      @for (obs of renderedObservers(); track obs.id) {
        @if (obs.received) {
          <circle
            [attr.cx]="obs.cx"
            [attr.cy]="obs.cy"
            r="9"
            [attr.class]="obs.fillClass"
            opacity="0.35"
            [style.filter]="'drop-shadow(0 0 6px var(--lm-glow-1))'"
          />
        }
        <circle
          [attr.cx]="obs.cx"
          [attr.cy]="obs.cy"
          r="5"
          [attr.class]="obs.fillClass"
        />
        @if (showLabels()) {
          <text
            [attr.x]="obs.cx + 10"
            [attr.y]="obs.cy + 4"
            class="font-mono text-[11px] uppercase tracking-wider opacity-80"
            [attr.fill]="obsTextColor(obs.fillClass)"
          >
            {{ obs.label }}
          </text>
        }
      }
    </svg>
  `,
})
export class LmLightSceneComponent {
  readonly width = input(560);
  readonly height = input(420);
  readonly padding = input(40);
  /** Half-width of scene in scene units (so x ∈ [-extent, +extent]). */
  readonly extent = input(1);
  readonly time = input(0);
  readonly observers = input<readonly LightSceneObserver[]>([]);
  readonly sources = input<readonly LightSceneSource[]>([]);
  readonly showLabels = input(true);
  /** Speed of light in scene units per scene-time unit. Default 1. */
  readonly c = input(1);

  // Per-observer position overrides (timeline target friendly).
  // Map of `<id>` → `{ x?: number; y?: number }`.
  // When a key is set, it overrides the observer's intrinsic motion for that axis.
  @Input() set observerOverrides(
    map: Record<string, { x?: number; y?: number }> | undefined,
  ) {
    this.overrides.set(map ?? {});
  }
  private readonly overrides = signal<
    Record<string, { x?: number; y?: number }>
  >({});

  /** Fires once per pulse-observer pair the first time the wavefront reaches the observer. */
  @Output() readonly reception = new EventEmitter<LightSceneReception>();

  private readonly emitted = new Set<string>();

  constructor() {
    effect(() => {
      const events = this.activeReceptions();
      for (const event of events) {
        const key = `${event.observerId}|${event.sourceId}|${event.pulseId}`;
        if (!this.emitted.has(key)) {
          this.emitted.add(key);
          this.reception.emit(event);
        }
      }
    });
  }

  protected obsTextColor(fillClass: string): string {
    if (fillClass.includes('accent-1')) return 'var(--lm-accent-1)';
    if (fillClass.includes('accent-2')) return 'var(--lm-accent-2)';
    return 'var(--lm-ink)';
  }

  protected readonly receptionTimes = computed<
    { observerId: string; sourceId: string; pulseId: string; atTime: number }[]
  >(() => {
    const out: {
      observerId: string;
      sourceId: string;
      pulseId: string;
      atTime: number;
    }[] = [];
    const c = this.c();
    for (const src of this.sources()) {
      for (const emission of src.emissions) {
        for (const obs of this.observers()) {
          const vSrc = src.velocity ?? { x: 0, y: 0 };
          const sourcePos = emissionPosition(
            { x: src.x, y: src.y },
            vSrc,
            emission.atTime,
          );
          const observerStart = { x: obs.x, y: obs.y };
          // Reception equation is in scene time relative to emission.
          const v = obs.velocity ?? { x: 0, y: 0 };
          let dt: number | null;
          if (v.x === 0 && v.y === 0) {
            dt = pulseReachesStationary(sourcePos, observerStart, c);
          } else {
            dt = pulseReachesMoving(sourcePos, observerStart, v, c);
          }
          if (dt === null || !Number.isFinite(dt)) {
            continue;
          }
          out.push({
            observerId: obs.id,
            sourceId: src.id,
            pulseId: emission.pulseId,
            atTime: emission.atTime + dt,
          });
        }
      }
    }
    return out;
  });

  protected readonly activeReceptions = computed(() =>
    this.receptionTimes().filter((event) => this.time() >= event.atTime - 1e-9),
  );

  protected readonly pulses = computed<PulseRender[]>(() => {
    const t = this.time();
    const c = this.c();
    const u = this.unit();
    const out: PulseRender[] = [];
    for (const src of this.sources()) {
      for (const emission of src.emissions) {
        const r = lightCircleRadius(emission.atTime, t, c);
        if (r <= 0) continue;
        const vSrc = src.velocity ?? { x: 0, y: 0 };
        const emitPos = emissionPosition(
          { x: src.x, y: src.y },
          vSrc,
          emission.atTime,
        );
        const center = this.toPx(emitPos.x, emitPos.y);
        out.push({
          id: `${src.id}|${emission.pulseId}`,
          cx: center.x,
          cy: center.y,
          r: r * u,
          opacity: 0.85,
        });
      }
    }
    return out;
  });

  protected readonly renderedSources = computed<SourceRender[]>(() => {
    const t = this.time();
    return this.sources().map((src) => {
      const v = src.velocity ?? { x: 0, y: 0 };
      const x = src.x + v.x * t;
      const y = src.y + v.y * t;
      const px = this.toPx(x, y);
      return {
        id: src.id,
        cx: px.x,
        cy: px.y,
        label: src.label ?? src.id,
      };
    });
  });

  protected readonly renderedObservers = computed<ObserverRender[]>(() => {
    const t = this.time();
    const overrides = this.overrides();
    const received = this.activeReceptions();
    const receivedSet = new Set(received.map((r) => r.observerId));
    return this.observers().map((obs) => {
      const v = obs.velocity ?? { x: 0, y: 0 };
      const override = overrides[obs.id] ?? {};
      const x = override.x !== undefined ? override.x : obs.x + v.x * t;
      const y = override.y !== undefined ? override.y : obs.y + v.y * t;
      const px = this.toPx(x, y);
      return {
        id: obs.id,
        cx: px.x,
        cy: px.y,
        label: obs.label ?? obs.id,
        fillClass: this.observerFill(obs.color),
        received: receivedSet.has(obs.id),
      };
    });
  });

  private observerFill(color?: LightSceneObserver['color']): string {
    switch (color) {
      case 'accent-1':
        return 'fill-accent-1';
      case 'accent-2':
        return 'fill-accent-2';
      default:
        return 'fill-ink';
    }
  }

  private unit(): number {
    const usableW = this.width() - 2 * this.padding();
    const usableH = this.height() - 2 * this.padding();
    return Math.min(usableW, usableH) / (2 * this.extent());
  }

  private toPx(x: number, y: number): { x: number; y: number } {
    const cx = this.width() / 2;
    const cy = this.height() / 2;
    const u = this.unit();
    return { x: cx + x * u, y: cy - y * u };
  }
}
