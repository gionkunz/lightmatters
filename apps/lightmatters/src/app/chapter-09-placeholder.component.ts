import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LmButtonComponent, LmWordmarkComponent } from '@lm/design';

/** Placeholder until the next chapter is authored. */
@Component({
  selector: 'app-chapter-09-placeholder',
  imports: [LmWordmarkComponent, LmButtonComponent, RouterLink],
  template: `
    <div
      class="flex min-h-screen flex-col items-center justify-center gap-8 bg-paper px-8 text-center font-serif text-ink"
    >
      <lm-wordmark [size]="28" />
      <p class="m-0 max-w-md text-2xl italic leading-snug">
        More chapters are coming.
      </p>
      <p class="m-0 max-w-lg text-[17px] opacity-75">
        Black holes, horizons, and beyond — the journey continues.
      </p>
      <a routerLink="/ch/08/step/7">
        <lm-button [emphasis]="true">← back to chapter 8</lm-button>
      </a>
    </div>
  `,
})
export class Chapter09PlaceholderComponent {}
