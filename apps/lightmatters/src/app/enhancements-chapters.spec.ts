import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = join(__dirname, '../../../..');

function readStep(relativePath: string): string {
  return readFileSync(join(repoRoot, relativePath), 'utf8');
}

describe('enhancements chapter narration', () => {
  describe('chapter-constant-c', () => {
    const texts = readStep(
      'libs/features/chapter-05-constant-c/src/lib/steps/step-03-frame-switch.ts',
    );

    it('defines frame of reference in plain language', () => {
      expect(texts).toMatch(/frame of reference/i);
      expect(texts).toMatch(/calls \*\*itself\*\* at rest/i);
    });

    it('names the principle of relativity as justification', () => {
      expect(texts).toMatch(/principle of relativity/i);
    });
  });

  describe('chapter-twin-paradox', () => {
    const texts = readStep(
      'libs/features/chapter-08-twin-paradox/src/lib/steps/step-04-doppler-count.ts',
    );

    it('counts flashes without invoking a Minkowski 45° convention', () => {
      // Epstein-only: the twin chapter no longer switches to a 45° light convention.
      expect(texts).not.toMatch(/45°/);
      expect(texts).toMatch(/count/i);
      expect(texts).toMatch(/proper time/i);
    });
  });

  describe('chapter-03-step-04', () => {
    const texts = readStep(
      'libs/features/chapter-03-light-information/src/lib/steps/step-04-two-flashes-one-witness.ts',
    );

    it('invites learner-driven frame toggle', () => {
      expect(texts).toMatch(/frame toggle/i);
    });
  });

  describe('chapter-08-step-01 light bending opener', () => {
    const texts = readStep(
      'libs/features/chapter-08-light-bending/src/lib/steps/step-01-deep-well.ts',
    );

    it('introduces time and space curvature contributors', () => {
      expect(texts).toMatch(/two/i);
      expect(texts).toMatch(/time/i);
      expect(texts).toMatch(/space/i);
      expect(texts).toMatch(/clocks/i);
    });
  });

  describe('chapter-08-step-07 light bending payoff', () => {
    const texts = readStep(
      'libs/features/chapter-08-light-bending/src/lib/steps/step-07-straight-lines.ts',
    );

    it('frames spatial curvature as completing the opening promise', () => {
      expect(texts).toMatch(/spatial/i);
      expect(texts).toMatch(/opening|promised|set aside on purpose/i);
    });
  });
});
