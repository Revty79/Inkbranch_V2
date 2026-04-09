# 16_admin_inspector.md

## Title
Inkbranch v2 — Admin Inspector

## Objective
Build the admin inspection surface for Inkbranch v2.

This prompt exists to create a clean internal observability interface for inspecting authored/runtime behavior without turning the admin area into a logic layer.

By the end of this prompt, the repo should have:
- an Admin layout and route structure for inspection
- inspector views for chronicles
- inspector views for chronicle state
- inspector views for perspective runs
- inspector views for scene instances and scene choices
- inspector views for choice resolutions
- inspector views for knowledge state
- inspector views for event log entries
- inspector views for canon commits
- generation inspection surfaces where generation data/results are available
- documentation describing the purpose and limits of the Admin Inspector

This prompt is about observability and inspection.

This is not the prompt for:
- changing runtime truth from the admin UI
- planner implementation
- runtime commit implementation
- reader UX
- studio authoring workflows
- broad operational tooling
- analytics dashboards
- moderation systems

---

## Why this prompt matters
Inkbranch v2 is too complex to trust blindly.

We are building:
- authored truth
- planner-generated structure
- runtime commit logic
- reader presentation
- generator rendering

Without inspection, debugging turns into guesswork.

The Admin Inspector is how we answer questions like:
- what scene was actually instantiated
- what choices were actually presented
- what choice was actually selected
- what events were appended
- what knowledge became discovered
- what canon became committed
- what the current chronicle projection says now
- what generation succeeded, failed, or fell back

If this surface does not exist, the system becomes opaque.
If it is built badly, the admin UI turns into a dangerous logic dump.

This prompt creates a read-oriented inspection home.

---

## Product direction to preserve
Inkbranch v2 is planner-led, runtime-committed, and AI-on-rails.

The Admin Inspector must reflect that architecture.

It should make it possible to inspect:
- authored inputs indirectly through their runtime consequences where useful
- planner output consequences
- runtime truth
- generator presentation results/fallbacks

It must not become:
- a beat-graph control center
- a node editor
- a secret runtime mutation console
- a planner override UI
- a raw database dump disguised as a product surface

The admin area is for visibility, not architecture drift.

---

## Non-negotiable rules
1. Do not implement runtime mutation controls in this prompt.
2. Do not implement planner override controls in this prompt.
3. Do not implement generator override controls in this prompt.
4. Do not put raw DB calls into admin UI components.
5. Do not let page files become giant inspector logic files.
6. Do not expose beat-graph concepts or graph-first navigation.
7. Keep inspector views read-oriented and modular.
8. Use the data access layer, not ad hoc DB access.
9. Keep reusable admin UI in `src/ui/admin`.
10. Build inspection, not mutation tooling.

---

## Scope
You should implement:
- an Admin layout
- admin route structure
- chronicle list and detail inspection views
- runtime state inspection views
- scene and choice inspection views
- event log inspection views
- knowledge state inspection views
- canon commit inspection views
- generation result inspection views where data exists
- reusable admin inspector UI components
- admin inspector documentation

You should also:
- preserve architecture boundaries
- keep pages thin
- shape data cleanly for inspection
- keep the admin area read-focused
- prepare the repo for validation/quality work in later prompts

---

## Out of scope
Do not implement:
- edit/delete controls for runtime data
- replay/reset buttons unless already trivial and explicitly safe
- planner rerun controls
- generator rerun controls
- bulk operational tooling
- user management systems
- auth/role systems beyond existing scaffolding
- analytics aggregation beyond current inspection needs
- SQL console-like views
- “fix state” buttons
- raw mutation actions from the UI

This prompt is the inspection surface only.

---

## Admin inspector philosophy

### Principle 1 — inspect truth, do not redefine it
The admin area should show what exists.

It should make runtime truth legible.

It must not become a place where truth is manually rewritten through ad hoc buttons.

### Principle 2 — projection and history must both be visible
The admin area should expose both:
- current-state projection
- historical event trail

The system is not understandable from only one of these.

### Principle 3 — inspector views should be shaped, not dumped
Do not show giant raw JSON blobs as the default experience.

It is acceptable to expose structured payload blocks where helpful, but the primary UI should be shaped and readable.

The inspector should help a human understand what happened.

### Principle 4 — admin pages stay thin
Admin route pages should:
- load inspection data through query modules
- compose admin UI components
- keep page logic light

They should not:
- perform raw DB work
- contain runtime logic
- contain planner/generator logic

