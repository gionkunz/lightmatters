import { Component } from '@angular/core';
import { LmKickerComponent } from '@org/design';

@Component({
  selector: 'lm-landing-manifesto',
  imports: [LmKickerComponent],
  template: `
    <section
      class="grid grid-cols-[180px_1fr] gap-x-14 border-b border-ink-faint px-16 pb-24 pt-[88px]"
    >
      <lm-kicker class="pt-2" [opacity]="0.55">I · why</lm-kicker>
      <div>
        <p
          class="m-0 max-w-[880px] text-pretty font-serif text-[30px] font-medium leading-snug text-ink"
        >
          Most people meet relativity as equations or analogies that never quite click.
          <em>Light Matters</em> is the other way in — a sequence of small drawings you can hold
          in one hand, then tilt, dial, and break open until the geometry tells you what the math
          meant all along.
        </p>
        <div class="mt-14 grid grid-cols-3 gap-x-9 gap-y-3">
          @for (item of pillars; track item.head) {
            <div class="border-t border-ink-faint pt-[18px]">
              <div class="mb-2.5 font-serif text-[22px] italic text-ink">{{ item.head }}</div>
              <div class="text-pretty font-serif text-base leading-normal text-ink opacity-70">
                {{ item.body }}
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LandingManifestoComponent {
  protected readonly pillars = [
    {
      head: 'intuition first',
      body: 'every idea starts as a picture you can grab.',
    },
    {
      head: 'a journey, paced',
      body: 'narrated, beat by beat. Skip ahead any time.',
    },
    {
      head: 'no prior math',
      body: 'equations only after the picture has clicked.',
    },
  ];
}
