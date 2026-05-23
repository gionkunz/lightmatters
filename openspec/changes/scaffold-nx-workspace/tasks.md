## 1. Pre-flight

- [x] 1.1 Capture a snapshot of the current repo root (`ls -la` output saved as a reference) so post-scaffold verification can confirm nothing pre-existing was touched.
- [x] 1.2 Confirm Node.js and npm versions meet `create-nx-workspace@latest` requirements; if not, install/switch via the user's version manager.
- [x] 1.3 Confirm the repository working tree is clean (`git status` shows no changes) so the scaffold diff is purely the new files.

## 2. Scaffold via `nrwl/angular-template` (Angular-compatible workspace)

- [x] 2.1 From the repo root, run `npx create-nx-workspace@latest lightmatters-tmp --template=nrwl/angular-template --packageManager=npm --nxCloud=skip --interactive=false --skipGit=true` and capture its output.
- [x] 2.2 Verify the scaffold produced `lightmatters-tmp/nx.json`, `lightmatters-tmp/package.json`, `lightmatters-tmp/tsconfig.base.json`, `eslint.config.mjs`, plus `vitest.workspace.ts`. Apps: `api`, `shop`, `shop-e2e`. Lib projects (Nx names): `feature-product-detail`, `feature-products`, `shared-ui`, `models`, `products`, `data`.
- [x] 2.3 Resolved versions: **Nx 22.7.2**, **Angular 21.2.9**, **@angular/cli 21.2.7**.

## 3. Remove demo projects from the template

- [x] 3.1 Inventory every project the template generated: run `cd lightmatters-tmp && npx nx show projects --tui=false` and list them. Found 9 projects across apps + libs.
- [x] 3.2 For each demo project, removed via `npx nx g @nx/workspace:remove --projectName=<name> --forceRemove --tui=false`. Removed: `shop-e2e`, `shop`, `api`, `feature-product-detail`, `feature-products`, `shared-ui`, `models`, `products`, `data`.
- [x] 3.3 Confirmed `apps/` and `libs/` are gone after removal (Nx deletes empty parent dirs).
- [x] 3.4 Confirmed `npx nx show projects --tui=false` returns `[]`.

## 4. Generate the `lightmatters` Angular application

