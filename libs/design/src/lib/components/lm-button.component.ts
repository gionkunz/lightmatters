import { Component, input } from '@angular/core';
import { LmInteractiveDirective } from '../directives/lm-interactive.directive';

/** Serif button with primary (filled) and outline variants. */
@Component({
  selector: 'lm-button',
  imports: [LmInteractiveDirective],
  template: `
    <button
      type="button"
      lmInteractive
      class="cursor-pointer font-serif transition-colors duration-400"
      [class.px-[22px]]="!emphasis()"
      [class.py-[10px]]="!emphasis()"
      [class.text-[length:var(--lm-text-button-sm)]]="!emphasis()"
      [class.italic]="!emphasis()"
      [class.px-7]="emphasis()"
      [class.py-3]="emphasis()"
      [class.text-[length:var(--lm-text-button)]]="emphasis()"
      [class.font-normal]="emphasis()"
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
  readonly emphasis = input(false);
}
