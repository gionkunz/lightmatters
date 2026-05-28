import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { LmButtonComponent } from '@lm/design';
import { Step01Component } from './steps/step-01.component';
import { Step02Component } from './steps/step-02.component';
import { Step03Component } from './steps/step-03.component';
import { Step04Component } from './steps/step-04.component';
import { Step05Component } from './steps/step-05.component';
import { Step06Component } from './steps/step-06.component';
import { Step07Component } from './steps/step-07.component';

@Component({
  selector: 'lm-ch8-step-page',
  imports: [
    Step01Component,
    Step02Component,
    Step03Component,
    Step04Component,
    Step05Component,
    Step06Component,
    Step07Component,
    LmButtonComponent,
    RouterLink,
  ],
  template: `
    @switch (stepNumber()) {
      @case (1) {
        <lm-ch8-step-01 />
      }
      @case (2) {
        <lm-ch8-step-02 />
      }
      @case (3) {
        <lm-ch8-step-03 />
      }
      @case (4) {
        <lm-ch8-step-04 />
      }
      @case (5) {
        <lm-ch8-step-05 />
      }
      @case (6) {
        <lm-ch8-step-06 />
      }
      @case (7) {
        <lm-ch8-step-07 />
      }
      @default {
        <div
          class="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-8 text-center font-serif text-ink"
        >
          <p class="m-0 text-2xl italic">We couldn't find that step.</p>
          <a routerLink="/chapter/12/step/1">
            <lm-button [primary]="true">go to step 1</lm-button>
          </a>
        </div>
      }
    }
  `,
})
export class StepPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly stepNumber = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number.parseInt(params.get('step') ?? '', 10)),
    ),
    { initialValue: 0 },
  );
}
