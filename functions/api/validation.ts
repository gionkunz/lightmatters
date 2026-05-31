export const FEEDBACK_CATEGORIES = [
  'general',
  'narrative',
  'content',
  'experience',
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export interface FeedbackRequestBody {
  message?: unknown;
  name?: unknown;
  category?: unknown;
  route?: unknown;
  chapter?: unknown;
  step?: unknown;
  checkpointIndex?: unknown;
  eventIndex?: unknown;
  elapsedMs?: unknown;
  theme?: unknown;
  timestamp?: unknown;
}

export interface ValidatedFeedbackRow {
  message: string;
  name: string | null;
  category: FeedbackCategory;
  route: string;
  chapter: number | null;
  step: number | null;
  checkpointIndex: number | null;
  eventIndex: number | null;
  elapsedMs: number | null;
  theme: string | null;
}

export type ValidationResult =
  | { ok: true; row: ValidatedFeedbackRow }
  | { ok: false; status: number; error: string };

function trimString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseOptionalInt(
  value: unknown,
  min: number,
  max: number,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    return Number.NaN;
  }
  return n;
}

export function validateFeedbackBody(
  body: FeedbackRequestBody,
): ValidationResult {
  const message = trimString(body.message);
  if (!message) {
    return { ok: false, status: 400, error: 'message required' };
  }
  if (message.length > 2000) {
    return { ok: false, status: 400, error: 'message too long' };
  }

  const nameRaw = trimString(body.name);
  if (nameRaw.length > 100) {
    return { ok: false, status: 400, error: 'name too long' };
  }
  const name = nameRaw.length > 0 ? nameRaw : null;

  const categoryRaw = trimString(body.category) || 'general';
  if (!FEEDBACK_CATEGORIES.includes(categoryRaw as FeedbackCategory)) {
    return { ok: false, status: 400, error: 'invalid category' };
  }
  const category = categoryRaw as FeedbackCategory;

  const route = trimString(body.route);
  if (!route) {
    return { ok: false, status: 400, error: 'route required' };
  }
  if (route.length > 500) {
    return { ok: false, status: 400, error: 'route too long' };
  }

  const chapter = parseOptionalInt(body.chapter, 1, 99);
  if (Number.isNaN(chapter)) {
    return { ok: false, status: 400, error: 'invalid chapter' };
  }
  const step = parseOptionalInt(body.step, 1, 99);
  if (Number.isNaN(step)) {
    return { ok: false, status: 400, error: 'invalid step' };
  }
  const checkpointIndex = parseOptionalInt(body.checkpointIndex, 0, 999);
  if (Number.isNaN(checkpointIndex)) {
    return { ok: false, status: 400, error: 'invalid checkpoint index' };
  }
  const eventIndex = parseOptionalInt(body.eventIndex, 0, 9999);
  if (Number.isNaN(eventIndex)) {
    return { ok: false, status: 400, error: 'invalid event index' };
  }
  const elapsedMs = parseOptionalInt(body.elapsedMs, 0, 86_400_000);
  if (Number.isNaN(elapsedMs)) {
    return { ok: false, status: 400, error: 'invalid elapsed ms' };
  }

  const themeRaw = trimString(body.theme);
  const theme =
    themeRaw === 'light' || themeRaw === 'dark'
      ? themeRaw
      : themeRaw.length > 0
        ? null
        : null;

  return {
    ok: true,
    row: {
      message,
      name,
      category,
      route,
      chapter,
      step,
      checkpointIndex,
      eventIndex,
      elapsedMs,
      theme,
    },
  };
}
