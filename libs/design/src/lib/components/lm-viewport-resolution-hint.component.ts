import { Component, inject } from '@angular/core';
import { LmKickerComponent } from './lm-kicker.component';
import { LmWordmarkComponent } from './lm-wordmark.component';
import { ViewportResolutionHintService } from '../viewport/viewport-resolution-hint.service';

/** Full-screen branded gate when the viewport is smaller than 1920×1080. */
@Component({
  selector: 'lm-viewport-resolution-hint',
  imports: [LmKickerComponent, LmWordmarkComponent],
  template: `
    @if (hint.visible()) {
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Light Matters — desktop experience required"
        class="fixed inset-0 z-[100] flex min-h-dvh flex-col items-center justify-center bg-paper px-6 py-10"
      >
        <div
          class="flex w-full max-w-[22rem] flex-col items-center text-center sm:max-w-md"
        >
          <lm-wordmark [size]="40" class="mb-3 block" />
          <p
            class="font-serif text-[length:var(--lm-text-button-sm)] italic leading-snug text-ink opacity-[0.78]"
          >
            the geometry of relativity, by hand.
          </p>

          <div
            class="my-8 h-px w-10 bg-ink opacity-20"
            aria-hidden="true"
          ></div>

          <lm-kicker class="mb-3 block" [opacity]="1"
            >an interactive journey</lm-kicker
          >
          <p
            class="text-pretty font-serif text-[length:var(--lm-text-chrome)] leading-normal text-ink opacity-[0.82]"
          >
            A guided tour through spacetime — paper, vectors, light cones, and
            gravity wells — that builds intuition before you ever see an
            equation.
          </p>

          <div
            class="mt-8 w-full border border-ink-faint bg-paper-alt px-6 py-5 text-left"
          >
            <lm-kicker class="mb-2 block" [opacity]="0.7"
              >only for desktop</lm-kicker
            >
            <p
              class="font-serif text-[length:var(--lm-text-chrome)] leading-normal text-ink"
            >
              This experience needs a lot of space — room to explore, in every
              sense. Diagrams, controls, and narration all share one canvas.
            </p>
            <p
              class="mt-3 font-serif text-[length:var(--lm-text-hint)] leading-normal text-ink-soft"
            >
              Open Light Matters on a desktop or laptop at full HD (1920×1080)
              or larger.
            </p>
          </div>

          <p
            class="mt-6 font-mono text-[length:var(--lm-text-hint)] uppercase tracking-[0.18em] text-ink opacity-45"
          >
            lightmatters.app
          </p>
        </div>
      </div>
    }
  `,
})
export class LmViewportResolutionHintComponent {
  protected readonly hint = inject(ViewportResolutionHintService);
}
