# Design — Reorder chapters & route scheme

## Context

Four new chapters are being added across three content changes. Each needs to land at a
specific pedagogical position, which requires renumbering existing chapters. Rather than let
"whichever lands first" improvise the renumber, this change fixes the final map and the route
scheme up front, so the content changes can target stable numbers.

## Decisions

### D1 — Final ordering is Option C (dependency-correct, least churn)

The locked map respects the SR prerequisite chain:

> see light move (3 Light & information) → no medium (4 The ether was wrong) → **c is the
> same for all (5 The same speed of light)** → therefore clocks dilate & rulers shrink
> (6 Clocks & rulers) → what you *see* when sources move (7 Doppler) → path-dependence of
> time (8 Twin paradox) → mass is energy (9 E=mc²) → curved spacetime (10–12).

Two hard dependencies forced this order over the alternative of placing "Clocks & rulers"
right after the speed budget:

1. **The light-sphere c-invariance demo needs the expanding-light-circle primitive** that
   "Light & information" introduces → c-invariance must come *after* Ch3.
2. **The light-clock derivation assumes c is invariant** → "Clocks & rulers" must come
   *after* "The same speed of light".

*Alternatives considered:* the design-docs' earlier order (Clocks 3, Same-speed 4) — rejected,
it derives the light clock before c-invariance is established and reshuffles more chapters;
append-only — rejected, wrong pedagogical sequence.

### D2 — Simultaneity is a planted puzzle, resolved later

"Light & information" (3) shows the *phenomenon* of simultaneity (who sees flashes together)
before "The same speed of light" (5) explains *why* it is frame-relative. This is the
product's show-then-explain ethos, and it is a stronger arc than stating the postulate cold.
Coordinated tweak in `physics-accuracy-pass`: the Ch3 simultaneity beat plants the puzzle and
forward-references Ch5 rather than fully resolving it in place.

### D3 — Route scheme: `/chapter/:chapter/step/:step`, unpadded

Replace `/ch/:c/step/:s` (zero-padded chapter) with `/chapter/:chapter/step/:step` using
unpadded integers (`/chapter/1/step/2`, `/chapter/12/step/7`). More readable, no padding logic.
The `:chapter` and `:step` params are plain integers; `chapterFirstStepHref` drops `padStart`.

### D4 — One atomic pass, land first

All renumber + rename edits happen together so the app is never in a half-renamed state:
`app.routes.ts`, chapter route files, `site-routes.ts`, `chapters.data.ts`,
`app.routes.server.ts`, `generate-seo.ts`, `_redirects`/`_headers`, registry, in-app nav
links, and narration cross-references. Recommended landing order: **this change first**, then
`physics-accuracy-pass`, then the three new-chapter changes (which insert at their final
positions without touching numbering).

### D5 — Consolidate route specs under one capability

The current per-chapter route requirements in `app-shell` (`/ch/01`, `/ch/02`, …) and the
`/ch/:c/step/:s` references in `static-site-generation` and `cloudflare-pages-deployment` are
superseded by a single `chapter-routing` capability that owns the scheme and numbering. On
archive, retire/replace the per-chapter `app-shell` route requirements in favor of it.

### D6 — Old-URL redirects are optional

Since v1.0 is not public, broken `/ch/0X/...` deep links are acceptable. Add courtesy
`_redirects` (`/ch/01/step/* → /chapter/1/step/:splat`, etc.) only if cheap; otherwise skip.

## Risks / Trade-offs

- **[Large mechanical surface area]** → do it as one pass with a build + e2e check; the
  `site-routes.ts` + `chapters.data.ts` centralization keeps most path construction in two files.
- **[Renumber drift with in-flight content changes]** → land this before the new-chapter
  changes; they then target final numbers.
- **[Hardcoded `/ch/...` strings in step components]** → grep every `ch/` occurrence; prefer
  routing relative to the current route or a shared href helper to avoid future churn.

## Open Questions

- Include courtesy old→new redirects, or accept broken pre-launch deep links? (D6)
- Should chapter numbers in narration be referenced by number at all, or by name only, to
  reduce future renumber churn? Settle during implementation.
