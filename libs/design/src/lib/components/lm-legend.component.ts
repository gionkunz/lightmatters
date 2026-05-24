import { Component, input } from '@angular/core';

/** Color bar + uppercase mono label (prototype Legend2). */
@Component({
  selector: 'lm-legend',
  template: `
    <div class="flex items-center gap-2">
      <span
        class="h-0.5 w-4"
        [class.bg-accent-1]="color() === 'accent-1'"
        [class.bg-accent-2]="color() === 'accent-2'"
      ></span>
      <span
        class="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink opacity-85"
        >{{ label() }}</span
      >
    </div>
  `,
})
export class LmLegendComponent {
  readonly color = input.required<'accent-1' | 'accent-2'>();
  readonly label = input.required<string>();
}
