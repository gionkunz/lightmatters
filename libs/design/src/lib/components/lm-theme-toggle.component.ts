import { Component, inject, input } from '@angular/core';
import { LmInteractiveDirective } from '../directives/lm-interactive.directive';
import { ThemeService } from '../theme/theme.service';

/** Light/dark theme toggle with accent dot and interactive glow. */
@Component({
  selector: 'lm-theme-toggle',
  imports: [LmInteractiveDirective],
  template: `
    <button
      type="button"
      lmInteractive
      class="inline-flex cursor-pointer items-center gap-2.5 border border-ink-faint bg-transparent px-3.5 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-ink transition-colors duration-400"
      (click)="toggleTheme()"
    >
      @if (withDot()) {
        <span
          class="size-2 rounded-full bg-accent-1 shadow-[0_0_7px_var(--lm-glow-1)] transition-shadow duration-200 hover:shadow-[0_0_14px_var(--lm-glow-1)]"
        ></span>
      }
      {{ theme() }}
    </button>
  `,
})
export class LmThemeToggleComponent {
  readonly #themeService = inject(ThemeService);

  readonly withDot = input(true);
  readonly theme = this.#themeService.theme;

  toggleTheme(): void {
    this.#themeService.toggle();
  }
}
