import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';

export const MIN_VIEWPORT_WIDTH = 1920;
export const MIN_VIEWPORT_HEIGHT = 1080;

const RESIZE_DEBOUNCE_MS = 100;

/** True when either viewport dimension is below the desktop minimum. */
export function isViewportUndersized(
  width: number,
  height: number,
): boolean {
  return (
    width < MIN_VIEWPORT_WIDTH || height < MIN_VIEWPORT_HEIGHT
  );
}

/**
 * Tracks undersized viewports for the blocking resolution modal.
 */
@Injectable({ providedIn: 'root' })
export class ViewportResolutionHintService {
  readonly #document = inject(DOCUMENT);
  readonly #platformId = inject(PLATFORM_ID);

  readonly visible = signal(false);

  #resizeTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    if (!isPlatformBrowser(this.#platformId)) {
      return;
    }

    const win = this.#document.defaultView;
    if (!win) {
      return;
    }

    this.#sync();
    win.addEventListener('resize', this.#onResize);
  }

  #onResize = (): void => {
    if (this.#resizeTimer !== undefined) {
      clearTimeout(this.#resizeTimer);
    }
    this.#resizeTimer = setTimeout(() => {
      this.#resizeTimer = undefined;
      this.#sync();
    }, RESIZE_DEBOUNCE_MS);
  };

  #sync(): void {
    const win = this.#document.defaultView;
    if (!win) {
      return;
    }

    this.visible.set(
      isViewportUndersized(win.innerWidth, win.innerHeight),
    );
  }
}
