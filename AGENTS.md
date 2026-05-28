# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Light Matters has an Nx integrated monorepo with the `lightmatters` Angular 21 app, foundational libraries (`libs/design`, `libs/engine`, `libs/physics`, `libs/primitives/spacetime-diagram`, `libs/primitives/light-scene`, `libs/primitives/curved-surface`), a design system + landing page at `/`, Chapter 1 Steps 1–4 at `/ch/01/step/{1..4}`, Chapter 2 Steps 1–3 at `/ch/02/step/{1..3}`, Chapter 3 Steps 1–5 at `/ch/03/step/{1..5}`, Chapter 4 Steps 1–5 at `/ch/04/step/{1..5}`, Chapter 5 Steps 1–5 at `/ch/05/step/{1..5}`, Chapter 6 Steps 1–4 at `/ch/06/step/{1..4}`, Chapter 7 Steps 1–6 at `/ch/07/step/{1..6}`, Chapter 8 Steps 1–7 at `/ch/08/step/{1..7}`, and a Playwright `lightmatters-e2e` project. The app builds with SSG (build-time prerender) and deploys to Cloudflare Pages via GitHub integration. The timeline engine, narrator, step chrome, spacetime-diagram, light-scene, and curved-surface (WebGL) primitives are implemented. Next up per `docs/architecture.md` build order: remaining Chapter 1/2 steps, `bind`/`trigger` timeline events, chapter-index, and design-sheet.

Build / test / lint commands:

```bash
nx build lightmatters --tui=false           # build the app
nx test lightmatters --tui=false            # jest unit tests for the app
nx lint lightmatters --tui=false            # ESLint for the app
nx run-many -t lint -p design engine physics --tui=false   # lint all libs
nx affected -t lint test build --tui=false  # only what changed
```

## What this is

Light Matters (lightmatters.app) is an interactive web app that builds intuition for special and general relativity through a guided journey of small, narrated, interactive steps. Heavy inspiration from Lewis Carroll Epstein's *Relativity Visualized*. **Engine-first design:** a small timeline-driven engine with reusable visual primitives (spacetime diagram, expanding light circles, cone / curved-surface, etc.) on which chapters and steps are authored as small TypeScript modules.

### Always-loaded context

- @docs/product.md — vision, audience, chapter structure, aesthetic principles.
- @docs/architecture.md — tech stack, module layout, the timeline engine, build order, locked-in decisions.

### Fetch on demand

- `docs/visual-guidelines.md` — the canonical visual source of truth: tokens, typography, layouts, primitives, motion timings. Read this whenever working on anything that touches visuals.
- `docs/interview-with-the-founder.md` — original founder's interview transcript. Reach for it when you need the narrative voice, intent, or pedagogical context behind a specific chapter idea.
- `visual-design-prototype/` — React/JSX mockup bundle from Claude Design. **The prototype is the source of truth for visual decisions** — when it disagrees with documentation, update the documentation. Per `visual-design-prototype/README.md`: do not render the prototype in a browser unless the user asks.

## Decisions already locked in

See `docs/architecture.md` for full reasoning. Highlights so you don't re-litigate them:

- **Stack:** Angular + **Three.js** (WebGL) + SVG, organized as an **Nx** classic integrated monorepo (`apps/` + `libs/`). Hosted on **Cloudflare Pages** at `lightmatters.app`.
- **CSS:** **Tailwind v4** via `@tailwindcss/postcss`. No `tailwind.config.js`; configuration (theme tokens, `@source` directives for libs) lives in `apps/lightmatters/src/styles.css`. Global styles entry is `.css` (not `.scss`) so PostCSS handles `@import "tailwindcss";` directly; component `.scss` files still work for Sass-only features.
- **Typography:** **EB Garamond** (serif, everywhere readable) + **IBM Plex Mono** (small uppercase "Kicker" labels only). No sans-serif. Ever.
- **Two themes:** light and dark. Both first-class, not an either-or.
- **Two-accent color grammar:** red = body / vector A, blue = body / vector B. Semantic, never decorative.
- **Interactive elements glow.** Diagrams stay quiet linework. The halo is the contract that says "you can grab this."
- **Engine:** custom timeline runner with five event types (`narrate`, `animate`, `wait`, `bind`, `trigger`). `branch` deferred until a step needs it.
- **Tweening:** hand-rolled easings, no GSAP/anime.js wrapper.
- **Spacetime diagram convention:** time vertical, space horizontal.
- **Routing:** per-step URLs (`/ch/:c/step/:s`), standard Angular Router.
- **Visualization lifecycle:** always remount per step. No cross-step persistence; continuity is achieved via continuous starting parameters.
- **Parameter state:** resets on every step entry. Re-visiting a step replays it from defaults.
- **No `prefers-reduced-motion` support.** Motion is the pedagogy here, not decoration.

## Running Nx commands

**Always disable Nx's interactive TUI when invoking any `nx` command.** The TUI breaks non-interactive shells: output is unparseable, the process can hang waiting for keypresses, and you lose the logs you need to reason about the result.

Two mechanisms — pick the right one for the command:

- **Task commands** (`nx build`, `nx test`, `nx serve`, `nx lint`, `nx affected`, `nx run-many`, `nx show`): pass `--tui=false` as a flag.
- **Generators** (`nx g @nx/angular:*`, `nx g @nx/js:*`, …): use the `NX_TUI=false` env var instead. The Angular generator schemas strict-validate flags and will error with `"'tui' is not found in schema"` if you pass `--tui=false` as a flag.

Examples:

```bash
nx build lightmatters --tui=false
nx affected -t lint test build --tui=false
NX_TUI=false nx g @nx/angular:application --name=my-app --directory=apps/my-app
NX_TUI=false nx g @nx/angular:library --name=design --directory=libs/design
```

If you ever see the agent execution hang on an Nx command, suspect a missing TUI disable first.

Also: Angular generators in this Nx/Angular version reject **positional** name arguments. Always pass `--name=<name>` explicitly (e.g. `nx g @nx/angular:application --name=lightmatters`, not `nx g @nx/angular:application lightmatters`).

## Working on this project

- The **engine and primitives** are the leverage points. Time spent making them clean pays back across every chapter.
- Adding a new chapter should not require engine changes — scaffold a feature lib under `libs/features/chapter-NN-<slug>/`, write step files, register routes in `app.routes.ts`.
- When porting from `visual-design-prototype/`, **match the visual output, not the React structure**. Re-decompose into Angular components and directives.
- Physics formulas (Lorentz factor, time dilation, Doppler shift, etc.) go in `libs/physics/` as pure functions. Both diagrams and narration call into the same module.
- The brand sheet from the prototype (`visual-design-prototype/project/brand-sheet.jsx`) should be ported as a `/design-sheet` route — it's the visual-regression canary.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
