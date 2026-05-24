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
          class="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink opacity-75"
          >{{ label() }}</span
        >
        <span class="font-mono text-[11.5px] text-ink opacity-65">{{
          displayValue()
        }}</span>
      </div>
      <div
        #track
        class="relative h-5 cursor-pointer"
        (mousedown)="onPointerDown($event)"
      >
        <div
          class="absolute inset-x-0 top-[9px] h-px bg-ink opacity-[0.22]"
        ></div>
        <div
          class="absolute left-0 top-[9px] h-px bg-accent-1 opacity-90"
          [style.width.%]="value() * 100"
        ></div>
        <div
          lmInteractive
          class="absolute top-px size-[18px] -translate-x-1/2 rounded-full border-[1.5px] border-accent-1 bg-paper"
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
