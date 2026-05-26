import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LmButtonComponent, LmWordmarkComponent } from '@lm/design';

/** Placeholder until Chapter 6 is authored. */
@Component({
  selector: 'lm-chapter-06-placeholder',
  imports: [LmWordmarkComponent, LmButtonComponent, RouterLink],
  template: `
    <div
      class="flex min-h-screen flex-col items-center justify-center gap-8 bg-paper px-8 text-center font-serif text-ink"
    >
      <lm-wordmark [size]="28" />
      <p class="m-0 max-w-md text-2xl italic leading-snug">
        Chapter 6 — Rolling the diagram: gravity as geometry — is coming next.
      </p>
      <p class="m-0 max-w-lg text-[17px] opacity-75">
        The cone visualization from Epstein will land here — gravity as geodesics
        on warped spacetime.
      </p>
      <a routerLink="/ch/05/step/5">
        <lm-button [emphasis]="true">← back to chapter 5</lm-button>
      </a>
    </div>
  `,
})
export class Chapter06PlaceholderComponent {}
