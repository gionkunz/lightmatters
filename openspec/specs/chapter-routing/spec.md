# chapter-routing Specification

## Purpose

Canonical chapter/step URL scheme and the locked v1.0 chapter numbering — the single source of truth for chapter route paths across the app shell, prerender, SEO, and edge redirects.

## Requirements

### Requirement: Canonical chapter/step URL scheme

Chapter step pages SHALL use the URL scheme `/chapter/:chapter/step/:step`, where
`:chapter` and `:step` are **unpadded** positive integers (e.g. `/chapter/1/step/2`,
`/chapter/12/step/7`). The legacy `/ch/:c/step/:s` scheme and zero-padded chapter numbers
(e.g. `/ch/01/step/2`) SHALL NOT be used for canonical routes. This scheme is the single
source of truth for chapter route paths, superseding the per-chapter route paths previously
declared in `app-shell`, `static-site-generation`, and `cloudflare-pages-deployment`.

#### Scenario: Step URL uses the unpadded chapter scheme

- **WHEN** the app resolves a chapter step page
- **THEN** its URL is `/chapter/<n>/step/<s>` with `<n>` and `<s>` written without leading zeros
- **AND** no canonical route uses the `/ch/` prefix or zero-padded chapter numbers

#### Scenario: First-step link helper is unpadded

- **WHEN** the landing/chapter-index builds a link to a chapter's first step
- **THEN** the produced href is `/chapter/<n>/step/1` (no `padStart`/zero padding)

#### Scenario: Chapter index route

- **WHEN** a browser requests `/chapter/<n>` (no step)
- **THEN** the router redirects to `/chapter/<n>/step/1`

### Requirement: Locked v1.0 chapter numbering

The application SHALL number chapters per the locked v1.0 journey map: (1) Position, time,
spacetime; (2) The speed budget; (3) Light and information; (4) The ether was wrong; (5) The
same speed of light; (6) Clocks & rulers; (7) Doppler and seeing motion; (8) The twin paradox;
(9) Mass is energy (E=mc²); (10) Rolling the diagram; (11) The center of the Earth; (12) Light
bending around mass. Chapters 1–9 are the flat-spacetime (special relativity) block; chapters
10–12 are the curved-spacetime (general relativity) block. Existing chapters SHALL be
renumbered accordingly (Doppler 5→7, Rolling 6→10, Center 7→11, Bending 8→12); chapters 1–4
keep their numbers.

#### Scenario: Existing chapters reachable at their new numbers

- **WHEN** a reader navigates to the renumbered chapters
- **THEN** Doppler resolves at `/chapter/7`, Rolling at `/chapter/10`, the center-of-the-Earth
  chapter at `/chapter/11`, and light bending at `/chapter/12`
- **AND** chapters 1–4 remain at `/chapter/1`–`/chapter/4`

#### Scenario: Registry, prerender, and SEO reflect the new numbering

- **WHEN** the build enumerates routes for prerender and sitemap generation
- **THEN** every chapter step path uses the new numbering and the `/chapter/...` scheme
- **AND** the chapter registry, `site-routes.ts`, and SEO output all agree on the numbering

### Requirement: Prerender and edge rules track the new scheme

Build-time prerendering, the SPA fallback, and any edge redirects SHALL use the
`/chapter/:chapter/step/:step` scheme. Prerendered HTML files SHALL be emitted under
`dist/apps/lightmatters/browser/chapter/<n>/step/<s>/index.html`.

#### Scenario: Prerendered files use the new path

- **WHEN** the app is built with prerendering enabled
- **THEN** each chapter step emits `chapter/<n>/step/<s>/index.html` (unpadded)
- **AND** no prerendered files are emitted under a `ch/` directory

#### Scenario: Placeholder/index redirects use the new scheme

- **WHEN** an edge or router redirect targets a chapter index or placeholder
- **THEN** it redirects to a `/chapter/<n>/step/1` URL (not `/ch/...`)
