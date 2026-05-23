import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';

/** Active color theme name. */
export type ThemeName = 'light' | 'dark';

const STORAGE_KEY = 'lm-theme';

/**
 * Manages light/dark theme state, persists preference to localStorage,
 * and applies `data-theme` on the document root.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly #document = inject(DOCUMENT);
  readonly #platformId = inject(PLATFORM_ID);

  readonly theme = signal<ThemeName>('light');

  constructor() {
    if (!isPlatformBrowser(this.#platformId)) {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const initial: ThemeName = stored === 'dark' ? 'dark' : 'light';
    this.#applyTheme(initial);
  }

  toggle(): void {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  setTheme(name: ThemeName): void {
    this.#applyTheme(name);

    if (isPlatformBrowser(this.#platformId)) {
      localStorage.setItem(STORAGE_KEY, name);
    }
  }

  #applyTheme(name: ThemeName): void {
    this.theme.set(name);
    this.#document.documentElement.setAttribute('data-theme', name);
  }
}
