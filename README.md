# Light Matters

An interactive web app that builds intuition for special and general relativity through a guided journey of small, narrated, interactive steps. Live at [lightmatters.app](https://lightmatters.app).

## Quick start

Requires **Node 22+**.

```bash
npm install
nx serve lightmatters --tui=false
```

Open `/` for the landing page or `/ch/01/step/1` for Chapter 1 · Step 1.

## Workspace

Nx integrated monorepo (`apps/` + `libs/`):

| Project | Path | Role |
|---|---|---|
| `lightmatters` | `apps/lightmatters` | App shell — routes, theme bootstrap, `<router-outlet/>` |
| `design` | `libs/design` | Tokens, ThemeService, brand components (`LmSlider`, etc.) |
| `engine` | `libs/engine` | Timeline runner, narrator, step frame, playback bar |
| `physics` | `libs/physics` | Pure physics functions |
| `spacetime-diagram` | `libs/primitives/spacetime-diagram` | SVG spacetime diagram (`position-only` variant shipped) |
| `feature-landing` | `libs/features/landing` | Marketing landing page at `/` |
| `feature-chapter-01-position-time` | `libs/features/chapter-01-position-time` | Chapter 1 at `/ch/01` |

Import aliases use the `@lm/*` prefix (see `tsconfig.base.json`).

## Commands

```bash
nx build lightmatters --tui=false
nx test engine --tui=false
nx lint lightmatters --tui=false
nx affected -t lint test build --tui=false
```

Always pass `--tui=false` on Nx task commands in non-interactive shells.

## Documentation

- [`docs/product.md`](docs/product.md) — vision, audience, chapter structure
- [`docs/architecture.md`](docs/architecture.md) — tech stack, engine, module layout, build order
- [`docs/visual-guidelines.md`](docs/visual-guidelines.md) — design tokens, typography, motion
- [`AGENTS.md`](AGENTS.md) — guidance for AI coding agents
