## Context

`LmStepFrame` renders a four-row grid: top nav (wordmark, chapter metadata, progress dots), `LmPlaybackBar` (checkpoint transport), main content, and a footer with keyboard hints plus back / continue buttons. Every step component wires the playback bar to `TimelineRunner` checkpoint methods and the footer to hard-coded `Router.navigateByUrl` prev/next handlers. The two surfaces duplicate "go forward / go back" semantics at different scopes without communicating intent.

The playback bar already uses media-player iconography (⏮ ▶ ⏸ ⏭) and checkpoint dots on a progress track. The footer adds chapter/step navigation that only appears after timeline completion or via explicit buttons — a second mental model.

## Goals / Non-Goals

**Goals:**

- Single transport surface: top playback bar handles checkpoint, step, and chapter navigation.
- Seamless boundary crossing: ⏮ / ⏭ at first/last checkpoint navigate to adjacent steps (or home / next chapter) without a separate UI mode.
- Boundary hints: when the next transport action crosses a step or chapter boundary, show a short kicker label beside the relevant button.
- Preserve existing timeline semantics (pause, play, checkpoint seek, Space/Enter advance).
- Reclaim footer vertical space for diagram / narrator content.
- Migrate `continueDisabled` gating (prediction gates, etc.) to transport forward disabled state.

**Non-Goals:**

- Changing timeline event authoring or checkpoint computation.
- Adding a global chapter index or swipe gestures.
- Replacing per-step URL knowledge with a centralized route registry (future refactor).
- Changing top nav (wordmark, dots, step counter) — it remains positional context, not transport.
- `prefers-reduced-motion` support.

## Decisions

### 1. Step frame orchestrates transport dispatch

**Choice:** `LmStepFrame` accepts optional `prevStepUrl`, `nextStepUrl`, `hasNextStep`, `nextChapter`, and `advanceDisabled` inputs. Its `(goPrevious)` / `(goNext)` handlers (wired from playback bar) dispatch internally:

1. If runner has a previous/next checkpoint → delegate to runner (existing behavior).
2. Else if boundary navigation applies → `Router.navigateByUrl` to the provided URL.
3. Forward at boundary respects `advanceDisabled` (disabled ⏭, no navigation).

Step components stop binding `(back)` / `(next)` on the frame; they pass URLs and gating flags instead. This keeps URL knowledge per chapter (existing `goPrevStep` / `goNextStep` methods become URL constants or thin helpers) while centralizing the checkpoint-vs-boundary decision once.

**Alternatives considered:**

- *Per-step handler duplication* — every step reimplements the if-checkpoint-else-navigate branch. Rejected: ~30+ copies of identical logic.
- *Engine navigation service with global registry* — cleaner long-term but out of scope; would require new cross-chapter registry infrastructure.

### 2. Boundary hint labels on playback bar

**Choice:** `LmPlaybackBar` gains optional `previousHint` and `nextHint` string inputs. When non-empty, render an `lm-kicker` label immediately beside the ⏮ / ⏭ button (left of ⏮, right of ⏭). Step frame computes hints:

| Condition | Hint example |
|-----------|----------------|
| At first checkpoint, prev goes home | `home` |
| At first checkpoint, prev goes to prior step | `step 2` |
| At first checkpoint, prev crosses chapter | `ch 1 · step 4` |
| At last checkpoint / complete, next goes to next step | `step 3` |
| At last checkpoint / complete, next crosses chapter | `next chapter` |

Hints appear only when the corresponding transport action would cross a boundary (no hint during intra-step checkpoint navigation).

**Alternatives considered:**

- *Tooltip on hover* — less discoverable; user asked for visible hints beside buttons.
- *Replace button icons with text* — breaks media-player metaphor.

### 3. Remove footer entirely

**Choice:** Delete the footer row and its grid slot (`grid-rows-[auto_auto_1fr_auto]` → `grid-rows-[auto_auto_1fr]`). Remove `LmButton` footer imports, keyboard hint strip, and `back` / `next` outputs from `LmStepFrame`.

Keyboard hints for Space (play/pause) are dropped from chrome — Space/Enter behavior is unchanged; no on-screen reminder unless we add a subtle nav-area hint later (non-goal for now).

### 4. Keyboard: ArrowLeft / ArrowRight mirror transport

**Choice:** Extend the existing `@HostListener('document:keydown')` pattern in step components (or a shared mixin/directive) so ArrowLeft triggers the same dispatch as ⏮ and ArrowRight triggers ⏭. Ignore when focus is in input/textarea/button. Space/Enter behavior unchanged.

**Alternative:** Only mouse/touch on playback bar. Rejected: power users and accessibility benefit from keyboard parity.

### 5. Forward gating replaces `continueDisabled`

**Choice:** Rename concept to `advanceDisabled` on step frame. When true and the user is at the last checkpoint, ⏭ is disabled and shows no next-step navigation. Step components set this from prediction gates, etc. (same call sites that would have used `continueDisabled`).

### 6. `canGoPrevious` / `canGoNext` semantics expand

**Choice:** Playback bar `canGoPrevious` is true when either runner has a previous checkpoint OR a `prevStepUrl` is provided. `canGoNext` is true when runner has next checkpoint OR (`hasNextStep` && !`advanceDisabled`). This keeps buttons enabled at boundaries so hints are actionable.

## Risks / Trade-offs

- **[Discoverability without footer buttons]** → Boundary hints on ⏮/⏭ explicitly signal step/chapter transitions; top nav dots still show position.
- **[Accidental chapter skip]** → Crossing a chapter boundary requires being at the last checkpoint and pressing ⏭ (same as today's "continue" after timeline completes); no change in guard rails.
- **[Last step of chapter with no next step]** → ⏭ disabled at last checkpoint (same as hidden continue today).
- **[Breaking change for step component API]** → Mechanical migration across all step files; no external consumers.
- **[E2E / visual regression]** → Footer selectors removed; update any tests referencing footer buttons.

## Migration Plan

1. Extend `LmPlaybackBar` with hint inputs and layout for labels beside transport buttons.
2. Refactor `LmStepFrame`: remove footer, add URL/gating inputs, internal dispatch + hint computation, inject `Router`.
3. Update one reference step (Chapter 1 Step 2) to validate the pattern.
4. Mechanical migration of remaining step components (~30 files): replace `(back)`/`(next)` with URL inputs; wire ArrowLeft/ArrowRight.
5. Update `step-chrome` and chapter delta specs; run unit tests + spot-check E2E.
6. Rollback: revert step-frame and playback-bar changes; footer restores prior UX.

## Open Questions

- Should clicking the wordmark navigate home (currently only Step 1 footer back did)? **Proposal: no change** — out of scope unless user wants it.
- Should hint text use kicker casing (`STEP 3`) or sentence case (`step 3`)? **Proposal: kicker lowercase** to match existing chrome labels.
