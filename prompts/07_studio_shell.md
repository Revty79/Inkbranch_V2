# 07_studio_shell.md

## Title
Inkbranch v2 — Studio Shell

## Objective
Build the Studio shell for Inkbranch v2.

This prompt exists to create the author-facing application shell and route structure for Studio without implementing the full authoring workflows yet.

By the end of this prompt, the repo should have:
- a real Studio layout
- Studio navigation
- Studio section route structure
- clean Studio UI scaffolding
- clear separation between Studio shell concerns and future authoring CRUD concerns
- no engine logic inside Studio UI
- no planner/runtime/generator logic inside Studio pages
- documentation describing the purpose of the Studio shell

This prompt is about shell and structure.

It is not the prompt for:
- full authoring CRUD
- planner implementation
- runtime orchestration
- generator integration
- admin inspection
- reader flow

---

## Why this prompt matters
Inkbranch v2 needs a clear home for authoring.

That home is Studio.

But Studio must not become:
- a junk drawer
- a direct database playground
- a planner control surface
- a runtime logic surface
- a place where engine logic gets hidden inside page files

This prompt creates the author-facing frame:
- layout
- navigation
- route organization
- placeholders for the authoring areas

The shell should make future authoring work feel obvious and organized without prematurely implementing the actual app.

---

## Product direction to preserve
Inkbranch v2 is a book-first, world-first, planner-led interactive fiction platform.

Studio exists to manage the book-bible side of the system:
- worlds
- books
- versions
- canon
- characters
- locations
- factions
- perspectives
- arc milestones
- reveal rules
- pacing rules
- ending rules

Studio does not decide:
- valid next scenes
- reader runtime outcomes
- reveal legality at runtime
- generated prose truth

Studio is for authoring inputs, not runtime control logic.

---

## Non-negotiable rules
1. Do not implement full CRUD in this prompt.
2. Do not implement planner logic in this prompt.
3. Do not implement runtime commit logic in this prompt.
4. Do not implement generator logic in this prompt.
5. Do not place raw database calls directly into Studio UI components.
6. Do not place engine logic in Studio page files.
7. Do not make Studio depend on beat-graph concepts.
8. Keep the Studio shell clean, navigable, and modular.
9. Prefer server-first route structure with presentational UI components.
10. Build a shell, not the whole Studio product.

---

## Scope
You should implement:
- a Studio layout
- Studio navigation
- Studio section route placeholders
- shared Studio UI shell components
- route grouping and file structure for Studio
- placeholders for future authoring modules
- lightweight server-side data loading only if needed to make the shell meaningful
- Studio shell documentation

You should also:
- preserve existing architecture boundaries
- keep page files thin
- keep reusable UI in `src/ui/studio`
- keep the shell ready for `08_authoring_workflow_v1.md`

---

## Out of scope
Do not implement:
- full create/edit/delete flows
- form-heavy authoring pages
- optimistic mutation behavior
- planner tools
- generator tools
- admin inspector functionality
- reader runtime pages
- auth protection unless trivial shell gating already exists
- deep caching strategy
- autosave systems
- publishing/version promotion logic

This prompt is the Studio frame only.

---

## Studio shell philosophy

### Principle 1 — Studio is an authoring home, not an engine host
The Studio shell may show:
- authored objects
- navigation
- section summaries
- placeholders
- lightweight loading states

It must not become the place where engine decisions are made.

### Principle 2 — page files stay thin
Page files should:
- compose layout and section components
- load minimal shell data where needed
- pass props into UI components

Page files should not:
- become giant feature files
- contain planner/runtime/generator logic
- perform sprawling DB orchestration inline

### Principle 3 — shared Studio UI belongs in `src/ui/studio`
Reusable Studio UI components should live under `src/ui/studio`.

Examples:
- shell header
- sidebar
- section cards
- empty states
- breadcrumb/header blocks
- version badges
- module status panels

Do not bury reusable Studio UI in route directories.

