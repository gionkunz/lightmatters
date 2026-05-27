/** RGB components in 0–1 range for WebGL. */
export type Rgb = [number, number, number];

/** Read a CSS custom property from the document root. */
export function readCssColor(varName: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback;
  }
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || fallback;
}

function hexToRgb(hex: string): Rgb {
  const normalized =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!match) {
    return [0, 0, 0];
  }
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ];
}

/**
 * Resolve any browser-supported CSS color (hex, rgb, oklch, …) to RGB floats.
 * WebGL/Three.js color parsers may not accept oklch() theme tokens directly.
 */
export function cssColorToRgb(css: string, fallbackHex: string): Rgb {
  const trimmed = css.trim() || fallbackHex;
  if (trimmed.startsWith('#')) {
    return hexToRgb(trimmed);
  }

  if (typeof document === 'undefined') {
    return hexToRgb(fallbackHex);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return hexToRgb(fallbackHex);
  }

  ctx.fillStyle = fallbackHex;
  try {
    ctx.fillStyle = trimmed;
  } catch {
    return hexToRgb(fallbackHex);
  }

  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

export interface ThemeColors {
  ink: Rgb;
  paper: Rgb;
  accent1: Rgb;
}

const FALLBACK_INK = '#14141a';
const FALLBACK_PAPER = '#f5f0e8';
const FALLBACK_ACCENT = '#c44b3a';

export function readThemeColors(): ThemeColors {
  return {
    ink: cssColorToRgb(readCssColor('--lm-ink', FALLBACK_INK), FALLBACK_INK),
    paper: cssColorToRgb(
      readCssColor('--lm-paper', FALLBACK_PAPER),
      FALLBACK_PAPER,
    ),
    accent1: cssColorToRgb(
      readCssColor('--lm-accent-1', FALLBACK_ACCENT),
      FALLBACK_ACCENT,
    ),
  };
}
