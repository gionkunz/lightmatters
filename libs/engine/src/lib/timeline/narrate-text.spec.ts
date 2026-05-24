import {
  buildNarrateRenderPieces,
  narrateTextTypingUnits,
  narrateTypingUnits,
  parseNarrateText,
} from './narrate-text';

describe('parseNarrateText', () => {
  it('returns a single text segment when no delimiters are present', () => {
    expect(parseNarrateText('Hello world')).toEqual([
      { kind: 'text', content: 'Hello world' },
    ]);
  });

  it('splits inline LaTeX on dollar delimiters', () => {
    expect(parseNarrateText('The factor is $\\gamma$ — done.')).toEqual([
      { kind: 'text', content: 'The factor is ' },
      { kind: 'math', latex: '\\gamma' },
      { kind: 'text', content: ' — done.' },
    ]);
  });
});

describe('narrateTypingUnits', () => {
  it('counts math blocks as multiple character units', () => {
    const segments = parseNarrateText('$\\gamma$');
    expect(narrateTypingUnits(segments)).toBe(5);
    expect(narrateTextTypingUnits('ab$\\gamma$cd')).toBe(2 + 5 + 2);
  });
});

describe('buildNarrateRenderPieces', () => {
  it('reveals math atomically once its unit is reached', () => {
    const segments = parseNarrateText('Hi $\\gamma$!');
    expect(buildNarrateRenderPieces(segments, 2)).toEqual([
      { kind: 'word', chars: ['H', 'i'] },
    ]);
    expect(buildNarrateRenderPieces(segments, 4)).toEqual([
      { kind: 'word', chars: ['H', 'i'] },
      { kind: 'space' },
      { kind: 'math', latex: '\\gamma' },
    ]);
  });
});
