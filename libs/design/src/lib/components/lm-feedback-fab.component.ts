import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FeedbackCategory,
  FeedbackService,
  FEEDBACK_CATEGORIES,
} from '../feedback/feedback.service';
import { LmInteractiveDirective } from '../directives/lm-interactive.directive';
import { LmButtonComponent } from './lm-button.component';
import { LmKickerComponent } from './lm-kicker.component';

type DialogPhase = 'form' | 'loading' | 'success' | 'error';

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  general: 'General',
  narrative: 'Narrative confusion',
  content: 'Content error',
  experience: 'Experience / bug',
};

/**
 * Global feedback FAB and dialog — fixed bottom-right on every route.
 */
@Component({
  selector: 'lm-feedback-fab',
  imports: [
    FormsModule,
    LmInteractiveDirective,
    LmButtonComponent,
    LmKickerComponent,
  ],
  template: `
    <button
      type="button"
      lmInteractive
      class="fixed bottom-6 right-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-ink-faint bg-paper font-mono text-[length:var(--lm-text-hint)] uppercase tracking-[0.14em] text-ink opacity-[0.55] shadow-sm transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent1"
      aria-label="Send feedback"
      [attr.aria-expanded]="dialogOpen()"
      (click)="toggleDialog()"
    >
      ?
    </button>

    @if (dialogOpen()) {
      <div
        class="fixed inset-0 z-[60] flex items-end justify-center bg-ink/25 p-4 sm:items-center"
        role="presentation"
        (click)="onBackdropClick($event)"
        (keydown.escape)="closeDialog()"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lm-feedback-title"
          class="w-full max-w-md border border-ink-faint bg-paper px-6 py-6 shadow-lg sm:rounded-sm"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          @if (phase() === 'success') {
            <lm-kicker class="mb-2 block">thank you</lm-kicker>
            <p
              id="lm-feedback-title"
              class="font-serif text-[length:var(--lm-text-chrome)] leading-normal text-ink"
            >
              Your note helps us improve the journey. We read every submission.
            </p>
            <div class="mt-6 flex justify-end">
              <lm-button (click)="closeDialog()">Close</lm-button>
            </div>
          } @else {
            <lm-kicker class="mb-2 block">feedback</lm-kicker>
            <h2
              id="lm-feedback-title"
              class="mb-4 font-serif text-[length:var(--lm-text-chrome)] italic text-ink"
            >
              Tell us what confused you, what felt wrong, or what broke.
            </h2>

            @if (phase() === 'error' && errorMessage()) {
              <p
                class="mb-4 font-serif text-[length:var(--lm-text-hint)] text-accent1"
                role="alert"
              >
                {{ errorMessage() }}
              </p>
            }

            <form
              class="flex flex-col gap-4"
              (ngSubmit)="onSubmit()"
              [class.pointer-events-none]="phase() === 'loading'"
              [class.opacity-70]="phase() === 'loading'"
            >
              <label class="flex flex-col gap-1">
                <span
                  class="font-mono text-[length:var(--lm-text-hint)] uppercase tracking-[0.14em] text-ink opacity-70"
                  >message</span
                >
                <textarea
                  #messageField
                  name="message"
                  rows="4"
                  required
                  [(ngModel)]="message"
                  class="resize-y border border-ink-faint bg-paper-alt px-3 py-2 font-serif text-[length:var(--lm-text-chrome)] text-ink outline-none focus:border-ink-soft"
                  placeholder="What happened?"
                ></textarea>
              </label>

              <label class="flex flex-col gap-1">
                <span
                  class="font-mono text-[length:var(--lm-text-hint)] uppercase tracking-[0.14em] text-ink opacity-70"
                  >name (optional)</span
                >
                <input
                  type="text"
                  name="name"
                  [(ngModel)]="name"
                  maxlength="100"
                  class="border border-ink-faint bg-paper-alt px-3 py-2 font-serif text-[length:var(--lm-text-chrome)] text-ink outline-none focus:border-ink-soft"
                  placeholder="Anonymous if left blank"
                />
              </label>

              <label class="flex flex-col gap-1">
                <span
                  class="font-mono text-[length:var(--lm-text-hint)] uppercase tracking-[0.14em] text-ink opacity-70"
                  >category</span
                >
                <select
                  name="category"
                  [(ngModel)]="category"
                  class="cursor-pointer border border-ink-faint bg-paper-alt px-3 py-2 font-serif text-[length:var(--lm-text-chrome)] text-ink outline-none focus:border-ink-soft"
                >
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ categoryLabels[cat] }}</option>
                  }
                </select>
              </label>

              <div class="mt-2 flex justify-end gap-3">
                <lm-button type="button" (click)="closeDialog()"
                  >Cancel</lm-button
                >
                <lm-button [primary]="true" (click)="onSubmit()">
                  @if (phase() === 'loading') {
                    Sending…
                  } @else {
                    Send
                  }
                </lm-button>
              </div>
            </form>
          }
        </div>
      </div>
    }
  `,
})
export class LmFeedbackFabComponent {
  protected readonly categories = FEEDBACK_CATEGORIES;
  protected readonly categoryLabels = CATEGORY_LABELS;

  readonly #feedback = inject(FeedbackService);

  protected readonly dialogOpen = signal(false);
  protected readonly phase = signal<DialogPhase>('form');
  protected readonly errorMessage = signal<string | null>(null);

  protected message = '';
  protected name = '';
  protected category: FeedbackCategory = 'general';

  protected toggleDialog(): void {
    if (this.dialogOpen()) {
      this.closeDialog();
    } else {
      this.dialogOpen.set(true);
      this.phase.set('form');
      this.errorMessage.set(null);
    }
  }

  protected closeDialog(): void {
    const wasSuccess = this.phase() === 'success';
    this.dialogOpen.set(false);
    this.phase.set('form');
    this.errorMessage.set(null);
    if (wasSuccess) {
      this.message = '';
      this.name = '';
      this.category = 'general';
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target !== event.currentTarget) {
      return;
    }
    this.closeDialog();
  }

  protected async onSubmit(): Promise<void> {
    const trimmed = this.message.trim();
    if (!trimmed) {
      this.phase.set('error');
      this.errorMessage.set('Please enter a message.');
      return;
    }

    this.phase.set('loading');
    this.errorMessage.set(null);

    const result = await this.#feedback.submit({
      message: trimmed,
      name: this.name,
      category: this.category,
    });

    if (result.ok) {
      this.phase.set('success');
      this.message = '';
      this.name = '';
      this.category = 'general';
      return;
    }

    this.phase.set('error');
    this.errorMessage.set(result.error);
  }
}
