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

  it('parses bold emphasis', () => {
    expect(parseNarrateText('This is **important** news.')).toEqual([
      { kind: 'text', content: 'This is ' },
      { kind: 'bold', content: 'important' },
      { kind: 'text', content: ' news.' },
    ]);
  });

  it('parses italic emphasis', () => {
    expect(parseNarrateText('An *ether* medium.')).toEqual([
      { kind: 'text', content: 'An ' },
      { kind: 'italic', content: 'ether' },
      { kind: 'text', content: ' medium.' },
    ]);
  });

  it('parses the Maxwell wave-speed formula beat', () => {
    expect(
      parseNarrateText(
        'Put them together and the wave speed falls out: $c = 1 / \\sqrt{\\varepsilon_0 \\mu_0}$. No clocks over a kilometre — pure electromagnetism.',
      ),
    ).toEqual([
      { kind: 'text', content: 'Put them together and the wave speed falls out: ' },
      { kind: 'math', latex: 'c = 1 / \\sqrt{\\varepsilon_0 \\mu_0}' },
      { kind: 'text', content: '. No clocks over a kilometre — pure electromagnetism.' },
    ]);
  });

  it('parses multiple inline math segments in one beat', () => {
    expect(
      parseNarrateText(
        'Constants $\\varepsilon_0$ (epsilon nought) and $\\mu_0$ (mu nought).',
      ),
    ).toEqual([
      { kind: 'text', content: 'Constants ' },
      { kind: 'math', latex: '\\varepsilon_0' },
      { kind: 'text', content: ' (epsilon nought) and ' },
      { kind: 'math', latex: '\\mu_0' },
      { kind: 'text', content: ' (mu nought).' },
    ]);
  });

  it('parses bold adjacent to inline math', () => {
    expect(parseNarrateText('The factor $\\gamma$ is **large**.')).toEqual([
      { kind: 'text', content: 'The factor ' },
      { kind: 'math', latex: '\\gamma' },
      { kind: 'text', content: ' is ' },
      { kind: 'bold', content: 'large' },
      { kind: 'text', content: '.' },
    ]);
  });

  it('does not parse asterisks inside math as Markdown', () => {
    expect(parseNarrateText('$x^* y^*$')).toEqual([
      { kind: 'math', latex: 'x^* y^*' },
    ]);
  });

  it('leaves unclosed emphasis markers as literal text', () => {
    expect(parseNarrateText('broken **bold')).toEqual([
      { kind: 'text', content: 'broken **bold' },
    ]);
  });
});

describe('narrateTypingUnits', () => {
  it('counts math blocks as multiple character units', () => {
    const segments = parseNarrateText('$\\gamma$');
    expect(narrateTypingUnits(segments)).toBe(5);
    expect(narrateTextTypingUnits('ab$\\gamma$cd')).toBe(2 + 5 + 2);
  });

  it('does not count emphasis delimiter characters', () => {
    expect(narrateTextTypingUnits('**bold**')).toBe(4);
    expect(narrateTextTypingUnits('*italic*')).toBe(6);
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

  it('reveals bold text with bold pieces', () => {
    const segments = parseNarrateText('**hi**');
    expect(buildNarrateRenderPieces(segments, 2)).toEqual([
      { kind: 'bold', chars: ['h', 'i'] },
    ]);
  });

  it('reveals italic text with italic pieces', () => {
    const segments = parseNarrateText('*ab*');
    expect(buildNarrateRenderPieces(segments, 1)).toEqual([
      { kind: 'italic', chars: ['a'] },
    ]);
  });
});
