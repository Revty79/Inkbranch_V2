# 00_foundation_scaffold.md

## Title
Inkbranch v2 — Foundation Scaffold

## Objective
Create the clean foundation for the Inkbranch v2 rebuild.

This prompt exists to establish the repository shape, architecture-safe directory layout, base application shell, module boundaries, and documentation scaffolding for a planner-first, book-first, world-first interactive fiction platform.

This is not a feature prompt.

Do not implement business logic.
Do not implement planner logic.
Do not implement runtime commits.
Do not implement AI generation.
Do not implement full CRUD flows.

The only purpose of this prompt is to make the repository structurally correct so later prompts can build on top of it without architecture drift.

---

## Why this prompt matters
The old Inkbranch repo became messy because too many responsibilities collapsed together:
- storage
- runtime engine
- AI generation
- admin CRUD
- projection syncing
- reader flow

This rebuild must prevent that from happening again at the filesystem and module-boundary level from day one.

The repo should make it easier to do the right thing than the wrong thing.

---

## Product direction to preserve
Inkbranch v2 is a planner-led interactive fiction platform.

Core flow:
book bible -> planner -> scene package -> reader decision -> runtime state update -> next scene package

Do not drift into:
world -> version -> beat -> choice -> next beat

This scaffold must make that older architecture harder to accidentally recreate.

---

## Non-negotiable architecture rules
1. No giant mega-files.
2. No giant runtime blob as the main source of truth.
3. No hand-authored beat graph as the core architecture.
4. No mixing repository, engine, and UI logic together.
5. The UI must not contain engine logic.
6. The planner decides what scene and choices are valid.
7. The generator turns approved structure into prose.
8. Runtime state must be relational, inspectable, and clean.
9. This prompt is foundation only, not feature implementation.
10. If existing repo code conflicts with this architecture, prefer clean rebuild structure over preserving old layout.

---

## Scope
You should create:
- the repo folder structure under `src`
- base route structure under `src/app`
- placeholder modules for domain/planner/runtime/generator/validators/data/ui
- path alias configuration if not already present
- architecture documentation stubs
- base root layout and minimal home page
- minimal reader/studio/admin route placeholders
- shared utility placeholders only where needed for the scaffold
- a clean separation between `core`, `data`, `ui`, and `app`

You should also:
- remove or replace structural artifacts that strongly enforce the old architecture if they conflict with the new scaffold
- preserve unrelated repo files when safe
- log any deletions or replacements in STATUS

---

## Out of scope
Do not implement:
- real database schema
- real auth
- real planner
- real runtime commit logic
- real generator integration
- story CRUD
- seed content
- tests beyond minimal sanity checks if needed
- styling polish beyond a simple readable shell
- API business logic
- any “temporary” beat graph system

If you feel tempted to “just stub a little logic,” do not.
Place explicit TODO-safe placeholders instead.

---

## Required repo shape

Create or normalize the project structure to the following shape:

