import { Component, input, output } from '@angular/core';
import { LmInteractiveDirective } from '../directives/lm-interactive.directive';
import { LmKickerComponent } from './lm-kicker.component';

export interface PredictionOption {
  id: string;
  label: string;
}

/** Selectable prediction prompt for pedagogical commitment beats. */
@Component({
  selector: 'lm-prediction-choice',
  imports: [LmInteractiveDirective, LmKickerComponent],
  template: `
    <div class="flex flex-col gap-3">
      @if (kicker()) {
        <lm-kicker [opacity]="0.55">{{ kicker() }}</lm-kicker>
      }
      <p class="m-0 font-serif text-[17px] leading-snug text-ink">{{ question() }}</p>
      <div class="mt-1 flex flex-col gap-2.5">
        @for (option of options(); track option.id) {
          <button
            type="button"
            lmInteractive
            class="cursor-pointer border px-4 py-3 text-left font-serif text-[16px] italic transition-colors duration-200"
            [class.border-ink-faint]="selectedId() !== option.id"
            [class.border-accent-1]="selectedId() === option.id"
            [class.shadow-[0_0_0_4px_var(--lm-glow-1)]]="selectedId() === option.id"
            [class.text-ink]="true"
            (click)="select(option.id)"
          >
            {{ option.label }}
          </button>
        }
      </div>
    </div>
  `,
})
export class LmPredictionChoiceComponent {
  readonly kicker = input<string>();
  readonly question = input.required<string>();
  readonly options = input.required<PredictionOption[]>();
  readonly selectedId = input<string | null>(null);

  readonly selectedIdChange = output<string>();

  protected select(id: string): void {
    this.selectedIdChange.emit(id);
  }
}
