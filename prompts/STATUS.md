# Inkbranch v2 Status

## Project
Full rebuild of Inkbranch as a planner-led, book-first, world-first interactive fiction platform.

## Product definition
Inkbranch v2 is not a hand-authored beat-graph system.

It is a structured interactive fiction platform where:
- the author defines the world, canon, book rules, characters, locations, perspectives, arcs, reveals, pacing, and ending rules
- the planner decides what scene package is valid next
- the generator turns approved structure into prose and structured reader-facing options
- the runtime commits what happened and preserves continuity in a relational, inspectable way

## Architecture anchors
- Book bible is authored truth
- Planner decides valid next scene packages
- Generator renders approved structure into prose
- Runtime commits what happened
- UI never contains engine logic
- Runtime truth is relational and inspectable
- No beat-graph-first core architecture
- No giant runtime blob as source of truth
- No giant mega-files
- No mixing repository, engine, and UI logic together

## Core flow
book bible -> planner -> scene package -> reader decision -> runtime state update -> next scene package

## Current phase
Foundation rebuild

## Current status
- Bootstrap workflow defined
- Sequential Codex execution model defined
- Prompt queue planned
- Foundation scaffold initialized and verified
- Tooling guardrails established and verified
- Database foundation established and verified
- Domain contracts established and verified
- Authoring schema established and verified
- Runtime schema established and verified
- Data access boundaries established and verified
- Studio shell established and verified

## Queue
- [x] 00_foundation_scaffold.md
- [x] 01_tooling_and_guards.md
- [x] 02_database_foundation.md
- [x] 03_domain_contracts.md
- [x] 04_authoring_schema.md
- [x] 05_runtime_schema.md
- [x] 06_data_access_boundaries.md
- [x] 07_studio_shell.md
- [x] 08_authoring_workflow_v1.md
- [x] 09_planner_contracts.md
- [x] 10_planner_mvp.md
- [x] 11_runtime_commit_pipeline.md
- [x] 12_reader_shell.md
- [x] 13_scene_package_rendering.md
- [x] 14_generator_boundary.md
- [x] 15_generator_integration.md
- [x] 16_admin_inspector.md
- [x] 17_validation_and_continuity_guards.md
- [x] 18_seed_data_and_demo_book.md
- [x] 19_tests_and_quality_gates.md
- [x] 20_docs_and_handoff.md

## Prompt intent map

### 00_foundation_scaffold.md
Create the repo foundation, folders, pathing, base docs, and architecture-safe module layout.

### 01_tooling_and_guards.md
Add linting, formatting, test scaffolding, env structure, and import/layer guardrails.

### 02_database_foundation.md
Set up database tooling, Drizzle config, db client, migration workflow, and schema entry points.

### 03_domain_contracts.md
Define pure domain contracts and shared type boundaries for authoring, planning, runtime, and generation.

### 04_authoring_schema.md
Create relational authoring tables for world/book/bible/canon/perspective/planning inputs.

### 05_runtime_schema.md
Create relational runtime tables for chronicles, scenes, choices, state, knowledge, events, and commits.

### 06_data_access_boundaries.md
Create queries, mutations, mappers, and repository-safe data access modules.

### 07_studio_shell.md
Build the studio shell and route structure without pulling engine logic into the UI.

### 08_authoring_workflow_v1.md
Implement first-pass studio authoring flow for managing the book bible inputs.

### 09_planner_contracts.md
Define the planner interfaces, planning context, scene package shape, and decision package contracts.

### 10_planner_mvp.md
Build the first deterministic planner that produces valid scene packages from authored truth and runtime context.

### 11_runtime_commit_pipeline.md
Implement choice resolution, event append, state projection refresh, knowledge updates, and canon commits.

### 12_reader_shell.md
Build the reader shell and route flow for viewing scenes and selecting decisions.

### 13_scene_package_rendering.md
Wire the reader to scene instances and decision packages using safe non-AI rendering first.

### 14_generator_boundary.md
Create the generator interface, structured schemas, adapters, validators, and fallback paths.

### 15_generator_integration.md
Integrate AI generation behind the generator boundary using planner-approved input only.

### 16_admin_inspector.md
Build admin inspection views for runs, states, events, scene instances, choices, and commits.

### 17_validation_and_continuity_guards.md
Implement continuity checks, illegal reveal blockers, contradiction guards, and ending gate validation.

### 18_seed_data_and_demo_book.md
Seed a realistic demo world/book/version and enough canon/runtime data to exercise the system.

### 19_tests_and_quality_gates.md
Add unit, integration, and end-to-end tests plus build/lint/typecheck gates.

### 20_docs_and_handoff.md
Write architecture docs, dev setup docs, workflow docs, and handoff docs.

## Non-negotiable source-of-truth rules
1. Authored truth lives in relational authoring tables.
2. Planner output is a proposal until committed through runtime.
3. Generated prose is presentation, not canon truth.
4. Runtime truth must be reconstructable from relational state plus event history.
5. Planner decides validity of scene progression and choices.
6. Generator never decides canon truth.
7. UI must not compute story logic.
8. Event history should be append-oriented and inspectable.
9. A prompt is not complete until its verification steps are done.
10. No prompt may be skipped.

## Implementation order doctrine
Work in this order unless a later approved decision explicitly changes it:
1. foundation
2. tooling guards
3. database
4. domain contracts
5. authoring schema
6. runtime schema
7. data boundaries
8. studio shell
9. authoring workflow
10. planner contracts
11. planner MVP
12. runtime commit pipeline
13. reader shell
14. scene package rendering
15. generator boundary
16. generator integration
17. admin inspector
18. continuity guards
19. seed/demo content
20. tests and docs

## Definition of done for any prompt
A prompt is only complete when:
- its required implementation is finished
- required files are created or updated
- required commands were run
- required verification was completed
- any discovered issues are resolved or clearly logged
- this STATUS.md file is updated
- the queue item is checked only if the prompt is truly complete

## Blocker rules
If blocked:
- do not check the queue item
- add a run log entry with `Status: blocked`
- describe the exact blocker
- describe attempted work
- list changed files, if any
- list commands run, if any
- stop after logging the blocker

## Decision log

### Accepted
- Full rebuild from scratch instead of refactor
- Planner-first architecture
- Book-first and world-first product direction
- Relational-first runtime model
- AI constrained to generator boundaries
- Studio, reader, admin, core, and data layers must remain separate
- No beat-graph-first architecture at the core
- No UI-owned engine logic
- No giant source-of-truth runtime blob

### Open
- Final production auth strategy
- Multi-provider AI adapter strategy
- Version publishing and promotion workflow
- Long-term background job/orchestration strategy for expensive generation tasks
- Final policy on when canon commits are created automatically vs explicitly

### Rejected
- Hand-authored beat tree as the core story architecture
- Giant JSON runtime store as the main source of truth
- Generator-led story logic
- UI-level planner logic
- Mixing CRUD, engine, runtime, and rendering in the same modules

## Risks to monitor
- Planner becoming disguised beat-graph logic
- Generator drifting into decision-making instead of rendering
- Runtime state duplication causing truth drift
- Studio CRUD bleeding into domain logic
- Oversized prompt scope causing false completion
- Codex skipping verification or logging

## Run log

### Run Log Entry Template
- Prompt: `00_foundation_scaffold.md`
- Status: completed | blocked
- Summary:
  - ...
- Files changed:
  - ...
- Commands run:
  - ...
- Verification:
  - ...
- Follow-up notes / risks:
  - ...

---

### 2026-04-08 â€” Bootstrap and status foundation
- Prompt: `bootstrap_and_status_setup`
- Status: completed
- Summary:
  - Defined the Inkbranch v2 rebuild direction as planner-first, book-first, and world-first.
  - Defined sequential Codex workflow with automatic continuation to the next unchecked prompt after full completion.
  - Defined initial prompt queue from `00` through `20`.
  - Established source-of-truth rules, completion rules, and blocker handling.
- Files changed:
  - `BOOTSTRAP.md`
  - `prompts/STATUS.md`
- Commands run:
  - none
- Verification:
  - Reviewed bootstrap instructions for sequential continuation behavior.
  - Confirmed queue ordering matches intended rebuild progression.
  - Confirmed definition-of-done and blocker rules are present.
- Follow-up notes / risks:
  - Prompt files still need to be authored before execution can begin.
  - Prompt scope must stay tight to prevent false completion and architecture drift.

### 2026-04-08 - Foundation scaffold
- Prompt: `00_foundation_scaffold.md`
- Status: completed
- Summary:
  - Created the initial Next.js + TypeScript project scaffold for Inkbranch v2.
  - Established `src/app`, `src/core`, `src/data`, `src/ui`, and `src/lib` with placeholder-only module entry points.
  - Added minimal route placeholders for `/`, `/reader`, `/studio`, and `/admin`.
  - Added architecture docs and layer boundary README guard files.
  - Configured and validated `@/` path aliases via `tsconfig.json`.
