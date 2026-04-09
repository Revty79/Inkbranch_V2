# 08_authoring_workflow_v1.md

## Title
Inkbranch v2 — Authoring Workflow v1

## Objective
Implement the first-pass Studio authoring workflow for Inkbranch v2.

This prompt exists to turn the Studio shell into a functional authoring surface for the book-bible side of the platform.

By the end of this prompt, the repo should support a clean first-pass authoring workflow for:
- worlds
- books
- book versions
- characters
- locations
- factions
- perspectives
- canon entries
- arc milestones
- reveal rules
- pacing rules
- ending rules

This prompt is about giving the author a usable v1 workflow for entering and editing structured authored truth.

This is not the prompt for:
- planner implementation
- runtime orchestration
- generator integration
- full publishing workflows
- advanced permissions
- autosave
- rich editorial tooling
- admin observability

---

## Why this prompt matters
Inkbranch v2 depends on authored truth.

The planner cannot work cleanly without authored truth.
The generator should not invent core truth.
The runtime must commit against something stable.

That means Studio now needs to move beyond shell and become a real authoring surface.

But v1 should remain disciplined.

The purpose of this prompt is not to build a giant all-in-one authoring CMS.
The purpose is to create a clean first authoring path that lets an author:
1. create a world
2. create a book in that world
3. create a book version
4. populate the version with core authoring inputs
5. inspect and edit those inputs in a structured way

This should give later prompts a stable foundation.

---

## Product direction to preserve
Inkbranch v2 is not a hand-built beat graph editor.

Do not build authoring workflows centered around:
- beat nodes
- beat trees
- branch editors
- next-beat mapping
- manual scene graph wiring
- choice graph authoring

Instead, the authoring workflow should reflect the actual product model:
- world
- book
- version
- canon
- entities
- perspectives
- arc milestones
- reveal rules
- pacing rules
- ending rules

Studio v1 is for authoring the structured truth the planner will later consume.

---

## Non-negotiable rules
1. Do not implement planner logic in this prompt.
2. Do not implement runtime commit logic in this prompt.
3. Do not implement generator logic in this prompt.
4. Do not reintroduce beat-graph-first authoring concepts.
5. Do not put raw DB calls in Studio UI components.
6. Do not let page files become giant business-logic modules.
7. Do not create mega-forms that try to do everything at once.
8. Keep workflows version-centered where appropriate.
9. Use the data access layer, not ad hoc database access.
10. Build a usable v1 workflow, not the final authoring product.

---

## Scope
You should implement:
- first-pass Studio authoring pages and flows
- form-based creation/editing for core authoring entities
- version-centered authoring navigation and organization
- list/detail or list/form patterns where appropriate
- server-side read/write orchestration using the data layer
- clean reusable Studio form and list UI where useful
- validation appropriate for v1
- documentation for the authoring workflow

You should also:
- keep authoring surfaces modular
- keep routes and UI aligned with Studio shell structure
- reuse Studio shell UI where appropriate
- preserve architecture boundaries
- keep CRUD explicit and readable

---

## Out of scope
Do not implement:
- drag-and-drop editors
- rich text systems unless the repo already has a trivial compatible setup
- autosave
- collaborative editing
- publishing workflow automation
- version promotion workflow
- planner preview tools
- reader preview runtime
- generator preview
- asset management systems
- audit history UI
- auth/permission systems beyond existing scaffolding
- “universal editor” abstractions that hide all business structure

This is Studio v1, not Studio ultimate.

---

## Workflow philosophy

### Principle 1 — authoring should follow the real hierarchy
The v1 workflow should make the structure obvious:

world → book → book version → version-authored truth

That means:
- worlds own books
- books own versions
- versions own most authoring inputs

This hierarchy should be visible in the UI.

### Principle 2 — book version is the authoring anchor
Most editable authoring data in v1 should hang off a selected book version.

That includes:
- canon entries
- characters
- locations
- factions
- perspectives
- milestones
- reveal rules
- pacing rules
- ending rules

Do not blur version-specific authoring into book-global editing surfaces.

