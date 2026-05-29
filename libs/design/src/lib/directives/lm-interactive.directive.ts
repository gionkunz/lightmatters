import { Directive, HostListener, inject } from '@angular/core';
import { AudioService } from '../audio/audio.service';

/** Applies the interactive accent glow on hover to controls. */
@Directive({
  selector: '[lmInteractive]',
  host: {
    class: 'lm-interactive',
  },
})
export class LmInteractiveDirective {
  readonly #audio = inject(AudioService);

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    if (event.isTrusted) {
      void this.#audio.unlockFromUserGesture();
    }
  }
}
