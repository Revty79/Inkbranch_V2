# 01_tooling_and_guards.md

## Title
Inkbranch v2 — Tooling and Architectural Guardrails

## Objective
Install and configure the project guardrails that prevent the Inkbranch v2 rebuild from collapsing back into a messy architecture.

This prompt exists to make the repository enforce its intended structure.

The goal is not to build app features.
The goal is to make bad architecture harder to write.

By the end of this prompt, the repo should have:
- linting
- formatting
- typecheck support
- basic test scaffolding
- environment file structure
- import boundary guardrails
- verification scripts
- a repeatable developer quality gate

This prompt should make it difficult for future prompts to:
- mix UI and engine logic
- import across layers incorrectly
- let the repo drift into junk-drawer utilities
- skip basic validation before marking work complete

---

## Why this prompt matters
The scaffold from `00_foundation_scaffold.md` creates the shape of the repo.

This prompt gives that shape teeth.

Without tooling and boundaries:
- `app` will start owning engine logic
- `ui` will start importing data and runtime code
- `core` will start depending on framework concerns
- `lib` will become a junk drawer
- “temporary” shortcuts will become permanent architecture damage

This prompt is where we install the rails.

---

## Rebuild principles to protect
Inkbranch v2 is:
- planner-first
- relational-first
- book-first
- world-first
- AI-on-rails
- runtime-inspectable

It is not:
- beat-graph-first
- UI-driven story logic
- generator-led story truth
- giant runtime-blob architecture
- repository soup

All tooling choices in this prompt should reinforce those principles.

---

## Non-negotiable rules
1. Do not implement product features in this prompt.
2. Do not add planner logic.
3. Do not add runtime mutation logic.
4. Do not add generator/provider logic.
5. Do not add real CRUD flows.
6. Do not weaken module boundaries for convenience.
7. Do not add giant config complexity unless necessary.
8. Prefer simple, enforceable guardrails over clever tooling.
9. Prefer explicit import restrictions over “team discipline.”
10. Any guardrail chosen should support the architecture, not fight it.

---

## Scope
You should implement:
- ESLint configuration
- Prettier configuration
- TypeScript quality support if needed
- basic Vitest scaffolding
- minimal test setup
- package scripts for quality checks
- `.editorconfig`
- `.prettierignore`
- `.env.example`
- environment helper structure
- architectural import guardrails
- documentation updates describing the guardrails

You should also:
- inspect existing config before rewriting it
- preserve compatible existing setup where possible
- normalize incompatible setup where necessary
- log all meaningful changes in STATUS

---

## Out of scope
Do not implement:
- production auth
- database schema
- real query logic
- planner algorithms
- runtime state transitions
- AI integrations
- story seeds
- e2e tests
- advanced CI/CD
- deployment work
- monorepo restructuring
- broad package churn unless truly needed

This prompt is project hygiene and enforcement, not app logic.

---

## Required end state
By the end of this prompt, the repo should support a workflow like this:

1. developer edits code
2. imports are constrained by architecture rules
3. code can be formatted consistently
4. linting catches bad patterns
5. typecheck can be run explicitly
6. tests can run in a minimal scaffolded way
7. a `verify` script can be used before marking prompts complete

That is the target.

---

## Existing repo handling
Before changing anything, inspect the existing repo.

Check for:
- `package.json`
- `tsconfig.json`
- `eslint.config.*` or legacy ESLint config files
- Prettier config files
- test config
- Next.js config
- existing scripts
- existing env files or examples
- old guard files or agent guidance files

Do not rewrite everything blindly.

Use this decision model:
- keep compatible existing setup
- normalize conflicting setup
- remove obviously harmful legacy config only if it meaningfully conflicts with the rebuild
- do not keep old tooling just because it already exists

Log meaningful removals or replacements in STATUS.

---

## Tooling choices to use

### Linting
Use ESLint with a flat config.

Base it on the Next.js configuration appropriate for the current app router stack.

Use the stronger core web vitals-oriented config where appropriate.

Do not rely on `next lint`.

Linting should run through ESLint directly.

### Formatting
Use Prettier.

Keep the config simple and local to the repo.

Do not add formatting bikeshedding.

### Testing
Use Vitest for the initial test scaffold.

This prompt only needs enough testing setup to support:
- future unit tests
- future core logic tests
- a tiny smoke test if needed

Do not overbuild a testing harness here.

### Type checking
Use the repo’s TypeScript support and scripts cleanly.

Add a dedicated `typecheck` script if one does not already exist.

---

## Architectural boundary policy

These boundaries are the heart of this prompt.

### High-level dependency direction
Use this allowed dependency flow as the default doctrine:

- `app` may depend on `ui`, `core`, `data`, and `lib`
- `ui` may depend on `core` contracts/types and `lib`
- `data` may depend on `core` contracts/types and `lib`
- `core` may depend on `core` submodules and `lib`
- `lib` should depend on almost nothing project-specific

But also enforce the following prohibitions:

