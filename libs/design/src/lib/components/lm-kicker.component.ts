import { Component, input } from '@angular/core';

/** Uppercase IBM Plex Mono section label (kicker). */
@Component({
  selector: 'lm-kicker',
  imports: [],
  template: `
    <div
      class="font-mono text-[length:var(--lm-text-kicker)] font-medium uppercase tracking-[0.22em] text-ink"
      [style.opacity]="opacity()"
    >
      <ng-content />
    </div>
  `,
})
export class LmKickerComponent {
  readonly opacity = input(0.6);
}
