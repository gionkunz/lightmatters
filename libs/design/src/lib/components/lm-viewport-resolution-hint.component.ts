import { Component, inject } from '@angular/core';
import { LmButtonComponent } from './lm-button.component';
import { LmKickerComponent } from './lm-kicker.component';
import { ViewportResolutionHintService } from '../viewport/viewport-resolution-hint.service';

/** Advisory banner when the viewport is smaller than 1920×1080. */
@Component({
  selector: 'lm-viewport-resolution-hint',
  imports: [LmKickerComponent, LmButtonComponent],
  template: `
    @if (hint.visible()) {
      <div
        role="status"
        aria-live="polite"
        class="pointer-events-auto fixed bottom-6 left-1/2 z-50 w-[min(100%-2rem,40rem)] -translate-x-1/2 rounded border border-ink-faint bg-surface px-6 py-4 shadow-[0_8px_32px_rgb(0_0_0/0.12)]"
      >
        <lm-kicker class="mb-2 block">Display</lm-kicker>
        <p
          class="mb-4 font-serif text-[length:var(--lm-text-body-sm)] leading-normal text-ink"
        >
          For the best experience, use a window at least 1920×1080.
        </p>
        <lm-button (click)="dismiss()">Got it</lm-button>
      </div>
    }
  `,
})
export class LmViewportResolutionHintComponent {
  protected readonly hint = inject(ViewportResolutionHintService);

  dismiss(): void {
    this.hint.dismiss();
  }
}
