import { DestroyRef, effect, inject } from '@angular/core';
import { FeedbackContextService } from '@lm/design';
import { TimelineRunner } from '../timeline/timeline-runner';

/**
 * Registers timeline playback context with {@link FeedbackContextService}
 * while the step component is mounted. Call from the step constructor.
 */
export function registerFeedbackStepContext(
  runner: TimelineRunner,
  chapter: number,
  step: number,
): void {
  const feedbackContext = inject(FeedbackContextService);
  const destroyRef = inject(DestroyRef);

  const sync = effect(() => {
    const checkpointIndex = runner.activeCheckpointIndex();
    const checkpoints = runner.checkpoints();
    const checkpoint = checkpoints[checkpointIndex];
    const eventIndex = checkpoint?.eventIndex ?? 0;

    feedbackContext.setStepContext({
      chapter,
      step,
      checkpointIndex,
      eventIndex,
      elapsedMs: runner.elapsedMs(),
    });
  });

  destroyRef.onDestroy(() => {
    sync.destroy();
    feedbackContext.clearStepContext();
  });
}
