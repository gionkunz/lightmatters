import { Component, input } from '@angular/core';

/** Light Matters wordmark with optional accent-colored period. */
@Component({
  selector: 'lm-wordmark',
  imports: [],
  template: `
    <h1
      class="m-0 font-serif font-medium tracking-tight text-ink transition-colors duration-400"
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
  readonly lineHeight = input(0.95);
}
