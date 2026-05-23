## Why

Light Matters is in pre-implementation: docs and a visual-design prototype exist, but no Angular code does. Step 1 of the build order in `docs/architecture.md` is the Nx workspace scaffold — every subsequent task (design system, engine, primitives, chapters) depends on it. Until the workspace exists with its module-boundary rules wired up, every new piece of code risks landing in the wrong place and creating coupling we'll have to unwind later.

## What Changes

- Initialize an Nx classic integrated monorepo at the repository root using `create-nx-workspace` with the `angular-monorepo` preset (SCSS, esbuild, `lightmatters` as the initial app name).
- If `create-nx-workspace` refuses to scaffold into the non-empty repo root, scaffold into a temporary subdirectory and move the generated files up to the root, preserving the existing `docs/`, `visual-design-prototype/`, `openspec/`, `CLAUDE.md`, and `.git`.
- Generate the three foundational libraries: `design`, `engine`, `physics` (all under `libs/`).
- Apply Nx tags (`scope:app`, `scope:chapter`, `scope:primitive`, `scope:engine`, `scope:design`, `scope:physics`) and configure `@nx/enforce-module-boundaries` per the dependency rules in `docs/architecture.md`.
- Add the project-wide convention of always invoking Nx with `--tui=false` to repo docs (CLAUDE.md is already updated; reaffirm in README or scripts as appropriate).
- Wire **Tailwind v4** into the `lightmatters` app via `@tailwindcss/postcss` per the [Nx Tailwind 4 + Angular guide](https://nx.dev/blog/setup-tailwind-4-angular-nx-workspace): install `tailwindcss` and `@tailwindcss/postcss`, add `apps/lightmatters/.postcssrc.json`, switch the global styles entry to `.css` (so PostCSS handles `@import "tailwindcss";` directly), and declare `@source` directives for the `libs/design` and `libs/engine` directories so Tailwind scans them for class usage.
- Verify that `nx build lightmatters --tui=false`, `nx lint lightmatters --tui=false`, and `nx test lightmatters --tui=false` succeed on the freshly scaffolded app.

This change does **not** include: design tokens, theme service, fonts, the landing page, the timeline engine, primitives, or any chapter content. Those are subsequent changes building on this scaffold.

## Capabilities

### New Capabilities

- `workspace-structure`: the directory layout, Nx project conventions (one app + libs split by scope), tag-based module-boundary rules, and the standing convention that all `nx` invocations pass `--tui=false`. This capability is the contract that every future change to libraries, apps, or dependencies must satisfy.

### Modified Capabilities

<!-- None: this is the foundational change; no prior specs exist. -->

## Impact

- **Filesystem:** introduces `apps/lightmatters/`, `apps/lightmatters-e2e/`, `libs/design/`, `libs/engine/`, `libs/physics/`, `nx.json`, `package.json`, `tsconfig.base.json`, `eslint.config.mjs`, `.nx/`, `node_modules/` at the repo root. Existing top-level files (`docs/`, `visual-design-prototype/`, `openspec/`, `CLAUDE.md`, `.git`) are preserved.
- **Dependencies:** adds Angular, Nx, ESLint, Jest/Vitest (per preset default), Playwright/Cypress for e2e. No runtime dependencies on `ogl`, fonts, or design tokens yet — those come with later changes.
- **CI/hosting:** out of scope for this change. Cloudflare Pages wiring is deferred until the landing page exists and there's something worth deploying.
- **Tooling docs:** `CLAUDE.md` already documents the `--tui=false` rule; no updates required there. A short README pointer may be added.
