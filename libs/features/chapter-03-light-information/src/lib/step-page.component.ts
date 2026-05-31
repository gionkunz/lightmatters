import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { LmButtonComponent } from '@lm/design';
import { Step01Component } from './steps/step-01.component';
import { Step02Component } from './steps/step-02.component';
import { Step03Component } from './steps/step-03.component';
import { Step04Component } from './steps/step-04.component';
import { Step05Component } from './steps/step-05.component';

@Component({
  selector: 'lm-ch3-step-page',
  imports: [
    Step01Component,
    Step02Component,
    Step03Component,
    Step04Component,
    Step05Component,
    LmButtonComponent,
    RouterLink,
  ],
  template: `
    @switch (stepNumber()) {
      @case (1) {
        <lm-ch3-step-01 />
      }
      @case (2) {
        <lm-ch3-step-02 />
      }
      @case (3) {
        <lm-ch3-step-03 />
      }
      @case (4) {
        <lm-ch3-step-04 />
      }
      @case (5) {
        <lm-ch3-step-05 />
      }
      @default {
        <div
          class="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-8 text-center font-serif text-ink"
        >
          <p class="m-0 text-2xl italic">We couldn't find that step.</p>
          <div class="flex gap-4">
            <a routerLink="/chapter/4/step/1">
              <lm-button [primary]="true">go to step 1</lm-button>
            </a>
            <lm-button (click)="goHome()">← home</lm-button>
          </div>
        </div>
      }
    }
  `,
})
export class StepPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly stepNumber = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number.parseInt(params.get('step') ?? '', 10)),
    ),
    { initialValue: 0 },
  );

  protected goHome(): void {
    void this.router.navigateByUrl('/');
  }
}