- Files changed:
  - `package.json`
  - `tsconfig.json`
  - `next-env.d.ts`
  - `next.config.ts`
  - `docs/architecture-overview.md`
  - `docs/module-boundaries.md`
  - `docs/rebuild-principles.md`
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/globals.css`
  - `src/app/(reader)/reader/page.tsx`
  - `src/app/(studio)/studio/page.tsx`
  - `src/app/(admin)/admin/page.tsx`
  - `src/app/api/.gitkeep`
  - `src/core/domain/README.md`
  - `src/core/domain/types/index.ts`
  - `src/core/domain/rules/index.ts`
  - `src/core/domain/value-objects/index.ts`
  - `src/core/planner/README.md`
  - `src/core/planner/contracts/index.ts`
  - `src/core/planner/services/index.ts`
  - `src/core/planner/strategies/index.ts`
  - `src/core/runtime/README.md`
  - `src/core/runtime/contracts/index.ts`
  - `src/core/runtime/services/index.ts`
  - `src/core/runtime/projections/index.ts`
  - `src/core/generator/README.md`
  - `src/core/generator/contracts/index.ts`
  - `src/core/generator/adapters/index.ts`
  - `src/core/generator/prompts/index.ts`
  - `src/core/validators/README.md`
  - `src/core/validators/contracts/index.ts`
  - `src/core/validators/rules/index.ts`
  - `src/data/db/index.ts`
  - `src/data/schema/index.ts`
  - `src/data/queries/index.ts`
  - `src/data/mutations/index.ts`
  - `src/data/mappers/index.ts`
  - `src/ui/shared/index.ts`
  - `src/ui/reader/index.ts`
  - `src/ui/studio/index.ts`
  - `src/ui/admin/index.ts`
  - `src/lib/constants/index.ts`
  - `src/lib/env/index.ts`
  - `prompts/STATUS.md`
- Commands run:
  - `node -v`
  - `npm -v`
  - `npm install`
  - `npm run typecheck`
  - `npm run build`
- Verification:
  - Confirmed all required scaffold files exist via explicit `Test-Path` checks.
  - Confirmed app build succeeded and generated `/`, `/reader`, `/studio`, and `/admin` routes.
  - Confirmed TypeScript check passes with no errors.
  - Confirmed no planner/runtime/generator feature logic was implemented beyond placeholders.
- Follow-up notes / risks:
  - Tooling guardrails (lint/format/test/layer rules) are not established yet and are deferred to `01_tooling_and_guards.md`.
  - Data and core contracts are placeholders only and intentionally non-functional until later prompts.


### 2026-04-08 - Tooling and architectural guardrails
- Prompt: `01_tooling_and_guards.md`
- Status: completed
- Summary:
  - Configured linting, formatting, test scaffolding, and a repeatable `verify` quality gate.
  - Added architecture-focused import restrictions to protect `app`, `core`, `data`, `ui`, and `lib` boundaries.
  - Added environment placeholder structure with a minimal env helper.
  - Documented tooling expectations and guardrail intent for future prompts.
- Files changed:
  - `package.json`
  - `package-lock.json`
  - `eslint.config.mjs`
  - `.prettierrc`
  - `.prettierignore`
  - `.editorconfig`
  - `.env.example`
  - `vitest.config.ts`
  - `src/lib/env/index.ts`
  - `tests/smoke/constants.test.ts`
  - `docs/tooling-and-guards.md`
  - `prompts/STATUS.md`
- Commands run:
  - `npm install`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run build`
  - `npm run format`
  - `npm run format:check`
  - `npm run verify`
- Verification:
  - Confirmed ESLint runs directly (no `next lint`) and passes with import boundary restrictions active.
  - Confirmed TypeScript no-emit check passes.
  - Confirmed Vitest runs and passes the smoke test scaffold.
  - Confirmed Prettier write/check scripts run successfully.
  - Confirmed `verify` script successfully runs lint + typecheck + test:run + build.
  - Confirmed route scaffold still builds successfully after tooling changes.
- Follow-up notes / risks:
  - Import restrictions are intentionally broad and may need finer-grained exceptions as orchestrator modules are introduced in later prompts.
  - Local Node version (`v20.17.0`) shows an engine warning for one transitive ESLint dependency requiring `^20.19.0`; current tooling still executes successfully.
  - Vitest currently reports a Vite CJS API deprecation warning; this is non-blocking for the current scaffold and can be addressed in later tooling refinement.


### 2026-04-08 - Database foundation
- Prompt: `02_database_foundation.md`
- Status: completed
- Summary:
  - Configured PostgreSQL + Drizzle foundation for Inkbranch v2.
  - Added clean DB config/client/health modules and schema root wiring.
  - Added migration directory setup and DB workflow scripts (`db:generate`, `db:migrate`, `db:studio`, `db:check`).
  - Added DB foundation documentation and kept business schema intentionally deferred.
- Files changed:
  - `package.json`
  - `package-lock.json`
  - `.gitignore`
  - `.env.example`
  - `drizzle.config.ts`
  - `drizzle/README.md`
  - `drizzle/meta/_journal.json`
  - `src/data/db/config.ts`
  - `src/data/db/client.ts`
  - `src/data/db/health.ts`
  - `src/data/db/index.ts`
  - `src/data/schema/index.ts`
  - `src/data/schema/README.md`
  - `scripts/db-check.ts`
  - `docs/database-foundation.md`
  - `prompts/STATUS.md`
- Commands run:
  - `npm install`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run build`
  - `npm run format`
  - `npm run format:check`
  - `npm run verify`
  - `npm run db:check` (with local `DATABASE_URL` set to the provided dev target)
  - `npm run db:generate` (with local `DATABASE_URL` set)
  - `npm run db:migrate` (with local `DATABASE_URL` set)
- Verification:
  - Confirmed Drizzle and pg dependencies install successfully.
  - Confirmed lint/typecheck/tests/build all pass after DB foundation changes.
  - Confirmed DB health check passes against local PostgreSQL target.
  - Confirmed DB migration scripts resolve and execute cleanly with an empty schema baseline.
  - Confirmed no authoring/runtime business tables were introduced in this prompt.
- Follow-up notes / risks:
  - Authoring schema is intentionally deferred to `04_authoring_schema.md`.
  - Runtime schema is intentionally deferred to `05_runtime_schema.md`.
  - DB scripts require `DATABASE_URL` to be present in the local server environment; `.env.example` remains placeholder-only by design.


### 2026-04-08 - Domain contracts
- Prompt: `03_domain_contracts.md`
- Status: completed
- Summary:
  - Defined the shared domain vocabulary for authoring, planning, runtime, generation, and validation concepts.
  - Replaced placeholder domain exports with explicit contracts and layer-specific contract re-export surfaces.
  - Preserved separation from DB/UI/app layers and kept the contracts implementation-free.
  - Added documentation describing domain-layer purpose, boundaries, and usage expectations.
- Files changed:
  - `src/core/domain/types/primitives.ts`
  - `src/core/domain/types/common.ts`
  - `src/core/domain/types/authoring.ts`
  - `src/core/domain/types/planning.ts`
  - `src/core/domain/types/runtime.ts`
  - `src/core/domain/types/generation.ts`
  - `src/core/domain/types/validation.ts`
  - `src/core/domain/types/index.ts`
  - `src/core/domain/value-objects/index.ts`
  - `src/core/domain/rules/index.ts`
  - `src/core/planner/contracts/index.ts`
  - `src/core/runtime/contracts/index.ts`
  - `src/core/generator/contracts/index.ts`
  - `src/core/validators/contracts/index.ts`
  - `docs/domain-contracts.md`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run build`
  - `npm run format:check`
- Verification:
  - Confirmed lint passes with guardrails still active.
  - Confirmed TypeScript contracts compile cleanly.
  - Confirmed test scaffold still passes.
  - Confirmed app build remains stable after contract additions.
  - Confirmed no DB/UI/app imports or implementation logic were introduced in domain contracts.
- Follow-up notes / risks:
  - Contract field sets are intentionally core-focused; additional detail will be added as schema and engine prompts require it.
  - Planner/runtime/generator logic remains intentionally deferred; these files define language only.


### 2026-04-08 - Authoring schema
- Prompt: `04_authoring_schema.md`
- Status: completed
- Summary:
  - Implemented the relational authoring schema for Inkbranch v2 across split Drizzle schema modules.
  - Added version-anchored authored truth tables, relations, indexes, and core uniqueness constraints.
  - Generated and applied the authoring migration to local PostgreSQL.
  - Documented authoring-plane ownership and explicitly deferred runtime schema work to prompt `05`.
- Files changed:
  - `src/data/schema/shared.ts`
  - `src/data/schema/authoring/worlds.ts`
  - `src/data/schema/authoring/books.ts`
  - `src/data/schema/authoring/canon.ts`
  - `src/data/schema/authoring/entities.ts`
  - `src/data/schema/authoring/planning-rules.ts`
  - `src/data/schema/authoring/relations.ts`
  - `src/data/schema/authoring/index.ts`
  - `src/data/schema/index.ts`
  - `src/data/schema/README.md`
  - `docs/authoring-schema.md`
  - `drizzle/0000_parallel_marvel_apes.sql`
  - `drizzle/meta/0000_snapshot.json`
  - `drizzle/meta/_journal.json`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run db:generate` (with local `DATABASE_URL` set)
  - `npm run db:migrate` (with local `DATABASE_URL` set)
  - local PostgreSQL table verification query via `node` + `pg`
  - `npm run verify`
  - `npm run format:check`
- Verification:
  - Confirmed lint and typecheck pass after schema additions.
  - Confirmed migration generation succeeds and includes the 12 authoring tables.
  - Confirmed migration application succeeds against local `inkbranch_dev`.
  - Confirmed all expected authoring tables exist in `public` and runtime tables are still absent.
  - Confirmed schema exports resolve cleanly from `src/data/schema/index.ts`.
- Follow-up notes / risks:
  - JSONB columns are intentionally bounded to metadata and rule/config payload fields; core truth remains relational.
  - Polymorphic subject references (`subjectType` + `subjectId`) remain intentionally flexible and may be refined in later prompts.
  - Runtime schema remains intentionally deferred to `05_runtime_schema.md`.


### 2026-04-08 - Runtime schema
- Prompt: `05_runtime_schema.md`
- Status: completed
- Summary:
  - Implemented the relational runtime schema for Inkbranch v2 in split runtime modules.
  - Added chronicles, projection state, perspective runs, scene instances, choices, choice resolutions, knowledge state, event log, and canon commits.
  - Generated and applied the runtime migration against the local dev database.
  - Documented runtime-plane purpose and deferred data access/query-mutation work to prompt `06`.
- Files changed:
  - `src/data/schema/runtime/chronicles.ts`
  - `src/data/schema/runtime/scenes.ts`
  - `src/data/schema/runtime/state.ts`
  - `src/data/schema/runtime/events.ts`
  - `src/data/schema/runtime/relations.ts`
  - `src/data/schema/runtime/index.ts`
  - `src/data/schema/shared.ts`
  - `src/data/schema/index.ts`
  - `src/data/schema/README.md`
  - `docs/runtime-schema.md`
  - `drizzle/0001_open_radioactive_man.sql`
  - `drizzle/meta/0001_snapshot.json`
  - `drizzle/meta/_journal.json`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run db:generate` (with local `DATABASE_URL` set)
  - `npm run db:migrate` (with local `DATABASE_URL` set)
  - local PostgreSQL table verification query via `node` + `pg`
  - `npm run verify`
  - `npm run format:check`
