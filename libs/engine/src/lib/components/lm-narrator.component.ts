import { Component, input } from '@angular/core';
import { LmKickerComponent } from '@lm/design';

type NarratorSegment =
  | { kind: 'word'; chars: string[] }
  | { kind: 'space' };

/** Narrator text revealed letter-by-letter with a soft fade-in. */
@Component({
  selector: 'lm-narrator',
  imports: [LmKickerComponent],
  styles: `
    @keyframes lm-char-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .lm-narr-word {
      white-space: nowrap;
    }

    .lm-narr-char {
      animation: lm-char-in 0.45s ease-out both;
    }
  `,
  template: `
    <div>
      @if (kicker()) {
        <lm-kicker class="mb-[18px] block" [opacity]="0.5">{{
          kicker()
        }}</lm-kicker>
      }
      <p
        class="m-0 min-h-[90px] max-w-[800px] text-pretty font-serif text-[30px] leading-[1.4] text-ink"
      >
        @for (segment of segments(); track $index) {
          @if (segment.kind === 'space') {
            {{ ' ' }}
          } @else {
            <span class="lm-narr-word">
              @for (char of segment.chars; track $index) {
                <span class="lm-narr-char">{{ char }}</span>
              }
            </span>
          }
        }
      </p>
    </div>
  `,
})
export class LmNarratorComponent {
  readonly kicker = input<string | undefined>();
  readonly text = input.required<string>();
  readonly visibleCount = input.required<number>();

  protected segments(): NarratorSegment[] {
    const visible = this.text().slice(0, this.visibleCount());
    const segments: NarratorSegment[] = [];
    let word: string[] = [];

    for (const char of visible) {
      if (char === ' ') {
        if (word.length > 0) {
          segments.push({ kind: 'word', chars: word });
          word = [];
        }
        segments.push({ kind: 'space' });
      } else {
        word.push(char);
      }
    }

    if (word.length > 0) {
      segments.push({ kind: 'word', chars: word });
    }

    return segments;
  }
}