- [x] 4.1 Ran `NX_TUI=false npx nx g @nx/angular:application --name=lightmatters --directory=apps/lightmatters --bundler=esbuild --style=scss --routing=true --ssr=false --e2eTestRunner=playwright --unitTestRunner=jest --tags=scope:app`. NOTE 1: `--tui=false` is rejected by the generator schema; pass `NX_TUI=false` as an env var instead (or use it only on `nx run-*` commands). NOTE 2: positional `lightmatters` arg is rejected by the Angular 21 schema; must use `--name=lightmatters`. NOTE 3: post-generator `npm install` failed twice with peer-dep ERESOLVE errors — fixed by loosening `@angular/*` pins from exact `21.2.9` to `~21.2.0` in `package.json`, bumping `jsdom` from `~22.1.0` to `~26.0.0` (required by `jest-preset-angular@~16.0.0`), and deleting `node_modules` + `package-lock.json` before re-installing.
- [x] 4.2 Confirmed `apps/lightmatters/` and `apps/lightmatters-e2e/` exist with their `project.json` files.
- [x] 4.3 `lightmatters` carries `tags: ["scope:app"]`. `lightmatters-e2e` was untagged (e2e generator didn't inherit); added `"tags": ["scope:app"]` to its `project.json` manually.

## 5. Generate the foundational libraries

- [x] 5.1 Generated `design`: `NX_TUI=false npx nx g @nx/angular:library --name=design --directory=libs/design --tags=scope:design --style=scss --skipModule=true --unitTestRunner=jest`.
- [x] 5.2 Generated `engine`: `NX_TUI=false npx nx g @nx/angular:library --name=engine --directory=libs/engine --tags=scope:engine --style=scss --skipModule=true --unitTestRunner=jest`.
- [x] 5.3 Generated `physics` as a pure TS library (no Angular) since physics formulas don't need framework runtime: `NX_TUI=false npx nx g @nx/js:library --name=physics --directory=libs/physics --tags=scope:physics --unitTestRunner=jest`.
- [x] 5.4 Confirmed `npx nx show projects --tui=false` returns `["lightmatters-e2e","lightmatters","physics","design","engine"]`.

## 6. Move scaffolded files to the repo root

- [x] 6.1 Inventoried lightmatters-tmp/ vs repo root. Collisions: `CLAUDE.md` and `.cursor/`. (Template does NOT add `.claude/`; ours moves through untouched.)
- [x] 6.2 Handled collisions: (a) appended template's `CLAUDE.md` (Nx-config block, preserving `<!-- nx configuration start/end -->` markers for future Nx auto-updates) to our existing CLAUDE.md, then `rm`'d the template's; (b) `.cursor/` dirs were complementary (ours had OpenSpec stuff, template's had Nx skills + monitor-ci) — merged additively with `cp -rn`, then `rm -rf`'d the template's. Also corrected the `--tui=false` guidance in our CLAUDE.md (it's rejected by `nx g @nx/angular:*` generators — use `NX_TUI=false` env var there) and updated the "pre-implementation" project-state paragraph to reflect the now-scaffolded state.
- [x] 6.3 `shopt -s dotglob && mv lightmatters-tmp/* .` moved every remaining file and dotfile/dotdir to repo root.
- [x] 6.4 `rmdir lightmatters-tmp` succeeded.
- [x] 6.5 Confirmed `.claude/`, `.cursor/` (now merged), `docs/`, `openspec/`, `visual-design-prototype/`, `CLAUDE.md` (now extended), `.git/` all present. Re-ran `nx build lightmatters --tui=false` from the new root — green.

## 7. Verify and adjust scope tags

- [x] 7.1 Read each project's `project.json` and confirmed: `lightmatters` → `scope:app`, `lightmatters-e2e` → `scope:app` (added in 4.3), `design` → `scope:design`, `engine` → `scope:engine`, `physics` → `scope:physics`.
- [x] 7.2 Added missing tag on `lightmatters-e2e` (handled in 4.3).
- [x] 7.3 All five projects carry exactly one `scope:*` tag.

## 8. Configure `@nx/enforce-module-boundaries`

- [x] 8.1 Template produced `eslint.config.mjs` (flat config) with `@nx/enforce-module-boundaries` already wired up.
- [x] 8.2 Replaced the template's demo `depConstraints` (which referenced `scope:shared`, `scope:shop`, `scope:api`, `type:data`) with the full matrix: `scope:app` → `['*']`, `scope:chapter` → engine/primitive/physics/design, `scope:primitive` → engine/physics/design, `scope:engine` → design, `scope:design` and `scope:physics` → `[]`.
- [x] 8.3 Included `scope:chapter` and `scope:primitive` constraints even though no such projects exist yet.

## 9. Verify the scaffold works end-to-end

- [x] 9.1 `npx nx build lightmatters --tui=false` succeeded (219 kB main bundle, 1.97s). One warning about `nx-welcome.ts` exceeding the 4 kB style budget — auto-generated welcome page, will go away when replaced.
- [x] 9.2 `npx nx lint lightmatters --tui=false` succeeded (all files pass).
- [x] 9.3 `npx nx test lightmatters --tui=false` succeeded (1 passed, 1 total — the default `app.spec.ts`).
- [x] 9.4 `npx nx run-many -t lint -p design engine physics --tui=false` succeeded for all three libs.
- [x] 9.5 Negative test: created `libs/engine/src/lib/_boundary-test.ts` importing from `@org/physics`; lint failed with exact message `A project tagged with "scope:engine" can only depend on libs tagged with "scope:design"`. Deleted the throwaway file and re-ran lint (with `--skip-nx-cache`) — passes cleanly.

## 9.5. Wire Tailwind v4 into the app

- [x] 9.5.1 Installed Tailwind v4 packages: `npm install -D tailwindcss@^4 @tailwindcss/postcss@^4`.
- [x] 9.5.2 Created `apps/lightmatters/.postcssrc.json` registering the `@tailwindcss/postcss` plugin.
- [x] 9.5.3 Replaced `apps/lightmatters/src/styles.scss` with `apps/lightmatters/src/styles.css` containing `@import "tailwindcss" source("./app");` and `@source` directives for `libs/design/src` and `libs/engine/src`. (The global entry has to be `.css` so PostCSS handles the import directly — Sass would intercept `@import "tailwindcss";` in a `.scss` file and try to resolve it as a Sass partial.)
- [x] 9.5.4 Updated `apps/lightmatters/project.json` `styles` array from `styles.scss` to `styles.css`.
- [x] 9.5.5 Re-ran `nx build lightmatters --tui=false --skip-nx-cache` — succeeded; styles bundle grew from 0 bytes → 6.50 kB, confirming Tailwind preflight is processed. Lint and test still green.

## 10. Tidy and finalize

- [x] 10.1 Reviewed `.gitignore`: covered `node_modules/`, `dist/`, `tmp/`, `coverage/`, `.nx/cache`, `.nx/workspace-data`, `.angular`, IDE files. **Removed** the `.claude` line — it would have silently ignored the user's tracked `.claude/` config (5+ files already in HEAD).
- [x] 10.2 `git status`: pre-existing files all preserved. Only modification: `CLAUDE.md` (intentional — Nx config block appended + `--tui=false`/positional-name guidance corrected + project-state updated). Also discovered that `create-nx-workspace` silently amended the initial commit despite `--skipGit=true` (added a phantom `lightmatters-tmp/README.md` to HEAD); ran `git reset --mixed 5739f34` to restore the original commit and unstage the phantom file. All scaffold work now shows as untracked, ready for a fresh commit.
- [x] 10.3 Updated `CLAUDE.md`: replaced the "pre-implementation, no commands yet" paragraph with the now-real Nx build/test/lint commands. Also corrected the "always pass `--tui=false`" guidance to clarify the env-var fallback for `nx g @nx/angular:*` generators (which strict-validate their schema and reject the flag).
- [ ] 10.4 Stage the scaffold and create the commit (deferred to the user — do not commit automatically).