- Verification:
  - Confirmed lint and typecheck pass after runtime schema additions.
  - Confirmed runtime migration generation succeeds and adds 9 runtime tables.
  - Confirmed runtime migration application succeeds against local `inkbranch_dev`.
  - Confirmed all expected runtime tables exist and authoring tables remain intact.
  - Confirmed no beat/graph-style runtime table names were introduced.
  - Confirmed schema exports remain clean through `src/data/schema/index.ts`.
- Follow-up notes / risks:
  - JSONB payload fields are intentionally bounded to snapshots and structured effect payloads; relational columns remain primary truth.
  - `perspective_runs.last_scene_instance_id` is intentionally left as a nullable UUID reference field without an FK to avoid tight cyclical constraints at this stage.
  - Data access boundaries (queries/mutations/mappers/repositories) remain intentionally deferred to `06_data_access_boundaries.md`.


### 2026-04-08 - Data access boundaries
- Prompt: `06_data_access_boundaries.md`
- Status: completed
- Summary:
  - Implemented disciplined query, mutation, and mapper boundaries for authoring and runtime data access.
  - Added server-only DB-access modules so persistence calls do not leak into UI/page layers.
  - Added typed foundational read/write surfaces for current authoring and runtime schemas.
  - Documented data-layer usage rules and separation from planner/runtime orchestration logic.
- Files changed:
  - `src/data/mappers/authoring.ts`
  - `src/data/mappers/runtime.ts`
  - `src/data/mappers/index.ts`
  - `src/data/queries/authoring/worlds.ts`
  - `src/data/queries/authoring/books.ts`
  - `src/data/queries/authoring/entities.ts`
  - `src/data/queries/authoring/planning-rules.ts`
  - `src/data/queries/authoring/index.ts`
  - `src/data/queries/runtime/chronicles.ts`
  - `src/data/queries/runtime/scenes.ts`
  - `src/data/queries/runtime/state.ts`
  - `src/data/queries/runtime/events.ts`
  - `src/data/queries/runtime/index.ts`
  - `src/data/queries/index.ts`
  - `src/data/mutations/authoring/worlds.ts`
  - `src/data/mutations/authoring/books.ts`
  - `src/data/mutations/authoring/entities.ts`
  - `src/data/mutations/authoring/planning-rules.ts`
  - `src/data/mutations/authoring/index.ts`
  - `src/data/mutations/runtime/chronicles.ts`
  - `src/data/mutations/runtime/scenes.ts`
  - `src/data/mutations/runtime/state.ts`
  - `src/data/mutations/runtime/events.ts`
  - `src/data/mutations/runtime/index.ts`
  - `src/data/mutations/index.ts`
  - `docs/data-access-boundaries.md`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `rg -n "@/data/db" src/ui src/app`
  - `npm run verify`
  - `npm run format:check`
- Verification:
  - Confirmed query and mutation modules compile with strict typing and server-only boundaries.
  - Confirmed lint/typecheck/tests/build all pass after adding data access modules.
  - Confirmed no `@/data/db` imports exist under `src/ui` or `src/app`.
  - Confirmed import guardrails remain satisfied.
- Follow-up notes / risks:
  - Access surface intentionally focuses on foundational operations; additional feature-specific queries/writes are deferred to later prompts.
  - Transaction use is intentionally narrow (`createChronicleWithInitialState`, `createSceneInstanceWithChoices`).
  - Planner and runtime orchestration logic remains intentionally deferred to later core-layer prompts.


### 2026-04-08 - Studio shell
- Prompt: `07_studio_shell.md`
- Status: completed
- Summary:
  - Implemented the Studio shell layout, navigation, overview, and section route structure under App Router.
  - Added reusable Studio UI shell components under `src/ui/studio` for layout, overview cards, section headers, status badges, and empty states.
  - Kept Studio page files thin and presentational with no planner/runtime/generator logic.
  - Documented Studio shell purpose, boundaries, and how prompt `08` will extend it.
- Files changed:
  - `src/app/(studio)/studio/layout.tsx`
  - `src/app/(studio)/studio/page.tsx`
  - `src/app/(studio)/studio/worlds/page.tsx`
  - `src/app/(studio)/studio/books/page.tsx`
  - `src/app/(studio)/studio/versions/page.tsx`
  - `src/app/(studio)/studio/canon/page.tsx`
  - `src/app/(studio)/studio/entities/page.tsx`
  - `src/app/(studio)/studio/planning/page.tsx`
  - `src/ui/studio/layout/StudioShell.tsx`
  - `src/ui/studio/layout/StudioSidebar.tsx`
  - `src/ui/studio/layout/StudioHeader.tsx`
  - `src/ui/studio/layout/StudioNav.tsx`
  - `src/ui/studio/overview/StudioOverviewPanel.tsx`
  - `src/ui/studio/overview/StudioSectionCard.tsx`
  - `src/ui/studio/shared/StudioEmptyState.tsx`
  - `src/ui/studio/shared/StudioSectionHeader.tsx`
  - `src/ui/studio/shared/StudioStatusBadge.tsx`
  - `src/ui/studio/index.ts`
  - `src/app/globals.css`
  - `docs/studio-shell.md`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `rg -n "@/data/db" src/ui/studio 'src/app/(studio)'`
  - `rg -n "@/core/planner|@/core/runtime|@/core/generator" src/ui/studio 'src/app/(studio)'`
  - `npm run verify`
  - `npm run format:check`
- Verification:
  - Confirmed Studio routes compile and render in build output (`/studio` + all section routes).
  - Confirmed navigation links exist for overview/worlds/books/versions/canon/entities/planning.
  - Confirmed lint/typecheck/tests/build all pass after shell changes.
  - Confirmed no raw `@/data/db` imports in Studio UI/pages.
  - Confirmed no direct planner/runtime/generator imports in Studio UI/pages.
- Follow-up notes / risks:
  - Section content is intentionally placeholder-only and focused on shell structure.
  - Lightweight shell data loading is intentionally deferred until workflow prompt `08`.
  - Full authoring workflows remain intentionally deferred to `08_authoring_workflow_v1.md`.


### 2026-04-08 - Authoring workflow v1
- Prompt: `08_authoring_workflow_v1.md`
- Status: completed
- Summary:
  - Implemented first-pass Studio authoring workflow across worlds, books, versions, canon, entities, and planning-rule surfaces.
  - Added explicit create/list/edit flows for all required version-owned inputs: canon entries, characters, locations, factions, perspectives, milestones, reveal rules, pacing rules, and ending rules.
  - Made version ownership explicit through a reusable version-context selector across canon/entities/planning routes.
  - Preserved architecture boundaries by keeping DB access in data query/mutation modules and orchestration in server actions.
  - Added v1 documentation explaining workflow scope, simplifications, and non-beat-graph product direction.
