import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LmButtonComponent, LmKickerComponent } from '@lm/design';
import { LmDiagramPlaceholderComponent } from '../placeholders/diagram-placeholder.component';

@Component({
  selector: 'lm-landing-hero',
  imports: [
    RouterLink,
    LmKickerComponent,
    LmButtonComponent,
    LmDiagramPlaceholderComponent,
  ],
  template: `
    <section
      class="grid grid-cols-2 items-center gap-x-14 border-b border-ink-faint px-16 pb-24 pt-[88px]"
    >
      <div>
        <lm-kicker class="mb-6 block" [opacity]="1"
          >an interactive journey</lm-kicker
        >
        <h2
          class="m-0 text-balance font-serif text-[84px] font-medium leading-[0.98] tracking-[-0.018em] text-ink"
        >
          Relativity, the way it<br />
          <em class="italic">should have</em> clicked<br />
          the first time<span class="text-accent-1">.</span>
        </h2>
        <p
          class="mt-7 max-w-[520px] text-pretty font-serif text-xl leading-normal text-ink opacity-[0.78]"
        >
          A guided journey of small interactive experiments — paper, vectors,
          light cones, gravity wells — that build intuition for spacetime before
          you ever see an equation.
        </p>
        <div class="mt-9 flex items-center gap-[18px]">
          <a routerLink="/ch/01/step/1">
            <lm-button [primary]="true">begin chapter 1 →</lm-button>
          </a>
          <lm-button>preview the journey</lm-button>
        </div>
        <div
          class="mt-7 flex items-center gap-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink opacity-45"
        >
          <span>~ 90 min · 8 chapters · no prior physics</span>
        </div>
      </div>

      <div class="relative">
        <div
          class="relative bg-paper-alt px-7 pb-[18px] pt-8 transition-colors duration-400"
        >
          <div class="mb-3.5 flex items-baseline justify-between">
            <lm-kicker [opacity]="0.55">chapter 2 · the speed budget</lm-kicker>
            <lm-kicker [opacity]="0.4">step 03</lm-kicker>
          </div>
          <div
            class="mb-[18px] min-h-16 text-pretty font-serif text-[21px] leading-snug text-ink"
          >
            You are always moving through spacetime at the speed of light. You
            only choose how to spend it.
          </div>
          <div class="flex justify-center">
            <lm-diagram-placeholder
              variant="single"
              [width]="500"
              [height]="380"
            />
          </div>
          <div class="mt-2 border-t border-ink-faint pt-3.5">
            <div class="flex flex-col gap-2">
              <div class="flex items-baseline justify-between">
                <span
                  class="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink opacity-75"
                >
                  v / c
                </span>
                <span class="font-mono text-[11.5px] text-ink opacity-65"
                  >0.62</span
                >
              </div>
              <div class="relative h-5">
                <div
                  class="absolute inset-x-0 top-[9px] h-px bg-ink opacity-[0.22]"
                ></div>
                <div
                  class="absolute left-0 top-[9px] h-px bg-accent-1 opacity-90"
                  style="width: 62%"
                ></div>
                <div
                  class="absolute top-px size-[18px] -translate-x-1/2 rounded-full border-[1.5px] border-accent-1 bg-paper shadow-[0_0_8px_var(--lm-accent-1)]"
                  style="left: 62%"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute -left-3.5 -top-3.5 flex size-7 items-center justify-center border border-ink-faint bg-paper font-mono text-[10px] tracking-wider text-ink opacity-55"
        >
          fig
        </div>
      </div>
    </section>
  `,
})
export class LandingHeroComponent {}
