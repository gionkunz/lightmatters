import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  viewChildren,
} from '@angular/core';
import { LmKickerComponent, MathJaxService } from '@lm/design';
import {
  buildNarrateRenderPieces,
  narrateTextTypingUnits,
  parseNarrateText,
} from '../timeline/narrate-text';

const NARR_TEXT =
  'm-0 font-serif text-[30px] leading-[1.4] text-pretty';

const MATH_PILL =
  'inline-block align-[-0.06em] rounded-[5px] bg-ink-very-faint px-[0.38em] pt-[0.06em] pb-[0.1em] shadow-[inset_0_0_0_1px_var(--lm-ink-faint)]';

const MATH_HOST = `${MATH_PILL} animate-char-in [&_mjx-container]:!my-0 [&_mjx-container]:!text-[1em] [&_mjx-math]:!text-[1em]`;

/** Narrator text revealed letter-by-letter with inline LaTeX via MathJax. */
@Component({
  selector: 'lm-narrator',
  imports: [LmKickerComponent],
  template: `
    <div>
      @if (kicker()) {
        <lm-kicker class="mb-[18px] block" [opacity]="0.5">{{
          kicker()
        }}</lm-kicker>
      }
      <div class="relative max-w-[800px] min-h-[90px]">
        <p [class]="NARR_TEXT + ' invisible select-none'" aria-hidden="true">
          @for (piece of ghostPieces(); track $index) {
            @switch (piece.kind) {
              @case ('space') {
                {{ ' ' }}
              }
              @case ('word') {
                <span class="whitespace-nowrap">
                  @for (char of piece.chars; track $index) {
                    <span>{{ char }}</span>
                  }
                </span>
              }
              @case ('math') {
                <span [class]="MATH_PILL">
                  <span class="inline-block min-w-[1.35em]">&nbsp;</span>
                </span>
              }
            }
          }
        </p>
        <p [class]="NARR_TEXT + ' absolute inset-0 text-ink'">
          @for (piece of renderPieces(); track $index) {
            @switch (piece.kind) {
              @case ('space') {
                {{ ' ' }}
              }
              @case ('word') {
                <span class="whitespace-nowrap">
                  @for (char of piece.chars; track $index) {
                    <span class="animate-char-in">{{ char }}</span>
                  }
                </span>
              }
              @case ('math') {
                <span
                  #mathHost
                  [class]="MATH_HOST"
                  [attr.data-latex]="piece.latex"
                ></span>
              }
            }
          }
        </p>
      </div>
    </div>
  `,
})
export class LmNarratorComponent {
  private readonly mathJax = inject(MathJaxService);
  private readonly injector = inject(Injector);
  private readonly mathHosts = viewChildren<ElementRef<HTMLElement>>('mathHost');

  protected readonly NARR_TEXT = NARR_TEXT;
  protected readonly MATH_PILL = MATH_PILL;
  protected readonly MATH_HOST = MATH_HOST;

  readonly kicker = input<string | undefined>();
  readonly text = input.required<string>();
  readonly visibleCount = input.required<number>();

  protected readonly renderPieces = computed(() =>
    buildNarrateRenderPieces(
      parseNarrateText(this.text()),
      this.visibleCount(),
    ),
  );

  protected readonly ghostPieces = computed(() =>
    buildNarrateRenderPieces(
      parseNarrateText(this.text()),
      narrateTextTypingUnits(this.text()),
    ),
  );

  constructor() {
    effect(() => {
      this.renderPieces();
      afterNextRender(
        () => {
          void this.typesetVisibleMath();
        },
        { injector: this.injector },
      );
    });
  }

  private async typesetVisibleMath(): Promise<void> {
    const pending = this.mathHosts().filter((ref) => {
      const element = ref.nativeElement;
      return (
        element.dataset['latex'] &&
        element.dataset['typeset'] !== 'done' &&
        element.dataset['typeset'] !== 'pending'
      );
    });

    for (const ref of pending) {
      const element = ref.nativeElement;
      const latex = element.dataset['latex'];
      if (!latex) {
        continue;
      }

      try {
        await this.mathJax.typesetElement(element, latex);
      } catch {
        element.dataset['typeset'] = 'error';
        element.textContent = `$${latex}$`;
      }
    }
  }
}
