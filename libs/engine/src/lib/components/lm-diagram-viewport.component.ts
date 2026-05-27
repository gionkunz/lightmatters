import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { computeDiagramFit } from '../diagram/compute-diagram-fit';

/** Measures available space and exposes fitted width/height for child diagrams. */
@Component({
  selector: 'lm-diagram-viewport',
  host: {
    class:
      'flex h-full min-h-0 min-w-0 w-full flex-1 items-center justify-center',
  },
  template: `
    <div #measure class="h-full w-full min-h-0 min-w-0">
      <ng-content />
    </div>
  `,
})
export class LmDiagramViewportComponent {
  private readonly destroyRef = inject(DestroyRef);

  /** Width / height of the diagram's design-time aspect ratio. */
  readonly aspectRatio = input(560 / 380);

  readonly containerSize = signal({ width: 560, height: 380 });

  readonly size = computed(() => {
    const { width, height } = this.containerSize();
    return computeDiagramFit(width, height, this.aspectRatio());
  });

  private readonly measure = viewChild.required<ElementRef<HTMLElement>>('measure');
  private resizeObserver: ResizeObserver | undefined;

  constructor() {
    afterNextRender(() => {
      const element = this.measure().nativeElement;
      this.resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const { width, height } = entry.contentRect;
        this.containerSize.set({ width, height });
      });
      this.resizeObserver.observe(element);
      this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());
    });
  }
}
