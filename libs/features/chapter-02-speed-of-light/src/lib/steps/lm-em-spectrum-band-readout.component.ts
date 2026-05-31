import { Component, computed, input } from '@angular/core';
import { EM_SPECTRUM_BANDS, emSpectrumEdgeReadout } from './em-spectrum-data';

/** Start/end frequency + wavelength readout for the active spectrum band. */
@Component({
  selector: 'lm-em-spectrum-band-readout',
  template: `
    @if (bandIndex() >= 0) {
      <div class="border-t border-ink-faint pt-5">
        <p
          class="m-0 mb-4 font-mono text-[length:calc(10px*var(--lm-type-scale))] uppercase tracking-[0.16em] text-accent-2 opacity-85"
        >
          {{ bandLabel() }}
        </p>
        <div class="grid grid-cols-2 gap-8">
          <div class="min-w-0">
            <p
              class="m-0 font-mono text-[length:calc(10px*var(--lm-type-scale))] uppercase tracking-[0.16em] text-ink opacity-55"
            >
              start
            </p>
            <p
              class="m-0 mt-1.5 font-mono text-[length:calc(13px*var(--lm-type-scale))] leading-snug text-ink opacity-90"
            >
              {{ start().freqCompact }}
            </p>
            <p
              class="m-0 mt-0.5 font-mono text-[length:calc(11px*var(--lm-type-scale))] leading-snug text-ink opacity-55"
            >
              {{ start().freqHz }}
            </p>
            <p
              class="m-0 mt-1.5 font-mono text-[length:calc(12px*var(--lm-type-scale))] leading-snug text-ink opacity-75"
            >
              λ = {{ start().wavelength }}
            </p>
          </div>
          <div class="min-w-0 text-right">
            <p
              class="m-0 font-mono text-[length:calc(10px*var(--lm-type-scale))] uppercase tracking-[0.16em] text-ink opacity-55"
            >
              end
            </p>
            <p
              class="m-0 mt-1.5 font-mono text-[length:calc(13px*var(--lm-type-scale))] leading-snug text-ink opacity-90"
            >
              {{ end().freqCompact }}
            </p>
            <p
              class="m-0 mt-0.5 font-mono text-[length:calc(11px*var(--lm-type-scale))] leading-snug text-ink opacity-55"
            >
              {{ end().freqHz }}
            </p>
            <p
              class="m-0 mt-1.5 font-mono text-[length:calc(12px*var(--lm-type-scale))] leading-snug text-ink opacity-75"
            >
              λ = {{ end().wavelength }}
            </p>
          </div>
        </div>
      </div>
    }
  `,
})
export class LmEmSpectrumBandReadoutComponent {
  readonly bandIndex = input(-1);

  protected readonly bandLabel = computed(() => {
    const index = this.bandIndex();
    return index >= 0 ? EM_SPECTRUM_BANDS[index].label : '';
  });

  protected readonly start = computed(() => {
    const index = this.bandIndex();
    if (index < 0) {
      return emSpectrumEdgeReadout(0);
    }
    return emSpectrumEdgeReadout(EM_SPECTRUM_BANDS[index].freqStartHz);
  });

  protected readonly end = computed(() => {
    const index = this.bandIndex();
    if (index < 0) {
      return emSpectrumEdgeReadout(0);
    }
    return emSpectrumEdgeReadout(EM_SPECTRUM_BANDS[index].freqEndHz);
  });
}
