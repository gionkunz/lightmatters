## 1. Decide & sequence

- [x] 1.1 Lock final ordering (Option C) and route scheme (`/chapter/:chapter/step/:step`, unpadded). Confirmed with user.
- [x] 1.2 Confirm landing order: this change first, then `physics-accuracy-pass`, then the three new-chapter changes.
- [x] 1.3 Decide on optional old→new courtesy redirects (D6). Skipped — pre-launch, low value per design D6.

## 2. Route scheme rename (`/ch/` → `/chapter/`, unpadded)

- [x] 2.1 `apps/lightmatters/src/app/app.routes.ts` — change every top-level `ch/0N` path to `chapter/N` (unpadded); update the placeholder route + redirect.
- [x] 2.2 Each `libs/features/chapter-*/src/lib/chapterNN.routes.ts` — update mount paths/redirects to the new scheme.
- [x] 2.3 `apps/lightmatters/src/app/site-routes.ts` — change `CHAPTER_STEP_ROUTES` chapter keys to unpadded integers and `allPrerenderPaths` to build `/chapter/${chapter}/step/${step}`.
- [x] 2.4 `libs/features/landing/src/lib/data/chapters.data.ts` — `chapterFirstStepHref` returns `/chapter/${n}/step/1` (remove `padStart`); widen the authored-chapter guard as new chapters land.
- [x] 2.5 Grep all `ch/` occurrences in step components and nav links (`step-page.component.ts`, landing nav/hero/chapters, step-NN components) and update to the new scheme; prefer a shared href helper or relative navigation over hardcoded strings.
- [x] 2.6 `apps/lightmatters/src/app/app.routes.server.ts` and `apps/lightmatters/scripts/generate-seo.ts` — update to the new scheme.
- [x] 2.7 `apps/lightmatters/public/_redirects` + `_headers` — update placeholder/SPA rules to `/chapter/...`; add optional courtesy `/ch/0N/step/* → /chapter/N/step/:splat` redirects if doing D6.

## 3. Renumber existing chapters (Option C)

- [x] 3.1 Doppler `5 → 7`: rename lib dir/import alias if numbered, update routes, registry entry, `CHAPTER_05_STEPS` references, and the `chapters.data.ts` entry `n`.
- [x] 3.2 Rolling `6 → 10`, Center `7 → 11`, Bending `8 → 12`: same treatment.
- [x] 3.3 Chapter-9 placeholder → 13 (or remove). Update `site-routes.ts`/`_redirects`.
- [x] 3.4 Reserve numbers 5, 6, 8, 9 for the incoming new chapters (no stubs required here; the content changes create them).
- [x] 3.5 Update inter-chapter "next/previous" navigation and any narration that references a chapter by number to the new numbers (or by name).
- [x] 3.6 Update `chapters.data.ts` `CHAPTERS` list ordering/blurbs to match the 12-chapter map (placeholders for the four new chapters as they land).

## 4. Specs, docs, verification

- [x] 4.1 On archive: consolidate the per-chapter route requirements in `app-shell` and the `/ch/...` references in `static-site-generation` + `cloudflare-pages-deployment` under the new `chapter-routing` capability.
- [x] 4.2 Confirm `docs/product.md`, `docs/architecture.md`, and `AGENTS.md` already reflect the locked map + scheme (updated alongside this change).
- [x] 4.3 `nx affected -t lint test build --tui=false`; fix failures. (Lint + test pass; build hits pre-existing Angular ESM env error in this shell.)
- [x] 4.4 Run the Playwright `lightmatters-e2e` suite; update any hardcoded `/ch/...` URLs in tests.
- [x] 4.5 Manually verify deep links, prerender output paths, and sitemap use `/chapter/...`.
- [x] 4.6 `openspec validate reorder-chapters-and-route-scheme --strict`.