### Principle 3 — forms should be small and explicit
Do not create giant mega-forms for the whole book bible.

Prefer:
- focused forms
- focused lists
- focused create/edit surfaces
- clear section ownership

### Principle 4 — CRUD should remain transparent
The authoring workflow should use clear reads and explicit mutations.

Avoid:
- generic save-everything endpoints
- giant hidden form engines
- massive dynamic config forms unless truly necessary

### Principle 5 — Studio UI is not the engine
The authoring workflow may create and edit planner inputs.
It does not run the planner.
It does not validate runtime continuity.
It does not generate the story.

---

## Required route structure

You may refine the Studio route structure so authoring v1 is usable.

A recommended shape is:

```text
src/app/
  (studio)/
    studio/
      page.tsx
      worlds/
        page.tsx
        new/
          page.tsx
        [worldId]/
          page.tsx
          edit/
            page.tsx
      books/
        page.tsx
        new/
          page.tsx
        [bookId]/
          page.tsx
          edit/
            page.tsx
      versions/
        page.tsx
        new/
          page.tsx
        [versionId]/
          page.tsx
          edit/
            page.tsx
      canon/
        page.tsx
        new/
          page.tsx
        [canonEntryId]/
          edit/
            page.tsx
      entities/
        page.tsx
        characters/
          page.tsx
          new/
            page.tsx
          [characterId]/
            edit/
              page.tsx
        locations/
          page.tsx
          new/
            page.tsx
          [locationId]/
            edit/
              page.tsx
        factions/
          page.tsx
          new/
            page.tsx
          [factionId]/
            edit/
              page.tsx
        perspectives/
          page.tsx
          new/
            page.tsx
          [perspectiveId]/
            edit/
              page.tsx
      planning/
        page.tsx
        milestones/
          page.tsx
          new/
            page.tsx
          [milestoneId]/
            edit/
              page.tsx
        reveals/
          page.tsx
          new/
            page.tsx
          [revealRuleId]/
            edit/
              page.tsx
        pacing/
          page.tsx
          new/
            page.tsx
          [pacingRuleId]/
            edit/
              page.tsx
        endings/
          page.tsx
          new/
            page.tsx
          [endingRuleId]/
            edit/
              page.tsx

You may simplify this slightly if needed, but the end result must still support a real v1 authoring workflow.

Do not add beat-graph routes.

Required workflow coverage
1. Worlds

Support:

list worlds
create world
view world summary
edit world

At minimum, allow editing of stable v1 fields like:

slug
title
description
status
metadata if appropriate and bounded
2. Books

Support:

list books
create book
view book summary
edit book

At minimum, allow editing of:

world association
slug
title
premise
default tone
status
metadata if appropriate and bounded
3. Book Versions

Support:

list versions
create version
view version summary
edit version

At minimum, allow editing of:

associated book
version label
status
active flag
notes

This should become the main launch point into version-owned authoring surfaces.

4. Canon Entries

Support:

list canon entries for a selected version
create canon entry
edit canon entry

At minimum, allow editing of:

book version
entry type
subject type
subject id or subject reference input
canonical text
importance
visibility
tags
bounded metadata if appropriate

Keep subject linkage practical for v1.
Do not overbuild polymorphic UX.

5. Characters

Support:

list characters for a selected version
create character
edit character

Fields should include at minimum:

version
slug
name
summary
status
metadata if bounded and useful
6. Locations

Support:

list locations for a selected version
create location
edit location
7. Factions

Support:

list factions for a selected version
create faction
edit faction
8. Perspectives

Support:

list perspectives for a selected version
create perspective
edit perspective

Fields should include at minimum:

version
character association
slug
name
summary
voice guide
knowledge baseline
eligibility rules
status

Keep knowledgeBaseline and eligibilityRules practical for v1.
A textarea/json input can be acceptable if cleanly framed and validated.
Do not overbuild a custom rule builder yet.

9. Arc Milestones

Support:

list milestones for a selected version
create milestone
edit milestone

Fields should include at minimum:

version
arc key
milestone key
title
description
priority
required
sequence hint
eligibility rules
completion rules
10. Reveal Rules

Support:

list reveal rules for a selected version
create reveal rule
edit reveal rule
11. Pacing Rules

Support:

list pacing rules for a selected version
create pacing rule
edit pacing rule
12. Ending Rules

Support:

list ending rules for a selected version
create ending rule
edit ending rule
Version selection requirement

A major usability requirement for v1:

The Studio authoring flow must make it obvious which book version the author is working on.

Implement a clean version-selection pattern.

Acceptable approaches include:

version filter in section pages
version-aware route context
version header/breadcrumb context
explicit selected-version panels or controls

Whatever approach you choose, it must make version ownership obvious for:

canon
entities
planning rules

Do not make authors guess which version they are editing.

Required implementation tasks
Task 1 — inspect current Studio shell and data access layer

Inspect:

src/app/(studio)/studio/*
src/ui/studio/*
src/data/queries/*
src/data/mutations/*
current domain contracts
current schema
current import boundary rules

Determine the cleanest way to add v1 authoring without violating architecture boundaries.

Task 2 — design the Studio v1 navigation refinement

Refine Studio navigation so it supports actual authoring work.

It should now support:

overview
worlds
books
versions
canon
entities
planning

Where useful, add local section navigation or section sub-links.
Do not overcomplicate the nav.

Task 3 — create reusable Studio authoring UI building blocks

Create reusable UI pieces under src/ui/studio as needed, such as:

list panels
form sections
page headers
create/edit form wrappers
version context header
empty states
save/cancel action rows
table/list presentation blocks

Keep them small and reusable.

Do not create one giant generic form engine.

Task 4 — implement world/book/version v1 workflows

Implement the create/list/edit workflow for:

worlds
books
book versions

Use the mutation and query layers.

Keep route pages thin.
If server actions are appropriate and compatible with current architecture, use them carefully.
If a different clean server-side mutation path is better in the repo, use that.

Do not put raw DB calls in the page files.

Task 5 — implement version-owned authoring surfaces

Implement first-pass create/list/edit workflows for:

canon entries
characters
locations
factions
perspectives
arc milestones
reveal rules
pacing rules
ending rules

These should clearly belong to a selected book version.

Keep forms explicit and manageable.

Task 6 — keep complex rule fields practical in v1

Some fields are inherently structured, such as:

eligibility rules
completion rules
gating rules
exposure effects
pacing configs
priority rules
resolution templates
knowledge baseline

For v1, choose a practical editing approach.

Acceptable approaches include:

structured textareas with JSON validation
small grouped field sets for simple known fields
bounded JSON editors if the current repo already has a lightweight compatible approach

Do not build a sophisticated rule-builder UI yet unless it is extremely simple and clearly justified.

The key is:

usable now
validated enough
not overbuilt
Task 7 — add form validation appropriate for v1

Implement reasonable validation for the v1 forms.

At minimum validate:

required fields
slug-like fields where applicable
key fields where applicable
version association where required
structured JSON inputs where present

Use a clean and maintainable validation approach consistent with the stack.

Validation should be enough to prevent obviously broken authoring data from being created through Studio.

Do not turn this prompt into a giant form-framework exercise.

Task 8 — make list/detail flows readable

For each section, provide a readable list or summary surface.

At minimum the list pages should:

show the main records
provide create entry points
provide edit entry points
show clear empty states when nothing exists
provide enough context to understand what is being edited

Do not leave authoring trapped behind deep routes only.

Task 9 — preserve boundaries

Ensure:

Studio pages use data access modules, not raw DB
UI components do not import the DB client
planner/runtime/generator logic is not introduced
page files do not become giant logic files
version context is explicit
authoring remains separate from admin and reader concerns
Task 10 — document the v1 workflow

Create:

docs/authoring-workflow-v1.md

This doc should explain:

what the v1 authoring workflow covers
what entities can be created and edited
how version-centered authoring works
what is intentionally simplified in v1
what remains for later prompts
why this is not a beat graph editor
Task 11 — verify the authoring workflow

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
Studio authoring routes compile
list pages render
create/edit surfaces render
validation works for required fields
no raw DB imports leaked into UI
no engine logic leaked into Studio pages

If practical, also verify core happy-path authoring flows such as:

create world
create book
create version
create character
create canon entry
Task 12 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

UI and UX guidance
Good v1 authoring UX

Good:

section list page with clear create button
explicit create/edit page
small focused forms
version context visible
readable empty states
clear labels matching domain language
Bad v1 authoring UX

Bad:

one massive page that edits the whole book bible
hidden version context
giant generic schema-driven form for everything
planner or runtime concepts creeping into authoring views
old beat/node/graph terminology
Safe simplification guidance

This is v1.

That means it is acceptable to simplify some things so long as the structure stays clean.

Examples of acceptable simplifications:

create/edit pages instead of inline editing everywhere
textarea/json input for structured rule payloads
practical list views rather than polished tables
straightforward navigation over clever UX

Examples of unacceptable shortcuts:

store everything in one giant “book config” blob
combine all entities into one generic content table
create a generic “authoring item” editor that erases domain distinctions
hide version ownership
Suggested data access usage

Use the data layer explicitly.

Examples of the kind of access patterns this prompt should rely on:

query worlds
create world
update world
query books
create book
update book
query book versions
create/update book version
query version-owned entities
create/update version-owned entities

If the current data layer lacks a few needed explicit functions, add them cleanly there rather than bypassing the boundary.

Do not let Studio pages become direct schema callers.

Guardrails against bad authoring workflow design
Do not do this

Bad patterns include:

one /studio/editor page for everything
forms driven entirely by raw DB schema dumps
route files full of mutation logic
UI components importing data/db modules directly
authoring flow based on beat graphs
hiding structured rule fields in opaque undocumented blobs
Do this instead

Good patterns include:

explicit domain-aligned sections
world/book/version hierarchy
version-owned canon/entities/planning inputs
small clear forms
readable list pages
explicit create/edit routes
practical validation
Acceptance criteria

This prompt is complete only if all of the following are true:

Studio supports first-pass create/list/edit workflows for worlds.
Studio supports first-pass create/list/edit workflows for books.
Studio supports first-pass create/list/edit workflows for book versions.
Studio supports version-owned create/list/edit workflows for canon entries.
Studio supports version-owned create/list/edit workflows for characters, locations, factions, and perspectives.
Studio supports version-owned create/list/edit workflows for milestones, reveal rules, pacing rules, and ending rules.
Version context is clearly visible and understandable in the authoring workflow.
Studio pages remain thin and do not contain raw DB access.
UI components do not import the DB layer directly.
No planner/runtime/generator logic was introduced.
No beat-graph-first authoring structure was introduced.
docs/authoring-workflow-v1.md exists and explains the workflow clearly.
Lint and typecheck pass.
The repo is ready for 09_planner_contracts.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
Studio authoring routes compile/render cleanly enough to proceed
create/list/edit flows render for all required sections
required-field validation works
JSON/structured rule validation works where applicable
no forbidden imports were introduced
current architecture boundaries remain intact

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a half-usable authoring workflow behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 08_authoring_workflow_v1.md

To:

 08_authoring_workflow_v1.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 08_authoring_workflow_v1.md
Status: completed
Summary:
implemented the first-pass Studio authoring workflow for Inkbranch v2
added create/list/edit flows for world/book/version authoring and version-owned truth inputs
made version context explicit across canon, entities, and planning sections
documented the v1 authoring workflow and kept engine logic out of Studio
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally simplified v1 UX
note any structured-rule editing still using practical JSON/text inputs
note that planner/runtime/generator workflows remain for later prompts

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Studio becomes a real, structured authoring workflow for the book bible.

It fails if authoring collapses into a giant editor, a beat graph tool, or a page-level logic mess.


Next is `09_planner_contracts.md`, and that one is a big one because it formally defines what the planner is allowed to see and decide.