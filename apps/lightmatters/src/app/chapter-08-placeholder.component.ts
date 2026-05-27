import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LmButtonComponent, LmWordmarkComponent } from '@lm/design';

/** Placeholder until Chapter 8 is authored. */
@Component({
  selector: 'lm-chapter-08-placeholder',
  imports: [LmWordmarkComponent, LmButtonComponent, RouterLink],
  template: `
    <div
      class="flex min-h-screen flex-col items-center justify-center gap-8 bg-paper px-8 text-center font-serif text-ink"
    >
      <lm-wordmark [size]="28" />
      <p class="m-0 max-w-md text-2xl italic leading-snug">
        Chapter 8 — Light bending around mass — is coming next.
      </p>
      <p class="m-0 max-w-lg text-[17px] opacity-75">
        A wide beam, two paths, one synchronised arrival — the geometry of bent
        light.
      </p>
      <a routerLink="/ch/07/step/6">
        <lm-button [emphasis]="true">← back to chapter 7</lm-button>
      </a>
    </div>
  `,
})
export class Chapter08PlaceholderComponent {}
