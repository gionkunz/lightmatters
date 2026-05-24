## 1. Narrate parsing and timeline

- [x] 1.1 Add `parseNarrateText`, `narrateTypingUnits`, `buildNarrateRenderPieces` in `libs/engine`
- [x] 1.2 Update `TimelineRunner` to use typing units instead of raw string length
- [x] 1.3 Unit tests for parser and timeline math-unit progression

## 2. MathJax integration

- [x] 2.1 Add `MathJaxService` in `libs/design` with lazy script load and `typesetElement`
- [x] 2.2 Copy `node_modules/mathjax` to `/mathjax/` via app build assets
- [x] 2.3 Export `MathJaxService` from `@lm/design`

## 3. Narrator rendering

- [x] 3.1 Update `LmNarratorComponent` to render text/math pieces from `buildNarrateRenderPieces`
- [x] 3.2 Typeset newly visible math hosts via `MathJaxService` after render
- [x] 3.3 Style inline math to align with 30px narration line height

## 4. Verification

- [x] 4.1 `nx test engine design --tui=false` succeeds
- [x] 4.2 `nx lint engine design --tui=false` succeeds
- [ ] 4.3 `nx build lightmatters --tui=false` succeeds
- [ ] 4.4 Manual smoke: add `$c$` to a narrate beat; verify MathJax loads and renders inline
