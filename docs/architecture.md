# Light Matters — Architecture

This document describes the technical architecture of Light Matters. It assumes the product vision and chapter structure described in `product.md`.

The guiding principle: **build an engine, then write content on it.** Chapters and steps are data and small composed components; the heavy lifting — animation orchestration, narration, rendering primitives — lives in a small, well-defined engine.

## High-level shape

Light Matters is a single-page application. The page is structured as a stack of layers:

1. **Narrator layer** (HTML, on top) — the reading text that appears progressively.
2. **Visualization layer(s)** (SVG and/or WebGL canvases) — the diagrams the narrator refers to.
3. **Control layer** (HTML, near the visualization) — sliders, buttons, and other inputs the user can manipulate.

At any moment, at most two visualization canvases are on screen — typically one 2D diagram (often the recurring spacetime diagram) and one 3D scene (e.g. a gravity-well cone). All of them are orchestrated by the same engine.

```
┌────────────────────────────────────────────────────┐
│  Narrator text (HTML, progressively revealed)      │
├────────────────────────────────────────────────────┤
│                                                    │
│       3D visualization canvas (WebGL)              │
│                                                    │
├────────────────────────────────────────────────────┤
│       2D diagram (SVG or 2D canvas)                │
├────────────────────────────────────────────────────┤
│  [slider]  [slider]  [next →]                      │
└────────────────────────────────────────────────────┘
```

## Tech stack

