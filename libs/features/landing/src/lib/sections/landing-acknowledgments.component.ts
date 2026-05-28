import { Component } from '@angular/core';
import { LmKickerComponent } from '@lm/design';

@Component({
  selector: 'lm-landing-acknowledgments',
  imports: [LmKickerComponent],
  template: `
    <section
      id="about"
      class="grid grid-cols-[180px_1fr] gap-x-14 border-b border-ink-faint px-16 pb-24 pt-[88px]"
    >
      <lm-kicker class="pt-2" [opacity]="0.55">IV · gratitude</lm-kicker>
      <div>
        <p
          class="m-0 max-w-[880px] text-pretty font-serif text-[30px] font-medium leading-snug text-ink"
        >
          Light Matters exists because other people made relativity
          <em>visible</em> long before this site did — scientists who found
          the geometry, and communicators who handed it to the rest of us.
        </p>

        <div class="mt-14 border-t border-ink-faint pt-[18px]">
          <div class="mb-2.5 font-serif text-[28px] italic text-ink">
            Lewis Carroll Epstein
          </div>
          <div
            class="max-w-[720px] text-pretty font-serif text-lg leading-normal text-ink opacity-75"
          >
            The deepest debt is to Epstein and his book
            <em>Relativity Visualized</em>. Folded paper, cones on the rim,
            vectors on a spacetime diagram — he showed that relativity could be
            held in the hand and tilted until it clicked. Light Matters is a
            love letter to that way of seeing. If anything here makes sense,
            the credit is mostly his.
          </div>
        </div>

        <div class="mt-14 grid grid-cols-3 gap-x-9 gap-y-8">
          @for (person of lineage; track person.name) {
            <div class="border-t border-ink-faint pt-[18px]">
              <div class="mb-2.5 font-serif text-[22px] italic text-ink">
                {{ person.name }}
              </div>
              <div
                class="text-pretty font-serif text-base leading-normal text-ink opacity-70"
              >
                {{ person.role }}
              </div>
            </div>
          }
        </div>

        <p
          class="mt-14 max-w-[720px] text-pretty font-serif text-base leading-normal text-ink opacity-65"
        >
          And to every teacher, writer, and explainer who ever drew a diagram
          on a napkin — thank you for making the universe legible.
        </p>
      </div>
    </section>
  `,
})
export class LandingAcknowledgmentsComponent {
  protected readonly lineage = [
    {
      name: 'Galileo Galilei',
      role: 'The principle that motion is relative — the seed of everything that follows.',
    },
    {
      name: 'James Clerk Maxwell',
      role: 'Light as an electromagnetic wave with one fixed speed in empty space.',
    },
    {
      name: 'Michelson & Morley',
      role: 'The experiment that measured nothing — and left physics no way out.',
    },
    {
      name: 'Hendrik Lorentz',
      role: 'The transformations that held the numbers together before anyone knew why.',
    },
    {
      name: 'Albert Einstein',
      role: 'Spacetime geometry as physics — special relativity, then general.',
    },
    {
      name: 'Hermann Minkowski',
      role: '“Henceforth space by itself, and time by itself, are doomed to fade away.”',
    },
  ];
}
