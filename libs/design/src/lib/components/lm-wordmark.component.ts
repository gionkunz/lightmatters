import { Component, input } from '@angular/core';

/** Light Matters wordmark with optional accent-colored period. */
@Component({
  selector: 'lm-wordmark',
  imports: [],
  template: `
    <h1
      class="m-0 font-serif tracking-tight text-ink transition-colors duration-400"
      [class.font-bold]="bold()"
      [class.font-medium]="!bold()"
      [style.fontSize.px]="size()"
      [style.lineHeight]="lineHeight()"
    >
      Light Matters
      @if (withDot()) {
        <span class="text-accent-1">.</span>
      }
    </h1>
  `,
})
export class LmWordmarkComponent {
  readonly size = input(64);
  readonly withDot = input(true);
  readonly bold = input(false);
  readonly lineHeight = input(0.95);
}