- **Framework:** Angular. Light Matters is genuinely an application — stateful, interactive, multi-component — not a document site. Angular's component model, dependency injection, and reactive primitives (signals, RxJS) match the orchestration this product needs.
- **3D rendering:** **ogl** (or raw WebGL2 if ogl proves limiting). ogl is shader-first and small, which suits the custom line-art aesthetic better than a full scene-graph library like Three.js. The engine boundary is drawn so the renderer is swappable.
- **2D rendering:** SVG for diagrams. Lightweight, accessible, easy to author, animates smoothly for the small element counts we expect. 2D canvas as a fallback only if a specific diagram demands it.
- **Animation:** custom timeline engine (see below), driven by `requestAnimationFrame`. Interpolation is hand-rolled (linear + a small library of easings) rather than wrapping GSAP/anime.js — the animation system *is* the narrative system, so a thin coordinator is cleaner than bridging an external library's lifecycle.
- **State:** Angular signals for component-local and shared reactive state. A small step-scoped store for the active timeline and its variables.
- **CSS framework:** **Tailwind v4** as the utility layer, configured via PostCSS (`@tailwindcss/postcss`) per [Nx's Tailwind 4 + Angular guide](https://nx.dev/blog/setup-tailwind-4-angular-nx-workspace). No `tailwind.config.js` — Tailwind 4 is CSS-first: `@import "tailwindcss";` plus `@source` directives in the app's global stylesheet name which libraries get scanned for class usage. Design tokens (palette, type, spacing) are declared with `@theme` inside the same stylesheet so they're available as both Tailwind utilities and CSS custom properties. Component-scoped styles can still use SCSS when needed for nesting / mixins; the global styles entry is plain CSS so PostCSS handles the Tailwind directives directly.
- **Typography:** **EB Garamond** for all body, narration, and display text. **IBM Plex Mono** for axis labels, chapter/step marks, and the small "Kicker" uppercase labels. Both served as web fonts.
- **Inline math:** **MathJax v4** (TeX input → CHTML output). Authors write `$...$` LaTeX directly in narrate strings; MathJax loads lazily from `/mathjax/` on first inline formula (not in the main bundle). Formulas render in MathJax's math font — distinct from EB Garamond narration.
- **Monorepo / tooling:** **Nx** in classic **integrated monorepo** mode (`apps/` + `libs/`, single `package.json`, Nx-managed Angular projects). Scaffolded with `create-nx-workspace` using the `angular-monorepo` preset. The integrated layout gives us enforced module boundaries between engine / primitives / chapters via the `@nx/enforce-module-boundaries` lint rule, `nx affected` graphs for fast CI, generators for new chapters and primitives, and a single source for tooling versions.
- **Build:** Nx-driven Angular build. Static output deployed as-is.
- **Hosting:** **Cloudflare Pages**, custom domain `lightmatters.app`.

Deliberate non-choices:

- No backend at first. The entire product is a static site. If we later need analytics, accounts, or saved progress, those are additive and live behind a small API.
- No SSR. The product is a fully client-rendered app; SEO is satisfied by a minimal landing page with hand-written meta content.
- No state management library beyond Angular signals. The engine itself is the source of truth for what is animating; UI components subscribe to it.

## Module layout

Nx workspace, integrated Angular monorepo. One deployable app, many libraries.

```
lightmatters/                          ← workspace root
  apps/
    lightmatters/                      ← minimal app shell — no features live here
      src/
        app/
          app.config.ts                ← root providers
          app.routes.ts                ← root routes; every page is lazy-imported from a feature lib
          app.component.ts             ← layout chrome: wordmark, theme toggle, <router-outlet/>
        main.ts
        styles.css                     ← Tailwind entry + @theme tokens + @source directives
    lightmatters-e2e/                  ← Playwright end-to-end tests

  libs/
    design/                            ← tokens, ThemeService, brand components, lmInteractive, MathJaxService
    engine/                            ← timeline runner, narrator, step frame, playback bar, step-page host
    physics/                           ← pure functions: lorentz, time-dilation, doppler, geodesics
    primitives/
      spacetime-diagram/               ← the reusable 2D spacetime diagram (time vertical)
      light-circle/                    ← expanding wavefront primitive
      velocity-vector/                 ← (planned) twin-vector pair; single vector lives in spacetime-diagram for now
      curved-surface/                  ← cylinder ↔ cone ↔ gravity-well surface (3D)
      worldline-tracer/                ← animated point + fading trail
      wireframe-body/                  ← line-rendered sphere / planet
    features/                          ← every user-facing routable area is a feature lib
      landing/                         ← /
      chapter-index/                   ← /chapters
      design-sheet/                    ← /design-sheet (dev-only)
      chapter-01-position-time/        ← one feature lib per chapter (lazy-loaded)
      chapter-02-speed-budget/
      ...

  nx.json, package.json, tsconfig.base.json, eslint.config.mjs, ...
```

### The app shell and feature libraries

The `apps/lightmatters` project is **intentionally minimal**. It contains:

- bootstrap (`main.ts`, `app.config.ts`),
- the root routes file (`app.routes.ts`) — nothing but `loadChildren` entries pointing at feature libs,
- the layout chrome in `app.component.ts` — wordmark, theme toggle, `<router-outlet/>`, and any persistent shell UI composed from `libs/design` brand components.

**No features live in the app.** No page templates, no chapter content, no route handlers beyond the lazy-import wiring. If something has its own URL, it belongs in a feature lib.

Every user-facing area is a **feature library** under `libs/features/`. A feature lib exposes a `Routes` array as its public API, which the app shell lazy-imports:

```ts
// libs/features/chapter-01-position-time/src/lib/chapter-01.routes.ts
import type { Routes } from '@angular/router';

export const chapter01Routes: Routes = [
  { path: '', component: ChapterShellComponent, children: [
    { path: 'step/:step', component: StepPageComponent },
    { path: '', redirectTo: 'step/1', pathMatch: 'full' },
  ]},
];

// apps/lightmatters/src/app/app.routes.ts
export const appRoutes: Routes = [
  { path: '',            loadChildren: () => import('@lm/feature-landing').then(m => m.landingRoutes) },
  { path: 'chapters',    loadChildren: () => import('@lm/feature-chapter-index').then(m => m.chapterIndexRoutes) },
  { path: 'design-sheet',loadChildren: () => import('@lm/feature-design-sheet').then(m => m.designSheetRoutes) },
  { path: 'ch/01',       loadChildren: () => import('@lm/feature-chapter-01-position-time').then(m => m.chapter01Routes) },
  // ...
  { path: '**',          redirectTo: '' },
];
```

**Chapters are a category of feature.** Each chapter is a feature lib (`feature-chapter-NN-<slug>`); landing, chapter-index, and design-sheet are non-chapter features. They follow the same rules: own folder, own dependency graph, own lazy chunk, route config as public API. Adding a chapter and adding a non-chapter page are the same operation.

### Dependency rules

Enforced via `@nx/enforce-module-boundaries` with Nx tags:

| Tag                  | May depend on                                                       |
|----------------------|---------------------------------------------------------------------|
| `scope:app`          | `scope:feature`, `scope:design` (shell chrome only)                 |
| `scope:feature`      | `scope:engine`, `scope:primitives`, `scope:physics`, `scope:design` |
| `scope:primitive`    | `scope:engine`, `scope:physics`, `scope:design`                     |
| `scope:engine`       | `scope:design`                                                      |
| `scope:design`       | — (leaf)                                                            |
| `scope:physics`      | — (leaf, pure functions only)                                       |

Features never depend on each other. Primitives never depend on features. The app depends on features only through dynamic `loadChildren` imports (not on the feature's internal symbols). The dependency graph stays a clean DAG, which keeps `nx affected` builds fast and prevents accidental coupling.

### Why a lib per feature

Each feature is small enough to be a single lib, and giving each its own project gives us: lazy-loading via the Angular router for free, isolated dependency graphs (a content edit in chapter 4 doesn't invalidate the build of chapter 2), and a natural seam for generators (`nx g chapter <n>-<name>` scaffolds a feature lib + route config + first step).

If a feature grows complex enough to need internal sub-libs, split it then; start coarse.

## The timeline — the heart of the engine

The most important architectural decision in Light Matters is treating animation and narration as a **single declarative timeline**. Every step is a timeline. The timeline orchestrates:

- when narrator text appears,
- when animations on the visualizations play,
- when control is handed to the user,
- how user input resumes or branches the timeline,
- when the step is considered "complete" and ready to advance.

### Conceptual model

A timeline is a sequence of **events** on a logical time axis. Each event has a start time (or a start condition), a duration (or an end condition), and a payload that says what should happen. Events can be:

- **`narrate`** — reveal a chunk of narrator text, typewriter style.
- **`animate`** — drive a property on a primitive from value A to value B over a duration with an easing.
- **`wait`** — pause the timeline until a condition is met (user clicks next, slider crosses a threshold, animation reaches a keyframe).
- **`bind`** — connect a control (e.g. a slider) to a property on a primitive, so user input drives it directly.
- **`trigger`** — fire a follow-up timeline (e.g. a re-animation after the user perturbed the system).

A `branch` event (choose between sub-timelines based on state) is **deferred** until an actual step demands it. Every chapter outlined in `product.md` is authorable with the five events above.

Events are **data**, not code. A step file looks something like:

```ts
export const step: Step = {
  id: 'speed-budget-intro',
  title: 'The speed budget',
  visualizations: ['spacetime-diagram'],
  timeline: [
    { at: 0,    narrate: 'Every object moves through spacetime at the same speed.' },
    { at: 1.5,  animate: { target: 'vector.angle', from: 0,    to: 90, duration: 2 } },
    { wait:     { for: 'animationDone' } },
    { narrate:  'When you stand still, all of that speed flows through time.' },
    { bind:     { control: 'slider.angle', to: 'vector.angle', range: [0, 90] } },
    { wait:     { for: 'userAdvance' } },
  ],
};
```

This is illustrative, not final. The point is that timelines are serializable, inspectable, and authorable without writing imperative animation code each time.

### The runtime

A `TimelineRunner` is a small state machine that:

1. Walks the event list in order.
2. For time-based events, schedules them against `requestAnimationFrame`.
3. For wait conditions, subscribes to the relevant signal (animation completion, user input) and pauses progression.
4. Exposes reactive playhead state — `waitingForUser`, `progress`, `elapsedMs`, `beatMarkers` — so step chrome (playback bar, footer controls) can react.

**Narrate events** reveal text character by character, then hold for a configurable **read pause** (`pauseAfter`, default 4000ms) before advancing. Space or skip during the read pause jumps past the hold. The read pause is **skipped automatically** on the narrate beat immediately before an `userAdvance` wait — sliders and other exploration controls unlock as soon as that beat finishes typing.

**Inline LaTeX in narration.** Narrate `text` fields may contain `$...$` delimiters for inline math. The engine parses these into text and math segments (`parseNarrateText` in `libs/engine`). Text segments reveal letter-by-letter as before; math segments reveal atomically (one typing-unit block). Each math block counts as five character-units for timing. `LmNarratorComponent` typesets revealed math via `MathJaxService` (`libs/design`), which lazy-loads `tex-chtml-nofont.js` from `/mathjax/` and calls `MathJax.typesetPromise()` per formula. Plain strings without `$` behave unchanged and never load MathJax.

Example:

```ts
{ type: 'narrate', text: 'The Lorentz factor is $\\gamma = \\frac{1}{\\sqrt{1-v^2/c^2}}$ — watch how it grows.' }
```

**Playback controls** (top `LmPlaybackBar` in the step frame):

- **Pause / resume** — freezes mid-narration or mid-tween.
- **Rewind** — resets animatable targets to their `initial` values and replays from the first event.
- **Fast-forward** — same as skip: complete in-progress work instantly and jump to the next `wait` boundary.

Crucially, the runner exposes a **skip** operation: a user pressing Space at a wait boundary (or during narration) fast-forwards to the next wait/interaction boundary, completing intermediate animations instantly. This makes the linear narrative skimmable without breaking state.

### Why a custom timeline (rather than GSAP/Anime.js/etc.)

Off-the-shelf animation libraries handle the "tween a property" part well, and we may use one internally. What they do not handle is the *narrative + interaction + animation* combination: pausing at a beat for user input, binding sliders into the animation graph, branching on user choices, and serializing the whole thing as data. That coordination is the engine's job.

We can absolutely delegate the actual interpolation of numeric properties to a library; the timeline runner is a coordinator on top.

## Rendering primitives

The product is built from a small set of reusable visual components. Each primitive:

- Has a clear set of animatable properties (e.g. the velocity vector has `angle`, `magnitude`, `color`).
- Exposes those properties through a stable interface the timeline can target.
- Renders consistently with the project's line-art aesthetic.
- Can appear in either a 2D (SVG) or a 3D (WebGL) context where appropriate.

### The spacetime diagram

The single most important primitive. It is essentially:

- An axis system: **time vertical, space horizontal** (matches Epstein and physics tradition).
- A configurable viewport (zoom, pan, axis ranges).
- A set of slots into which other primitives (vectors, light circles, worldlines, points) can be inserted.
- Optionally, a "fold" transform that can morph the diagram from a flat plane into a cylinder or cone — this is the bridge between Chapter 1's flat diagram and Chapter 3's cone geometry. The 2D and 3D renderings of the spacetime diagram should be the **same conceptual object**, just rendered differently.

**Incremental variants.** Chapter 1 grows the diagram one concept at a time:

| Variant | Chapter 1 step | What it shows |
|---------|----------------|---------------|
| `position-only` | Step 1 | Horizontal spatial axis, movable point — no time axis yet |
| `time-only` | Step 2 | Vertical time axis, movable point — no space axis yet |
| `full` | Step 3 | Both axes, light cone, worldline segment from origin to `(position, time)` |
| `single` | Step 4 | Both axes, light cone, fixed-length **velocity vector** from origin; angle driven by `velocity` (v/c, 0 = pure time, 1 = light cone) |

Steps 5–6 will extend the vocabulary further. The `pair` twin-vector variant (Chapter 2 speed-budget comparison) and decorative vector swing animation remain deferred. See `visual-guidelines.md` §8 for stroke, arrowhead, and light-cone conventions.

### The curved surface

For the gravity-well chapter. A parametric surface that can smoothly interpolate between cylinder, cone, and bezier-curved well shapes by adjusting a few parameters. Rendered as a wireframe in WebGL.

### Light circles, vectors, worldlines, wireframe bodies

Smaller primitives, each with its own folder, its own test surface, and its own minimal API.

## Rendering style

The sketch / line-art look is achieved via:

- For SVG: thin strokes, no fills, hand-tuned line weights, deliberate use of dashed/dotted styles.
- For WebGL: a small library of line-based shaders. Wireframe geometry rendered with anti-aliased lines (likely instanced quads to avoid `gl.LINES` quality issues). Bodies are silhouettes with a wireframe overlay rather than shaded solids.
- All visual layers read from the same design tokens (see below), so theme inversion (light/dark) is a single token swap. WebGL shaders receive `ink` and `paper` as uniforms updated from the active theme.

## Design system

The visual design — palette tokens, typography roles, two-color accent grammar, the "interactive elements glow" rule, brand marks, animation timings, and per-primitive specs — is documented in detail in **[`visual-guidelines.md`](./visual-guidelines.md)**. The authoritative source for all visual decisions is the prototype bundle at [`visual-design-prototype/`](../visual-design-prototype/).

Architecture-relevant summary:

- **Two themes** (light + dark), both first-class. Theme switch animates over 0.4s.
- **Tokens** live in `libs/design/src/lib/tokens.ts` as a typed object. Projected onto `<html>` as CSS custom properties (`--lm-paper`, `--lm-ink`, `--lm-accent-1`, etc.) and re-bound into WebGL shader uniforms whenever the theme changes.
- **A `ThemeService`** exposing a signal for the active theme + a `toggle()` method. Persists to `localStorage`. Default `light`.
- **An `lmInteractive` directive** implements the shared idle/hover/glow treatment so every interactive element behaves consistently. Diagrams never use it.
- **A `MathJaxService`** lazy-loads MathJax v4 for inline LaTeX in narration. On `build` and `serve`, a `copy-mathjax` target copies `node_modules/mathjax` to `apps/lightmatters/public/mathjax/` (gitignored); the main bundle only contains the small loader service.
- **Two type families** — EB Garamond (serif, everywhere readable) and IBM Plex Mono (Kicker labels only). Loaded as web fonts with `font-display: swap`.
- **The prototype's component files** (`landing.jsx`, `chapter-index.jsx`, `step-ui.jsx`, `primitives.jsx`, `brand-sheet.jsx`) are a **feature inventory**, not a folder structure. Re-decompose into Angular idioms.
- **Brand sheet as a route** — port `brand-sheet.jsx` to a `/design-sheet` route as a visual-regression canary.

## Step and chapter authoring

A step is a small TypeScript module exporting a `Step` object. It declares:

- which visualization primitives it uses,
- the layout (which primitive goes where on screen),
- the timeline (the narrative + animations + interactions),
- any controls (sliders, toggles) and their initial values.

A chapter is a small module exporting a `Chapter` object: metadata (title, blurb), an ordered list of steps, and a `Routes` array (the lib's public API).

The chapter index feature reads from a central chapter registry (a small typed list, one entry per chapter feature). Adding a chapter is: `nx g chapter <n>-<name>` to scaffold the feature lib, write step files, register the chapter in the registry, add one `loadChildren` line to `app.routes.ts`. No engine changes required.

### Visualization lifecycle

Visualizations **mount fresh on every step entry and unmount on step exit**. There is no cross-step persistence. This keeps the engine simple and each step self-contained: the author knows exactly what state they start with, and the runtime never has to reconcile a stale diagram against a new step's expectations.

When a chapter wants the "morph the same diagram across steps" effect (chapter 3's rolling-the-paper sequence is the obvious case), the author achieves it by **using the same primitive with continuous starting parameters across consecutive steps** — the visual continuity is in the parameters and the entry animation, not in shared component instances.

## Physics utilities

Physical formulas (Lorentz factor, time dilation, Doppler shift, geodesic paths on the curved surface, etc.) live in the `libs/physics` library as **pure functions**:

```ts
export const lorentz = (vOverC: number) => 1 / Math.sqrt(1 - vOverC * vOverC);
export const timeDilation = (vOverC: number) => 1 / lorentz(vOverC);
export const dopplerFactor = (vOverC: number, approaching: boolean) => ...;
```

Both rendering primitives and narration call into this module. Narration may also use inline `$...$` LaTeX (rendered by MathJax) for formulas before or alongside numeric readouts from `physics`. It is a utility module, not an enforced architectural layer — if it grows enough to warrant signal-based reactivity or per-step physical state, promote it later.

## Routing

Per-step URLs: `/ch/:chapter/step/:step`, plus `/` (landing), `/chapters` (journey map), and `/design-sheet` (dev-only). Routing uses the standard Angular Router so browser back/forward, deep links, and bookmarks work out of the box. Each step route is the canonical share-able URL; a user can send a friend a link to a specific beat in the journey.

**Route ownership is distributed.** The app shell's `app.routes.ts` declares one top-level entry per feature, each using `loadChildren` to import that feature's exported `Routes` array. The feature owns its own URL space below its mount point — child routes, redirects, route-level resolvers, route-scoped providers all live in the feature lib. The shell never knows what `step/:step` means; chapter features do.

On invalid **app-level** routes, redirect to `/` (landing). Unknown **step numbers within a chapter** are handled by the chapter feature — e.g. `/ch/01/step/99` shows a brief not-found message with links back to Step 1 or home.

## State and persistence

- **Per-step state** lives in the timeline runner and a small reactive store. It **resets every time the user enters a step** — including when they navigate back. Re-visiting a step replays it from its initial state. Predictability beats preservation here; the journey is the same every time you read it.
- **Progress** (which chapters / steps the user has completed, and the furthest point they've reached) is persisted to `localStorage` so the user can resume the journey across sessions.
- **No accounts** in v1. If we later add sync across devices, progress is the only thing worth syncing initially.

## Performance considerations

- Lazy-load every feature. The feature-per-lib layout makes this the default — each `libs/features/*` is a route-level lazy chunk via `loadChildren`. The shell bundle stays tiny because no feature code ships with it.
- **MathJax is lazy-loaded separately.** The ~800 KB MathJax bundle lives at `/mathjax/` and loads only when a step first typesets inline math — not on landing or text-only steps.
- WebGL contexts are expensive — share one context across the app if possible, swap scenes within it as the user moves between steps.
- Throttle `requestAnimationFrame` work when a step is paused at a wait condition.
- Pre-compile shaders for the project-wide line primitives at startup.
- `nx affected:build` and `nx affected:test` in CI so a content edit in one chapter doesn't rebuild or re-test the whole tree.

## Accessibility

The product is fundamentally visual, so it will not be fully accessible to blind users. Within that constraint:

- All narrator text is real DOM text, screen-reader-accessible.
- Keyboard navigation supports advance, skip, and back without requiring a pointer.
- High-contrast mode is the default by design (pure black on white, or its dark-mode inversion).

**No reduced-motion concession.** Motion in Light Matters is not decoration — it is the pedagogy. Vector swings, expanding wavefronts, the cone-fall trajectory, the typewriter narration: each animation *is* the explanation. Honoring `prefers-reduced-motion` by stopping the animations would leave a user with an empty diagram and no path to the intuition. Readers who cannot tolerate motion are, candidly, not in the target audience for this product.

## Mobile

V1 targets desktop. Mobile users get a top-of-page banner suggesting desktop for the best experience, but the app still renders. Some interactions (dragging vector handles, fine slider control) will degrade on small screens. Steps that are pure read + click should still work end-to-end on a phone.

Fully responsive interaction design is deferred past v1.

## Testing strategy

- **Engine unit tests** for the timeline runner: event ordering, skip semantics, wait-condition handling, branching.
- **Primitive snapshot tests** for visual components — render a deterministic frame and diff the SVG / canvas pixels against a golden image.
- **Step smoke tests** — run each step's timeline to completion at fast speed in a headless browser and assert no errors.
- Manual sign-off for the *feel* of each step. Tests can verify correctness, but pacing and beauty are human judgments.

## Build, deploy, infrastructure

- Static build via `nx build lightmatters`.
- Hosted on **Cloudflare Pages**, custom domain `lightmatters.app`.
- A single deployment target initially.
- No backend, no database, no server-rendered routes in v1.
- CI runs `nx affected -t lint test build` on every push; full `nx run-many -t ...` on main.

## Risks and open questions

- **Aesthetic feasibility in WebGL.** Achieving the "sketch on paper" look in WebGL with consistently good antialiased lines is non-trivial. Prototype the look on a single primitive (the wireframe sphere or the cone) before committing to the engine work.
- **Timeline expressiveness.** It is hard to know whether the five-event timeline data model is rich enough until we author several real steps. Plan to iterate the schema after building Chapter 1 end-to-end. `branch` is the most likely addition.
- **Performance on low-end hardware.** WebGL line rendering plus typewriter text plus reactive controls can be heavy. Performance budgets per step will need real measurement.
- **Author ergonomics.** If writing a step ends up requiring a lot of boilerplate, the content pipeline will bottleneck. The engine's success is partly measured by how short a step file can be.
- **WebGL context strategy.** One shared context across the app vs. per-canvas. Start per-canvas; consolidate only if perf demands.

## Build order (engineering plan, condensed)

1. ~~**Nx workspace scaffold.**~~ Done.
2. ~~**Design system foundation.**~~ Done — tokens, themes, Wordmark, Kicker, Button, ThemeToggle, `lmInteractive`.
3. ~~**App shell.**~~ Done — wordmark, theme toggle, lazy routes.
4. ~~**Landing feature**~~ at `libs/features/landing`. Done.
5. ~~**The `TimelineRunner`**~~ in `libs/engine` with `narrate`, `animate`, `wait`, skip, read pause, pause/resume, rewind, and progress tracking. Done.
6. ~~**The `Narrator` component**~~ in `libs/engine` — per-letter fade-in reveal driven by the timeline. Done.
7. ~~**End-to-end step + spacetime diagram primitive.**~~ Done as Chapter 1 Step 1 (`position-only` variant + `LmSlider`).
8. **Chapter 1** as `libs/features/chapter-01-position-time` — Steps 1–4 authored (`position-only` → `time-only` → `full` → `single` / speed budget); steps 5–6 remain. Step-to-step footer navigation wired through step 4. Add an `nx g chapter` generator while authoring the rest so chapters 2+ are one command.
9. ~~**Inline math in narration.**~~ Done — `$...$` LaTeX in narrate strings, MathJax v4 lazy load, atomic math reveal in typewriter.
10. **Chapter-index and design-sheet features** at `libs/features/chapter-index` and `libs/features/design-sheet`, both lazy-loaded from the shell.
11. **WebGL rendering** — wireframe aesthetic prototyped on a sphere in ogl, then `libs/primitives/curved-surface` for the cone visualizations.
12. **Expand the timeline event set** (`bind`, `branch`, `trigger`) as Chapter 2 and Chapter 3 demand them.
13. **Chapter 2, then Chapter 3.** Chapter 2 (speed budget) and the bridge step are authored. Chapter 3 (light and information) is authored on a new `libs/primitives/light-scene` primitive — top-down 2-D space, expanding pulse circles, no time axis — alongside `@lm/physics` reception helpers (`pulseReachesStationary`, `pulseReachesMoving`). The Epstein spacetime diagram returns in Chapter 6. From here, further chapters are mostly content on top of `light-scene`, `spacetime-diagram`, and (later) `curved-surface`.
