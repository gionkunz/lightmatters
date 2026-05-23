import { Component } from '@angular/core';
import { LmWordmarkComponent } from '@org/design';

@Component({
  selector: 'lm-landing-footer',
  imports: [LmWordmarkComponent],
  template: `
    <footer class="grid grid-cols-3 items-baseline gap-x-8 px-16 py-9">
      <lm-wordmark [size]="18" />
      <div
        class="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink opacity-50"
      >
        a paper companion to Epstein's
        <em class="font-serif text-[13px] normal-case not-italic tracking-normal">
          Relativity Visualized
        </em>
      </div>
      <div
        class="text-right font-mono text-[10px] uppercase tracking-[0.22em] text-ink opacity-50"
      >
        © {{ year }} · lightmatters.app
      </div>
    </footer>
  `,
})
export class LandingFooterComponent {
  protected readonly year = new Date().getFullYear();
}
