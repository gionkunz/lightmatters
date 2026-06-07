import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  viewChild,
  viewChildren,
} from '@angular/core';
import { LmKickerComponent, MathJaxService } from '@lm/design';
import {
  buildNarrateRenderPieces,
  narrateTextTypingUnits,
  parseNarrateText,
  type NarrateRenderPiece,
} from '../timeline/narrate-text';

const PAST_TEXT =
  'm-0 font-serif text-[length:var(--lm-text-chat-past)] leading-[1.5] text-pretty text-ink opacity-45';

const CURRENT_TEXT =
  'm-0 border-l-2 border-ink-mid pl-[18px] font-serif text-[length:var(--lm-text-chat-current)] leading-[1.45] text-pretty text-ink';

const MATH_PILL =
  'inline-block align-[-0.06em] rounded-[5px] bg-ink-very-faint px-[0.38em] pt-[0.06em] pb-[0.1em] shadow-[inset_0_0_0_1px_var(--lm-ink-faint)]';

const MATH_HOST = `${MATH_PILL} [&_mjx-container]:!my-0 [&_mjx-container]:!text-[1em] [&_mjx-math]:!text-[1em]`;

/** Chat-feed narrator: faded past beats + bordered current beat with typewriter. */
@Component({
  selector: 'lm-narrator-chat-feed',
  imports: [LmKickerComponent],
  host: {
    class:
      'flex h-full max-h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden max-w-[120ch]',
  },
  template: `
    @if (kicker()) {
      <lm-kicker class="mb-[22px] block shrink-0" [opacity]="0.5">{{
        kicker()
      }}</lm-kicker>
    }

    <div
      #beatScroll
      class="lm-scrollbar flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto overscroll-contain"
    >
      @for (beat of pastBeats(); track $index) {
        <p [class]="PAST_TEXT">
          @for (
            piece of pastPieces(beat);
            track pieceTrackKey(pieceIndex, piece);
            let pieceIndex = $index
          ) {
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
              @case ('bold') {
                <strong class="font-semibold whitespace-nowrap">
                  @for (char of piece.chars; track $index) {
                    <span>{{ char }}</span>
                  }
                </strong>
              }
              @case ('italic') {
                <em class="italic whitespace-nowrap">
                  @for (char of piece.chars; track $index) {
                    <span>{{ char }}</span>
                  }
                </em>
              }
              @case ('math') {
                <span
                  #pastMathHost
                  [class]="MATH_HOST"
                  [attr.data-latex]="piece.latex"
                ></span>
              }
            }
          }
        </p>
      }

      @if (currentText()) {
        <p #currentBeat [class]="CURRENT_TEXT">
          @for (
            piece of currentPieces();
            track pieceTrackKey(pieceIndex, piece);
            let pieceIndex = $index
          ) {
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
              @case ('bold') {
                <strong class="font-semibold whitespace-nowrap">
                  @for (char of piece.chars; track $index) {
                    <span class="animate-char-in">{{ char }}</span>
                  }
                </strong>
              }
              @case ('italic') {
                <em class="italic whitespace-nowrap">
                  @for (char of piece.chars; track $index) {
                    <span class="animate-char-in">{{ char }}</span>
                  }
                </em>
              }
              @case ('math') {
                <span
                  #currentMathHost
                  [class]="MATH_HOST + ' animate-char-in'"
                  [attr.data-latex]="piece.latex"
                ></span>
              }
            }
          }
        </p>
      }
    </div>
  `,
})
export class LmNarratorChatFeedComponent {
  private readonly mathJax = inject(MathJaxService);
  private readonly injector = inject(Injector);
  private readonly pastMathHosts =
    viewChildren<ElementRef<HTMLElement>>('pastMathHost');
  private readonly currentMathHosts =
    viewChildren<ElementRef<HTMLElement>>('currentMathHost');
  private readonly currentBeat =
    viewChild<ElementRef<HTMLElement>>('currentBeat');

  protected readonly PAST_TEXT = PAST_TEXT;
  protected readonly CURRENT_TEXT = CURRENT_TEXT;
  protected readonly MATH_HOST = MATH_HOST;

  readonly kicker = input<string | undefined>();
  readonly pastBeats = input<string[]>([]);
  readonly currentText = input('');
  readonly visibleCount = input(0);

  protected readonly currentPieces = computed(() =>
    buildNarrateRenderPieces(
      parseNarrateText(this.currentText()),
      this.visibleCount(),
    ),
  );

  protected pastPieces(beat: string) {
    return buildNarrateRenderPieces(
      parseNarrateText(beat),
      narrateTextTypingUnits(beat),
    );
  }

  protected pieceTrackKey(
    pieceIndex: number,
    piece: NarrateRenderPiece,
  ): string {
    if (piece.kind === 'math') {
      return `m${pieceIndex}:${piece.latex}`;
    }
    return `${piece.kind}:${pieceIndex}`;
  }

  constructor() {
    effect(() => {
      this.pastBeats();
      afterNextRender(
        () => {
          void this.typesetPastMathWithRetry();
        },
        { injector: this.injector },
      );
    });

    effect(() => {
      this.currentText();
      this.currentPieces();
      afterNextRender(
        () => {
          void this.typesetMathHosts(this.currentMathHosts());
          this.currentBeat()?.nativeElement.scrollIntoView({
            block: 'nearest',
          });
        },
        { injector: this.injector },
      );
    });
  }

  private async typesetPastMathWithRetry(): Promise<void> {
    await this.typesetMathHosts(this.pastMathHosts());
    requestAnimationFrame(() => {
      void this.typesetMathHosts(this.pastMathHosts());
    });
  }

  private async typesetMathHosts(
    hosts: readonly ElementRef<HTMLElement>[],
  ): Promise<void> {
    const targets = hosts
      .map((ref) => this.toTypesetTarget(ref.nativeElement))
      .filter((target): target is { element: HTMLElement; latex: string } =>
        target !== null,
      );

    if (targets.length === 0) {
      return;
    }

    try {
      await this.mathJax.typesetElements(targets);
    } catch {
      for (const { element, latex } of targets) {
        if (element.querySelector('mjx-container')) {
          continue;
        }
        element.dataset['typeset'] = 'error';
        element.textContent = `$${latex}$`;
      }
    }
  }

  private toTypesetTarget(
    element: HTMLElement,
  ): { element: HTMLElement; latex: string } | null {
    const latex = element.getAttribute('data-latex');
    if (!latex || element.querySelector('mjx-container')) {
      return null;
    }

    if (element.dataset['typeset'] === 'pending') {
      return null;
    }

    if (element.dataset['typeset'] === 'done') {
      delete element.dataset['typeset'];
    }

    return { element, latex };
  }
}
