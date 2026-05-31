import { TestBed } from '@angular/core/testing';
import { FeedbackContextService } from './feedback-context.service';
import { FeedbackService } from './feedback.service';
import { ThemeService } from '../theme/theme.service';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;

    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackService);
  });

  it('rejects empty message in buildPayload', () => {
    expect(service.buildPayload({ message: '   ' })).toBeNull();
  });

  it('builds payload with step context and theme', () => {
    const ctx = TestBed.inject(FeedbackContextService);
    const theme = TestBed.inject(ThemeService);
    theme.setTheme('dark');

    ctx.setStepContext({
      chapter: 1,
      step: 2,
      checkpointIndex: 0,
      eventIndex: 3,
      elapsedMs: 500,
    });

    const payload = service.buildPayload({
      message: 'Confusing beat',
      category: 'narrative',
    });

    expect(payload).toMatchObject({
      message: 'Confusing beat',
      category: 'narrative',
      route: expect.any(String),
      theme: 'dark',
      chapter: 1,
      step: 2,
      checkpointIndex: 0,
      eventIndex: 3,
      elapsedMs: 500,
    });
    expect(payload?.timestamp).toBeDefined();
  });

  it('submit returns error when message is empty', async () => {
    const result = await service.submit({ message: '' });
    expect(result).toEqual({ ok: false, error: 'Message is required.' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submit returns success on HTTP 201', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, id: 'abc' }),
    });

    const result = await service.submit({ message: 'Great step' });
    expect(result).toEqual({ ok: true, id: 'abc' });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/feedback',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });
});
