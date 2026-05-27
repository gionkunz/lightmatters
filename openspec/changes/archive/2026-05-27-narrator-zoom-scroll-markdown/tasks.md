## 1. Default UI scale

- [x] 1.1 Add `--lm-type-scale: 1.5` typography/control tokens in `apps/lightmatters/src/styles.css` (CSS `zoom` rejected — pixelates WebGL)
- [x] 1.2 Apply scaled tokens to narrator, kickers, buttons, sliders, playback, step chrome

## 2. Narrate text Markdown parsing

- [x] 2.1 Extend `narrate-text.ts`: after `$...$` split, parse `**...**` and `*...*` in text segments into `bold` / `italic` render segment kinds
- [x] 2.2 Ensure markup delimiters do not count toward typing units (`narrateTypingUnits`, `buildNarrateRenderPieces`)
- [x] 2.3 Add unit tests: bold-only, italic-only, bold adjacent to `$...$` math, asterisks inside math unchanged, unclosed markers fall through as literal text

## 3. Narrator component templates

- [x] 3.1 Update `LmNarratorComponent` template to render `bold` / `italic` pieces with `<strong>` / `<em>` inside existing word/char loops
- [x] 3.2 Update `LmNarratorChatFeedComponent` template with the same emphasis rendering for past and current beats
- [x] 3.3 Verify typewriter reveal and MathJax atomic math blocks still work on a step with both `**emphasis**` and `$\\gamma$`

## 4. Chat-feed scroll

- [x] 4.1 Wrap beat stack in `LmNarratorChatFeed` with `min-h-0 flex-1 overflow-y-auto overscroll-contain`
- [x] 4.2 Add `min-h-0` to left-column flex wrappers in chat-feed step layouts where missing (Chapter 2–6 steps using `lm-narrator-chat-feed`)
- [x] 4.3 Auto-scroll current beat into view on beat change (`scrollIntoView({ block: 'nearest' })` after render)
- [x] 4.4 Smoke-test Chapter 2 Step 2 and Chapter 6 Step 5 with multiple beats — scroll works, current beat stays visible

## 5. Verification

- [x] 5.1 Run `nx test engine --tui=false` and fix any failures
- [x] 5.2 Run `nx lint engine design --tui=false`
- [x] 5.3 Manual spot-check: Chapter 4 Step 1 (`**luminiferous ether**`), Chapter 5 Step 2 (bold + math), Chapter 6 Step 3 (chat feed + bold)
