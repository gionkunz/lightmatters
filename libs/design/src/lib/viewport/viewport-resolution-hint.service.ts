import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';

export const MIN_VIEWPORT_WIDTH = 1920;
export const MIN_VIEWPORT_HEIGHT = 1080;

const RESIZE_DEBOUNCE_MS = 100;

/** True when either viewport dimension is below the recommended minimum. */
export function isViewportUndersized(
  width: number,
  height: number,
): boolean {
  return (
    width < MIN_VIEWPORT_WIDTH || height < MIN_VIEWPORT_HEIGHT
  );
}

/**
 * Tracks undersized viewports and episode-based dismiss state for the
 * resolution hint (no persistence across reloads).
 */
@Injectable({ providedIn: 'root' })
export class ViewportResolutionHintService {
  readonly #document = inject(DOCUMENT);
  readonly #platformId = inject(PLATFORM_ID);

  readonly #undersized = signal(false);
  readonly #dismissedForEpisode = signal(false);

  readonly visible = computed(
    () => this.#undersized() && !this.#dismissedForEpisode(),
  );

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

  dismiss(): void {
    if (this.#undersized()) {
      this.#dismissedForEpisode.set(true);
    }
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

    const undersized = isViewportUndersized(win.innerWidth, win.innerHeight);
    const wasUndersized = this.#undersized();
    this.#undersized.set(undersized);

    if (!undersized) {
      this.#dismissedForEpisode.set(false);
    } else if (!wasUndersized && undersized) {
      this.#dismissedForEpisode.set(false);
    }
  }
}
