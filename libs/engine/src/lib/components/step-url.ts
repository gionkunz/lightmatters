const STEP_URL_PATTERN = /^\/chapter\/(\d+)\/step\/(\d+)$/;

export interface ParsedStepUrl {
  chapter: number;
  step: number;
}

/** Canonical href for a chapter step page (unpadded integers). */
export function chapterStepHref(chapter: number, step: number): string {
  return `/chapter/${chapter}/step/${step}`;
}

export function parseStepUrl(url: string): ParsedStepUrl | null {
  const match = STEP_URL_PATTERN.exec(url);
  if (!match) {
    return null;
  }
  return {
    chapter: Number.parseInt(match[1], 10),
    step: Number.parseInt(match[2], 10),
  };
}
