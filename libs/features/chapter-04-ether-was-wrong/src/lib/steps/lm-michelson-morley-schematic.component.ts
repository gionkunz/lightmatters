import { Component } from '@angular/core';

/**
 * Illustrative Michelson–Morley schematic (not to scale).
 * Uses CSS variable attributes directly — this lib is outside Tailwind @source.
 */
@Component({
  selector: 'lm-michelson-morley-schematic',
  template: `
    <svg
      viewBox="0 0 480 320"
      width="480"
      height="320"
      class="mx-auto block h-auto max-w-full"
      aria-label="Michelson–Morley interferometer schematic"
      role="img"
    >
      <!-- L-shaped bench -->
      <line
        x1="240"
        y1="60"
        x2="240"
        y2="250"
        stroke="var(--lm-ink-faint)"
        stroke-width="1"
      />
      <line
        x1="80"
        y1="160"
        x2="400"
        y2="160"
        stroke="var(--lm-ink-faint)"
        stroke-width="1"
      />

      <!-- beam splitter (45°) -->
      <rect
        x="230"
        y="150"
        width="20"
        height="20"
        fill="var(--lm-paper-alt)"
        stroke="var(--lm-ink)"
        stroke-width="1.4"
        transform="rotate(45 240 160)"
      />

      <!-- arm along motion (vertical, accent-1) -->
      <line
        x1="240"
        y1="160"
        x2="240"
        y2="72"
        stroke="var(--lm-accent-1)"
        stroke-width="2.2"
      />
      <!-- arm across motion (horizontal, accent-2) -->
      <line
        x1="240"
        y1="160"
        x2="368"
        y2="160"
        stroke="var(--lm-accent-2)"
        stroke-width="2.2"
      />
      <!-- return paths (faint) -->
      <line
        x1="240"
        y1="160"
        x2="240"
        y2="248"
        stroke="var(--lm-accent-1)"
        stroke-width="1.4"
        opacity="0.35"
      />
      <line
        x1="240"
        y1="160"
        x2="112"
        y2="160"
        stroke="var(--lm-accent-2)"
        stroke-width="1.4"
        opacity="0.35"
      />

      <!-- mirrors -->
      <line
        x1="222"
        y1="72"
        x2="258"
        y2="72"
        stroke="var(--lm-ink)"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <line
        x1="368"
        y1="148"
        x2="368"
        y2="172"
        stroke="var(--lm-ink)"
        stroke-width="2.5"
        stroke-linecap="round"
      />

      <!-- source below splitter -->
      <circle cx="240" cy="248" r="4.5" fill="var(--lm-ink)" />
      <!-- detector beside splitter (recombined beam) -->
      <circle cx="112" cy="160" r="4" fill="var(--lm-ink)" opacity="0.7" />

      <text
        x="252"
        y="252"
        fill="var(--lm-ink)"
        opacity="0.55"
        font-family="var(--font-mono)"
        font-size="10"
        letter-spacing="0.12em"
      >
        SOURCE
      </text>
      <text
        x="88"
        y="154"
        fill="var(--lm-ink)"
        opacity="0.55"
        font-family="var(--font-mono)"
        font-size="10"
        letter-spacing="0.12em"
      >
        DETECTOR
      </text>
      <text
        x="240"
        y="44"
        text-anchor="middle"
        fill="var(--lm-accent-1)"
        font-family="var(--font-mono)"
        font-size="10"
        letter-spacing="0.1em"
      >
        ALONG MOTION
      </text>
      <text
        x="392"
        y="164"
        fill="var(--lm-accent-2)"
        font-family="var(--font-mono)"
        font-size="10"
        letter-spacing="0.1em"
      >
        ACROSS
      </text>

      <!-- fringe readout: expected shift (ghost) vs observed null -->
      <text
        x="340"
        y="292"
        fill="var(--lm-ink)"
        opacity="0.45"
        font-family="var(--font-mono)"
        font-size="9"
        letter-spacing="0.1em"
      >
        EXPECTED SHIFT
      </text>
      @for (i of fringeBars; track i) {
        <rect
          [attr.x]="328 + i * 9"
          y="248"
          width="5"
          height="38"
          fill="var(--lm-ink)"
          [attr.opacity]="i % 2 === 0 ? 0.22 : 0.08"
        />
      }

      <text
        x="72"
        y="292"
        fill="var(--lm-accent-1)"
        font-family="var(--font-mono)"
        font-size="9"
        letter-spacing="0.1em"
      >
        OBSERVED: NULL
      </text>
      @for (i of fringeBars; track i) {
        <rect
          [attr.x]="60 + i * 9"
          y="248"
          width="5"
          height="38"
          fill="var(--lm-accent-1)"
          [attr.opacity]="i % 2 === 0 ? 0.85 : 0.35"
        />
      }
    </svg>
  `,
})
export class LmMichelsonMorleySchematicComponent {
  protected readonly fringeBars = [0, 1, 2, 3, 4];
}
