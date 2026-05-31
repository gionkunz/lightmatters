import { validateFeedbackBody } from './validation';

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequestPost: PagesFunction<{ FEEDBACK_DB: D1Database }> = async (
  context,
) => {
  const contentType = context.request.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) {
    return jsonResponse({ ok: false, error: 'expected application/json' }, 400);
  }

  const db = context.env.FEEDBACK_DB;
  if (!db) {
    console.error('FEEDBACK_DB binding missing');
    return jsonResponse({ ok: false, error: 'service unavailable' }, 503);
  }

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'invalid json' }, 400);
  }

  const validated = validateFeedbackBody(
    (body ?? {}) as Parameters<typeof validateFeedbackBody>[0],
  );
  if (!validated.ok) {
    return jsonResponse({ ok: false, error: validated.error }, validated.status);
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const userAgent = context.request.headers.get('User-Agent');
  const { row } = validated;

  try {
    await db
      .prepare(
        `INSERT INTO feedback (
          id, created_at, message, name, category, route,
          chapter, step, checkpoint_index, event_index, elapsed_ms, theme, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        createdAt,
        row.message,
        row.name,
        row.category,
        row.route,
        row.chapter,
        row.step,
        row.checkpointIndex,
        row.eventIndex,
        row.elapsedMs,
        row.theme,
        userAgent,
      )
      .run();
  } catch (err) {
    console.error('D1 insert failed', err);
    return jsonResponse({ ok: false, error: 'service unavailable' }, 503);
  }

  return jsonResponse({ ok: true, id }, 201);
};

export const onRequest: PagesFunction = async ({ request }) => {
  if (request.method === 'POST') {
    return jsonResponse({ ok: false, error: 'method not allowed' }, 405);
  }
  return jsonResponse({ ok: false, error: 'method not allowed' }, 405);
};
