import { Component, input } from '@angular/core';

/** Mono key + value readout row (prototype FactLine). */
@Component({
  selector: 'lm-fact-line',
  template: `
    <div class="flex items-baseline justify-between gap-4">
      <span
        class="font-mono text-[length:var(--lm-text-mono-sm)] uppercase tracking-[0.14em]"
        [class.text-accent-1]="accent() === 'accent-1'"
        [class.text-accent-2]="accent() === 'accent-2'"
        [class.text-ink]="!accent()"
        [class.opacity-95]="!!accent()"
        [class.opacity-60]="!accent()"
        >{{ label() }}</span
      >
      <span class="font-mono text-[length:calc(12px*var(--lm-type-scale))] text-ink opacity-85">{{ value() }}</span>
    </div>
  `,
})
export class LmFactLineComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly accent = input<'accent-1' | 'accent-2' | undefined>();
}
