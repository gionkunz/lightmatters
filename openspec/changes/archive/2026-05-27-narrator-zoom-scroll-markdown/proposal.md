## Why

On typical desktop viewports the step UI renders at 1× browser scale, making narrator text, playback controls, and interactive handles feel small relative to the diagram canvas. Authors already write emphasis with Markdown conventions (`**bold**`, `*italic*`) in narrate strings across Chapters 4–6, but the narrator renders those markers literally. Chat-feed layout steps stack multiple narration beats without scroll, so long sequences clip or push diagram content off-screen.

## What Changes

- Set a **1.5× typography/control scale** via CSS tokens (`--lm-type-scale`) applied to narrator text, kickers, buttons, sliders, playback transport, and step chrome — **not** `html { zoom }`, so WebGL canvases stay crisp and page height stays closer to the original layout.
- Add **vertical scroll** to `LmNarratorChatFeed` so past + current beats scroll within the left column instead of overflowing the step grid.
- Extend narrate text parsing to render **common inline Markdown** — at minimum `**bold**` and `*italic*` — in both `LmNarrator` and `LmNarratorChatFeed`, coexisting with existing `$...$` inline LaTeX.
- Preserve typewriter letter reveal, word grouping, MathJax atomic math blocks, and accessibility (real DOM text nodes).

Out of scope: full Markdown (headings, lists, links, code fences), user-configurable zoom, `prefers-reduced-motion` changes.

## Capabilities

### New Capabilities

_(none — behavior extends existing narrator and app-shell specs)_

### Modified Capabilities

- `app-shell`: typography/control scale tokens at 1.5× for chrome and narration (not global CSS zoom).
- `narrator`: chat-feed column scrolls when beats overflow; inline Markdown emphasis renders in narrator components.
- `inline-math-narrator`: Markdown emphasis and `$...$` LaTeX coexist in the same narrate string without delimiter conflicts.

## Impact

- **App:** `apps/lightmatters/src/styles.css` and/or `index.html` — default scale token or viewport rule.
- **Engine:** `narrate-text.ts` parser extended for inline emphasis; `LmNarratorComponent` and `LmNarratorChatFeedComponent` templates updated for styled spans; chat-feed scroll container + auto-scroll-to-current-beat behavior.
- **Tests:** unit tests for Markdown+math parsing and typing-unit accounting.
- **No new dependencies** — hand-rolled inline parser (same philosophy as `$...$` split).
