# 06_data_access_boundaries.md

## Title
Inkbranch v2 — Data Access Boundaries

## Objective
Implement the data access layer boundaries for Inkbranch v2.

This prompt exists to create the read/write access structure that sits on top of the schema without leaking database calls across the app.

By the end of this prompt, the repo should have:
- a clean query layer
- a clean mutation layer
- a clean mapper layer
- explicit read/write boundaries
- server-only database access surfaces
- typed return shapes for current read paths
- typed input shapes for current write paths
- no direct database calls leaking into UI components or route pages
- documentation describing how the data layer must be used

This prompt is about data access organization and boundaries.

It is not the prompt for:
- planner logic
- runtime commit orchestration
- generator integration
- full studio CRUD
- reader flow implementation

---

## Why this prompt matters
Inkbranch v2 now has:
- a schema foundation
- an authoring schema
- a runtime schema

If raw database usage is allowed to spread freely now, the rebuild will drift right back into the same mess:
- route files talking directly to the database
- UI components importing queries
- engine logic mutating tables directly
- random helper files becoming shadow repositories
- business rules hiding inside ad hoc SQL

This prompt exists to stop that.

The goal is to create clear and disciplined access patterns so that:
- reads have a home
- writes have a home
- mapping has a home
- the rest of the system does not touch persistence directly

---

## Product direction to preserve
Inkbranch v2 is planner-first and runtime-inspectable.

That means the data layer must support:
- loading authored truth
- loading planner context
- loading runtime state
- committing state changes later through controlled mutation surfaces
- inspecting runs cleanly

It must not push the architecture back toward:
- route-owned database logic
- UI-owned persistence
- giant generic repository classes
- beat-graph data traversal patterns
- blob-first state management

---

## Non-negotiable rules
1. Do not implement planner algorithms in this prompt.
2. Do not implement runtime commit orchestration in this prompt.
3. Do not implement generator logic in this prompt.
4. Do not put raw DB calls in React UI components.
5. Do not put raw DB calls in client components.
6. Do not let route page components become data/repository layers.
7. Do not create one giant “repository” file for the whole app.
8. Keep reads and writes separate.
9. Keep mappers small and intentional.
10. Keep the data layer aligned with the schema and domain contracts, not with old app shortcuts.

---

## Scope
You should implement:
- query modules under `src/data/queries`
- mutation modules under `src/data/mutations`
- mapper modules under `src/data/mappers`
- clear index/barrel exports where useful
- small, typed access surfaces for the current schema
- server-safe DB access patterns
- data-layer documentation
- enough read/write modules to support future prompts cleanly

You should also:
- inspect the existing schema and contract layer
- keep data access aligned with authoring vs runtime separation
- preserve the existing architectural guardrails
- avoid speculative overbuilding

---

## Out of scope
Do not implement:
- full planner services
- full runtime mutation pipeline
- full studio CRUD routes
- full reader route flow
- server actions for product workflows unless absolutely needed
- auth integration
- generator provider integration
- admin screens
- broad caching strategy
- cross-cutting app orchestration modules

This prompt is about boundaries and access organization, not feature completion.

---

## Data access philosophy

### Principle 1 — reads and writes are different
Do not collapse everything into one generic repository abstraction.

Use:
- `queries` for reads
- `mutations` for writes
- `mappers` for translation or shaping where needed

That split should remain visible and intentional.

### Principle 2 — the data layer is not the domain layer
The data layer reads and writes persistence.
It does not decide story truth.

It may:
- assemble row data
- return typed records
- map schema data into domain-friendly shapes

It must not:
- decide valid scene progression
- decide legal reveals
- decide runtime continuity
- perform generator decisions

Those belong later in `core`.

### Principle 3 — route pages are not repositories
App route pages and layouts should not become the place where raw Drizzle queries live.

The page layer may call a query module.
It may call a mutation entry later through a controlled server-side path.
It must not become a data soup layer.

### Principle 4 — query modules should be purposeful
Do not make query files that are just giant grab bags of unrelated SQL.

Prefer small, purpose-driven modules such as:
- world queries
- book version queries
- perspective queries
- chronicle queries
- scene queries
- event queries

### Principle 5 — mutation modules should be narrow and explicit
Do not make a giant mutation file with every table mixed together.

Mutations should be shaped around clear write operations.

Good examples:
- create world
- create book
- create book version
- update character summary
- create chronicle
- create scene instance

Bad examples:
- `saveEverything.ts`
- `upsertAnyAuthoringThing.ts`
- `runtimeHelpers.ts` that mutates six unrelated tables

