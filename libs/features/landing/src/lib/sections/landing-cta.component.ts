import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LmButtonComponent, LmKickerComponent } from '@lm/design';

@Component({
  selector: 'lm-landing-cta',
  imports: [RouterLink, LmKickerComponent, LmButtonComponent],
  template: `
    <section
      class="grid place-items-center border-b border-ink-faint px-16 py-[120px] text-center"
    >
      <lm-kicker class="mb-[18px] block" [opacity]="0.5">begin</lm-kicker>
      <h2
        class="m-0 max-w-[880px] text-balance font-serif text-[76px] font-medium leading-[1.02] tracking-[-0.015em] text-ink"
      >
        Light is not metaphor. <em class="italic">It is the geometry.</em>
      </h2>
      <p
        class="mt-6 max-w-[620px] text-pretty font-serif text-xl leading-snug text-ink opacity-75"
      >
        Spend ninety minutes inside the diagram and the universe stops being a
        lecture.
      </p>
      <div class="mt-10 flex items-center gap-4">
        <a routerLink="/ch/01/step/1">
          <lm-button [primary]="true">begin chapter 1 →</lm-button>
        </a>
        <lm-button>read the founder's note</lm-button>
      </div>
    </section>
  `,
})
export class LandingCtaComponent {}