- Files changed:
  - `docs/authoring-workflow-v1.md`
  - `src/app/(studio)/studio/_actions/form-utils.ts`
  - `src/app/(studio)/studio/_actions/planning.ts`
  - `src/app/(studio)/studio/canon/page.tsx`
  - `src/app/(studio)/studio/canon/new/page.tsx`
  - `src/app/(studio)/studio/canon/[canonEntryId]/edit/page.tsx`
  - `src/app/(studio)/studio/entities/page.tsx`
  - `src/app/(studio)/studio/entities/characters/page.tsx`
  - `src/app/(studio)/studio/entities/characters/new/page.tsx`
  - `src/app/(studio)/studio/entities/characters/[characterId]/edit/page.tsx`
  - `src/app/(studio)/studio/entities/locations/page.tsx`
  - `src/app/(studio)/studio/entities/locations/new/page.tsx`
  - `src/app/(studio)/studio/entities/locations/[locationId]/edit/page.tsx`
  - `src/app/(studio)/studio/entities/factions/page.tsx`
  - `src/app/(studio)/studio/entities/factions/new/page.tsx`
  - `src/app/(studio)/studio/entities/factions/[factionId]/edit/page.tsx`
  - `src/app/(studio)/studio/entities/perspectives/page.tsx`
  - `src/app/(studio)/studio/entities/perspectives/new/page.tsx`
  - `src/app/(studio)/studio/entities/perspectives/[perspectiveId]/edit/page.tsx`
  - `src/app/(studio)/studio/planning/page.tsx`
  - `src/app/(studio)/studio/planning/milestones/page.tsx`
  - `src/app/(studio)/studio/planning/milestones/new/page.tsx`
  - `src/app/(studio)/studio/planning/milestones/[milestoneId]/edit/page.tsx`
  - `src/app/(studio)/studio/planning/reveals/page.tsx`
  - `src/app/(studio)/studio/planning/reveals/new/page.tsx`
  - `src/app/(studio)/studio/planning/reveals/[revealRuleId]/edit/page.tsx`
  - `src/app/(studio)/studio/planning/pacing/page.tsx`
  - `src/app/(studio)/studio/planning/pacing/new/page.tsx`
  - `src/app/(studio)/studio/planning/pacing/[pacingRuleId]/edit/page.tsx`
  - `src/app/(studio)/studio/planning/endings/page.tsx`
  - `src/app/(studio)/studio/planning/endings/new/page.tsx`
  - `src/app/(studio)/studio/planning/endings/[endingRuleId]/edit/page.tsx`
  - `src/app/(studio)/studio/books/new/page.tsx`
  - `src/app/(studio)/studio/books/page.tsx`
  - `src/app/(studio)/studio/books/[bookId]/page.tsx`
  - `src/app/(studio)/studio/versions/new/page.tsx`
  - `src/app/(studio)/studio/versions/page.tsx`
  - `src/app/(studio)/studio/versions/[versionId]/page.tsx`
  - `src/app/(studio)/studio/page.tsx`
  - `src/app/globals.css`
  - `src/ui/studio/shared/StudioFormActions.tsx`
  - `src/ui/studio/shared/StudioSubnav.tsx`
  - `src/ui/studio/shared/StudioVersionContext.tsx`
  - `src/ui/studio/index.ts`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run build` (failed once due server-action utility module annotation)
  - `npm run verify` (failed once because `DATABASE_URL` was not set for build-time data collection)
  - `$env:DATABASE_URL='postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev'; npm run verify`
  - `npm run format:check`
  - `rg -n "@/data/db" src/ui 'src/app/(studio)/studio'`
  - `rg -n "@/core/planner|@/core/runtime|@/core/generator" src/ui/studio 'src/app/(studio)/studio'`
  - `rg --files 'src/app/(studio)/studio/canon' 'src/app/(studio)/studio/entities' 'src/app/(studio)/studio/planning'`
  - `rg -n "requireText|requireSlug|requireKey|parseJsonObject|parseNullableNumber" 'src/app/(studio)/studio/_actions'`
  - `rg -n "required" 'src/app/(studio)/studio/canon' 'src/app/(studio)/studio/entities' 'src/app/(studio)/studio/planning'`
  - `rg -n Json 'src/app/(studio)/studio/canon' 'src/app/(studio)/studio/entities' 'src/app/(studio)/studio/planning'`
- Verification:
  - Confirmed lint, typecheck, tests, and build all pass via `verify` when `DATABASE_URL` is set for build-time server data access.
  - Confirmed Studio routes compile for all required authoring surfaces, including canon/entities/planning list/new/edit sub-routes.
  - Confirmed no raw `@/data/db` imports were introduced in `src/ui` or Studio app routes.
  - Confirmed no planner/runtime/generator imports were introduced into Studio UI/routes.
  - Confirmed required fields are present on form surfaces and structured JSON fields are wired to server-side JSON validation helpers.
- Follow-up notes / risks:
  - Structured rule editing remains intentionally textarea+JSON based in v1 for clarity and speed.
  - End-to-end browser interaction tests are not yet implemented; current verification is compile/lint/type/build plus architecture scans.
  - Planner/runtime/generator workflows remain intentionally deferred to later prompts.


### 2026-04-08 - Planner contracts
- Prompt: `09_planner_contracts.md`
- Status: completed
- Summary:
  - Defined formal planner contracts for planning context, scene planning packages, decision packages, reveal eligibility, pacing state, ending eligibility, planner issues, and result envelopes.
  - Established planner service boundary interfaces for later deterministic implementation while keeping this prompt implementation-free.
  - Replaced placeholder planner contract exports with explicit split contract modules under `src/core/planner/contracts`.
  - Updated planner docs to clarify structural ownership and explicitly avoid beat-graph or prose-generation responsibilities.
- Files changed:
  - `src/core/planner/contracts/context.ts`
  - `src/core/planner/contracts/scene-plan.ts`
  - `src/core/planner/contracts/decisions.ts`
  - `src/core/planner/contracts/reveals.ts`
  - `src/core/planner/contracts/pacing.ts`
  - `src/core/planner/contracts/endings.ts`
  - `src/core/planner/contracts/issues.ts`
  - `src/core/planner/contracts/result.ts`
  - `src/core/planner/contracts/service.ts`
  - `src/core/planner/contracts/index.ts`
  - `src/core/planner/README.md`
  - `docs/planner-contracts.md`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `$env:DATABASE_URL='postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev'; npm run build`
  - `npm run format:check`
  - `rg -n "@/app|@/ui|@/data" src/core/planner/contracts`
  - `rg -n "export (async )?function|=>|class " src/core/planner/contracts`
  - `rg -n "\\b(beat|graph|node|edge)\\b" src/core/planner/contracts`
- Verification:
  - Confirmed planner contracts compile cleanly with lint and typecheck passing.
  - Confirmed no UI or persistence-layer imports exist in planner contracts.
  - Confirmed no implementation logic was added to planner contracts beyond typed interface declarations.
  - Confirmed no beat-graph-first naming appears in planner contract files.
  - Confirmed app build remains successful after contract refactor.
- Follow-up notes / risks:
  - Contract field depth is intentionally foundational and expected to deepen in `10_planner_mvp.md`.
  - Runtime commit behavior and generator integration remain intentionally out of scope for this prompt.
  - Diagnostics/result shapes are ready for deterministic planner implementation and later admin inspection work.


### 2026-04-08 - Planner MVP
- Prompt: `10_planner_mvp.md`
- Status: completed
- Summary:
  - Implemented a deterministic planner MVP service that evaluates authored truth and runtime context to produce valid scene and decision packages.
  - Added focused planner service modules for context loading, milestone targeting, reveal gating, pacing evaluation, ending eligibility, scene selection, and decision construction.
  - Added data-layer context loading support so planner services consume structured inputs through data access boundaries instead of direct DB calls.
  - Updated planner docs to describe the MVP flow, deterministic behavior, diagnostics, and architectural boundaries.
- Files changed:
  - `src/core/planner/contracts/context.ts`
  - `src/core/planner/contracts/reveals.ts`
  - `src/core/planner/contracts/endings.ts`
  - `src/core/planner/services/context-loader.ts`
  - `src/core/planner/services/milestone-selector.ts`
  - `src/core/planner/services/reveal-evaluator.ts`
  - `src/core/planner/services/pacing-evaluator.ts`
  - `src/core/planner/services/ending-evaluator.ts`
  - `src/core/planner/services/scene-selector.ts`
  - `src/core/planner/services/decision-builder.ts`
  - `src/core/planner/services/planner-mvp.ts`
  - `src/core/planner/services/index.ts`
  - `src/core/planner/strategies/index.ts`
  - `src/core/planner/README.md`
  - `src/data/queries/runtime/planner-context.ts`
  - `src/data/queries/runtime/index.ts`
  - `tests/planner/planner-mvp.test.ts`
  - `docs/planner-mvp.md`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run format:check`
  - `$env:DATABASE_URL='postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev'; npm run build`
  - `rg -n "@/app|@/ui|@/data/db|drizzle-orm|pg|Math\\.random" src/core/planner`
  - `rg -n "@/data/queries" src/core/planner/services`
  - `rg -n "\\b(beat|graph|node|edge)\\b" src/core/planner/contracts src/core/planner/services`
- Verification:
  - Confirmed planner services compile and execute through lint, typecheck, tests, and build.
  - Confirmed planner behavior is deterministic with focused tests for stable outputs and ending-scene eligibility handling.
  - Confirmed planner core modules do not import UI, raw DB clients, or generator/runtime commit concerns.
  - Confirmed planner context acquisition is routed through data access modules and runtime query boundaries.
  - Confirmed no beat-graph-first language or traversal model was introduced in planner contracts/services.
- Follow-up notes / risks:
  - The prompt file includes malformed duplicated sections; implementation followed the explicit MVP requirements that were intact.
  - Deterministic rule ordering is intentionally simple in MVP and expected to deepen with future continuity/validation prompts.
  - Runtime commit behavior remains intentionally separate and deferred to `11_runtime_commit_pipeline.md`.


### 2026-04-08 - Runtime commit pipeline
- Prompt: `11_runtime_commit_pipeline.md`
- Status: completed
- Summary:
  - Implemented a real runtime commit backbone with explicit Phase A scene instantiation and Phase B choice resolution orchestration.
  - Added modular runtime services for scene instantiation, choice resolution, event append, knowledge updates, canon commit updates, chronicle projection refresh, and perspective projection refresh.
  - Added runtime commit contracts and projection helpers to keep runtime behavior structural, deterministic, and inspectable.
  - Added a DB-backed runtime commit store adapter in the data mutation layer to keep core runtime logic persistence-agnostic while still committing relational runtime truth.
  - Added focused runtime tests validating instantiation, mismatch rejection, event append behavior, knowledge/canon updates, and projection refresh behavior.
  - Added runtime commit pipeline documentation and updated runtime README boundaries.
