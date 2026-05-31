import { validateFeedbackBody } from './validation';

describe('validateFeedbackBody', () => {
  it('accepts a valid minimal body', () => {
    const result = validateFeedbackBody({
      message: 'Helpful note',
      route: '/chapter/1/step/1',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.row.message).toBe('Helpful note');
      expect(result.row.category).toBe('general');
      expect(result.row.chapter).toBeNull();
    }
  });

  it('rejects missing message', () => {
    const result = validateFeedbackBody({ route: '/' });
    expect(result).toEqual({
      ok: false,
      status: 400,
      error: 'message required',
    });
  });

  it('rejects unknown category', () => {
    const result = validateFeedbackBody({
      message: 'x',
      route: '/',
      category: 'spam',
    });
    expect(result).toEqual({
      ok: false,
      status: 400,
      error: 'invalid category',
    });
  });

  it('rejects name over 100 characters', () => {
    const result = validateFeedbackBody({
      message: 'x',
      route: '/',
      name: 'a'.repeat(101),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(400);
    }
  });
});
