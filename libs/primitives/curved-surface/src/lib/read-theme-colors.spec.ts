import { cssColorToRgb } from './read-theme-colors';

describe('readThemeColors', () => {
  it('parses hex colors without a document', () => {
    expect(cssColorToRgb('#ff0000', '#000000')).toEqual([1, 0, 0]);
    expect(cssColorToRgb('#14141a', '#000000')[0]).toBeCloseTo(0.078, 2);
  });
});
