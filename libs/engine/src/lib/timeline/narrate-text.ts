/** Parsed segment from narrate text with `$...$` inline LaTeX delimiters. */
export type NarrateSegment =
  | { kind: 'text'; content: string }
  | { kind: 'math'; latex: string };

/** Typing duration for a math block, expressed as equivalent text characters. */
export const MATH_TYPING_UNIT_CHARS = 5;

export type NarrateRenderPiece =
  | { kind: 'word'; chars: string[] }
  | { kind: 'space' }
  | { kind: 'math'; latex: string };

/** Split narrate text on `$...$` into plain text and inline LaTeX segments. */
export function parseNarrateText(text: string): NarrateSegment[] {
  if (!text.includes('$')) {
    return text.length > 0 ? [{ kind: 'text', content: text }] : [];
  }

  const segments: NarrateSegment[] = [];
  const parts = text.split('$');

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === '') {
      continue;
    }

    if (i % 2 === 0) {
      segments.push({ kind: 'text', content: part });
    } else {
      segments.push({ kind: 'math', latex: part });
    }
  }

  return segments;
}

/** Total typewriter units for a parsed narrate string. */
export function narrateTypingUnits(segments: NarrateSegment[]): number {
  return segments.reduce(
    (total, segment) =>
      total +
      (segment.kind === 'text'
        ? segment.content.length
        : MATH_TYPING_UNIT_CHARS),
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
    appendTextPieces(pieces, segment.content.slice(0, take));
    remaining -= take;
  }

  return pieces;
}

function appendTextPieces(pieces: NarrateRenderPiece[], visible: string): void {
  let word: string[] = [];

  for (const char of visible) {
    if (char === ' ') {
      if (word.length > 0) {
        pieces.push({ kind: 'word', chars: word });
        word = [];
      }
      pieces.push({ kind: 'space' });
    } else {
      word.push(char);
    }
  }

  if (word.length > 0) {
    pieces.push({ kind: 'word', chars: word });
  }
}
