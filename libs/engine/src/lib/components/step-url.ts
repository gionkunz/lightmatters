const STEP_URL_PATTERN = /^\/ch\/(\d+)\/step\/(\d+)$/;

export interface ParsedStepUrl {
  chapter: number;
  step: number;
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
