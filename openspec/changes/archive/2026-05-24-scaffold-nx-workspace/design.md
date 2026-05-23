## Context

The repository currently contains only documentation (`docs/`, `CLAUDE.md`), the visual-design prototype (`visual-design-prototype/`), the OpenSpec workspace (`openspec/`), and a `.git` directory. No Angular code, no `package.json`, no Nx workspace. The `docs/architecture.md` build order calls for an Nx classic integrated monorepo as step 1.

Two practical constraints shape this scaffold:

1. **`create-nx-workspace` will refuse to write into a non-empty target directory.** Our root is non-empty, so we cannot point it at `.`.
2. **The scaffolded files must end up at the repository root**, not inside a nested folder, so that `nx.json`, `package.json`, `apps/`, and `libs/` sit alongside `docs/`, `openspec/`, `visual-design-prototype/`, and `CLAUDE.md`.

## Goals / Non-Goals

**Goals:**

- Stand up an Nx classic integrated monorepo at the repository root with the `lightmatters` Angular app and three foundational libs (`design`, `engine`, `physics`).
- Encode the dependency rules from `docs/architecture.md` via Nx tags and `@nx/enforce-module-boundaries`, so future code lands in the right project automatically.
- Leave the existing top-level content (`docs/`, `openspec/`, `visual-design-prototype/`, `CLAUDE.md`, `.git`) untouched and functional.
- Verify the freshly-scaffolded app builds, lints, and tests cleanly before declaring done.

**Non-Goals:**

- No design tokens, fonts, theme service, or `lmInteractive` directive — that's the next change.
- No landing page, routing, narrator, timeline engine, primitives, or chapter content.
- No CI configuration or Cloudflare Pages deployment wiring.
- No changes to `ogl`, WebGL, or any rendering library (deferred until primitives exist).
- No README authorship beyond what `create-nx-workspace` generates.

## Decisions

### 1. Scaffold via a temporary subdirectory, then move files up

`create-nx-workspace` writes into a target folder that must be empty (or it complains and aborts). We will:

1. Run the modern multi-step scaffold (see decision 2) inside a temp `lightmatters-tmp/` subdirectory.
2. Move every file and directory (including dotfiles like `.gitignore`, `.editorconfig`, `.prettierrc`, `.vscode/`, and the wholesale `apps/`, `libs/`, `node_modules/`) from `lightmatters-tmp/` into the repo root, **with conflict resolution favoring the existing file** for anything that already exists at the root (notably our `CLAUDE.md`).
3. Delete the now-empty `lightmatters-tmp/` directory.
4. Run `git status` to inspect what was added and confirm no pre-existing files were clobbered.

**Alternative considered:** running `create-nx-workspace` with `--cwd=.` or similar. Rejected: the tool has no flag that bypasses the non-empty check, and pre-creating files inside `lightmatters-tmp` to merge them doesn't avoid the underlying restriction.

**Alternative considered:** initializing the workspace manually (handwritten `nx.json`, `package.json`, `tsconfig.base.json`, etc.). Rejected: brittle, drifts from Nx's expected defaults, and we'd lose the value of preset-driven scaffolding.

### 2. Scaffold via `nrwl/angular-template`, then delete the demo projects and generate ours

**Why this path:** In Nx 22.7.x, `create-nx-workspace` has no flag combination that produces a clean Angular-compatible monorepo with our app name. Every preset/template option falls into one of three buckets:

- **`nrwl/angular-template`** (what `--preset=angular-monorepo` remaps to): Angular-compatible config, but pre-baked with a `shop` Angular app + an `api` Node app + their e2e projects.
- **`nrwl/empty-template`** (what `--preset=apps`, `--preset=ts`, etc. remap to): clean, but uses TypeScript project references / npm workspaces (`packages/*` layout, `composite: true`, `customConditions: ["@org/source"]`). The `@nx/angular` plugin explicitly **refuses to install** into this setup with the error: *"The Angular framework doesn't support a TypeScript setup with project references."* Flags like `--no-workspaces` and `--useProjectJson=true` are silently ignored when the resolved scaffold is template-driven.
- **`nrwl/typescript-template`**: same TS-references blocker as empty, no Angular included.

Empirically verified on Nx 22.7.x. So the path forward is: take the Angular-compatible template, throw away its demo projects, generate ours fresh.

**The path:**

