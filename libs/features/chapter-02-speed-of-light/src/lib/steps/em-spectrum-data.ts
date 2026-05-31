import { SPEED_OF_LIGHT_MS } from '@lm/physics';

export type EmSpectrumBandId =
  | 'radio'
  | 'microwave'
  | 'infrared'
  | 'visible'
  | 'uv'
  | 'xray'
  | 'gamma';

export interface EmSpectrumBandData {
  readonly id: EmSpectrumBandId;
  readonly label: string;
  readonly short: string;
  readonly x0: number;
  readonly x1: number;
  /** Approximate lower edge of the band (Hz). Boundaries are conventional, not sharp. */
  readonly freqStartHz: number;
  /** Approximate upper edge of the band (Hz). */
  readonly freqEndHz: number;
}

/** Log-scaled strip positions with rounded ITU-style frequency edges. */
export const EM_SPECTRUM_BANDS: readonly EmSpectrumBandData[] = [
  {
    id: 'radio',
    label: 'Radio',
    short: 'radio',
    x0: 0.02,
    x1: 0.16,
    freqStartHz: 3e3,
    freqEndHz: 3e8,
  },
  {
    id: 'microwave',
    label: 'Microwave',
    short: 'µwave',
    x0: 0.16,
    x1: 0.28,
    freqStartHz: 3e8,
    freqEndHz: 3e11,
  },
  {
    id: 'infrared',
    label: 'Infrared',
    short: 'IR',
    x0: 0.28,
    x1: 0.42,
    freqStartHz: 3e11,
    freqEndHz: 4e14,
  },
  {
    id: 'visible',
    label: 'Visible',
    short: 'vis',
    x0: 0.42,
    x1: 0.52,
    freqStartHz: 4e14,
    freqEndHz: 7.5e14,
  },
  {
    id: 'uv',
    label: 'Ultraviolet',
    short: 'UV',
    x0: 0.52,
    x1: 0.62,
    freqStartHz: 7.5e14,
    freqEndHz: 3e16,
  },
  {
    id: 'xray',
    label: 'X-ray',
    short: 'X',
    x0: 0.62,
    x1: 0.78,
    freqStartHz: 3e16,
    freqEndHz: 3e19,
  },
  {
    id: 'gamma',
    label: 'Gamma',
    short: 'γ',
    x0: 0.78,
    x1: 0.98,
    freqStartHz: 3e19,
    freqEndHz: 3e22,
  },
];

export function wavelengthFromFrequencyHz(hz: number): number {
  return SPEED_OF_LIGHT_MS / hz;
}

function superscriptExponent(exp: number): string {
  const map: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '-': '⁻',
  };
  return String(exp)
    .split('')
    .map((char) => map[char] ?? char)
    .join('');
}

/** Explicit Hz readout, e.g. `7.5×10¹⁴ Hz` or `3000 Hz`. */
export function formatFrequencyInHz(hz: number): string {
  if (hz >= 1e6) {
    const exp = Math.round(Math.log10(hz));
    const coeff = hz / 10 ** exp;
    const coeffText = Number(coeff.toPrecision(3)).toString();
    return `${coeffText}×10${superscriptExponent(exp)} Hz`;
  }
  if (hz >= 1) {
    return `${Math.round(hz).toLocaleString('en-US')} Hz`;
  }
  return `${hz} Hz`;
}

/** Compact label, e.g. `300 MHz` or `750 THz`. */
export function formatEmFrequency(hz: number): string {
  if (hz >= 1e21) {
    return `${Math.round(hz / 1e21)} EHz`;
  }
  if (hz >= 1e18) {
    return `${Math.round(hz / 1e18)} EHz`;
  }
  if (hz >= 1e15) {
    return `${Math.round(hz / 1e15)} PHz`;
  }
  if (hz >= 1e12) {
    return `${Math.round(hz / 1e12)} THz`;
  }
  if (hz >= 1e9) {
    return `${Math.round(hz / 1e9)} GHz`;
  }
  if (hz >= 1e6) {
    return `${Math.round(hz / 1e6)} MHz`;
  }
  if (hz >= 1e3) {
    return `${Math.round(hz / 1e3)} kHz`;
  }
  return `${hz} Hz`;
}

/** Wavelength with an SI prefix, e.g. `750 nm`, `100 km`, `1.2 µm`. */
export function formatEmWavelength(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km >= 100 ? Math.round(km) : Number(km.toPrecision(3))} km`;
  }
  if (meters >= 1) {
    return `${meters >= 100 ? Math.round(meters) : Number(meters.toPrecision(3))} m`;
  }
  if (meters >= 1e-3) {
    return `${Number((meters / 1e-3).toPrecision(3))} mm`;
  }
  if (meters >= 1e-6) {
    return `${Number((meters / 1e-6).toPrecision(3))} µm`;
  }
  if (meters >= 1e-9) {
    return `${Number((meters / 1e-9).toPrecision(3))} nm`;
  }
  return `${Number((meters / 1e-12).toPrecision(3))} pm`;
}

export interface EmSpectrumEdgeReadout {
  readonly freqCompact: string;
  readonly freqHz: string;
  readonly wavelength: string;
}

export function emSpectrumEdgeReadout(hz: number): EmSpectrumEdgeReadout {
  return {
    freqCompact: formatEmFrequency(hz),
    freqHz: formatFrequencyInHz(hz),
    wavelength: formatEmWavelength(wavelengthFromFrequencyHz(hz)),
  };
}
