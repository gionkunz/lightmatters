# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Light Matters is in **pre-implementation**. Docs and a visual-design prototype exist; the Angular app has not yet been scaffolded. The first engineering task is the project scaffold (step 1 of the build order in `docs/architecture.md`).

There are no build / test / lint commands yet because there is no code. Update this file once the Angular app is initialized.

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

- **Stack:** Angular + **ogl** (WebGL) + SVG, organized as an **Nx** classic integrated monorepo (`apps/` + `libs/`). Hosted on **Cloudflare Pages** at `lightmatters.app`.
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

**Always pass `--tui=false` when invoking any `nx` command.** Nx's interactive TUI breaks non-interactive shells: output is unparseable, the process can hang waiting for keypresses, and you lose the logs you need to reason about the result. This applies to every `nx` invocation — `nx build`, `nx test`, `nx serve`, `nx affected`, `nx run-many`, `nx g`, etc. Example:

```bash
nx build lightmatters --tui=false
nx affected -t lint test build --tui=false
nx g @nx/angular:lib design --tui=false
```

If you ever see the agent execution hang on an Nx command, suspect a missing `--tui=false` first.

## Working on this project

- The **engine and primitives** are the leverage points. Time spent making them clean pays back across every chapter.
- Adding a new chapter should not require engine changes — create a folder under `src/app/chapters/`, write step files, register the chapter.
- When porting from `visual-design-prototype/`, **match the visual output, not the React structure**. Re-decompose into Angular components and directives.
- Physics formulas (Lorentz factor, time dilation, Doppler shift, etc.) go in `src/app/physics/` as pure functions. Both diagrams and narration call into the same module.
- The brand sheet from the prototype (`visual-design-prototype/project/brand-sheet.jsx`) should be ported as a `/design-sheet` route — it's the visual-regression canary.