1. `npx create-nx-workspace@latest lightmatters-tmp --template=nrwl/angular-template --packageManager=npm --nxCloud=skip --interactive=false --skipGit=true` — produces an Angular-compatible Nx workspace with the demo `shop` + `api` content.
2. Inventory and delete the demo projects: `apps/shop/`, `apps/shop-e2e/`, `apps/api/`, plus any demo libraries the template generates under `libs/`. Use `nx g @nx/workspace:remove` per project so Nx cleans up cross-project references (root tsconfigs, project graph entries) rather than leaving dangling pointers from a raw `rm -rf`.
3. Handle agent-tooling file collisions: the template drops `CLAUDE.md`, `AGENTS.md`, `opencode.json`, and `.claude/`, `.cursor/`, `.codex/`, `.gemini/`, `.opencode/`, `.agents/` directories at its root. Our repo already has `CLAUDE.md`, `.claude/`, `.cursor/`. During the move-to-root step, the template's versions are **discarded** in favor of ours — we will, however, read the template's `CLAUDE.md` once and copy any Nx-specific tips worth keeping into our own `CLAUDE.md` (and delete the template's after).
4. Generate our app from scratch: `npx nx g @nx/angular:application lightmatters --directory=apps/lightmatters --bundler=esbuild --style=scss --routing=true --ssr=false --e2eTestRunner=playwright --unitTestRunner=jest --tags=scope:app --tui=false`. This also produces `apps/lightmatters-e2e/`.
5. Generate the three foundational libraries: `npx nx g @nx/angular:library design --directory=libs/design --tags=scope:design --tui=false`, and similarly for `engine` and `physics`.

**Trade-offs:**

- The cleanup step is mechanical and bounded — `nx g @nx/workspace:remove` per demo project + a list of files/dirs to drop.
- First commit will look like a regular Nx Angular workspace with our exact app + libs, no demo cruft.
- We're on the path Nx itself ships and maintains, so we inherit fixes and upgrades without re-litigating the scaffold.
- `--skipGit=true` is essential because the temp directory is inside our existing repo; we don't want a nested git init.

**Alternative considered:** patch `nrwl/empty-template` output (strip `workspaces` field, `composite`, `customConditions`, TS references) and then run `nx add @nx/angular`. Rejected: fragile — we'd be guessing at what `@nx/angular`'s init step requires, and the patched state is unsupported (no docs say "this is OK"). High risk of subtle breakage that only surfaces during build or test.

**Alternative considered:** pin to an older Nx (e.g. `npx create-nx-workspace@19 ... --preset=angular-monorepo`) where the preset was a real preset, not a template remap. Rejected: locks us to a stale major; we'd want to upgrade soon anyway and inherit this same migration. Better to face the modern reality now.

### 3. Generate `design`, `engine`, `physics` as the only initial libs

These three are called out in the build order as the foundational libs. We generate them now, even though they will be empty stubs, so that:

- The Nx tag rules can be applied uniformly from the start.
- The `@nx/enforce-module-boundaries` lint rule has real targets to validate against.
- Subsequent changes can `nx g component` / `nx g service` directly into existing libs without each change re-doing scaffolding.

Primitives, chapters, and the e2e-only libs are deferred. We'll generate them as the relevant changes land.

### 4. Tag rules wired up at scaffold time

We assign tags to each generated project in its `project.json` (or in `nx.json` if Nx generators prefer that location for the version we get):

- `apps/lightmatters` → `scope:app`
- `apps/lightmatters-e2e` → `scope:app` (e2e is part of the app surface)
- `libs/design` → `scope:design`
- `libs/engine` → `scope:engine`
- `libs/physics` → `scope:physics`

The `@nx/enforce-module-boundaries` rule in `eslint.config.mjs` (or `.eslintrc.json`, depending on Nx version) is then configured with the dependency matrix from `docs/architecture.md`. Even though no chapter or primitive libs exist yet, we declare the `scope:chapter` and `scope:primitive` entries in the rule config so future generators slot in without anyone having to remember to update the rule.

### 5. `--tui=false` is a documented convention, not an enforced wrapper

`CLAUDE.md` already documents the rule. We do **not** wrap `nx` in a shell alias or script that injects `--tui=false`, because:

- That hides the real binary from anyone reading scripts or CI configs.
- The convention applies primarily to non-interactive contexts (agents, CI); a human running `nx` locally in a real terminal may prefer the TUI.

If a future change introduces CI, the CI scripts will pass the flag explicitly. For now, no automation is required.

### 6. Tailwind v4 via PostCSS, configured CSS-first (no `tailwind.config.js`)

We wire Tailwind v4 into the `lightmatters` app per [Nx's Tailwind 4 + Angular guide](https://nx.dev/blog/setup-tailwind-4-angular-nx-workspace):

1. `npm install -D tailwindcss@^4 @tailwindcss/postcss@^4` — Tailwind's runtime + the PostCSS plugin.
2. Create `apps/lightmatters/.postcssrc.json` registering the `@tailwindcss/postcss` plugin. Angular's `@angular/build:application` executor picks up the file automatically.
3. Switch the app's global styles entry from `styles.scss` to `styles.css` and update `apps/lightmatters/project.json`'s `styles` array accordingly. The first line of `styles.css` is `@import "tailwindcss" source("./app");` followed by `@source` directives for the libs that contain templates with Tailwind classes (`libs/design`, `libs/engine`).
4. Component-scoped styles (e.g., `app.component.scss`) remain `.scss` so Sass features (nesting, mixins) are available where they matter; only the global entry has to be `.css`.

**Why `.css` for the global entry, not `.scss`:** Angular's build pipeline runs Sass *before* PostCSS. `@import "tailwindcss";` in a `.scss` file would be intercepted by Sass, which tries to resolve it as a Sass partial (`_tailwindcss.scss` or `tailwindcss.scss`) and fails because that doesn't exist. Renaming the global entry to `.css` lets PostCSS handle the directive directly.

**Why no `tailwind.config.js`:** Tailwind v4 is CSS-first. Theme tokens are declared via `@theme` inside the same stylesheet; `@source` directives control which files get scanned for class usage. There's no separate JS config to maintain — see the Tailwind v4 docs.

**Trade-offs:**

- The `@source` list has to be maintained as new libs are added that contain templates with Tailwind classes (chapters, primitives). This is a small recurring cost; we'll add a step to the eventual `nx g chapter` generator to append the new lib to the `@source` list automatically.
- Splitting `styles.css` (Tailwind) from per-component `.scss` files (Sass-only) is mildly awkward, but unavoidable given the Sass-vs-PostCSS ordering. Most projects end up with this same split.

**Alternative considered:** keep `styles.scss` and write `@use 'tailwindcss';` instead. Rejected: same problem — `@use` is also Sass-only and tries to resolve as a Sass module before PostCSS sees the file.

**Alternative considered:** stick with Tailwind v3 + a `tailwind.config.js` to use the well-trodden setup. Rejected: v4 is the current major, eliminates the JS config, and the CSS-first approach fits how our design tokens will be expressed anyway (see `visual-guidelines.md`).

### 7. Preserved-content invariant

Before running anything, we'll snapshot the root listing (`ls -la`). After moving files in, we'll diff against it and assert that `docs/`, `openspec/`, `visual-design-prototype/`, `CLAUDE.md`, and `.git/` are all present and unchanged (mtimes and content). If `create-nx-workspace` ever emits a file that collides with one of these, we abort and investigate rather than overwrite.

## Risks / Trade-offs

- **Risk:** `npx create-nx-workspace@latest` pulls the newest Nx, which may differ from what `docs/architecture.md` was written against → **Mitigation:** capture the resolved Nx version in the commit message; if a major version jump introduces surprises, pin to a known-good version in a follow-up change rather than re-litigating the scaffold mid-task.
- **Risk:** moving the `node_modules/` directory out of the temp folder is slow and may hit filesystem quirks → **Mitigation:** acceptable for a one-time scaffold; if it's a problem, delete `lightmatters-tmp/node_modules/` and run `npm install` at the root after moving the rest.
- **Risk:** the preset's default lint config (`eslint.config.mjs` flat config vs legacy `.eslintrc.json`) varies across Nx versions and our module-boundary snippet has to target the right format → **Mitigation:** detect which file the preset generated and write the rule there; if both exist, prefer the flat config.
- **Risk:** `.gitignore` from the preset may not list `node_modules/`, build outputs, or IDE files the way we want → **Mitigation:** review the generated `.gitignore` after scaffolding; add entries only if missing.
- **Trade-off:** generating the three libs up front means three empty `index.ts` files and three sets of test/lint configs sitting around with nothing in them. Accepted because the alternative — generating them one at a time as the first real code lands — leaves the tag enforcement incomplete in the meantime.

## Open Questions

- None blocking. Nx version pinning and the exact location of the lint config are decisions we can make in-flight based on what the preset emits.