### Principle 4 — route structure should mirror authoring intent
The Studio shell should make it clear where future authoring work belongs.

The route structure should anticipate sections like:
- overview
- worlds
- books
- versions
- canon
- entities
- planning rules

Without fully implementing them yet.

### Principle 5 — shell now, workflow next
This prompt should stop short of full authoring workflow implementation.

It should make `08_authoring_workflow_v1.md` easy, not redundant.

---

## Required route structure

Use or normalize a Studio route structure under App Router that keeps the Studio shell organized and future-ready.

A recommended route shape is:

```text
src/app/
  (studio)/
    studio/
      layout.tsx
      page.tsx
      worlds/
        page.tsx
      books/
        page.tsx
      versions/
        page.tsx
      canon/
        page.tsx
      entities/
        page.tsx
      planning/
        page.tsx

You may choose slightly different subgrouping if it is cleaner, but the route intent should remain clear.

Recommended section meaning:

/studio → overview/dashboard
/studio/worlds → future world management
/studio/books → future book management
/studio/versions → future book-version management
/studio/canon → future canon entry management
/studio/entities → future characters/locations/factions/perspectives
/studio/planning → future arc milestones/reveal/pacing/ending rules

Do not add routes for beat graphs or node maps.

Required UI structure

Use or normalize Studio UI support under:

src/ui/studio/
  layout/
    StudioShell.tsx
    StudioSidebar.tsx
    StudioHeader.tsx
    StudioNav.tsx
  overview/
    StudioOverviewPanel.tsx
    StudioSectionCard.tsx
  shared/
    StudioEmptyState.tsx
    StudioSectionHeader.tsx
    StudioStatusBadge.tsx
  index.ts

  You may choose slightly different file names if they are cleaner, but you should have:

shell container
nav/sidebar
header
reusable section presentation pieces
shared empty/state components

Do not create giant UI files.
Do not create business logic components here.

Required implementation tasks
Task 1 — inspect current app and UI structure

Inspect:

src/app/(studio)/studio/page.tsx
any existing Studio placeholders
src/ui/studio/*
current navigation/home links
current import guardrails
current data access boundaries

Determine how to evolve the placeholder into a real shell without violating the rebuild rules.

Task 2 — create Studio layout

Implement src/app/(studio)/studio/layout.tsx.

This layout should:

establish the Studio shell frame
render shared Studio navigation
render a header area
render children
remain clean and composable

The layout should feel like the stable container for all Studio routes.

Do not put engine logic into this layout.

Task 3 — create Studio shell UI components

Create the reusable Studio shell components under src/ui/studio.

At minimum implement:

a shell wrapper component
a Studio sidebar or nav area
a Studio header
shared section header/empty state helpers
a simple badge/status component if useful

These components should be presentational-first.

Keep them small, readable, and reusable.

Task 4 — implement Studio navigation

Add navigation for the Studio sections.

At minimum include links to:

/studio
/studio/worlds
/studio/books
/studio/versions
/studio/canon
/studio/entities
/studio/planning

Use clear labels.

The navigation should reflect the product architecture.
It should not include old beat-graph-first concepts.

Task 5 — implement Studio overview page

Implement src/app/(studio)/studio/page.tsx as the Studio overview.

This page should:

explain the purpose of Studio
surface the main authoring areas
provide section entry points
make the system feel organized

Good content examples:

cards or panels for each section
a short explanation of the authoring model
status placeholders like “not yet implemented” where appropriate

Do not try to build the full dashboard product here.

Task 6 — implement section placeholder pages

Implement placeholder pages for:

worlds
books
versions
canon
entities
planning

Each page should:

have a section header
state the intended responsibility of the section
include a clean placeholder or empty state
make clear what will be built in later prompts

Examples:

worlds: “manage top-level universes”
books: “manage books within worlds”
versions: “manage draft/test/published book versions”
canon: “manage authored truth entries”
entities: “manage characters, locations, factions, perspectives”
planning: “manage milestones, reveals, pacing, endings”

Do not add full forms or CRUD yet.

Task 7 — add lightweight shell data only if needed

If the shell benefits from very light server-side data, keep it minimal.

Acceptable examples:

simple counts
existence checks
current empty-state awareness

If you add any data loading:

use the data-access layer
keep page files thin
do not import raw DB client into Studio pages or UI

If the shell is cleaner without live data yet, that is acceptable.
Do not force data loading into this prompt.

Task 8 — keep client/server boundaries clean

Default to server components unless interactivity truly requires client components.

If you introduce any client components:

keep them small
isolate them to actual UI interaction needs
do not move data fetching or engine logic into them

Do not convert the Studio shell into a client-heavy app unnecessarily.

Task 9 — create Studio shell documentation

Create:

docs/studio-shell.md

This doc should explain:

what the Studio shell is for
what routes exist
what belongs in Studio
what does not belong in Studio
why this prompt stops short of full CRUD
how later prompts should build on the shell

It should also clarify that:

08_authoring_workflow_v1.md adds first-pass authoring workflows
planner/runtime/generator logic remain outside Studio UI
Task 10 — refine exports

Update src/ui/studio/index.ts and any local barrels needed so Studio UI is easy to compose in later prompts.

Keep exports intentional and readable.

Task 11 — verify the Studio shell

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
the Studio shell routes render/compile
navigation works
no raw DB imports leaked into UI
no planner/runtime/generator logic leaked into Studio pages
Task 12 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Design guidance
Studio shell look and feel

Keep the Studio shell:

clean
readable
modular
clearly partitioned

It does not need final polish.
It does need strong information architecture.

Think:

left sidebar or top nav
clear section header
content container
section cards / empty states

Do not overdesign.
Do not under-structure.

Good Studio shell patterns

Good:

layout owns frame
nav is shared
pages stay thin
UI components are reusable
section placeholders explain intent
future CRUD homes are obvious

Bad:

one giant studio/page.tsx
route files full of hardcoded business logic
UI components importing data modules directly
old beat/node language in navigation
admin/runtime features mixed into Studio
Guardrails against bad Studio design
Do not do this

Bad patterns include:

putting planner controls in Studio pages
adding runtime debug logic here
importing db directly into Studio UI
turning section placeholders into mini-products prematurely
creating a beat graph explorer route
mixing admin observability into Studio shell routes
Do this instead

Good patterns include:

strong navigation
clear section ownership
reusable shell UI
placeholders that prepare future prompts
server-first route composition
presentational UI separation
Acceptance criteria

This prompt is complete only if all of the following are true:

Studio has a real shared layout under App Router.
Studio navigation exists and links to the main authoring sections.
/studio renders a meaningful overview shell.
Section routes exist for worlds, books, versions, canon, entities, and planning.
Studio UI components live under src/ui/studio in a reusable structure.
Page files remain thin and do not contain engine logic.
No raw DB imports were added to Studio UI components.
No beat-graph-first concepts appear in Studio structure or navigation.
docs/studio-shell.md exists and explains the shell clearly.
Lint and typecheck pass.
The repo is ready for 08_authoring_workflow_v1.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
Studio routes compile or render cleanly enough to proceed
navigation links are wired correctly
no forbidden imports were introduced
Studio shell remains within current architecture boundaries

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a half-formed Studio shell behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 07_studio_shell.md

To:

 07_studio_shell.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 07_studio_shell.md
Status: completed
Summary:
implemented the Studio shell, layout, navigation, and section route structure
added reusable Studio UI shell components
established a clean authoring home without mixing in engine logic
documented the purpose and limits of the Studio shell
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally placeholder section content
note any lightweight shell data intentionally deferred
note that full authoring workflows remain for 08

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Studio becomes a clean, navigable authoring shell.

It fails if Studio starts absorbing engine logic or turns into a premature feature dump.


Next is `08_authoring_workflow_v1.md`, where Studio stops being just a shell and gets its first real book-bible workflow.
::contentReference[oaicite:1]{index=1}