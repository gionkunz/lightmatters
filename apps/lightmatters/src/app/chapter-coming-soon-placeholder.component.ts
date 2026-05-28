import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LmButtonComponent, LmWordmarkComponent } from '@lm/design';

/** Placeholder until a reserved chapter slot is authored. */
@Component({
  selector: 'app-chapter-coming-soon-placeholder',
  imports: [LmWordmarkComponent, LmButtonComponent, RouterLink],
  template: `
    <div
      class="flex min-h-screen flex-col items-center justify-center gap-8 bg-paper px-8 text-center font-serif text-ink"
    >
      <lm-wordmark [size]="28" />
      <p class="m-0 max-w-md text-2xl italic leading-snug">
        Chapter {{ chapter() }} — {{ title() }}
      </p>
      <p class="m-0 max-w-lg text-[17px] opacity-75">
        {{ blurb() }}
      </p>
      <a [routerLink]="backHref()">
        <lm-button [emphasis]="true">{{ backLabel() }}</lm-button>
      </a>
    </div>
  `,
})
export class ChapterComingSoonPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly chapter = () =>
    this.route.snapshot.data['chapter'] as number;
  protected readonly title = () =>
    this.route.snapshot.data['title'] as string;
  protected readonly blurb = () =>
    (this.route.snapshot.data['blurb'] as string | undefined) ??
    'This chapter is coming soon.';
  protected readonly backHref = () =>
    this.route.snapshot.data['backHref'] as string;
  protected readonly backLabel = () =>
    (this.route.snapshot.data['backLabel'] as string | undefined) ??
    '← back';
}
