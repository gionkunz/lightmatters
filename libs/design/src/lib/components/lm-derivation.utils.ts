import { interpolate } from '../animation/easing';
import type { CancelVisualState, TokenRect } from './lm-derivation.types';

const CANCEL_PHASE = 0.25;

/** Strike-and-fade phases for cancelled tokens during a frame transition. */
export function cancelVisualState(t: number): CancelVisualState {
  const clamped = Math.max(0, Math.min(1, t));
  const phase = (start: number) =>
    Math.min(1, Math.max(0, (clamped - start) / CANCEL_PHASE));

  return {
    tint: Math.min(1, clamped / CANCEL_PHASE),
    strike: phase(CANCEL_PHASE),
    fade: phase(CANCEL_PHASE * 2),
    collapse: phase(CANCEL_PHASE * 3),
  };
}

export function queryTokenNodes(
  root: HTMLElement,
  tokenIds?: readonly string[],
): Map<string, HTMLElement> {
  const nodes = new Map<string, HTMLElement>();
  const ids = tokenIds ?? collectCssIdNodes(root).map((el) => el.id);
  for (const id of ids) {
    const candidates = Array.from(
      root.querySelectorAll<HTMLElement>(`[id="${cssEscape(id)}"]`),
    );
    // MathJax repeats the same id on the hidden assistive-MathML copy; always
    // pick the visible glyph node, never the accessibility mirror.
    const node = candidates.find((el) => !isAssistiveNode(el)) ?? candidates[0];
    if (node) {
      nodes.set(id, node);
    }
  }
  return nodes;
}

export function measureTokenRects(
  root: HTMLElement,
  stageRect: DOMRect,
): Map<string, TokenRect> {
  const rects = new Map<string, TokenRect>();
  for (const node of collectCssIdNodes(root)) {
    const rect = node.getBoundingClientRect();
    rects.set(node.id, {
      id: node.id,
      left: rect.left - stageRect.left,
      top: rect.top - stageRect.top,
      width: rect.width,
      height: rect.height,
    });
  }
  return rects;
}

export function applyCancelStyles(
  element: HTMLElement,
  state: CancelVisualState,
): void {
  const opacity = 1 - state.fade * 0.95;
  const scaleX = Math.max(0.05, 1 - state.collapse * 0.95);
  element.style.color = `color-mix(in oklch, var(--lm-accent-1) ${Math.round(state.tint * 100)}%, currentColor)`;
  element.style.opacity = `${opacity}`;
  element.style.transform = `scaleX(${scaleX})`;
  element.style.transformOrigin = 'center center';

  let strike = element.querySelector<HTMLElement>('.lm-derivation-strike');
  if (!strike && state.strike > 0) {
    strike = document.createElement('span');
    strike.className =
      'lm-derivation-strike pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-accent-1';
    element.style.position = 'relative';
    element.appendChild(strike);
  }
  if (strike) {
    strike.style.opacity = `${state.strike}`;
  }
}

export function applyMoveStyles(
  element: HTMLElement,
  from: TokenRect,
  to: TokenRect,
  t: number,
): void {
  const left = interpolate(from.left, to.left, t, 'ease-out');
  const top = interpolate(from.top, to.top, t, 'ease-out');
  const width = interpolate(from.width, to.width, t, 'ease-out');
  const height = interpolate(from.height, to.height, t, 'ease-out');
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
}

export function applyEnterStyles(element: HTMLElement, t: number): void {
  element.style.opacity = `${interpolate(0, 1, t, 'ease-out')}`;
}

export function applyExitStyles(element: HTMLElement, t: number): void {
  element.style.opacity = `${interpolate(1, 0, t, 'ease-out')}`;
}

function collectCssIdNodes(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[id]')).filter(
    (node) =>
      node.id.length > 0 && root.contains(node) && !isAssistiveNode(node),
  );
}

/**
 * MathJax emits a hidden `<mjx-assistive-mml>` MathML mirror alongside the visible
 * CHTML, and `\cssId` tags land on *both*. Those hidden copies have degenerate
 * rects and would render as stray "ghost" tokens, so we skip them entirely.
 */
function isAssistiveNode(node: HTMLElement): boolean {
  return node.closest('mjx-assistive-mml') !== null;
}

function cssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && 'escape' in CSS) {
    return CSS.escape(value);
  }
  return value.replace(/"/g, '\\"');
}
