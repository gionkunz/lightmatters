import { Component } from '@angular/core';
import {
  LmThemeToggleComponent,
  LmWordmarkComponent,
} from '@org/design';

@Component({
  selector: 'lm-landing-nav',
  imports: [LmWordmarkComponent, LmThemeToggleComponent],
  template: `
    <nav
      class="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-8 border-b border-ink-faint px-16 py-[26px]"
    >
      <lm-wordmark [size]="22" />
      <div></div>
      <div class="flex gap-8">
        @for (item of links; track item) {
          <a
            [href]="item.href"
            class="font-serif text-base italic text-ink no-underline opacity-[0.78] transition-opacity hover:opacity-100"
          >
            {{ item.label }}
          </a>
        }
      </div>
      <lm-theme-toggle />
    </nav>
  `,
})
export class LandingNavComponent {
  protected readonly links = [
    { label: 'Chapters', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Notes', href: '#' },
  ];
}
