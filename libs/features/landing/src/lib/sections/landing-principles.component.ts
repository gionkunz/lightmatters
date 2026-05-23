import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { LmKickerComponent } from '@org/design';

@Component({
  selector: 'lm-landing-principles',
  imports: [DecimalPipe, LmKickerComponent],
  template: `
    <section
      class="grid grid-cols-[180px_1fr] gap-x-14 border-b border-ink-faint px-16 pb-24 pt-[88px]"
    >
      <lm-kicker class="pt-2" [opacity]="0.55">III · how</lm-kicker>
      <div class="grid gap-[22px]">
        @for (line of lines; track line.head; let i = $index; let last = $last) {
          <div
            class="grid grid-cols-[64px_320px_1fr] items-baseline gap-x-9 pb-[22px]"
            [class.border-b]="!last"
            [class.border-ink-faint]="!last"
          >
            <lm-kicker [opacity]="0.45">{{ i + 1 | number: '2.0-0' }}</lm-kicker>
            <div class="font-serif text-[32px] italic leading-tight text-ink">{{ line.head }}</div>
            <div
              class="max-w-[540px] text-pretty font-serif text-lg leading-snug text-ink opacity-75"
            >
              {{ line.body }}
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class LandingPrinciplesComponent {
  protected readonly lines = [
    {
      head: 'One screen.',
      body: 'One idea. One beat of narration. One thing to try.',
    },
    {
      head: 'Show, then play.',
      body: 'The animation runs. Then the controls become yours.',
    },
    {
      head: 'Paper before pixels.',
      body: 'Line work, serif type, generous margins. Made to read for an hour.',
    },
    {
      head: 'The reader sets the pace.',
      body: 'Every reveal is skippable. Every animation can be replayed.',
    },
  ];
}
