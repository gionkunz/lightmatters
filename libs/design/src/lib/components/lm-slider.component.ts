import {
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { LmInteractiveDirective } from '../directives/lm-interactive.directive';

/** Normalized slider (0–1) with label and value display. */
@Component({
  selector: 'lm-slider',
  imports: [LmInteractiveDirective],
  template: `
    <div class="flex min-w-0 flex-col gap-2">
      <div class="flex items-baseline justify-between">
        <span
          class="font-mono text-[length:var(--lm-text-mono-sm)] font-medium uppercase tracking-[0.18em] text-ink opacity-75"
          >{{ label() }}</span
        >
        <span class="font-mono text-[length:var(--lm-text-mono-md)] text-ink opacity-65">{{
          displayValue()
        }}</span>
      </div>
      <div
        #track
        class="relative cursor-pointer"
        [style.height]="'var(--lm-slider-track-h)'"
        (mousedown)="onPointerDown($event)"
      >
        <div
          class="absolute inset-x-0 h-px bg-ink opacity-[0.22]"
          [style.top]="'var(--lm-slider-line-top)'"
        ></div>
        <div
          class="absolute left-0 h-px opacity-90"
          [class.bg-accent-1]="accent() === 'accent-1'"
          [class.bg-accent-2]="accent() === 'accent-2'"
          [style.top]="'var(--lm-slider-line-top)'"
          [style.width.%]="value() * 100"
        ></div>
        <div
          lmInteractive
          class="absolute top-px -translate-x-1/2 rounded-full border-[1.5px] bg-paper"
          [class.border-accent-1]="accent() === 'accent-1'"
          [class.border-accent-2]="accent() === 'accent-2'"
          [style.width]="'var(--lm-slider-thumb)'"
          [style.height]="'var(--lm-slider-thumb)'"
          [style.left.%]="value() * 100"
        ></div>
      </div>
    </div>
  `,
})
export class LmSliderComponent {
  readonly label = input('position');
  readonly value = input(0.5);
  readonly valueFormat = input<'decimal' | 'percent'>('decimal');
  readonly disabled = input(false);
  readonly accent = input<'accent-1' | 'accent-2'>('accent-1');

  readonly valueChange = output<number>();

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  protected displayValue(): string {
    const v = this.value();
    if (this.valueFormat() === 'percent') {
      return `${Math.round(v * 100)}%`;
    }
    return v.toFixed(2);
  }

  protected onPointerDown(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    this.updateFromEvent(event);

    const onMove = (ev: MouseEvent) => this.updateFromEvent(ev);
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  private updateFromEvent(event: MouseEvent): void {
    const el = this.track().nativeElement;
    const rect = el.getBoundingClientRect();
    const next = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width),
    );
    this.valueChange.emit(next);
  }
}
