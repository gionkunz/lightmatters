## Context

Authors need to write formulas directly in timeline narrate strings. MathJax v4 with TeX input and CHTML output is the chosen approach: LaTeX in `$...$` delimiters, lazy-loaded from `/mathjax/tex-chtml-nofont.js`, fonts fetched from jsDelivr by MathJax automatically (`-nofont` bundle).

The narrator typewriter reveals text character-by-character. Inline math must appear as a single atomic unit when reached — not character-by-character through `\frac`.

## Goals / Non-Goals

**Goals:**

- Authors write `$...$` LaTeX inline in existing `NarrateEvent.text` strings.
- MathJax loads once, on first math typeset.
- Math blocks reveal atomically; text reveals letter-by-letter.
- Timeline progress/duration accounts for math blocks.

**Non-Goals:**

- Build-time LaTeX compilation (math-core).
- AsciiMath input.
- Display math `$$...$$` (defer until needed).
- Matching EB Garamond in formulas (MathJax NewCM is acceptable for v1).

## Decisions

### 1. Delimiter syntax: `$...$`

Split narrate text on `$` with even indices = text, odd = LaTeX. Authors escape literal dollars in a later iteration if needed.

Example:

```ts
{
  type: 'narrate',
  text: 'Everything moves at $c$ through spacetime — even at rest.',
}
```

### 2. Typing units

Each math block counts as **5 character-units** (`MATH_TYPING_UNIT_CHARS = 5`) for timeline timing and reveal progression. At default 28 ms/char, a formula gets ~140 ms before the next text character.

### 3. MathJaxService (design lib)

- Singleton `providedIn: 'root'`
- Config: empty `inlineMath`/`displayMath` arrays (no auto-scan); manual `\(...\)` injection per element
- `typesetElement(el, latex)` → `MathJax.typesetPromise([el])`
- Script: `/mathjax/tex-chtml-nofont.js`

### 4. Narrator rendering

`buildNarrateRenderPieces(segments, visibleUnits)` produces word/space/math pieces. Math spans use `#mathHost` template refs; `afterNextRender` triggers typeset for newly visible hosts.

### 5. Asset delivery

Copy full `node_modules/mathjax` to `/mathjax/` via Angular assets. Loaded async on first formula — not in main JS bundle.

## Risks / Trade-offs

- **[Bundle on first math]** ~800 KB MathJax download when user first hits a formula step. → Acceptable; lazy-loaded.
- **[Typography mismatch]** MathJax NewCM vs EB Garamond narration. → Accept for v1; tune later.
- **[Literal `$` in prose]** Split parser treats `$` as delimiter. → Rare in narration; escape support deferred.
- **[MathJax load failure]** Fallback shows raw `$latex$` text.

## Migration Plan

Additive. Existing narrate strings without `$` behave identically.
