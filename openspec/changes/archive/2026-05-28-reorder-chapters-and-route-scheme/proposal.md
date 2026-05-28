# Reorder chapters to the v1.0 journey map and adopt a cleaner route scheme

## Why

The v1.0 journey map is now locked (see `design.md`). It inserts four new chapters
("The same speed of light", "Clocks & rulers", "The twin paradox", "Mass is energy")
into the special-relativity block and pushes the gravity block to the end. Because the
app is not yet public, this is the moment to put chapters in their correct pedagogical
order **once**, rather than appending and living with a wrong sequence.

At the same time, the current route scheme `/ch/:c/step/:s` with zero-padded chapter
numbers (`/ch/01/step/2`) is uglier than it needs to be. We want human-friendly,
unpadded URLs: `/chapter/1/step/2`.

This change is the **prerequisite refactor** that all four new-chapter changes depend on:
it establishes the final chapter numbering and the canonical route scheme. It carries
**no new content or physics** — it is a coordinated renumber + rename pass.

## What Changes

- **Lock the v1.0 numbering (Option C).** Twelve chapters, flat spacetime 1–9, curved
  spacetime 10–12:

  | # | Chapter | Source |
  |---|---------|--------|
  | 1 | Position, time, spacetime | existing |
  | 2 | The speed budget | existing |
  | 3 | Light and information | existing |
  | 4 | The ether was wrong | existing |
  | 5 | The same speed of light | new (`add-c-invariance-and-twin-paradox`) |
  | 6 | Clocks & rulers | new (`add-light-clock-and-length-contraction`) |
  | 7 | Doppler and seeing motion | existing (was 5) |
  | 8 | The twin paradox | new (`add-c-invariance-and-twin-paradox`) |
  | 9 | Mass is energy (E=mc²) | new (`add-matter-and-emc2`) |
  | 10 | Rolling the diagram | existing (was 6) |
  | 11 | The center of the Earth | existing (was 7) |
  | 12 | Light bending around mass | existing (was 8) |

- **Renumber existing chapters.** Doppler `5 → 7`; Rolling `6 → 10`; Center `7 → 11`;
  Bending `8 → 12`. Chapters 1–4 keep their numbers. The chapter-9 placeholder moves to 13
  (or is removed).
- **Adopt the new route scheme.** `/ch/:chapter/step/:step` → `/chapter/:chapter/step/:step`,
  with **unpadded** chapter and step numbers (`/chapter/1/step/2`, not `/ch/01/step/2`).
- **Single coordinated pass** updates: `app.routes.ts`, each chapter's `chapterNN.routes.ts`,
  `site-routes.ts` (`CHAPTER_STEP_ROUTES`, `allPrerenderPaths`), `chapters.data.ts`
  (`chapterFirstStepHref` — drop `padStart`), all in-step/inter-chapter navigation links,
  `app.routes.server.ts`, `generate-seo.ts`, `public/_redirects` / `_headers`, the chapter
  registry, and narration cross-references that name chapter numbers.
- **Optional courtesy redirects** from old `/ch/0X/...` paths to the new `/chapter/X/...`
  paths (low value pre-launch; include only if cheap).

## Capabilities

- `chapter-routing`: the canonical chapter/step URL scheme and the locked v1.0 chapter
  numbering — the single source of truth for chapter route paths, superseding the scattered
  per-chapter route paths in `app-shell`, `static-site-generation`, and
  `cloudflare-pages-deployment`.

## Impact

- **Touches routing/SEO across the whole app** — high surface area, low conceptual risk.
  Best done as one atomic pass, ideally **before** the four new-chapter changes land.
- **Breaks existing deep links** (`/ch/0X/...`). Acceptable pre-launch; optional courtesy
  redirects mitigate.
- **No engine or primitive changes.** Pure routing + numbering + doc updates.
- **Supersedes** the per-chapter route requirements in `app-shell` (e.g. "App routes
  lazy-load chapter 2 feature" at `/ch/02`) — those should be consolidated under
  `chapter-routing` on archive.