- `ui` must not import from `data/db`
- `ui` must not import from `data/queries`
- `ui` must not import from `data/mutations`
- `ui` must not import planner services, runtime services, or generator adapters
- `core` must not import from `app`
- `core` must not import from `ui`
- `core` must not import from `data`
- `data` must not import from `app`
- `data` must not import from `ui`
- `app` page/layout components must not become a home for planner/runtime/generator logic
- `lib` must not become a second `core`

These boundaries do not need to be mathematically perfect on day one, but they must clearly block the most dangerous crossings.

---

## Required import guardrails

Configure lint rules that reject obviously bad imports.

At minimum, guard against these patterns:

### Prohibited imports from UI
Files under:
- `src/ui/**`

must not import from:
- `@/data/db/**`
- `@/data/queries/**`
- `@/data/mutations/**`
- `@/core/planner/services/**`
- `@/core/runtime/services/**`
- `@/core/generator/adapters/**`

### Prohibited imports from core
Files under:
- `src/core/**`

must not import from:
- `@/app/**`
- `@/ui/**`
- `@/data/**`

### Prohibited imports from data
Files under:
- `src/data/**`

must not import from:
- `@/app/**`
- `@/ui/**`

### Prohibited imports from app pages and layouts
Files under:
- `src/app/**/page.tsx`
- `src/app/**/layout.tsx`

must not import directly from:
- `@/core/planner/services/**`
- `@/core/runtime/services/**`
- `@/core/generator/adapters/**`

This does not mean the app layer can never orchestrate core logic later.
It means route/page components must not become direct logic containers.

If needed, leave room for future server-only orchestration modules, but do not invent them yet.

### Guard `lib`
Files under:
- `src/lib/**`

should not import from:
- `@/app/**`
- `@/ui/**`
- `@/data/**`
- `@/core/planner/**`
- `@/core/runtime/**`
- `@/core/generator/**`

Allow only very limited project-level constants or env helpers here.

---

## How to implement the import guardrails
Use ESLint restrictions to enforce these boundaries.

Use file-pattern-based overrides where appropriate so different folders get different forbidden import sets.

The goal is not to create the perfect academic dependency graph.
The goal is to catch the obvious architecture violations automatically.

Include helpful lint messages where possible, such as:
- “UI must not import data-layer modules directly.”
- “Core must remain framework- and persistence-independent.”
- “App pages must not directly own planner/runtime/generator service logic.”

Keep the config readable.

---

## Required configuration work

### Task 1 — inspect and normalize package scripts
Inspect `package.json`.

Ensure scripts exist for the following, adding or normalizing as needed:
- `dev`
- `build`
- `lint`
- `lint:fix`
- `typecheck`
- `format`
- `format:check`
- `test`
- `test:run`
- `verify`

Expected intent of scripts:
- `lint` runs ESLint directly
- `lint:fix` applies safe ESLint fixes
- `typecheck` runs TypeScript without emitting
- `format` runs Prettier write mode
- `format:check` runs Prettier check mode
- `test` runs Vitest in watch or normal dev-friendly mode
- `test:run` runs Vitest once
- `verify` runs at least lint + typecheck + test:run, and optionally format:check if appropriate

Use the repo’s existing package manager and ecosystem.
Do not rewrite scripts unnecessarily if they already fit this model.

### Task 2 — configure ESLint
Create or normalize the ESLint config using a flat config style.

Requirements:
- include the Next.js recommended stack appropriate for this repo
- keep the config explicit and readable
- add the architecture import restrictions
- ignore generated/output folders appropriately
- do not rely on removed/deprecated workflow assumptions

Also:
- inspect for old `.eslintrc*` files
- remove or replace conflicting legacy ESLint config if necessary
- avoid redundant plugin piles unless they are necessary

### Task 3 — configure Prettier
Create or normalize:
- `.prettierrc` or equivalent
- `.prettierignore`

Keep Prettier options intentionally minimal.

Add ignore patterns for:
- build output
- dependency folders
- generated artifacts where appropriate

Do not create a giant opinionated style matrix.

### Task 4 — add `.editorconfig`
Create `.editorconfig` if it does not already exist.

Use a simple, standard setup that helps keep formatting stable across editors.

Include at least:
- utf-8 charset
- lf line endings
- final newline
- spaces over tabs
- reasonable indent defaults

### Task 5 — create env structure
Create or normalize `.env.example`.

It should contain placeholders only, no real secrets.

At this stage it should include only the expected categories of variables, not finalized values.

Include placeholders for likely future needs such as:
- app URL
- database URL
- auth secret placeholders
- AI provider key placeholders
- any other clearly expected top-level environment variables

Also create or normalize the env helper area under:
- `src/lib/env/`

This helper should remain minimal for now.

It may:
- centralize environment variable names
- export tiny safe access helpers
- include TODO comments for future validation

It must not:
- become a full runtime config engine
- pull in app/business logic
- overcomplicate validation at this stage

### Task 6 — add Vitest scaffold
Create or normalize Vitest setup.

Add only what is needed for a clean starting point:
- `vitest.config.ts` or compatible config
- optional setup file if needed
- a minimal test folder structure, such as:
  - `tests/`
  - `tests/smoke/`

A tiny smoke test is acceptable if useful, such as verifying a placeholder export or a trivial contract file exists and can be imported.

