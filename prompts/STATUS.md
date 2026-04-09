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
- [ ] 11_runtime_commit_pipeline.md
- [ ] 12_reader_shell.md
- [ ] 13_scene_package_rendering.md
- [ ] 14_generator_boundary.md
- [ ] 15_generator_integration.md
- [ ] 16_admin_inspector.md
- [ ] 17_validation_and_continuity_guards.md
- [ ] 18_seed_data_and_demo_book.md
- [ ] 19_tests_and_quality_gates.md
- [ ] 20_docs_and_handoff.md

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