- Files changed:
  - `docs/runtime-commit-pipeline.md`
  - `src/core/runtime/README.md`
  - `src/core/runtime/contracts/events.ts`
  - `src/core/runtime/contracts/index.ts`
  - `src/core/runtime/contracts/pipeline.ts`
  - `src/core/runtime/contracts/ports.ts`
  - `src/core/runtime/contracts/records.ts`
  - `src/core/runtime/contracts/service.ts`
  - `src/core/runtime/projections/index.ts`
  - `src/core/runtime/projections/chronicle-state.ts`
  - `src/core/runtime/projections/perspective-run.ts`
  - `src/core/runtime/services/index.ts`
  - `src/core/runtime/services/append-event.ts`
  - `src/core/runtime/services/instantiate-scene.ts`
  - `src/core/runtime/services/refresh-chronicle-state.ts`
  - `src/core/runtime/services/resolve-choice.ts`
  - `src/core/runtime/services/runtime-commit-pipeline.ts`
  - `src/core/runtime/services/update-canon-commits.ts`
  - `src/core/runtime/services/update-knowledge.ts`
  - `src/core/runtime/services/update-perspective-run.ts`
  - `src/data/mutations/runtime/index.ts`
  - `src/data/mutations/runtime/runtime-commit-pipeline.ts`
  - `tests/runtime/runtime-commit-pipeline.test.ts`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run format:check`
  - `$env:DATABASE_URL='postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev'; npm run build` (attempted multiple times; timed out under local `.next` lock from active dev server process)
  - `rg -n "@/app|@/ui|@/data/db|drizzle-orm|\bpg\b" src/core/runtime`
  - `rg -n "@/core/planner/services|@/core/generator" src/core/runtime`
  - `rg -n "rendered prose|renderedProse|LLM|OpenAI|generator" src/core/runtime/services src/data/mutations/runtime/runtime-commit-pipeline.ts`
  - `rg -n "scene_instantiated|scene_choices_created|choice_resolved|knowledge_state_updated|canon_commit_created|chronicle_state_refreshed|perspective_run_updated" src/core/runtime src/data/mutations/runtime/runtime-commit-pipeline.ts`
  - `rg -n "@/data/db|@/data/mutations/runtime/runtime-commit-pipeline|createDatabaseRuntimeCommitPipeline" src/app src/ui`
- Verification:
  - Confirmed lint passes with architecture guardrails intact.
  - Confirmed TypeScript compile passes with the new runtime contracts, services, projections, and data adapter.
  - Confirmed focused runtime tests pass and cover instantiation, choice mismatch rejection, event append behavior, knowledge updates, canon commits, and projection refresh.
  - Confirmed runtime core does not import UI or raw data layer internals directly.
  - Confirmed runtime event typing and event append behavior use explicit stable event names.
  - Confirmed generator/prose logic remains out of runtime commit orchestration.
  - Build command could not complete in this session due persistent `.next` lock contention from an already-running local `next dev` process; this was logged and isolated from runtime pipeline correctness checks.
- Follow-up notes / risks:
  - Structural effect mapping is intentionally simple MVP logic and will need deeper continuity/validation rules in later prompts.
  - Chronicle and perspective projection summaries are explicit but still compact; richer projection detail can expand in admin/validation prompts.
  - Reader-facing submission flow remains intentionally deferred to `12_reader_shell.md`.
  - Prose generation remains intentionally separate and deferred to generator prompts.


### 2026-04-08 - Reader shell
- Prompt: `12_reader_shell.md`
- Status: completed
- Summary:
  - Implemented the Reader shell layout and chronicle-centered route flow for reader entry, chronicle listing, chronicle summary, and current scene viewing.
  - Added reusable Reader UI modules under `src/ui/reader` for shell layout, chronicle cards/summary/progress, scene frame/meta/placeholders, choice presentation, and shared empty/error/status helpers.
  - Wired Reader routes to runtime query modules so pages are data-backed while keeping page files thin and server-first.
  - Added loading, not-found, and error route surfaces for clean reader-state handling.
  - Added focused reader shell component tests and documentation for Reader scope and boundaries.
- Files changed:
  - `docs/reader-shell.md`
  - `src/app/(reader)/reader/layout.tsx`
  - `src/app/(reader)/reader/page.tsx`
  - `src/app/(reader)/reader/loading.tsx`
  - `src/app/(reader)/reader/error.tsx`
  - `src/app/(reader)/reader/not-found.tsx`
  - `src/app/(reader)/reader/chronicles/page.tsx`
  - `src/app/(reader)/reader/chronicles/loading.tsx`
  - `src/app/(reader)/reader/chronicles/[chronicleId]/page.tsx`
  - `src/app/(reader)/reader/chronicles/[chronicleId]/loading.tsx`
  - `src/app/(reader)/reader/chronicles/[chronicleId]/not-found.tsx`
  - `src/app/(reader)/reader/chronicles/[chronicleId]/error.tsx`
  - `src/app/(reader)/reader/chronicles/[chronicleId]/scene/page.tsx`
  - `src/app/(reader)/reader/chronicles/[chronicleId]/scene/loading.tsx`
  - `src/app/(reader)/reader/chronicles/[chronicleId]/scene/error.tsx`
  - `src/ui/reader/index.ts`
  - `src/ui/reader/layout/ReaderHeader.tsx`
  - `src/ui/reader/layout/ReaderNav.tsx`
  - `src/ui/reader/layout/ReaderShell.tsx`
  - `src/ui/reader/chronicle/ChronicleCard.tsx`
  - `src/ui/reader/chronicle/ChronicleList.tsx`
  - `src/ui/reader/chronicle/ChronicleSummary.tsx`
  - `src/ui/reader/chronicle/ProgressPanel.tsx`
  - `src/ui/reader/scene/ChoiceCard.tsx`
  - `src/ui/reader/scene/ChoiceList.tsx`
  - `src/ui/reader/scene/SceneFrame.tsx`
  - `src/ui/reader/scene/SceneMeta.tsx`
  - `src/ui/reader/scene/ScenePlaceholder.tsx`
  - `src/ui/reader/shared/ReaderEmptyState.tsx`
  - `src/ui/reader/shared/ReaderErrorState.tsx`
  - `src/ui/reader/shared/PerspectiveBadge.tsx`
  - `src/ui/reader/shared/ReaderStatusBadge.tsx`
  - `src/data/queries/runtime/chronicles.ts`
  - `src/data/queries/runtime/scenes.ts`
  - `src/app/globals.css`
  - `tests/reader/reader-shell-ui.test.tsx`
  - `vitest.config.ts`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run format:check`
  - `rg -n "@/data/db|@/data/queries|@/data/mutations" src/ui/reader`
  - `rg -n "@/core/planner/services|@/core/runtime/services|@/core/generator" 'src/app/(reader)/reader' src/ui/reader`
  - `rg -n "beat|graph|node|edge" 'src/app/(reader)/reader' src/ui/reader`
- Verification:
  - Confirmed lint and typecheck pass with Reader route/UI additions.
  - Confirmed reader shell tests pass and include empty state, chronicle summary rendering, and scene placeholder rendering coverage.
  - Confirmed Reader route structure exists for landing, chronicle listing, chronicle summary, and current-scene surfaces.
  - Confirmed Reader pages use runtime query boundaries and do not import runtime/planner/generator service internals.
  - Confirmed no raw DB imports exist in Reader UI components.
  - Confirmed loading, not-found, and error route surfaces are implemented.
- Follow-up notes / risks:
  - Scene presentation intentionally remains structural-first when prose is unavailable; deeper scene rendering is deferred to `13_scene_package_rendering.md`.
  - Reader interaction remains display-focused in this prompt; full choice submission UX stays thin/deferred until later integration prompts.
  - Generator integration remains separate and deferred to `14` and `15`.


### 2026-04-08 - Scene package rendering
- Prompt: `13_scene_package_rendering.md`
- Status: completed
- Summary:
  - Implemented a runtime-to-reader scene presentation mapper that transforms committed scene + choice records into a reader-safe scene model.
  - Added explicit scene composition with `SceneHeader`, `SceneBody`, `SceneFallbackBody`, `SceneMeta`, and refined choice rendering.
  - Implemented clear body precedence: committed prose when present, structural fallback body when prose is absent.
  - Updated the current scene route to stay thin by mapping runtime data first and rendering through reusable scene components.
  - Added rendering-focused tests for prose precedence, fallback rendering, and enabled/disabled choice presentation.
  - Documented scene package rendering ownership and boundaries ahead of generator boundary prompts.