Do not create broad test coverage here.

### Task 7 — add guard documentation
Update or create documentation that explains the new tooling and guardrails.

At minimum create:
- `docs/tooling-and-guards.md`

This doc should explain:
- what tooling is installed
- what each script is for
- why import restrictions exist
- which architectural violations are intentionally blocked
- how future prompts should work within the boundaries

### Task 8 — sanity-verify the setup
Run the appropriate commands to verify the setup works.

At minimum, attempt as appropriate:
- dependency install if needed
- lint
- typecheck
- test run
- optionally format check

If something fails because later prompts have not implemented real code yet, fix the tooling so it still works with the current scaffold.

Do not leave the repo in a “tooling exists but currently broken” state.

### Task 9 — update STATUS
Update `/prompts/STATUS.md` only after this prompt is truly complete.

---

## Required files to create or normalize

You may create or update the following as needed:

### Root config and repo hygiene
- `package.json`
- `eslint.config.mjs`
- `.prettierrc`
- `.prettierignore`
- `.editorconfig`
- `.env.example`
- `vitest.config.ts`
- `tsconfig.json` if normalization is required
- `next.config.*` only if needed for compatibility

### Minimal env support
- `src/lib/env/index.ts`

### Minimal test support
- `tests/`
- `tests/smoke/`
- one tiny smoke test file if useful

### Documentation
- `docs/tooling-and-guards.md`

You may add other small support files only when they directly serve this prompt.

Do not expand into product logic.

---

## Preferred lint philosophy
Use linting to block architectural mistakes, not to satisfy vanity style rules.

Prioritize:
- forbidden imports
- accidental unused variables where appropriate
- obvious unsafe patterns if already configured
- consistency with Next.js expectations
- configuration readability

Do not go overboard with noisy stylistic rules that fight Prettier.

---

## Suggested architecture guard examples

These are examples of the kind of policy the repo should enforce.

### Good
- `src/ui/reader/SceneCard.tsx` imports shared types from `@/core/domain/types`
- `src/app/(reader)/reader/page.tsx` imports a presentational component from `@/ui/reader`
- `src/data/queries/index.ts` imports a domain type from `@/core/domain/types`

### Bad
- `src/ui/reader/SceneCard.tsx` imports directly from `@/data/queries`
- `src/core/planner/services/index.ts` imports a React component from `@/ui/shared`
- `src/core/runtime/services/index.ts` imports from `next/navigation`
- `src/app/(studio)/studio/page.tsx` directly contains planner service logic
- `src/lib/helpers.ts` starts importing from every layer in the repo

Your config and docs should make these distinctions obvious.

---

## Keep config complexity reasonable
Do not add:
- a giant custom ESLint plugin
- a complicated multi-project test matrix
- elaborate CI config
- dozens of npm scripts
- premature monorepo abstractions

This is a single-app rebuild foundation.
Keep it sharp and readable.

---

## Acceptance criteria
This prompt is complete only if all of the following are true:

1. ESLint is configured and runnable.
2. Linting does not depend on `next lint`.
3. Architectural import guardrails exist and are active.
4. Prettier is configured and runnable.
5. `.editorconfig` exists.
6. `.env.example` exists with placeholder categories only.
7. `src/lib/env` has a minimal helper entry point.
8. Vitest is configured and runnable in a minimal way.
9. `package.json` has a clean set of quality scripts, including `verify`.
10. `docs/tooling-and-guards.md` exists and explains the rules.
11. The repo still contains no real planner/runtime/generator/product feature logic.
12. The current scaffold remains clean and stable for `02_database_foundation.md`.

If any of these are false, do not mark the prompt complete.

---

## Verification requirements
Before marking complete, verify all of the following with actual commands where possible:
- lint runs
- typecheck runs
- tests run
- route scaffold still compiles cleanly enough to proceed
- the import restrictions do not break the current scaffold
- the new scripts work as intended

If verification fails:
- fix the tooling
- rerun verification
- only then mark complete

Do not leave known broken tooling behind.

---

## STATUS update instructions
After completing the work, update `/prompts/STATUS.md`.

### Mark queue item
Change:
- [ ] 01_tooling_and_guards.md

To:
- [x] 01_tooling_and_guards.md

Only do this if the prompt is truly complete.

### Add run log entry
Append a run log entry in this shape:

- Prompt: `01_tooling_and_guards.md`
- Status: completed
- Summary:
  - configured linting, formatting, test scaffold, and verification scripts
  - added architecture import guardrails to protect layer boundaries
  - created environment example and minimal env helper structure
  - documented tooling and guard expectations
- Files changed:
  - list all significant files added/updated/removed
- Commands run:
  - list actual commands run
- Verification:
  - list actual verification performed
- Follow-up notes / risks:
  - note any guardrails that are intentionally broad for now
  - note any future boundary refinement expected in later prompts

If blocked:
- do not check the queue item
- add a run log entry with `Status: blocked`
- describe the exact blocker
- include attempted work
- include files changed
- include commands run
- stop after logging

---

## Final instruction
This prompt succeeds if the repo becomes stricter.

It fails if you start building the app instead of the rules that protect the app.