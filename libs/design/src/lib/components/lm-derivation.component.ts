import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { MathJaxService } from '../math/mathjax.service';
import type { DerivationFrame } from './lm-derivation.types';
export type { DerivationFrame } from './lm-derivation.types';
import { queryTokenNodes } from './lm-derivation.utils';

const SETTLE_EPSILON = 0.001;

/** Timeline-driven formula derivation with token-level FLIP transitions. */
@Component({
  selector: 'lm-derivation',
  template: `
    <div
      class="lm-derivation relative inline-block max-w-full rounded-[3px] border border-ink-faint bg-paper px-8 py-6 text-center font-serif text-[length:calc(26px*var(--lm-type-scale))] leading-tight text-ink shadow-[0_1px_0_0_var(--lm-glow-ink)]"
      [style.minWidth.px]="reservedWidth()"
      [style.minHeight.px]="reservedHeight()"
    >
      <div
        #stage
        class="lm-derivation__stage relative mx-auto inline-block [&_mjx-container]:!my-0"
        data-testid="derivation-stage"
      ></div>

      @if (!clientReady()) {
        <span
          class="lm-derivation__fallback absolute inset-0 flex items-center justify-center opacity-70"
          data-testid="derivation-fallback"
          >{{ frames()[0]?.latex }}</span
        >
      }

      <div
        class="pointer-events-none absolute left-[-9999px] top-0 opacity-0"
        aria-hidden="true"
        data-testid="derivation-measurer"
      >
        @for (frame of frames(); track $index) {
          <div
            #frameHost
            class="lm-derivation__frame-host inline-block"
            [attr.data-frame-index]="$index"
            [attr.data-latex]="frame.latex"
          ></div>
        }
      </div>
    </div>
  `,
})
export class LmDerivationComponent {
  private readonly mathJax = inject(MathJaxService);
  private readonly injector = inject(Injector);

  private readonly stageRef = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly frameHosts = viewChildren<ElementRef<HTMLElement>>('frameHost');

  readonly frames = input.required<readonly DerivationFrame[]>();
  readonly playhead = input(0);

  protected readonly clientReady = signal(false);
  protected readonly reservedWidth = signal(0);
  protected readonly reservedHeight = signal(0);

  private typesetReady = false;
  private mathJaxAvailable = false;
  private lastRenderedKey = '';

  constructor() {
    afterNextRender(
      () => {
        if (typeof window === 'undefined') {
          return;
        }
        void this.bootstrap();
      },
      { injector: this.injector },
    );

    effect(() => {
      this.frames();
      this.playhead();
      if (!this.typesetReady) {
        return;
      }
      afterNextRender(
        () => {
          void this.render();
        },
        { injector: this.injector },
      );
    });
  }

  private async bootstrap(): Promise<void> {
    // Actively load MathJax (the narrator lazy-loads it elsewhere, but we cannot
    // assume it is present yet when this primitive first renders).
    try {
      await this.mathJax.ensureReady();
    } catch {
      // Leave the static fallback in place if MathJax fails to load.
    }
    this.mathJaxAvailable =
      typeof window !== 'undefined' && Boolean(window.MathJax);
    await this.typesetAllFrames();
    this.measureReservedSpace();
    this.typesetReady = true;
    this.clientReady.set(this.mathJaxAvailable);
    await this.render();
  }

  private canAnimate(): boolean {
    return this.mathJaxAvailable;
  }

  private async typesetAllFrames(): Promise<void> {
    if (!this.canAnimate()) {
      return;
    }

    for (const ref of this.frameHosts()) {
      const element = ref.nativeElement;
      const latex = element.dataset['latex'];
      if (!latex || element.dataset['typeset'] === 'done') {
        continue;
      }
      try {
        await this.mathJax.typesetElement(element, latex);
      } catch {
        element.dataset['typeset'] = 'error';
        element.textContent = `$${latex}$`;
      }
    }
  }

  private measureReservedSpace(): void {
    let maxWidth = 0;
    let maxHeight = 0;

    for (const ref of this.frameHosts()) {
      const rect = ref.nativeElement.getBoundingClientRect();
      maxWidth = Math.max(maxWidth, rect.width);
      maxHeight = Math.max(maxHeight, rect.height);
    }

    this.reservedWidth.set(Math.ceil(maxWidth));
    this.reservedHeight.set(Math.ceil(maxHeight));
  }