- Files changed:
  - `docs/scene-package-rendering.md`
  - `src/data/mappers/reader-scene.ts`
  - `src/data/mappers/index.ts`
  - `src/app/(reader)/reader/chronicles/[chronicleId]/scene/page.tsx`
  - `src/ui/reader/index.ts`
  - `src/ui/reader/scene/SceneFrame.tsx`
  - `src/ui/reader/scene/SceneHeader.tsx`
  - `src/ui/reader/scene/SceneBody.tsx`
  - `src/ui/reader/scene/SceneFallbackBody.tsx`
  - `src/ui/reader/scene/SceneMeta.tsx`
  - `src/ui/reader/scene/ChoiceList.tsx`
  - `src/ui/reader/scene/ChoiceCard.tsx`
  - `src/ui/reader/scene/ScenePlaceholder.tsx`
  - `src/app/globals.css`
  - `tests/reader/scene-package-rendering.test.ts`
  - `tests/reader/reader-shell-ui.test.tsx`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run format:check`
  - `rg -n "@/data/db|@/data/queries|@/data/mutations" src/ui/reader`
  - `rg -n "@/core/planner/services|@/core/runtime/services|@/core/generator" 'src/app/(reader)/reader' src/ui/reader src/data/mappers/reader-scene.ts`
  - `rg -n "plannerPayload|generatorPayload|payloadJson|JSON" 'src/app/(reader)/reader/chronicles/[chronicleId]/scene/page.tsx' src/ui/reader src/data/mappers/reader-scene.ts`
  - `rg -n 'mode: "prose"|mode: "fallback"|SceneFallbackBody|mapRuntimeSceneForReader' src/data/mappers/reader-scene.ts src/ui/reader/scene tests/reader`
- Verification:
  - Confirmed lint and typecheck pass after rendering-layer refactor.
  - Confirmed rendering-focused tests pass for prose precedence, fallback behavior, and choice availability mapping.
  - Confirmed scene route composes through the mapper + reusable scene components rather than inline rendering logic.
  - Confirmed no raw DB imports exist in Reader UI components.
  - Confirmed planner/runtime commit/generator service internals are not imported into reader rendering components.
  - Confirmed raw planner/generator payload objects are not displayed as main scene body content.
- Follow-up notes / risks:
  - Structural fallback copy is intentionally simple and honest; literary prose quality remains for generator integration prompts.
  - Scene metadata presentation is intentionally lightweight to avoid turning Reader into an engine dashboard.
  - Generator boundary and AI generation remain intentionally deferred to `14_generator_boundary.md` and `15_generator_integration.md`.


### 2026-04-08 - Generator boundary
- Prompt: `14_generator_boundary.md`
- Status: completed
- Summary:
  - Implemented the formal generator boundary as a provider-agnostic, schema-first presentation layer.
  - Added explicit generator contracts for approved scene input, structured generated output, diagnostics, and success/failure/fallback result envelopes.
  - Added prompt builders, output validation, fallback construction, and generator orchestration that never mutates planner/runtime truth.
  - Added a deterministic mock adapter for non-provider development/test flow and focused generator-boundary tests.
  - Documented the boundary in generator-layer docs and `docs/generator-boundary.md`.
- Files changed:
  - `src/core/generator/contracts/input.ts`
  - `src/core/generator/contracts/output.ts`
  - `src/core/generator/contracts/issues.ts`
  - `src/core/generator/contracts/result.ts`
  - `src/core/generator/contracts/service.ts`
  - `src/core/generator/contracts/index.ts`
  - `src/core/generator/adapters/base.ts`
  - `src/core/generator/adapters/mock.ts`
  - `src/core/generator/adapters/index.ts`
  - `src/core/generator/prompts/shared.ts`
  - `src/core/generator/prompts/choices.ts`
  - `src/core/generator/prompts/scene.ts`
  - `src/core/generator/prompts/index.ts`
  - `src/core/generator/validators/output.ts`
  - `src/core/generator/validators/index.ts`
  - `src/core/generator/services/fallback.ts`
  - `src/core/generator/services/generate-scene.ts`
  - `src/core/generator/services/index.ts`
  - `src/core/generator/README.md`
  - `docs/generator-boundary.md`
  - `tests/generator/generator-boundary.test.ts`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test:run`
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run format:check`
  - `rg -n "@/app|@/ui|@/data" src/core/generator -g "*.ts"`
  - `rg -n "planNextScene|instantiateScene|resolveChoice|createCanonCommit|appendRuntimeEvent|db|drizzle|pg" src/core/generator -g "*.ts"`
  - `rg -n "scenePackage|plannerPayload|generatorPayload" src/core/generator -g "*.ts"`
- Verification:
  - Confirmed lint, typecheck, tests, and format checks pass after generator boundary implementation.
  - Confirmed generator output validation accepts valid schema-aligned payloads and rejects invalid payloads into explicit fallback envelopes.
  - Confirmed mock adapter path produces valid structured output through the same orchestration and validation boundary.
  - Confirmed prompt builders consume approved generator input fields and include explicit anti-story-control instructions.
  - Confirmed no forbidden `app/ui/data` imports or runtime/planner mutation logic were introduced in generator core modules.
- Follow-up notes / risks:
  - Live provider integration remains intentionally deferred to `15_generator_integration.md`.
  - Fallback prose is intentionally structural and honest; quality/tone refinement is expected to deepen once live integration is active.
  - Adapter-level timeout and provider-specific retry policies are intentionally deferred to prompt `15`.


### 2026-04-08 - Generator integration
- Prompt: `15_generator_integration.md`
- Status: completed
- Summary:
  - Integrated a live OpenAI adapter behind the established generator boundary while keeping the app provider-agnostic through configured generator services.
  - Added server-side env wiring for provider selection and generation enablement, including explicit missing-key handling when `openai` is requested.
  - Implemented structured OpenAI generation requests, adapter parsing, validation enforcement, and fallback continuity through existing generator result envelopes.
  - Connected generator output into the reader scene flow in a bounded server-side path without mutating runtime truth.
  - Added focused integration tests for adapter selection, live-adapter parsing, invalid-output fallback, and mock-path behavior.
- Files changed:
  - `.env.example`
  - `src/lib/env/index.ts`
  - `src/core/generator/adapters/openai.ts`
  - `src/core/generator/adapters/index.ts`
  - `src/core/generator/services/configured-service.ts`
  - `src/core/generator/services/index.ts`
  - `src/core/generator/README.md`
  - `src/data/mappers/generator-scene.ts`
  - `src/data/mappers/index.ts`
  - `src/app/(reader)/reader/chronicles/[chronicleId]/scene/page.tsx`
  - `docs/generator-integration.md`
  - `tests/generator/generator-integration.test.ts`
  - `vitest.config.ts`
  - `tests/stubs/server-only.ts`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test:run` (initially failed due Vitest not resolving `server-only`; fixed with test alias stub and reran)
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run format:check`
  - `rg -n "openai|OPENAI_API_KEY|Authorization: \`Bearer|/responses" src/app src/ui`
  - `rg -n "createOpenAiSceneGenerationAdapter|openai.ts|/responses|server-only" src/core/generator`
  - `rg -n "GENERATOR_PROVIDER|GENERATOR_ENABLED|OPENAI_MODEL|OPENAI_BASE_URL" .env.example src/lib/env src/core/generator/services/configured-service.ts`
- Verification:
  - Confirmed lint, typecheck, tests, and format checks pass after live integration changes.
  - Confirmed env-based runtime configuration resolves provider and generation mode with explicit handling for missing OpenAI key.
  - Confirmed live adapter path parses structured OpenAI output and returns adapter results through the boundary.
  - Confirmed invalid live output is rejected into structured fallback (`validation-failed`) via generator orchestration.
  - Confirmed mock/noop path remains available and passes focused integration tests.
  - Confirmed no OpenAI/provider call code was introduced into UI components, and provider integration remains server-side.
- Follow-up notes / risks:
  - OpenAI prompt/model tuning is intentionally minimal in this prompt and expected to evolve.
  - Reader integration currently performs on-demand generation for scenes without committed prose; persistence/inspection of generation outputs remains for later admin/inspection workflows.
  - Advanced retry/backoff and usage analytics are intentionally deferred.


### 2026-04-08 - Admin inspector
- Prompt: `16_admin_inspector.md`
- Status: completed
- Summary:
  - Implemented a chronicle-centered Admin Inspector route tree with shared layout and read-only inspection pages for state, scenes, choices/resolutions, events, knowledge, commits, and generation markers.
  - Added reusable admin UI modules under `src/ui/admin` for shell/navigation, chronicle summaries, scene/choice inspection, event/knowledge/commit views, generation panels, and shared inspector primitives.
  - Added admin-focused data query coverage for choice resolutions by chronicle/scene and used query-layer access only in admin routes.
  - Added focused admin inspector UI tests and documentation clarifying purpose, route coverage, and read-only boundaries.
- Files changed:
  - `src/app/(admin)/admin/layout.tsx`
  - `src/app/(admin)/admin/page.tsx`
  - `src/app/(admin)/admin/chronicles/page.tsx`
  - `src/app/(admin)/admin/chronicles/[chronicleId]/_lib/context.ts`
  - `src/app/(admin)/admin/chronicles/[chronicleId]/page.tsx`
  - `src/app/(admin)/admin/chronicles/[chronicleId]/state/page.tsx`
  - `src/app/(admin)/admin/chronicles/[chronicleId]/scenes/page.tsx`
  - `src/app/(admin)/admin/chronicles/[chronicleId]/scenes/[sceneInstanceId]/page.tsx`
  - `src/app/(admin)/admin/chronicles/[chronicleId]/events/page.tsx`
  - `src/app/(admin)/admin/chronicles/[chronicleId]/knowledge/page.tsx`
  - `src/app/(admin)/admin/chronicles/[chronicleId]/commits/page.tsx`
  - `src/app/(admin)/admin/chronicles/[chronicleId]/generation/page.tsx`
  - `src/ui/admin/layout/AdminShell.tsx`
  - `src/ui/admin/layout/AdminHeader.tsx`
  - `src/ui/admin/layout/AdminNav.tsx`
  - `src/ui/admin/chronicles/ChronicleList.tsx`
  - `src/ui/admin/chronicles/ChronicleCard.tsx`
  - `src/ui/admin/chronicles/ChronicleSummary.tsx`
  - `src/ui/admin/chronicles/ChronicleStatePanel.tsx`
  - `src/ui/admin/chronicles/PerspectiveRunList.tsx`
  - `src/ui/admin/chronicles/ChronicleInspectorNav.tsx`
  - `src/ui/admin/scenes/SceneInstanceList.tsx`
  - `src/ui/admin/scenes/SceneInstanceCard.tsx`
  - `src/ui/admin/scenes/SceneInstanceDetail.tsx`
  - `src/ui/admin/scenes/SceneChoiceList.tsx`
  - `src/ui/admin/scenes/ChoiceResolutionPanel.tsx`
  - `src/ui/admin/events/EventLogList.tsx`
  - `src/ui/admin/events/EventLogEntry.tsx`
  - `src/ui/admin/knowledge/KnowledgeStateList.tsx`
  - `src/ui/admin/knowledge/KnowledgeStateCard.tsx`
  - `src/ui/admin/commits/CanonCommitList.tsx`
  - `src/ui/admin/commits/CanonCommitCard.tsx`
  - `src/ui/admin/generation/GenerationResultPanel.tsx`
  - `src/ui/admin/generation/GenerationFallbackPanel.tsx`
  - `src/ui/admin/shared/InspectorEmptyState.tsx`
  - `src/ui/admin/shared/InspectorErrorState.tsx`
  - `src/ui/admin/shared/InspectorMetaTable.tsx`
  - `src/ui/admin/shared/InspectorStatusBadge.tsx`
  - `src/ui/admin/index.ts`
  - `src/data/queries/runtime/scenes.ts`
  - `src/app/globals.css`
  - `docs/admin-inspector.md`
  - `tests/admin/admin-inspector-ui.test.tsx`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run typecheck` (initial run caught tuple typing in `admin/chronicles/page.tsx`; fixed and reran)
  - `npm run lint`
  - `npm run test:run`
  - `npm run format`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `npm run format:check`
  - `$env:DATABASE_URL='postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev'; npm run build` (timed out due active local `next dev` lock)
  - `Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' } ...` (confirmed active `next dev` plus timed-out build processes)
  - `Stop-Process -Id 18684,23080,17920,22044 -Force` (cleaned up stuck build processes only)
  - `rg -n "@/data/db|drizzle-orm|@/data/schema" src/ui/admin 'src/app/(admin)/admin'`
  - `rg -n "@/core/planner/services|@/core/runtime/services|@/core/generator/adapters" src/ui/admin 'src/app/(admin)/admin'`
  - `rg --files 'src/app/(admin)/admin/chronicles'`
  - `rg -n "\\b(create|update|delete|insert|mutate|mutation)\\b" 'src/app/(admin)/admin' -g '*.tsx'`
