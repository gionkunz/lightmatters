/** Parsed segment from narrate text with `$...$` math and inline emphasis. */
export type NarrateSegment =
  | { kind: 'text'; content: string }
  | { kind: 'bold'; content: string }
  | { kind: 'italic'; content: string }
  | { kind: 'math'; latex: string };

/** Typing duration for a math block, expressed as equivalent text characters. */
export const MATH_TYPING_UNIT_CHARS = 5;

export type NarrateRenderPiece =
  | { kind: 'word'; chars: string[] }
  | { kind: 'bold'; chars: string[] }
  | { kind: 'italic'; chars: string[] }
  | { kind: 'space' }
  | { kind: 'math'; latex: string };

type TextSegmentKind = 'text' | 'bold' | 'italic';

/** Split narrate text on `$...$` and inline emphasis into render segments. */
export function parseNarrateText(text: string): NarrateSegment[] {
  if (!text.includes('$')) {
    return parseEmphasisInText(text);
  }

  const segments: NarrateSegment[] = [];
  const parts = text.split('$');

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === '') {
      continue;
    }

    if (i % 2 === 0) {
      segments.push(...parseEmphasisInText(part));
    } else {
      segments.push({ kind: 'math', latex: part });
    }
  }

  return segments;
}

function parseEmphasisInText(text: string): NarrateSegment[] {
  if (!text.includes('*')) {
    return text.length > 0 ? [{ kind: 'text', content: text }] : [];
  }

  const segments: NarrateSegment[] = [];
  let plain = '';
  let i = 0;

  const flushPlain = () => {
    if (plain.length > 0) {
      segments.push({ kind: 'text', content: plain });
      plain = '';
    }
  };

  while (i < text.length) {
    if (text.startsWith('**', i)) {
      const close = text.indexOf('**', i + 2);
      if (close !== -1) {
        flushPlain();
        segments.push({ kind: 'bold', content: text.slice(i + 2, close) });
        i = close + 2;
        continue;
      }
    }

    if (text[i] === '*' && !text.startsWith('**', i)) {
      let close = -1;
      for (let j = i + 1; j < text.length; j++) {
        if (text[j] === '*' && !text.startsWith('**', j)) {
          close = j;
          break;
        }
        if (text.startsWith('**', j)) {
          break;
        }
      }

      if (close !== -1) {
        flushPlain();
        segments.push({ kind: 'italic', content: text.slice(i + 1, close) });
        i = close + 1;
        continue;
      }
    }

    plain += text[i];
    i++;
  }

  flushPlain();
  return segments;
}

/** Total typewriter units for a parsed narrate string. */
export function narrateTypingUnits(segments: NarrateSegment[]): number {
  return segments.reduce(
    (total, segment) =>
      total +
      (segment.kind === 'math'
        ? MATH_TYPING_UNIT_CHARS
        : segment.content.length),
    0,
  );
}

/** Total typewriter units for raw narrate text (convenience). */
export function narrateTextTypingUnits(text: string): number {
  return narrateTypingUnits(parseNarrateText(text));
}

/** Map visible unit count to render pieces for the narrator template. */
export function buildNarrateRenderPieces(
  segments: NarrateSegment[],
  visibleUnits: number,
): NarrateRenderPiece[] {
  const pieces: NarrateRenderPiece[] = [];
  let remaining = visibleUnits;

  for (const segment of segments) {
    if (remaining <= 0) {
      break;
    }

    if (segment.kind === 'math') {
      pieces.push({ kind: 'math', latex: segment.latex });
      remaining -= MATH_TYPING_UNIT_CHARS;
      continue;
    }

    const take = Math.min(remaining, segment.content.length);
    appendTextPieces(pieces, segment.content.slice(0, take), segment.kind);
    remaining -= take;
  }

  return pieces;
}

function appendTextPieces(
  pieces: NarrateRenderPiece[],
  visible: string,
  style: TextSegmentKind = 'text',
): void {
  let word: string[] = [];

  const pushWord = () => {
    if (word.length === 0) {
      return;
    }
    if (style === 'bold') {
      pieces.push({ kind: 'bold', chars: word });
    } else if (style === 'italic') {
      pieces.push({ kind: 'italic', chars: word });
    } else {
      pieces.push({ kind: 'word', chars: word });
    }
    word = [];
  };

  for (const char of visible) {
    if (char === ' ') {
      pushWord();
      pieces.push({ kind: 'space' });
    } else {
      word.push(char);
    }
  }

  pushWord();
}
