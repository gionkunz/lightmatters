## Why

Chapter 2 Steps 1–2 established the speed budget and twin-traveller time dilation, but the journey stops without a narrative handoff to Chapter 3. The bridge step teases **one pulse** — B sends a single flash, the ring expands to A then C with pauses for narration at each arrival, and A/C clocks tell different stories. The reader commits to predictions; **Chapter 3** opens the full wavefront chapter (multiple pulses, rhythm, simultaneity). Shipping this bridge now unblocks Chapter 3 without front-loading its content.

## What Changes

- Author **Chapter 2 Step 3** ("Bridge to light") at `/ch/02/step/3`: chat-feed layout, **`wavefront` diagram variant** (A and B stationary, C at $v/c \approx 0.5$), **one pulse only** from B, **staged wavefront animation** to physics-derived milestones (reaches A → pause/narrate → reaches C → pause/narrate), FactLine clocks for A and C, prediction gate, **closing narrate that we will explore this more in the next chapter**, continue to Chapter 3.
- Add **physics helpers** for reception times, proper elapsed time, and **wavefront radius at each observer** (timeline `from`/`to` targets).
- **`LmPredictionChoice`** + **`continueDisabled`** on step frame (unchanged).
- Wire navigation Step 2 → Step 3 → Chapter 3 Step 1 stub.

**Bridge contract:** exactly **one** expanding wavefront on this step. No pulse trains, no second flash. Chapter 3 owns richer wavefront authoring.

Out of scope: multiple pulses (Chapter 3), simultaneity slices, aberration, judging predictions, remaining Chapter 2 beats 4–11.

## Capabilities

### New Capabilities

- `chapter-02-step-03`: Bridge step — one pulse, staged wavefront milestones with narrative pauses, A/C clocks, predictions.
- `prediction-choice`: Selectable prediction options with glow states.

### Modified Capabilities

- `spacetime-diagram`: `wavefront` variant — three observers, single timeline-driven ring, milestone radii, reception markers that persist while paused.
- `physics`: Signal reception + **wavefront radius at observer** helpers for timeline milestones.
- `step-chrome`: Step 2 → Step 3; Step 3 gated continue → Chapter 3.

## Impact

- **Primitive:** `wavefront` variant with segmented radius animation support.
- **Physics:** milestone radius exports for step timeline authoring.
- **Feature:** Step 3 timeline uses **multiple `animate` segments** (`0 → r_A`, `r_A → r_C`) interleaved with **`narrate` checkpoint pauses** — no new timeline event type required.
- **Docs:** Update `docs/product.md` bridge paragraph (single-pulse preview; full wavefronts in Ch 3).
