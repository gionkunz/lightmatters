## Why

Chapter 2+ steps will introduce Lorentz factors, time dilation, and other formulas layered on top of visual explanations. Authors should write LaTeX inline in narrate strings (`$...$`) without maintaining a separate formula registry or build-time compiler. MathJax with TeX input provides mature rendering, direct authoring ergonomics, and lazy-loaded delivery separate from the main app bundle.

## What Changes

- Add **`MathJaxService`** in `libs/design`: lazy-load MathJax v4 (`tex-chtml-nofont.js`), typeset inline `\(...\)` on demand.
- Add **narrate text parsing** in `libs/engine`: split `$...$` delimiters into text/math segments; math blocks reveal atomically during typewriter playback.
- Extend **`LmNarratorComponent`** to render inline math via MathJax when a math segment becomes visible.
- Update **`TimelineRunner`** typing-unit accounting so math blocks count as fixed-duration atomic units.
- Copy **MathJax assets** to `/mathjax/` via Angular build assets config (async load, not in main bundle).

Out of scope: display/block `$$...$$` math, equation numbering, `\define`/custom macros file, narrator segment API change (still plain `text` strings with delimiters), MathJax context menu.

## Capabilities

### New Capabilities

- `inline-math-narrator`: Inline LaTeX in narrate strings via `$...$`, MathJax CHTML rendering, atomic reveal during typewriter.

### Modified Capabilities

- `narrator`: narrate strings MAY contain `$...$` inline LaTeX; math reveals atomically.
- `timeline-engine`: typing-unit duration accounts for inline math blocks.

## Impact

- **Design:** `MathJaxService`, MathJax static assets (~800 KB lazy-loaded).
- **Engine:** `narrate-text` parser, narrator + timeline runner updates.
- **App:** `project.json` assets entry for MathJax files.
- **Dependency:** `mathjax@4` npm package.
