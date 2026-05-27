import { parseStepUrl } from './step-url';

describe('parseStepUrl', () => {
  it('parses chapter step routes', () => {
    expect(parseStepUrl('/ch/01/step/4')).toEqual({ chapter: 1, step: 4 });
  });

  it('returns null for non-step routes', () => {
    expect(parseStepUrl('/')).toBeNull();
  });
});
