import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { ThemeService } from '../theme/theme.service';
import { FeedbackContextService } from './feedback-context.service';

export const FEEDBACK_CATEGORIES = [
  'general',
  'narrative',
  'content',
  'experience',
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export interface FeedbackSubmitInput {
  message: string;
  name?: string;
  category?: FeedbackCategory;
}

export type FeedbackSubmitResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export interface FeedbackPayload {
  message: string;
  name?: string;
  category: FeedbackCategory;
  route: string;
  timestamp: string;
  theme: 'light' | 'dark';
  chapter?: number;
  step?: number;
  checkpointIndex?: number;
  eventIndex?: number;
  elapsedMs?: number;
}

/**
 * Submits user feedback to the same-origin Pages Function API.
 */
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  readonly #document = inject(DOCUMENT);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #theme = inject(ThemeService);
  readonly #context = inject(FeedbackContextService);

  buildPayload(input: FeedbackSubmitInput): FeedbackPayload | null {
    const message = input.message.trim();
    if (!message) {
      return null;
    }

    const name = input.name?.trim();
    const category = input.category ?? 'general';
    const route = this.#currentRoute();
    const timestamp = new Date().toISOString();
    const theme = this.#theme.theme();
    const stepCtx = this.#context.context();

    const payload: FeedbackPayload = {
      message,
      category,
      route,
      timestamp,
      theme,
    };

    if (name) {
      payload.name = name;
    }

    if (stepCtx) {
      payload.chapter = stepCtx.chapter;
      payload.step = stepCtx.step;
      payload.checkpointIndex = stepCtx.checkpointIndex;
      payload.eventIndex = stepCtx.eventIndex;
      payload.elapsedMs = stepCtx.elapsedMs;
    }

    return payload;
  }

  async submit(input: FeedbackSubmitInput): Promise<FeedbackSubmitResult> {
    const payload = this.buildPayload(input);
    if (!payload) {
      return { ok: false, error: 'Message is required.' };
    }

    if (!isPlatformBrowser(this.#platformId)) {
      return { ok: false, error: 'Feedback is only available in the browser.' };
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        return {
          ok: false,
          error: data.error ?? 'Something went wrong. Please try again.',
        };
      }

      return { ok: true, id: data.id ?? '' };
    } catch {
      return {
        ok: false,
        error: 'Could not reach the server. Check your connection and try again.',
      };
    }
  }

  #currentRoute(): string {
    if (!isPlatformBrowser(this.#platformId)) {
      return '/';
    }
    const path = this.#document.location?.pathname ?? '/';
    const search = this.#document.location?.search ?? '';
    return `${path}${search}` || '/';
  }
}