### Principle 5 — internal visibility should mirror architecture
The admin inspector should help make the boundaries legible:
- planner output consequences
- runtime committed truth
- scene package history
- generation success/fallback results

This is how you know whether the architecture is actually holding.

---

## Required route structure

Use or normalize an Admin route structure under App Router that makes inspection clear and scalable.

A recommended shape is:

```text
src/app/
  (admin)/
    admin/
      layout.tsx
      page.tsx
      chronicles/
        page.tsx
        [chronicleId]/
          page.tsx
          state/
            page.tsx
          scenes/
            page.tsx
            [sceneInstanceId]/
              page.tsx
          events/
            page.tsx
          knowledge/
            page.tsx
          commits/
            page.tsx
          generation/
            page.tsx

You may refine the subgrouping slightly if a cleaner route layout emerges, but the intent should remain:

/admin → admin overview
/admin/chronicles → list chronicles
/admin/chronicles/[chronicleId] → chronicle inspection summary
/admin/chronicles/[chronicleId]/state → current projection/state
/admin/chronicles/[chronicleId]/scenes → scene instance list
/admin/chronicles/[chronicleId]/scenes/[sceneInstanceId] → scene detail
/admin/chronicles/[chronicleId]/events → event log
/admin/chronicles/[chronicleId]/knowledge → knowledge state
/admin/chronicles/[chronicleId]/commits → canon commits
/admin/chronicles/[chronicleId]/generation → generation inspection if data exists

Do not add beat/node/graph navigation routes.

Required UI structure

Use or normalize Admin UI support under:

src/ui/admin/
  layout/
    AdminShell.tsx
    AdminHeader.tsx
    AdminNav.tsx
  chronicles/
    ChronicleList.tsx
    ChronicleCard.tsx
    ChronicleSummary.tsx
    ChronicleStatePanel.tsx
  scenes/
    SceneInstanceList.tsx
    SceneInstanceCard.tsx
    SceneInstanceDetail.tsx
    SceneChoiceList.tsx
    ChoiceResolutionPanel.tsx
  events/
    EventLogList.tsx
    EventLogEntry.tsx
  knowledge/
    KnowledgeStateList.tsx
    KnowledgeStateCard.tsx
  commits/
    CanonCommitList.tsx
    CanonCommitCard.tsx
  generation/
    GenerationResultPanel.tsx
    GenerationFallbackPanel.tsx
  shared/
    InspectorEmptyState.tsx
    InspectorErrorState.tsx
    InspectorMetaTable.tsx
    InspectorStatusBadge.tsx
  index.ts

  You may choose slightly different names if they are cleaner, but the responsibilities should remain clear:

shell
chronicle overview
scene inspection
event inspection
knowledge inspection
canon commit inspection
generation inspection
shared inspector components

Do not create giant UI files.

Required inspection coverage
1. Chronicle list

Support:

list chronicles
show core chronicle summary info
link into chronicle detail inspection

Useful fields may include:

chronicle id
status
book version reference
reader id if present
started/completed timestamps
current scene reference if available
2. Chronicle summary

Support:

inspect one chronicle at a high level
show current projection summary
show current perspective/run context
link to scenes, events, knowledge, commits, and generation views

This should act as the inspection hub for a single run.

3. Chronicle state

Support:

inspect chronicle_states
show current scene instance id
show current perspective id
show progress index
show ending lock or equivalent fields
show summary/projection fields cleanly

Make the projection legible.

4. Perspective runs

Support:

inspect perspective runs for a chronicle
show perspective id/name if available
show status
show entry count
show knowledge score if present
show last scene instance reference

This can be shown on chronicle summary and/or state surfaces.

5. Scene instances

Support:

list scene instances for a chronicle
inspect a single scene instance
show:
scene kind
scene goal
planner cycle
status
perspective run linkage
rendered prose presence/absence
generator payload presence/absence if applicable
planner payload presence/absence if appropriate

Do not default to massive payload dumps, but make deep inspection possible.

6. Scene choices and choice resolutions

Support:

inspect choices for a scene
inspect any choice resolution linked to the scene/chronicle
show:
choice key
label
intent
enabled/disabled
resolution type
resolution timestamp
structural effect hints where helpful

This should make it easy to see what was offered and what was selected.

7. Event log

Support:

list chronicle event log entries
show event type
timestamp
cause reference
concise payload summary
optional expandable payload detail if useful

Make the event history readable.
Do not make it a wall of raw JSON.

8. Knowledge state

Support:

inspect current knowledge state entries
show:
knowledge key
status
perspective scope if present
source scene reference if present
metadata summary where useful

This should help explain what the run currently “knows.”

9. Canon commits

Support:

inspect chronicle canon commits
show:
commit type
commit key
linked canon entry if present
source event linkage if present
commit value summary

This should make committed run truth visible.

10. Generation results / fallbacks

Where generation-related data is available, support inspection of:

whether generation succeeded
whether fallback was used
any issue/failure code
whether prose exists
whether generated choice presentation exists
minimal structured generation diagnostics if available

Do not turn this into a prompt lab.
Keep it inspection-focused.

Required implementation tasks
Task 1 — inspect current admin placeholders, data access layer, and runtime/generator data surfaces

Inspect:

src/app/(admin)/admin/*
src/ui/admin/*
runtime queries from 06
runtime pipeline outputs from 11
generation boundary/integration outputs from 14 and 15
current import guardrails

Determine the cleanest way to build a read-only admin inspector.

Task 2 — create Admin layout

Implement src/app/(admin)/admin/layout.tsx.

This layout should:

establish the Admin shell frame
render shared admin navigation
render a header area
render children
remain clean and composable

Do not put inspection logic directly into the layout.

Task 3 — create Admin shell UI components

Create reusable Admin shell and inspector UI under src/ui/admin.

At minimum implement:

shell wrapper
admin header
admin nav
chronicle summary components
scene inspection components
event log components
shared empty/error/meta components

Keep them presentational-first.

Task 4 — implement admin overview page

Implement src/app/(admin)/admin/page.tsx.

This page should:

explain the purpose of the Admin area
link into chronicle inspection
summarize the available inspection surfaces
make clear that this area is for observability, not runtime editing

Do not overbuild this page.

Task 5 — implement chronicle list and summary inspection

Implement:

/admin/chronicles
/admin/chronicles/[chronicleId]

These pages should:

load chronicle data through the data layer
show chronicle summaries
provide links to deeper inspection areas
remain thin
Task 6 — implement chronicle state and perspective-run inspection

Implement:

/admin/chronicles/[chronicleId]/state

This should show:

chronicle projection/state
perspective run summaries
links to current scene and related inspection surfaces

Keep the projection understandable.

Task 7 — implement scene and choice inspection

Implement:

/admin/chronicles/[chronicleId]/scenes
/admin/chronicles/[chronicleId]/scenes/[sceneInstanceId]

These pages should:

list scene instances
inspect a single scene instance
show linked choices
show linked resolutions where applicable
surface rendered prose presence cleanly
surface structural fields cleanly

Do not make the page a raw payload dump, but allow deeper inspection in a controlled way.

Task 8 — implement event log inspection

Implement:

/admin/chronicles/[chronicleId]/events

This page should:

list event log entries in chronological or reverse-chronological order
show readable event summaries
support inspecting payload detail when useful
Task 9 — implement knowledge and canon commit inspection

Implement:

/admin/chronicles/[chronicleId]/knowledge
/admin/chronicles/[chronicleId]/commits

These pages should make knowledge state and canon commitments legible and useful.

Task 10 — implement generation inspection

Implement:

/admin/chronicles/[chronicleId]/generation

This page should show generation-related inspection where available.

Examples:

scene has rendered prose
scene used fallback
generation issue code if captured
output summary/presence markers

Keep it bounded.
Do not build a provider prompt-debug lab here.

Task 11 — shape data for inspection through the data layer

Use the data access layer explicitly.

If a few new read helpers are needed for good inspection surfaces, add them cleanly to the query layer.

Do not let admin pages import the DB client directly.

The admin area should rely on query modules, not schema/db access in routes.

Task 12 — keep the admin area read-only

Do not add mutation controls.

If the existing UI patterns tempt you to add edit/delete buttons, do not.

This prompt succeeds by making the system visible, not editable.

Task 13 — create admin inspector documentation

Create:

docs/admin-inspector.md

This doc should explain:

what the Admin Inspector is for
what routes exist
what each route inspects
why this area is read-oriented
how it reflects the system architecture
what this prompt intentionally does not include
Task 14 — refine exports

Update src/ui/admin/index.ts and any local barrels needed so the admin UI is easy to compose and extend later.

Keep exports intentional and readable.

Task 15 — verify the inspector

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
admin routes compile
chronicle list and detail routes work
scene inspection routes work
event/knowledge/commit/generation routes work
no raw DB imports leaked into UI
no forbidden imports were introduced
admin remains read-only
Task 16 — add focused inspector tests if appropriate

Add a small number of focused tests where useful, such as:

chronicle summary renders with minimal data
scene detail renders choices and resolution state
event log renders readable entries
empty inspector states render cleanly
generation fallback state renders cleanly

Keep tests focused and purposeful.
Do not build a full admin e2e suite yet.

Task 17 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Design guidance
Good admin inspector design

Good:

chronicle-centered inspection
readable summaries
modular route structure
reusable admin UI
shaped inspection data
clean empty/error states
read-only posture
Bad admin inspector design

Bad:

giant /admin/page.tsx
raw database dumps as the main UX
mutation buttons for runtime truth
planner/debug logic mixed into pages
graph/node-based navigation
UI components importing DB modules directly
Safe payload-detail guidance

Some payload detail may be useful in admin views.

That is acceptable.

But payload detail should be:

secondary
collapsible or compartmentalized if large
clearly labeled
not the only way to understand the record

The main inspection UX should still be shaped and readable.

Good:

summary first, payload detail second

Bad:

full JSON blob as the page
Suggested data access usage

The Admin Inspector will likely need read paths such as:

list chronicles
get chronicle by id
get chronicle state by chronicle id
get perspective runs by chronicle id
get scene instances by chronicle id
get scene instance detail by id
get scene choices by scene instance id
get choice resolutions by scene instance id or chronicle id
get event log by chronicle id
get knowledge state by chronicle id
get canon commits by chronicle id
get generation/result markers by chronicle id or scene instance id

If a few specific read helpers are missing, add them cleanly to the query layer instead of bypassing the boundary.

Do not let admin pages import the DB client directly.

Guardrails against bad admin design
Do not do this

Bad patterns include:

admin pages mutating runtime data
raw DB client imports in admin UI or pages
graph/node inspection metaphors
provider prompt laboratories in admin by default
dumping payload JSON everywhere with no shaping
giant page files that own all admin logic
Do this instead

Good patterns include:

chronicle-centered inspection
clear route boundaries
shaped summaries
read-only surfaces
modular admin UI
data access through query modules
focused generation visibility, not experimentation tooling
Acceptance criteria

This prompt is complete only if all of the following are true:

Admin has a real shared layout under App Router.
Admin has a route structure for chronicle inspection and related runtime surfaces.
Chronicle list and chronicle summary inspection views are real and data-backed.
Chronicle state and perspective-run inspection is implemented.
Scene instance, scene choice, and choice resolution inspection is implemented.
Event log inspection is implemented.
Knowledge state inspection is implemented.
Canon commit inspection is implemented.
Generation result/fallback inspection is implemented where data exists.
Admin UI components live under src/ui/admin in a reusable structure.
Page files remain thin and do not contain raw DB access.
Admin remains read-only in this prompt.
No beat-graph-first concepts appear in Admin routes or UX.
docs/admin-inspector.md exists and explains the inspector clearly.
Lint and typecheck pass.
Focused inspector tests exist where appropriate and pass.
The repo is ready for 17_validation_and_continuity_guards.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
admin routes compile or render cleanly enough to proceed
chronicle list and summary pages work
state/scenes/events/knowledge/commits/generation pages work
empty/error states behave reasonably
no forbidden imports were introduced
no raw DB imports leaked into UI
admin remains read-only

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a fake inspector behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 16_admin_inspector.md

To:

 16_admin_inspector.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 16_admin_inspector.md
Status: completed
Summary:
implemented the Admin Inspector with chronicle-centered runtime and generation inspection surfaces
added reusable admin UI for state, scenes, choices, events, knowledge, canon commits, and generation visibility
kept the admin area read-only and separate from planner, runtime commit, and UI logic ownership
documented the inspector and added focused inspector tests
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any payload-detail views intentionally kept minimal
note any generation visibility fields that may deepen later
note that continuity/validation hardening remains for 17

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Inkbranch gains a clean, read-oriented inspection surface that makes runtime truth, scene history, events, knowledge, canon commits, and generation outcomes visible.

It fails if Admin becomes a mutation console, a graph debugger, a raw DB dump, or a page-level monolith.


Next is `17_validation_and_continuity_guards.md`, and that one is where we harden the whole machine so illegal reveals, contradictions, and bad ending transitions stop getting through.