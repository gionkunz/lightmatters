## Context

Light Matters step pages render at native browser scale (`initial-scale=1`). Narrator components (`LmNarrator`, `LmNarratorChatFeed`) parse narrate strings for `$...$` inline LaTeX via `parseNarrateText` in `libs/engine/src/lib/timeline/narrate-text.ts`, then reveal text character-by-character. Chat-feed steps (Chapter 2+, many Chapter 3–6 layouts) stack completed beats in `LmNarratorChatFeed` inside a flex column with no overflow constraint — long narration pushes sibling content down or clips against `lm-step-frame`'s `overflow-hidden` main region.

Authors across Chapters 4–6 already use `**bold**` and `*italic*` in narrate `text` fields; these render as literal asterisks today.

## Goals / Non-Goals

**Goals:**

- Default 1.5× UI scale on app load for better readability and interactive target size.
- Scrollable chat-feed beat column with auto-scroll pinned to the current beat.
- Inline Markdown emphasis (`**…**`, `*…*`) rendered as styled DOM in both narrator variants, compatible with `$…$` math and the existing typewriter.
- Unit tests covering parser edge cases (nested emphasis, math adjacent to emphasis, typing units unchanged for markup delimiters).

**Non-Goals:**

- Full Markdown (headings, lists, links, block quotes, code blocks).
- User preference / localStorage zoom override or zoom controls in chrome.
- Changing diagram intrinsic pixel sizes (they scale with the global zoom).
- `prefers-reduced-motion` support.

## Decisions

### 1. Typography and control scale via CSS tokens (not `zoom`)

Remove `html { zoom }`. Introduce `--lm-type-scale: 1.5` and derived `--lm-text-*` / `--lm-slider-*` tokens in `styles.css`. Apply tokens to narrator text, kickers, buttons, sliders, playback transport, step chrome, and fact lines only.

Diagram canvas dimensions (SVG width/height inputs, WebGL framebuffer size) stay at their authored pixel values so WebGL stays crisp and step layouts keep similar height.

**Alternative considered:** `html { zoom: 1.5 }`. Rejected — pixelates WebGL canvases and inflates total page height including padding and diagram boxes.

**Alternative considered:** `<meta viewport initial-scale=1.5>`. Rejected — mobile pinch semantics; does not match desktop browser-zoom feel.

**Alternative considered:** Bump all Tailwind text sizes globally. Rejected — would scale diagram axis labels; token approach targets chrome + narration only.

### 2. Chat-feed scroll container

Wrap the beat stack in `LmNarratorChatFeed` with:

```html
<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain …">
  <!-- past + current beats -->
</div>
```

Parent step layouts already use `flex flex-col` on the left column; add `min-h-0` to that column where missing so flex children can shrink and scroll.

On `currentText` or `pastBeats` change, scroll the current beat `<p>` into view (`scrollIntoView({ block: 'nearest' })`) after render so new beats stay readable without manual scrolling.

**Alternative considered:** Fixed `max-height` in px. Rejected — breaks across viewport sizes; flex + `min-h-0` adapts to the step grid.

### 3. Two-phase narrate parsing: math first, then emphasis

Extend the pipeline without replacing `parseNarrateText`:

1. Split on `$…$` → `text | math` segments (unchanged).
2. For each `text` segment, split on inline emphasis patterns → `text | bold | italic` sub-segments.
3. Flatten to a render segment union: `{ kind: 'text' | 'bold' | 'italic' | 'math', content | latex }`.
4. `buildNarrateRenderPieces` maps segments to template pieces; markup delimiters (`*`, `**`) do **not** count as typing units — only visible characters do (same rule as today: delimiters are invisible).

Parsing order: `$…$` takes precedence over `*`. Content inside `$…$` is LaTeX only — no Markdown parsing within math delimiters.

Emphasis regex (greedy-minimal): `\*\*(.+?)\*\*` for bold, `(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)` for italic (single asterisks not part of `**`).

Templates wrap `bold`/`italic` pieces in `<strong class="font-semibold">` / `<em class="italic">` inside the existing word/char loops so line-break and typewriter behavior stay intact.

**Alternative considered:** `marked` or `markdown-it` dependency. Rejected — overkill for two inline patterns; adds bundle weight and HTML sanitization concerns.

**Alternative considered:** `[innerHTML]` with a sanitizer. Rejected — breaks per-character typewriter; stick to structured pieces.

### 4. Typing units and skip semantics unchanged

Markup delimiters are stripped before counting characters for `narrateTypingUnits` / visible-unit progression. A string `**bold**` counts as 4 typing units (`b`,`o`,`l`,`d`), not 8.

Skip / checkpoint-hold still completes the full visible string instantly.

### 5. Shared template helper for styled pieces

Both `LmNarratorComponent` and `LmNarratorChatFeedComponent` duplicate the piece-rendering `@switch`. Extract a small presentational sub-component or shared template fragment only if the duplication exceeds ~30 lines; otherwise inline the extra `@case ('bold')` / `@case ('italic')` branches in both components to minimize scope.

## Risks / Trade-offs

- **[CSS zoom Firefox support]** → Accept for v1; if needed later, fall back to `transform` wrapper for Firefox only via `@supports not (zoom: 1)`.
- **[Double scrollbars on narrow viewports]** → Use `overscroll-contain` and `min-h-0` discipline; smoke-test chat-feed steps at 1280×800 and 1440×900.
- **[Author typos in Markdown]** → Unclosed `*` / `**` render as literal characters (no throw); same fail-soft as broken `$…$`.
- **[Bold + italic nesting]** → Support `***both***` as bold wrapping italic inner parse, or treat as bold-only for v1; document in tests.

## Migration Plan

1. Land CSS zoom + chat-feed scroll (visible immediately, no author changes).
2. Land parser + template emphasis rendering (existing authored `**` strings start rendering correctly).
3. Run `nx test engine --tui=false`; spot-check Chapter 2 Step 2 (chat feed), Chapter 6 Step 3 (bold-heavy narration).
4. Rollback = revert single commit; no data migration.

## Open Questions

- Should landing page (`/`) also receive 1.5× zoom? **Decision:** yes — apply on `html` globally for consistency.
- Italic styling: EB Garamond has native italic; use `font-style: italic` only (no synthetic oblique). **Decision:** yes.
