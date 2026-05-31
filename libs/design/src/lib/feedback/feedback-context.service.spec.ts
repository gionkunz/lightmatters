import { TestBed } from '@angular/core/testing';
import { FeedbackContextService } from './feedback-context.service';

describe('FeedbackContextService', () => {
  let service: FeedbackContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackContextService);
  });

  it('starts with no step context', () => {
    expect(service.context()).toBeNull();
  });

  it('sets and clears step context', () => {
    service.setStepContext({
      chapter: 3,
      step: 2,
      checkpointIndex: 1,
      eventIndex: 4,
      elapsedMs: 1200,
    });

    expect(service.context()).toEqual({
      chapter: 3,
      step: 2,
      checkpointIndex: 1,
      eventIndex: 4,
      elapsedMs: 1200,
    });

    service.clearStepContext();
    expect(service.context()).toBeNull();
  });
});
