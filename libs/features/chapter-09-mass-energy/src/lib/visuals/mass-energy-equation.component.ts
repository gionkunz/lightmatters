import { Component, input } from '@angular/core';

/** The bare equation, rendered large in EB Garamond. `emphasize` highlights a term. */
@Component({
  selector: 'lm-mass-energy-equation',
  template: `
    <div
      class="flex select-none items-baseline justify-center font-serif italic leading-none text-ink"
      [style.fontSize]="'clamp(3rem, 12cqi, 7rem)'"
    >
      <span>E</span>
      <span class="mx-[0.18em] not-italic opacity-50">=</span>
      <span [class.text-accent-1]="emphasize() === 'mass'">m</span>
      <span [class.text-accent-2]="emphasize() === 'c'">
        c<span class="align-super text-[0.5em]">2</span>
      </span>
    </div>
  `,
})
export class MassEnergyEquationComponent {
  /** Optionally tint the mass (`m`) or the conversion factor (`c²`). */
  readonly emphasize = input<'none' | 'mass' | 'c'>('none');
}
