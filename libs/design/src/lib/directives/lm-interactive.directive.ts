import { Directive } from '@angular/core';

/** Applies the interactive accent glow on hover to controls. */
@Directive({
  selector: '[lmInteractive]',
  host: {
    class: 'lm-interactive',
  },
})
export class LmInteractiveDirective {}