- Verification:
  - Confirmed lint, typecheck, tests, and format checks pass with the new admin inspector surfaces.
  - Confirmed chronicle list, chronicle summary hub, and each chronicle sub-route (`state`, `scenes`, scene detail, `events`, `knowledge`, `commits`, `generation`) are implemented and data-backed via query modules.
  - Confirmed choice-resolution inspection is available per scene through new runtime query helpers.
  - Confirmed no raw DB/schema imports leaked into `src/ui/admin` or admin page files.
  - Confirmed admin remains read-only in this prompt (no runtime/planner/generator mutation controls introduced).
  - Build verification could not complete in this session due existing local `next dev` lock contention; all non-build quality gates passed.
- Follow-up notes / risks:
  - Payload detail uses expandable JSON blocks and stays secondary to shaped summaries; this can deepen incrementally with future needs.
  - Generation inspection currently reflects runtime scene markers (`renderedProse`, `generatorPayload`) and does not include provider-level prompt diagnostics by design.
  - Continuity/validation hardening remains intentionally deferred to `17_validation_and_continuity_guards.md`.


### 2026-04-08 - Validation and continuity guards
- Prompt: `17_validation_and_continuity_guards.md`
- Status: completed
- Summary:
  - Implemented a real continuity guard layer across planner scene validation, reveal legality, runtime transition safety, knowledge/canon consistency, chronicle projection coherence, ending safety, and generator truth-boundary safety.
  - Integrated validators into real runtime and generator execution paths so guard checks run before commits and before generated output is accepted.
  - Added structured guard contracts with machine-readable issue codes, severity, blocking, and fallback-allowed semantics.
  - Added focused continuity tests that block contradictory reveal sets, illegal reveals, invalid choice transitions, contradictory canon commits, knowledge regressions, premature ending eligibility, and projection mismatches while enforcing safe generator fallback behavior.
  - Documented guard-layer ownership, runtime touchpoints, and safe-degrade vs hard-block behavior.
- Files changed:
  - `src/core/validators/contracts/issues.ts`
  - `src/core/validators/contracts/result.ts`
  - `src/core/validators/contracts/service.ts`
  - `src/core/validators/contracts/index.ts`
  - `src/core/validators/rules/planner-scene.ts`
  - `src/core/validators/rules/reveals.ts`
  - `src/core/validators/rules/runtime-instantiation.ts`
  - `src/core/validators/rules/choice-resolution.ts`
  - `src/core/validators/rules/knowledge.ts`
  - `src/core/validators/rules/canon-commits.ts`
  - `src/core/validators/rules/chronicle-state.ts`
  - `src/core/validators/rules/endings.ts`
  - `src/core/validators/rules/generator-safety.ts`
  - `src/core/validators/rules/index.ts`
  - `src/core/validators/services/validate-planner-scene.ts`
  - `src/core/validators/services/validate-reveal-usage.ts`
  - `src/core/validators/services/validate-runtime-transition.ts`
  - `src/core/validators/services/validate-canon-commit.ts`
  - `src/core/validators/services/validate-ending-eligibility.ts`
  - `src/core/validators/services/validate-generator-output.ts`
  - `src/core/validators/services/index.ts`
  - `src/core/validators/README.md`
  - `src/core/runtime/contracts/issues.ts`
  - `src/core/runtime/contracts/ports.ts`
  - `src/core/runtime/services/resolve-choice.ts`
  - `src/core/runtime/services/runtime-commit-pipeline.ts`
  - `src/core/generator/services/generate-scene.ts`
  - `src/data/mutations/runtime/runtime-commit-pipeline.ts`
  - `tests/runtime/runtime-commit-pipeline.test.ts`
  - `tests/validators/continuity-guards.test.ts`
  - `docs/validation-and-continuity-guards.md`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run -- tests/validators/continuity-guards.test.ts`
  - `npm run test:run -- tests/runtime/runtime-commit-pipeline.test.ts` (initially failed after new ending guard; updated fixture to use `development` scene and reran)
  - `npm run test:run -- tests/generator/generator-integration.test.ts`
  - `npm run test:run`
  - `npm run format:check` (initially failed)
  - `npx prettier --write src/core/runtime/services/runtime-commit-pipeline.ts src/core/validators/rules/generator-safety.ts src/core/validators/rules/index.ts src/core/validators/rules/planner-scene.ts src/core/validators/rules/reveals.ts src/core/validators/services/validate-runtime-transition.ts tests/validators/continuity-guards.test.ts`
  - `npm run format:check`
  - `rg -n "@/app|@/ui|@/data" src/core/validators -g "*.ts"`
  - `rg -n "@/core/validators/services" src/core/runtime src/core/generator -g "*.ts"`
  - `rg -n "@/core/validators" src/app src/ui -g "*.ts" -g "*.tsx"`
  - `rg -n "validatePlannerScenePackage|validateRuntimeInstantiationInput|validateRevealUsage|validateKnowledgeUpdateInput|validateCanonCommitEffectsInput|validateChronicleProjectionInput|validateEndingTransition" src/core/runtime/services/runtime-commit-pipeline.ts`
- Verification:
  - Confirmed lint, typecheck, full test suite, and format check pass.
  - Confirmed focused guard tests pass for illegal reveals, contradictory allowed/blocked reveals, invalid choice resolution, contradictory canon commit, knowledge regression, premature ending eligibility, projection mismatch, and invalid generator output fallback.
  - Confirmed planner package validation and runtime instantiation guards run before scene instantiation commits.
  - Confirmed reveal, ending, knowledge, canon, and chronicle projection guards run in runtime choice resolution flow before committing side effects.
  - Confirmed generator output safety guard runs after schema validation and falls back safely on invalid output.
  - Confirmed no `app/ui/data` imports were introduced in validator core modules and no validator logic leaked into route/UI components.
- Follow-up notes / risks:
  - Current guard checks focus on explicit high-value continuity contradictions and are intentionally bounded MVP logic, not a generic policy engine.
  - Canon commit contradiction checks currently use key/value coherence and can deepen later with richer authored-canon cross-reference rules.
  - Chronicle projection validation currently catches structural drift/mismatch and can expand toward deeper event-history reconciliation in later phases.
  - Seed/demo world data remains intentionally deferred to `18_seed_data_and_demo_book.md`.


### 2026-04-08 - Seed data and demo book
- Prompt: `18_seed_data_and_demo_book.md`
- Status: completed
- Summary:
  - Seeded one coherent demo world/book/version package (`Brinebound Meridian` / `Last Light at Meridian Gate` / `demo-v1`) with meaningful authored truth for planner-led flow.
  - Added realistic demo entities, canon, perspectives, milestones, reveal rules, pacing rules, and ending rules in dedicated seed modules.
  - Implemented an executable runtime bootstrap (`seed:demo`) that resets the demo chronicle, runs planner + runtime commit pipeline, resolves one structural choice, and instantiates the next scene for Reader/Admin inspection.
  - Added demo seed documentation (`docs/demo-book.md`, `docs/seed-data.md`) and focused seed package tests.
  - Verified seeded content is present and usable across planner/runtime/query paths with concrete DB and service checks.
- Files changed:
  - `package.json`
  - `package-lock.json`
  - `scripts/seed-demo.ts`
  - `scripts/server-only-shim.cjs`
  - `src/data/seeds/demo-world.ts`
  - `src/data/seeds/demo-entities.ts`
  - `src/data/seeds/demo-canon.ts`
  - `src/data/seeds/demo-planning.ts`
  - `src/data/seeds/demo-runtime.ts`
  - `src/data/seeds/index.ts`
  - `docs/demo-book.md`
  - `docs/seed-data.md`
  - `tests/seeds/demo-seed-data.test.ts`
  - `prompts/STATUS.md`
- Commands run:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test:run -- tests/seeds/demo-seed-data.test.ts`
  - `$env:DATABASE_URL='postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev'; npm run seed:demo` (initially failed: missing/throwing `server-only`, then resolved with shim + script update; later failed once on canon uniqueness and was fixed)
  - `npm install server-only`
  - `npx prettier --write docs/demo-book.md docs/seed-data.md scripts/seed-demo.ts scripts/server-only-shim.cjs src/data/seeds/demo-entities.ts src/data/seeds/demo-planning.ts src/data/seeds/demo-runtime.ts src/data/seeds/demo-world.ts src/data/seeds/index.ts tests/seeds/demo-seed-data.test.ts`
  - `npm run format:check`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
  - `$env:DATABASE_URL='postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev'; npm run seed:demo` (final successful run)
  - DB verification via `node` + `pg` row-count query for world/book/version/authoring/runtime tables
  - Planner verification via `tsx --require ./scripts/server-only-shim.cjs` using `planNextSceneForChronicle(...)`
  - Reader/Admin query-path verification via `tsx --require ./scripts/server-only-shim.cjs` using runtime query modules
  - `rg -n "@/app|@/ui" src/data/seeds scripts/seed-demo.ts`
  - `rg -n "beat-graph|beat graph|node tree|scene tree|next-node" src/data/seeds docs/demo-book.md docs/seed-data.md scripts/seed-demo.ts`