```text
/prompts
/docs

/src
  /app
    /api
    /(reader)
      /reader
        /page.tsx
    /(studio)
      /studio
        /page.tsx
    /(admin)
      /admin
        /page.tsx
    /layout.tsx
    /page.tsx
    /globals.css

  /core
    /domain
      /README.md
      /types
      /rules
      /value-objects
    /planner
      /README.md
      /contracts
      /services
      /strategies
    /runtime
      /README.md
      /contracts
      /services
      /projections
    /generator
      /README.md
      /contracts
      /adapters
      /prompts
    /validators
      /README.md
      /contracts
      /rules

  /data
    /db
    /schema
    /queries
    /mutations
    /mappers

  /ui
    /shared
    /reader
    /studio
    /admin

  /lib
    /constants
    /env

    You may add a few tiny support files if truly necessary, but do not expand the scaffold into feature work.

Intent of each top-level source area
src/app

Owns route entry points, layouts, pages, and request orchestration only.

Must not contain planner logic.
Must not contain runtime state mutation logic.
Must not contain generator business logic.

src/core

Owns business/domain logic.

Contains the heart of the system:

domain contracts
planner contracts and services
runtime contracts and services
generator contracts and adapters
validation rules

This layer must remain framework-light and UI-free.

src/data

Owns persistence integration and data access boundaries.

Contains:

db setup
schema entry points
queries
mutations
mapping helpers

No route rendering.
No React UI.

src/ui

Owns presentational components only.

May render data.
May accept typed props.
Must not decide story validity.

src/lib

Owns generic repo-level helpers like constants and env helpers only.

Do not let lib become a junk drawer.

Existing repo handling

This repo is a rebuild from scratch.

That means:

do not refactor old architecture in place unless that is the simplest way to establish the new scaffold
do not preserve old folders just because they already exist
do not import old beat/choice graph concepts into new naming
do not wire old logic into new directories

If the repo contains conflicting structures, choose one of these:

remove them if safe
replace them if they block the new scaffold
leave them only if they are harmless and clearly not part of the new architecture

If you keep conflicting legacy code temporarily, do not connect the new scaffold to it.

Log all meaningful removals or structural replacements in STATUS.

Required files to create
App shell files

Create:

src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/app/(reader)/reader/page.tsx
src/app/(studio)/studio/page.tsx
src/app/(admin)/admin/page.tsx

These pages should be minimal placeholders that clearly identify their area and intended purpose.

Architecture documentation stubs

Create:

docs/architecture-overview.md
docs/module-boundaries.md
docs/rebuild-principles.md

These do not need to be exhaustive yet, but they should explain:

planner-first design
relational runtime direction
separation of core/data/ui/app
prohibition on beat-graph-first architecture
Layer README guard files

Create README guard files in:

src/core/domain/README.md
src/core/planner/README.md
src/core/runtime/README.md
src/core/generator/README.md
src/core/validators/README.md

Each README should state:

what the layer owns
what it must not own
examples of allowed responsibilities
examples of forbidden responsibilities
Placeholder module entry files

Create minimal placeholder entry files where needed so the structure is real and discoverable.

Examples are acceptable like:

src/core/domain/types/index.ts
src/core/planner/contracts/index.ts
src/core/runtime/contracts/index.ts
src/core/generator/contracts/index.ts
src/core/validators/contracts/index.ts
src/data/db/index.ts
src/data/schema/index.ts
src/data/queries/index.ts
src/data/mutations/index.ts
src/data/mappers/index.ts
src/ui/shared/index.ts
src/ui/reader/index.ts
src/ui/studio/index.ts
src/ui/admin/index.ts
src/lib/constants/index.ts
src/lib/env/index.ts

These should be placeholders only.
Do not add real business behavior.

Base app requirements
src/app/layout.tsx

Implement a minimal root layout that:

includes valid HTML/body shell
imports globals.css
uses a simple app title like Inkbranch v2
is clean and minimal
src/app/page.tsx

Implement a minimal landing page that:

identifies the project as Inkbranch v2
states that it is a planner-first rebuild
links to:
/reader
/studio
/admin

Do not add feature logic.
A simple page with a short architecture summary is enough.

Placeholder route pages

Each of:

/reader
/studio
/admin

should have a minimal placeholder page containing:

title
one-paragraph purpose summary
reminder of what belongs in that area

Examples:

reader: “reader-facing scene consumption and choices”
studio: “authoring and book-bible management”
admin: “inspection, diagnostics, and run observability”
Path alias requirements

Ensure the repo supports clean absolute imports using the @/ alias.

If the project already has working path aliases, validate and preserve them.
If not, configure them properly.

The expected alias behavior should support imports like:

@/core/domain/...
@/core/planner/...
@/data/db/...
@/ui/shared/...

Do not introduce complicated alias patterns.
Keep it clean and obvious.

Minimal implementation details
src/core/domain

Create placeholder contracts/types only.
Examples of future intended content:

authored truth types
book/version/world contracts
perspective contracts
arc/reveal/pacing/ending types
runtime value objects

Do not add database code here.

src/core/planner

Create contracts and service placeholders only.
Examples of future intended content:

PlanningContext
ScenePlan
DecisionPackage
planner interface contracts

Do not create actual planner algorithms yet.

src/core/runtime

Create contracts and service placeholders only.
Examples of future intended content:

choice resolution contracts
event append contracts
projection refresh contracts

Do not create mutation logic yet.

src/core/generator

Create contracts and adapter placeholders only.
Examples of future intended content:

generator input/output contracts
prose rendering adapter interfaces
structured output validation hooks

Do not integrate AI providers yet.

src/core/validators

Create placeholder validator contracts and docs.
Examples of future intended content:

reveal legality checks
continuity checks
pacing validation
ending eligibility checks

Do not implement validation logic yet.

src/data

Create folder structure and placeholder entry points only.
No real schema yet.
No real query logic yet.
No real mutation logic yet.

src/ui

Create placeholder directories and minimal export stubs only.
Do not move route logic into here yet.
This layer will later host reusable presentational components.

Documentation content requirements
docs/rebuild-principles.md

Must explain:

this is a rebuild, not a refactor
the old architecture is not the model
planner-first and relational-first principles
generator as renderer, not logic engine
why beat-graph-first architecture is rejected
docs/architecture-overview.md

Must describe:

top-level layers
intended data flow
the core loop:
book bible
planner
scene package
reader decision
runtime update
next scene package
docs/module-boundaries.md

Must describe:

what app can and cannot do
what core can and cannot do
what data can and cannot do
what ui can and cannot do
examples of good vs bad boundary crossing

Keep the docs readable and explicit.
Later prompts will deepen them.

Coding posture

Prefer:

small files
explicit exports
simple placeholders
obvious naming
architecture clarity over cleverness

Avoid:

giant placeholder files with many future concepts stuffed together
fake implementation to “look complete”
vague TODO dumping without boundary clarity
resurrecting old naming like beat/next-beat graph structures
Safe placeholder guidance

Good placeholder examples:

empty interfaces with comments
small typed objects
README boundary docs
tiny page components
minimal index.ts exports
file headers describing intended purpose

Bad placeholder examples:

giant speculative schema files
300-line “future engine” files
fake runtime blobs
unused helper jungles
copying old repo logic into new homes
If TypeScript or repo config already exists

Inspect before changing.

If the repo already has:

tsconfig.json
next.config.*
ESLint config
package scripts
app router shell

Then:

keep what is already clean and compatible
normalize only what conflicts with the rebuild scaffold
avoid unnecessary churn
log meaningful config changes in STATUS

Do not rewrite working config for cosmetic reasons.

Expected implementation tasks

Complete the following in order:

Task 1 — inspect repo foundation

Review the existing repository structure.
Determine what can stay, what must be replaced, and what should remain untouched for now.

Task 2 — normalize src architecture layout

Create the target folder structure under src with placeholder entry points.

Task 3 — establish base app shell

Create or normalize the minimal root layout, home page, and reader/studio/admin placeholder routes.

Task 4 — add architecture docs

Create the three docs files and the five layer README guard files.

Task 5 — normalize path aliases

Ensure @/ imports are supported cleanly.

Task 6 — sanity check build shape

Make sure the scaffold builds or typechecks cleanly enough for later prompts to proceed.

Task 7 — update STATUS

Mark this prompt complete only if the scaffold is fully in place and verified.

Acceptance criteria

This prompt is complete only if all of the following are true:

The repo has a clean src/app, src/core, src/data, src/ui, and src/lib structure.
The root app renders successfully with a minimal landing page.
/reader, /studio, and /admin routes exist and render minimal placeholder pages.
Architecture documentation files exist under /docs.
Layer README guard files exist under the core submodules.
Path aliases are working or correctly configured.
No real planner/runtime/generator/business logic has been implemented yet.
No beat-graph-first structures were introduced.
Any major conflicting legacy structure changes are logged.
The repo is in a stable state for prompt 01_tooling_and_guards.md.

If any of these are false, do not mark the prompt complete.

Suggested file content guidance
Example tone for layer README files

Use direct language like:

“This layer owns planner contracts and scene package decision logic.”
“This layer must not contain React components.”
“This layer must not directly decide story validity.”
“This layer exists so runtime logic stays out of UI.”
Example tone for placeholder pages

Use plain language, for example:

“Reader surface for scene delivery and decision consumption.”
“Studio surface for authored world/book/canon input.”
“Admin surface for run inspection and observability.”

Keep them sparse and clean.

Commands to run

Run only the commands needed to validate the scaffold.

Use the repo’s package manager and existing scripts if present.

At minimum, run whichever of these are available and appropriate:

install dependencies if required
typecheck if available
lint if available
build or dev-start sanity check if lightweight and appropriate

Prefer existing scripts from package.json.

Do not invent an elaborate validation routine at this stage.

Verification requirements

You must verify all of the following before marking complete:

the app shell compiles or typechecks cleanly enough to proceed
route files exist for /, /reader, /studio, and /admin
docs files exist
layer README files exist
placeholder module entry points exist
no accidental feature implementation slipped in

If verification reveals a problem, fix it before marking complete.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 00_foundation_scaffold.md

To:

 00_foundation_scaffold.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry using this structure:

Prompt: 00_foundation_scaffold.md
Status: completed
Summary:
created the v2 repo scaffold and route placeholders
established layer boundaries and architecture docs
normalized path alias usage
removed or isolated conflicting structural artifacts if needed
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any structural leftovers to clean up later
note any intentional placeholder limitations

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

Do not overbuild.

This prompt succeeds by creating a clean, enforceable foundation for the rebuild.

It fails if you start implementing the app itself.


A couple of the choices in that prompt are grounded in current official docs: Next.js App Router uses filesystem routing and a required root `app/layout.tsx`, and Next.js supports `tsconfig` path aliases like `@/…`; Drizzle’s migration flow is designed around `drizzle-kit` commands like generate and migrate, which is why I kept the scaffold ready for that later instead of inventing a custom persistence layout. :contentReference[oaicite:1]{index=1}

Next I’d write `01_tooling_and_guards.md`, because that’s the one that prevents Codex from violating the boundaries we just established.
::contentReference[oaicite:2]{index=2}