  private async render(): Promise<void> {
    if (!this.typesetReady && this.canAnimate()) {
      await this.bootstrap();
      return;
    }

    const stage = this.stageRef().nativeElement;
    const frameCount = this.frames().length;
    if (frameCount === 0) {
      stage.replaceChildren();
      return;
    }

    const clampedPlayhead = Math.max(
      0,
      Math.min(this.playhead(), frameCount - 1),
    );
    const fromIdx = Math.floor(clampedPlayhead);
    const toIdx = Math.min(Math.ceil(clampedPlayhead), frameCount - 1);
    const transitionT = clampedPlayhead - fromIdx;
    const renderKey = `${fromIdx}:${toIdx}:${transitionT.toFixed(4)}:${this.frames().length}`;

    if (renderKey === this.lastRenderedKey) {
      return;
    }
    this.lastRenderedKey = renderKey;

    if (!this.canAnimate()) {
      this.renderSettled(stage, 0);
      return;
    }

    if (
      transitionT < SETTLE_EPSILON ||
      fromIdx === toIdx ||
      transitionT > 1 - SETTLE_EPSILON
    ) {
      this.renderSettled(stage, transitionT > 1 - SETTLE_EPSILON ? toIdx : fromIdx);
      return;
    }

    this.renderTransition(stage, fromIdx, toIdx, transitionT);
  }

  private renderSettled(stage: HTMLElement, frameIndex: number): void {
    stage.replaceChildren();
    const host = this.hostForIndex(frameIndex);
    if (!host) {
      return;
    }
    stage.appendChild(cleanFrameClone(host));
  }

  /**
   * Cross-fade the outgoing line out and the incoming line in, while striking
   * through the cancelled tokens in red. A crossfade keeps every term's structure
   * intact throughout the transition (no half-built or stray fragments) and reads
   * unambiguously as "this line becomes that line".
   */
  private renderTransition(
    stage: HTMLElement,
    fromIdx: number,
    toIdx: number,
    t: number,
  ): void {
    const fromHost = this.hostForIndex(fromIdx);
    const toHost = this.hostForIndex(toIdx);
    if (!fromHost || !toHost) {
      return;
    }

    stage.replaceChildren();

    // The incoming line lays out the stage box and fades in.
    const toClone = cleanFrameClone(toHost);
    toClone.style.opacity = `${easeInOut(t)}`;
    stage.appendChild(toClone);

    // The outgoing line is overlaid, centred, and fades out.
    const fromClone = cleanFrameClone(fromHost);
    fromClone.style.position = 'absolute';
    fromClone.style.left = '50%';
    fromClone.style.top = '50%';
    fromClone.style.transform = 'translate(-50%, -50%)';
    fromClone.style.opacity = `${easeInOut(1 - t)}`;
    stage.appendChild(fromClone);

    const cancelIds = this.frames()[fromIdx]?.cancel ?? [];
    if (cancelIds.length === 0) {
      return;
    }

    const overlay = document.createElement('div');
    overlay.className =
      'lm-derivation__overlay pointer-events-none absolute inset-0';
    stage.appendChild(overlay);

    const stageRect = stage.getBoundingClientRect();
    const tokens = queryTokenNodes(fromClone, cancelIds);
    const tint = Math.round(Math.min(1, t / 0.3) * 100);
    const strikeProgress = Math.min(1, Math.max(0, (t - 0.1) / 0.45));

    for (const id of cancelIds) {
      const node = tokens.get(id);
      if (!node) {
        continue;
      }
      node.style.color = `color-mix(in oklch, var(--lm-accent-1) ${tint}%, currentColor)`;

      const rect = node.getBoundingClientRect();
      const strike = document.createElement('span');
      strike.className = 'lm-derivation__strike bg-accent-1';
      strike.style.position = 'absolute';
      strike.style.left = `${rect.left - stageRect.left}px`;
      strike.style.top = `${rect.top - stageRect.top + rect.height / 2}px`;
      strike.style.width = `${rect.width * strikeProgress}px`;
      strike.style.height = '2px';
      strike.style.opacity = `${strikeProgress}`;
      overlay.appendChild(strike);
    }
  }

  private hostForIndex(index: number): HTMLElement | undefined {
    return this.frameHosts().find(
      (ref) => Number(ref.nativeElement.dataset['frameIndex']) === index,
    )?.nativeElement;
  }
}

function cleanFrameClone(host: HTMLElement): HTMLElement {
  const clone = host.cloneNode(true) as HTMLElement;
  clone.removeAttribute('data-frame-index');
  clone.removeAttribute('data-latex');
  clone.removeAttribute('data-typeset');
  clone.classList.remove('lm-derivation__frame-host');
  clone.style.margin = '0';
  return clone;
}

function easeInOut(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5
    ? 2 * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
}
