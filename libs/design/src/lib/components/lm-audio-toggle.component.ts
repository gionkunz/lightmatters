import { Component, inject } from '@angular/core';
import { LmInteractiveDirective } from '../directives/lm-interactive.directive';
import { AudioService } from '../audio/audio.service';

/** Audio mute/unmute toggle with interactive glow. */
@Component({
  selector: 'lm-audio-toggle',
  imports: [LmInteractiveDirective],
  template: `
    <button
      type="button"
      lmInteractive
      class="inline-flex cursor-pointer items-center justify-center border border-ink-faint bg-transparent p-2 text-ink transition-colors duration-400"
      [attr.aria-label]="muted() ? 'Unmute audio' : 'Mute audio'"
      [attr.aria-pressed]="muted()"
      (click)="toggleAudio()"
    >
      @if (muted()) {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <line x1="22" x2="16" y1="9" y2="15" />
          <line x1="16" x2="22" y1="9" y2="15" />
        </svg>
      } @else {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      }
    </button>
  `,
})
export class LmAudioToggleComponent {
  readonly #audio = inject(AudioService);
  readonly muted = this.#audio.muted;

  toggleAudio(): void {
    this.#audio.toggle();
  }
}
