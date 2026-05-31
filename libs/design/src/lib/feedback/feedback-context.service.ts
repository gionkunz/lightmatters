import { Injectable, signal } from '@angular/core';

/** Playback context captured from an active step timeline. */
export interface FeedbackStepContext {
  chapter: number;
  step: number;
  checkpointIndex: number;
  eventIndex: number;
  elapsedMs: number;
}

/**
 * Holds optional step playback context for feedback submissions.
 * Step components register while mounted; cleared on destroy.
 */
@Injectable({ providedIn: 'root' })
export class FeedbackContextService {
  readonly #context = signal<FeedbackStepContext | null>(null);

  readonly context = this.#context.asReadonly();

  setStepContext(ctx: FeedbackStepContext): void {
    this.#context.set(ctx);
  }

  clearStepContext(): void {
    this.#context.set(null);
  }
}
