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
- Implementation not yet started

## Queue
- [ ] 00_foundation_scaffold.md
- [ ] 01_tooling_and_guards.md
- [ ] 02_database_foundation.md
- [ ] 03_domain_contracts.md
- [ ] 04_authoring_schema.md
- [ ] 05_runtime_schema.md
- [ ] 06_data_access_boundaries.md
- [ ] 07_studio_shell.md
- [ ] 08_authoring_workflow_v1.md
- [ ] 09_planner_contracts.md
- [ ] 10_planner_mvp.md
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

### 2026-04-08 — Bootstrap and status foundation
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