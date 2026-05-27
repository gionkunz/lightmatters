import { NgTemplateOutlet } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LmKickerComponent } from '@lm/design';
import { CHAPTERS, chapterFirstStepHref } from '../data/chapters.data';
import { LmDiagramPlaceholderComponent } from '../placeholders/diagram-placeholder.component';

@Component({
  selector: 'lm-landing-chapters',
  imports: [
    DecimalPipe,
    NgTemplateOutlet,
    RouterLink,
    LmKickerComponent,
    LmDiagramPlaceholderComponent,
  ],
  template: `
    <section
      id="chapters"
      class="border-b border-ink-faint px-16 pb-24 pt-[88px]"
    >
      <div class="mb-11 flex items-baseline gap-[18px]">
        <lm-kicker [opacity]="0.55">II · the journey</lm-kicker>
        <h3
          class="m-0 font-serif text-[30px] font-semibold italic text-ink"
        >
          eight chapters, paced for an evening.
        </h3>
        <span class="mb-2 h-px flex-1 bg-ink-faint"></span>
      </div>
      <div class="grid grid-cols-4 gap-x-6 gap-y-8">
        @for (chapter of chapters; track chapter.n) {
          @if (chapterHref(chapter.n); as route) {
            <a
              [routerLink]="route"
              class="lm-chapter-card block cursor-pointer bg-paper-alt p-[22px] no-underline text-inherit"
            >
              <ng-container
                [ngTemplateOutlet]="card"
                [ngTemplateOutletContext]="{ chapter: chapter }"
              />
            </a>
          } @else {
            <article
              class="lm-chapter-card cursor-pointer bg-paper-alt p-[22px]"
              tabindex="0"
            >
              <ng-container
                [ngTemplateOutlet]="card"
                [ngTemplateOutletContext]="{ chapter: chapter }"
              />
            </article>
          }
        }
      </div>
    </section>

    <ng-template #card let-chapter="chapter">
      <div class="mb-3.5 flex items-baseline justify-between">
        <lm-kicker [opacity]="0.55"
          >ch. {{ chapter.n | number: '2.0-0' }}</lm-kicker
        >
        <span class="font-mono text-[11px] text-ink opacity-35">→</span>
      </div>
      <div class="mb-3.5 flex h-[100px] items-center justify-center">
        <lm-diagram-placeholder
          [variant]="chapter.mini"
          [width]="180"
          [height]="100"
        />
      </div>
      <div
        class="mb-2 font-serif text-[length:var(--lm-text-chrome)] font-semibold leading-tight text-ink"
      >
        {{ chapter.title }}
      </div>
      <div
        class="text-pretty font-serif text-sm leading-normal text-ink opacity-65"
      >
        {{ chapter.blurb }}
      </div>
    </ng-template>
  `,
})
export class LandingChaptersComponent {
  protected readonly chapters = CHAPTERS;

  protected chapterHref(chapterNumber: number): string | null {
    return chapterFirstStepHref(chapterNumber);
  }
}