- Verification:
  - Confirmed lint, typecheck, focused seed tests, full test suite, and format check all pass.
  - Confirmed `seed:demo` runs successfully against local DB and prints usable Reader/Admin chronicle routes.
  - Confirmed seeded authoring data exists with expected counts (world=1, book=1, active version=1, canon=12, characters=5, perspectives=2, milestones=6, reveals=4, endings=3).
  - Confirmed runtime bootstrap exists and works (chronicle created, 2 scene instances, 1 choice resolution, event log entries, current scene pointer present).
  - Confirmed planner operates on seeded runtime context and produces valid scene package output for the demo chronicle.
  - Confirmed Reader/Admin query paths load seeded chronicle state, current scene, choices, and event history.
  - Confirmed no forbidden `app/ui` imports were introduced in seed modules or scripts, and no beat-graph-first seed structure was introduced.
- Follow-up notes / risks:
  - Demo package scope is intentionally compact and deterministic for inspectability, not full-content breadth.
  - Seed script uses a scoped `server-only` shim for CLI execution paths while preserving app-layer architecture boundaries.
  - Runtime bootstrap currently exercises one resolution plus next-scene instantiation; deeper multi-cycle automation can be expanded later if needed.
  - Final quality-gate hardening remains for `19_tests_and_quality_gates.md`.


### 2026-04-08 - Tests and quality gates
- Prompt: `19_tests_and_quality_gates.md`
- Status: completed
- Summary:
  - Implemented an explicit three-layer test strategy with clear structure: `tests/unit`, `tests/integration`, and `tests/e2e`.
  - Added meaningful integration seam coverage for planner-to-runtime handoff and seed bootstrap coherence in addition to existing runtime/generator/reader/admin integration checks.
  - Added targeted Playwright E2E coverage for Studio load, Reader demo chronicle load, Admin chronicle inspection load, and a focused Reader navigation flow.
  - Added/normalized quality-gate scripts (`test:unit`, `test:integration`, `test:e2e`, `verify`) and validated a full end-to-end verify path.
  - Documented the testing strategy, command contract, and seed/bootstrap role in `docs/testing-and-quality-gates.md`.
- Files changed:
  - `package.json`
  - `package-lock.json`
  - `playwright.config.ts`
  - `docs/testing-and-quality-gates.md`
  - `tests/e2e/demo-fixture.ts`
  - `tests/e2e/studio.spec.ts`
  - `tests/e2e/reader.spec.ts`
  - `tests/e2e/admin.spec.ts`
  - `tests/e2e/demo-flow.spec.ts`
  - `tests/unit/planner/planner-mvp.test.ts` (moved)
  - `tests/unit/validators/continuity-guards.test.ts` (moved)
  - `tests/unit/generator/generator-boundary.test.ts` (moved)
  - `tests/unit/reader/scene-package-rendering.test.ts` (moved)
  - `tests/unit/smoke/constants.test.ts` (moved)
  - `tests/unit/seeds/demo-seed-data.test.ts` (moved)
  - `tests/integration/runtime/runtime-commit-pipeline.test.ts` (moved)
  - `tests/integration/generator/generator-integration.test.ts` (moved)
  - `tests/integration/reader/reader-shell-ui.test.tsx` (moved)
  - `tests/integration/admin/admin-inspector-ui.test.tsx` (moved)
  - `tests/integration/planner-runtime/planner-runtime-handoff.test.ts`
  - `tests/integration/seed/seed-bootstrap-coherence.test.ts`
  - `prompts/STATUS.md`
- Commands run:
  - `npm install -D @playwright/test`
  - `npm run test:e2e:install`
  - `npm run format:check` (initially failed)
  - `npx prettier --write docs/testing-and-quality-gates.md playwright.config.ts tests/e2e/admin.spec.ts tests/e2e/demo-fixture.ts tests/e2e/demo-flow.spec.ts tests/e2e/reader.spec.ts tests/e2e/studio.spec.ts tests/integration/planner-runtime/planner-runtime-handoff.test.ts tests/integration/seed/seed-bootstrap-coherence.test.ts`
  - `npm run format:check`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:unit`
  - `npm run test:integration`
  - `$env:DATABASE_URL='postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev'; npm run test:e2e` (initially timed out due stale `next dev` processes)
  - `Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' } ...` (identified stale dev server processes)
  - `Stop-Process -Id ... -Force` (cleaned stale `next dev`/Next server processes)
  - `$env:DATABASE_URL='postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev'; npm run test:e2e` (rerun successful)
  - `$env:DATABASE_URL='postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev'; npm run verify` (full gate successful)
  - `rg -n "@/app|@/ui|@/data" src/core -g "*.ts"`
  - `rg -n "@/app|@/ui" src/data/seeds scripts/seed-demo.ts`
  - `rg -n "test:unit|test:integration|test:e2e|verify" package.json`
- Verification:
  - Confirmed lint and typecheck pass after test-structure and script updates.
  - Confirmed unit tests pass (`tests/unit`), including planner/runtime-adjacent validators/generator/rendering/seed package checks.
  - Confirmed integration tests pass (`tests/integration`), including runtime pipeline, generator integration, planner-runtime seam, and seed bootstrap coherence.
  - Confirmed Playwright E2E suite passes for Studio, Reader demo chronicle, Admin chronicle inspection, and demo Reader flow.
  - Confirmed `verify` passes with the full configured gate: lint + typecheck + unit + integration + build + e2e.
  - Confirmed demo seed/bootstrap remains usable because `test:e2e` executes `seed:demo` before browser checks.
  - Confirmed no forbidden app/ui imports were introduced into core/seed script boundaries in this prompt’s changes.
- Follow-up notes / risks:
  - E2E coverage is intentionally scoped to highest-value routes/flows, not an exhaustive browser suite.
  - E2E and verify assume a reachable local Postgres demo DB (`DATABASE_URL`) and Chromium install.
  - A stale-local-dev-process timeout can affect web server startup; reruns are stable after process cleanup.
  - Final documentation and handoff consolidation remains for `20_docs_and_handoff.md`.


### 2026-04-08 - Docs and handoff
- Prompt: `20_docs_and_handoff.md`
- Status: completed
- Summary:
  - Finalized the documentation/handoff layer with a strong root `README.md`, docs index, practical local setup guide, and explicit contributor continuation guidance.
  - Normalized architecture docs to reflect the implemented planner/runtime/generator/validator boundaries and removed stale deferred-prompt language.
  - Added explicit architecture red lines in prominent docs to preserve planner-first, relational-runtime, and generator-on-rails doctrine.
  - Cross-linked setup, seed/demo, testing, architecture, and contributor docs so future contributors can navigate and continue safely.
  - Verified documentation updates against actual scripts, routes, test commands, and current repo behavior.
- Files changed:
  - `README.md`
  - `docs/README.md`
  - `docs/local-setup.md`
  - `docs/contributor-handoff.md`
  - `docs/architecture-overview.md`
  - `docs/module-boundaries.md`
  - `docs/admin-inspector.md`
  - `docs/planner-mvp.md`
  - `docs/generator-boundary.md`
  - `docs/authoring-schema.md`
  - `docs/runtime-schema.md`
  - `docs/seed-data.md`
  - `docs/testing-and-quality-gates.md`
  - `prompts/STATUS.md`
- Commands run:
  - `Get-ChildItem docs | Select-Object -ExpandProperty Name`
  - `Get-Content -Raw docs/architecture-overview.md`
  - `Get-Content -Raw docs/module-boundaries.md`
  - `Get-Content -Raw docs/rebuild-principles.md`
  - `Get-Content -Raw docs/admin-inspector.md`
  - `Get-Content -Raw docs/planner-mvp.md`
  - `Get-Content -Raw docs/generator-boundary.md`
  - `Get-Content -Raw docs/authoring-schema.md`
  - `Get-Content -Raw docs/runtime-schema.md`
  - `rg -n "deferred to|remains for prompt|Still deferred" docs README.md`
  - `npm run format:check` (initially failed)
  - `npx prettier --write README.md docs/README.md docs/local-setup.md docs/contributor-handoff.md`
  - `npm run format:check`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:run`
- Verification:
  - Confirmed root README now documents architecture posture, setup flow, demo usage, verify path, and architecture red lines.
  - Confirmed docs index and cross-links are in place for architecture/setup/workflow/demo/testing/handoff navigation.
  - Confirmed local setup instructions align with actual scripts (`db:migrate`, `seed:demo`, `dev`, `test:*`, `verify`).
  - Confirmed stale deferred-prompt references were removed/updated so docs match current implementation state.
  - Confirmed lint, typecheck, and test suite pass after doc normalization.
  - Confirmed no code-level architecture regressions were introduced while finalizing docs.
- Follow-up notes / risks:
  - Documentation is intentionally concise in some deeper subsystem narratives to keep onboarding practical.
  - Future expansions can add troubleshooting matrices and operational runbooks as production operations mature.
  - The sequential rebuild prompt chain is now complete (`00` through `20` checked).
