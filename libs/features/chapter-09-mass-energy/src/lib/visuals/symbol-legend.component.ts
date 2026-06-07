import { Component, input } from '@angular/core';

export interface SymbolLegendRow {
  /** The symbol as it appears in the formulas (e.g. "E", "c", "γ"). */
  readonly sym: string;
  /** Plain-language meaning, ideally with its SI unit (e.g. "energy (joules, J)"). */
  readonly desc: string;
}

/** Compact "what the symbols mean" key, with units, for the formula steps. */
@Component({
  selector: 'lm-symbol-legend',
  template: `
    <dl class="m-0 grid grid-cols-2 gap-x-6 gap-y-1">
      @for (row of rows(); track row.sym) {
        <div class="grid min-w-0 grid-cols-[1.4rem_1fr] items-baseline gap-x-2.5">
          <dt
            class="font-serif text-[length:var(--lm-text-chrome)] italic leading-tight text-ink"
          >
            {{ row.sym }}
          </dt>
          <dd
            class="m-0 font-mono text-[length:var(--lm-text-mono-md)] leading-tight text-ink opacity-65"
          >
            {{ row.desc }}
          </dd>
        </div>
      }
    </dl>
  `,
})
export class SymbolLegendComponent {
  readonly rows = input.required<readonly SymbolLegendRow[]>();
}
