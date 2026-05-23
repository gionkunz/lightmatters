import { Component, input } from '@angular/core';
import { LmInteractiveDirective } from '../directives/lm-interactive.directive';

/** Serif italic button with primary (filled) and outline variants. */
@Component({
  selector: 'lm-button',
  imports: [LmInteractiveDirective],
  template: `
    <button
      type="button"
      lmInteractive
      class="cursor-pointer px-[22px] py-[10px] font-serif text-[17px] italic transition-colors duration-400"
      [class.border]="!primary()"
      [class.border-ink-faint]="!primary()"
      [class.bg-ink]="primary()"
      [class.text-paper]="primary()"
      [class.text-ink]="!primary()"
      [class.border-none]="primary()"
    >
      <ng-content />
    </button>
  `,
})
export class LmButtonComponent {
  readonly primary = input(false);
}