### Principle 6 — mappers are translators, not logic engines
Use mappers only when they improve clarity between:
- schema result shapes
- domain contract shapes
- feature-facing DTOs

Do not hide business rules in mappers.

---

## Required directory and file shape

Use or normalize a structure like:

```text
src/data/
  db/
    ...
  schema/
    ...
  queries/
    authoring/
      worlds.ts
      books.ts
      entities.ts
      planning-rules.ts
    runtime/
      chronicles.ts
      scenes.ts
      state.ts
      events.ts
    index.ts
  mutations/
    authoring/
      worlds.ts
      books.ts
      entities.ts
      planning-rules.ts
    runtime/
      chronicles.ts
      scenes.ts
      state.ts
      events.ts
    index.ts
  mappers/
    authoring.ts
    runtime.ts
    index.ts

    You may choose slightly different file names if they are clearer, but the separation should remain:

authoring reads
runtime reads
authoring writes
runtime writes
shared mapping

Do not collapse all of this into one or two giant files.

Required boundary rules
Query layer

Query modules may:

import from @/data/db
import from @/data/schema
import from @/core/domain/types
import from @/data/mappers
use Drizzle query/select APIs
shape typed results

Query modules must not:

import from @/ui
import from @/app
import planner services
import runtime services
mutate state unless the action is truly read-side support like harmless inspection-only helpers
Mutation layer

Mutation modules may:

import from @/data/db
import from @/data/schema
import from @/core/domain/types
import from @/data/mappers
use transactions where appropriate
perform explicit inserts/updates/deletes

Mutation modules must not:

import from @/ui
import from @/app
decide planner validity
decide reveal legality
decide ending legality
embed generator orchestration
Mapper layer

Mapper modules may:

transform DB row/result shapes into domain-facing shapes
normalize nullability or shape differences
prepare small DTOs for higher layers

Mapper modules must not:

call the DB
import from UI
decide business outcomes
become fake service layers
Required implementation tasks
Task 1 — inspect current schema and core contracts

Inspect:

src/data/schema/index.ts
authoring schema files
runtime schema files
src/core/domain/types/*
current placeholder query/mutation/mappers files if any

Determine a clean access layout that matches the actual schema now present.

Task 2 — normalize query structure

Create or normalize query modules for the current schema.

At minimum, provide query modules that make sense for future work in:

authoring reads
runtime reads

You do not need to implement every possible read in the whole app.
You do need enough clear access surfaces that later prompts do not need to hit the DB directly.

Minimum useful query surfaces should include examples such as:

fetch world by id or slug
fetch book by id or slug
fetch active book version for a book
fetch perspectives for a book version
fetch arc milestones / reveal rules / pacing rules / ending rules for a book version
fetch chronicle by id
fetch chronicle state by chronicle id
fetch perspective runs for a chronicle
fetch scene instances for a chronicle
fetch scene choices for a scene instance
fetch event log entries for a chronicle
fetch canon commits for a chronicle

Keep each module focused.
Do not make one mega-query file.

Task 3 — normalize mutation structure

Create or normalize mutation modules for the current schema.

At minimum, provide mutation modules that make sense for future work in:

authoring writes
runtime writes

You do not need to implement every future write operation.
You do need enough explicit write surfaces so later prompts have a disciplined starting point.

Minimum useful mutation surfaces should include examples such as:

create world
create book
create book version
create character
create location
create faction
create perspective
create chronicle
create chronicle state
create perspective run
create scene instance
create scene choices
append event log entry
create canon commit

Use clear names.
Keep them small and explicit.

Task 4 — use transactions only where they are obviously appropriate

If any mutation naturally creates dependent rows together, use a transaction cleanly.

Examples where a transaction may make sense:

create chronicle + create initial chronicle state
create scene instance + create scene choices

Do not turn every write into an elaborate transaction abstraction.
Use transactions where they clearly protect consistency.

Task 5 — add mapper support where useful

Create small mapper modules only where they improve clarity.

Examples:

map authoring row/result shapes to stable domain-facing records
map runtime joined results into concise inspection objects

Do not create mappers for the sake of having mappers.
Do not duplicate schema shape without purpose.

Task 6 — create typed result/input shapes where useful

For queries and mutations, create or infer typed input/output surfaces that are easy for future prompts to use.

These may come from:

domain contracts
schema inference where appropriate
small purpose-built DTOs

Keep the boundary explicit and readable.

Do not let the rest of the app depend on raw internal SQL result shapes if a mapper improves clarity.

Task 7 — mark server-only boundaries where appropriate

Any module that directly accesses the database should be treated as server-only.

If the repo’s current setup supports a lightweight server-only boundary marker, use it appropriately for DB-accessing modules.

The goal is to prevent accidental client import of DB access code.

Do not overengineer this.
Just make the boundary explicit and safe.

Task 8 — create data layer documentation

Create:

docs/data-access-boundaries.md

This doc should explain:

what belongs in queries
what belongs in mutations
what belongs in mappers
what higher layers are allowed to import
why route pages and UI must not access the DB directly
how later prompts should build on this layer

It should also explain that:

planner logic remains in core/planner
runtime orchestration remains in core/runtime
this prompt only establishes disciplined persistence access
Task 9 — add or refine exports

Update:

src/data/queries/index.ts
src/data/mutations/index.ts
src/data/mappers/index.ts

and any local barrels needed for clarity.

Keep export surfaces intentional.
Do not create barrel chaos.

Task 10 — verify the boundary layer

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
tests still pass if applicable
import guardrails are respected
query and mutation modules compile cleanly
no raw DB calls have leaked into UI or app routes
Task 11 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Implementation guidance
Query design guidance

Good query functions are:

purpose-named
small
typed
composable
scoped to one conceptual area

Good examples:

getWorldBySlug
getBookBySlug
getActiveBookVersionByBookId
getPerspectivesByBookVersionId
getChronicleById
getSceneChoicesBySceneInstanceId

Bad examples:

getEverythingForStudio
loadInkbranchState
queryHelper
dbStuff
Mutation design guidance

Good mutation functions are:

explicit
narrow
named after the write they perform
transaction-aware only when needed

Good examples:

createBook
createPerspective
createChronicle
createSceneInstance
appendEventLogEntry

Bad examples:

saveBookBible
saveSceneFlow
mutateRuntime
persistStoryThing
Mapper guidance

Good mappers:

clarify shape
normalize naming
reduce noisy join results
support higher-layer readability

Bad mappers:

hide branching logic
compute planner decisions
silently mutate or fetch
duplicate raw rows for no reason
Minimal expected write/read coverage

This prompt should not aim for exhaustive app completeness.

It should aim for enough clear surfaces that:

07_studio_shell.md and 08_authoring_workflow_v1.md have obvious authoring reads/writes
10_planner_mvp.md later has obvious planning-context reads to build on
11_runtime_commit_pipeline.md later has obvious runtime writes to extend
12_reader_shell.md and 13_scene_package_rendering.md later have obvious runtime reads

So think in terms of “foundational access surfaces,” not “every function the whole app will ever need.”

Guardrails against bad data layer design
Do not do this

Bad patterns include:

one global repository.ts
route pages importing db directly
UI components importing query modules
mutation files that also decide planner legality
query files that also mutate state
mappers that call the database
giant joined read functions that pretend to be the domain layer
Do this instead

Good patterns include:

small authoring query modules
small runtime query modules
small authoring mutation modules
small runtime mutation modules
optional small mappers where they help
explicit function names
server-only DB access modules
Acceptance criteria

This prompt is complete only if all of the following are true:

src/data/queries is populated with clean authoring and runtime read modules.
src/data/mutations is populated with clean authoring and runtime write modules.
src/data/mappers exists with only purposeful mapping helpers.
No raw DB calls were added to UI components.
No raw DB calls were added to route page/layout components.
Query and mutation modules are small, explicit, and typed.
Read and write concerns are clearly separated.
Any transactions used are narrow and justified.
docs/data-access-boundaries.md exists and explains the rules clearly.
Lint and typecheck pass.
Existing import guardrails are respected.
The repo is ready for 07_studio_shell.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
tests pass if present
query modules compile
mutation modules compile
data-layer imports respect current guardrails
no direct DB imports have leaked into src/ui or src/app

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a half-disciplined data layer behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 06_data_access_boundaries.md

To:

 06_data_access_boundaries.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 06_data_access_boundaries.md
Status: completed
Summary:
implemented disciplined query, mutation, and mapper boundaries for Inkbranch v2
prevented raw database access from leaking into UI and route layers
added typed foundational read/write surfaces for authoring and runtime tables
documented how the data layer must be used going forward
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally deferred access functions
note any transaction usage intentionally kept narrow
note that planner/runtime orchestration remains for later prompts

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if the database becomes accessible in a disciplined way.

It fails if DB access starts leaking across the app or if the data layer becomes a new monolith.


Next is `07_studio_shell.md`, where we give the authoring side a real home without letting studio UI swallow engine logic.
::contentReference[oaicite:1]{index=1}