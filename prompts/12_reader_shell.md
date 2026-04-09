# 12_reader_shell.md

## Title
Inkbranch v2 — Reader Shell

## Objective
Build the reader-facing shell for Inkbranch v2.

This prompt exists to create the reader application shell and route structure for the interactive reading experience without implementing prose generation yet.

By the end of this prompt, the repo should have:
- a real Reader layout
- reader-facing route structure
- reader shell UI components
- chronicle-aware route flow scaffolding
- scene/choice presentation placeholders wired to runtime-safe data
- loading, empty, and error-state surfaces
- clean separation between reader UI, runtime commit logic, and generator logic
- documentation describing the purpose of the Reader shell

This prompt is about the reader frame and runtime-facing surface.

This is not the prompt for:
- prose generation
- generator provider integration
- full literary scene rendering
- admin observability UI
- planner implementation
- runtime commit implementation
- final polish of the end-to-end experience

---

## Why this prompt matters
Inkbranch v2 now has:
- authoring truth
- planner contracts and MVP planner
- runtime commit pipeline

But the reader still needs a proper home.

The Reader shell is where the run becomes visible.

It must give the product a clean space for:
- loading a chronicle
- displaying the current scene instance
- displaying available choices
- guiding the user through the reading flow
- surfacing progress and context safely
- handling empty, invalid, and unavailable states cleanly

Without this shell, the runtime has no usable surface.
With a bad shell, the app risks turning reader pages into runtime logic soup.

This prompt creates the reader-facing frame without collapsing UI and engine responsibilities together.

---

## Product direction to preserve
Inkbranch v2 is not a graph-traversal reading app.

Do not build the Reader shell around:
- node maps
- branch trees
- beat navigation
- graph explorer views
- “current node / next node” UX

Instead, the Reader shell should reflect the actual product loop:

book bible -> planner -> scene package -> reader decision -> runtime state update -> next scene package

The reader sees:
- the current chronicle/run
- the current scene instance
- the available choices
- the current perspective context
- readable progression context

The reader does not see:
- engine internals as the main interface
- beat graph structures
- raw planner diagnostics as core UX

---

## Non-negotiable rules
1. Do not implement prose generation in this prompt.
2. Do not implement planner algorithms in this prompt.
3. Do not implement runtime commit logic in this prompt.
4. Do not put raw DB calls in reader UI components.
5. Do not put runtime commit logic in route page files.
6. Do not reintroduce beat-graph-first reader concepts.
7. Keep page files thin and server-first where appropriate.
8. Keep reusable reader UI in `src/ui/reader`.
9. Use the data access layer for reading runtime state.
10. Build the shell, not the final literary experience.

---

## Scope
You should implement:
- a Reader layout
- reader route structure
- chronicle-focused page scaffolding
- reusable reader shell UI components
- scene display placeholders using current runtime-safe data
- choice display placeholders using current runtime-safe data
- progress / context surfaces
- loading / empty / error state components
- reader shell documentation

You should also:
- preserve architecture boundaries
- keep route pages thin
- keep UI separate from runtime services
- keep the shell ready for later scene rendering and generator integration

---

## Out of scope
Do not implement:
- prose generation
- final narrative styling polish
- AI generator integration
- final reader choice submission UX if it requires full runtime orchestration in-route
- in-app admin debugging tools
- deep bookmarking/resume features
- multiplayer/session sync
- audio/media enhancements
- final reader personalization systems
- beat graph viewers
- interactive map/graph navigation

This prompt is the Reader shell only.

---

## Reader shell philosophy

### Principle 1 — the reader shell presents runtime, it does not own runtime
The Reader shell may:
- read committed runtime state
- display the current scene instance
- display current available choices
- show progress and perspective context
- show empty or blocked states

The Reader shell must not:
- decide valid next scenes
- resolve runtime truth itself
- generate prose
- become the planner

### Principle 2 — pages stay thin
Reader route pages should:
- load the relevant chronicle / scene / choice data through query modules
- compose reusable UI components
- pass clean props into the reader UI layer

Reader route pages should not:
- contain raw DB access
- contain runtime orchestration
- contain generator logic
- grow into giant feature files

### Principle 3 — reusable reader UI belongs in `src/ui/reader`
Put reader-facing shell UI in `src/ui/reader`.

Examples:
- ReaderShell
- ReaderHeader
- SceneFrame
- ChoiceList
- ProgressPanel
- PerspectiveBadge
- ReaderEmptyState
- ReaderErrorState

Do not bury reusable reader UI under route folders.

### Principle 4 — route structure should reflect run experience
The Reader shell should make it obvious how a user moves through a chronicle.

It should be organized around:
- entering the reader
- selecting or loading a chronicle
- viewing the current scene state
- viewing the current scene and its choices

Do not organize it around graph navigation.

### Principle 5 — shell now, richer render later
This prompt should stop short of final generated-prose rendering.

It should make later prompts easy, especially:
- `13_scene_package_rendering.md`
- `14_generator_boundary.md`
- `15_generator_integration.md`

---

## Required route structure

Use or normalize a Reader route structure under App Router that keeps the reading experience organized.

A recommended route shape is:

```text
src/app/
  (reader)/
    reader/
      layout.tsx
      page.tsx
      chronicles/
        page.tsx
        [chronicleId]/
          page.tsx
          scene/
            page.tsx

You may refine this slightly if a cleaner route shape fits the repo better, but the route intent should remain:

/reader → reader landing / entry
/reader/chronicles → list or select chronicles
/reader/chronicles/[chronicleId] → chronicle summary / current run surface
/reader/chronicles/[chronicleId]/scene → current scene and available choices

You may add supporting route files such as:

loading.tsx
error.tsx
not-found.tsx

where useful and appropriate.

Do not add beat or graph route concepts.

Required UI structure

Use or normalize Reader UI support under:

src/ui/reader/
  layout/
    ReaderShell.tsx
    ReaderHeader.tsx
    ReaderNav.tsx
  scene/
    SceneFrame.tsx
    SceneMeta.tsx
    ScenePlaceholder.tsx
    ChoiceList.tsx
    ChoiceCard.tsx
  chronicle/
    ChronicleList.tsx
    ChronicleCard.tsx
    ChronicleSummary.tsx
    ProgressPanel.tsx
  shared/
    ReaderEmptyState.tsx
    ReaderErrorState.tsx
    PerspectiveBadge.tsx
    ReaderStatusBadge.tsx
  index.ts

  You may choose slightly different names if they are cleaner, but you should have:

reader shell frame
chronicle list/summary presentation
scene presentation
choice presentation
shared reader states

Do not create giant UI files.
Do not create business logic components here.

Required implementation tasks
Task 1 — inspect current app, runtime, and reader structure

Inspect:

src/app/(reader)/reader/*
src/ui/reader/*
current reader placeholders from 00
runtime queries from 06
runtime pipeline outputs from 11
current import guardrails

Determine how to evolve the placeholder into a real Reader shell without violating architecture boundaries.

Task 2 — create Reader layout

Implement src/app/(reader)/reader/layout.tsx.

This layout should:

establish the Reader shell frame
render a shared header or minimal nav area
render children
remain clean and composable

The layout should feel like a stable reader container.

Do not put runtime logic into this layout.

Task 3 — create Reader shell UI components

Create reusable Reader shell UI components under src/ui/reader.

At minimum implement:

a shell wrapper
a header
a chronicle summary/panel component
a scene frame component
a choice list component
shared empty/error state helpers
small status/perspective/progress components if useful

These should be presentational-first.

Keep them small, readable, and reusable.

Task 4 — implement reader landing page

Implement src/app/(reader)/reader/page.tsx.

This page should:

explain the purpose of Reader
link into chronicle selection or loading
act as a clear entry point to the reading experience

Do not overbuild the landing page.

Task 5 — implement chronicle listing page

Implement src/app/(reader)/reader/chronicles/page.tsx.

This page should:

list available chronicles or current chronicle candidates using the data access layer
show clear empty states if no chronicles exist yet
provide links into individual chronicle surfaces

If the current app state means only a minimal list is possible, that is acceptable, but it should be real and not just hardcoded text.

Keep page logic thin.
Do not import raw DB access directly into the page.

Task 6 — implement chronicle summary page

Implement src/app/(reader)/reader/chronicles/[chronicleId]/page.tsx.

This page should:

load the chronicle
load its current chronicle state
load relevant perspective/run summary data
show enough summary context to understand the run
provide a clear entry point to the current scene surface

Good examples of summary content:

chronicle status
current perspective
current scene reference if present
simple progress/projection info
empty or blocked state if the run is not ready

Do not dump raw runtime tables directly into the UI.
Shape the data cleanly.

Task 7 — implement current scene page

Implement src/app/(reader)/reader/chronicles/[chronicleId]/scene/page.tsx.

This page should:

load the current scene instance for the chronicle
load the current scene choices
display scene metadata and structural content that already exists
render choices in a clean reader-friendly way
handle empty scene states gracefully

At this stage, the page may show:

rendered prose if any currently exists in runtime
placeholder/structural scene content if prose generation is not yet present
planner/render metadata only in a reader-appropriate minimal way

Do not expose raw planner payloads as the main user-facing content.

Task 8 — add loading, empty, and error states

Add reader-appropriate support for:

loading
no chronicle found
no current scene available
empty chronicle list
chronicle not ready yet

Use clean route-level or shared UI state handling.

Do not let the reader experience degrade into blank pages.

Task 9 — use server/client boundaries intentionally

Default to server components unless interactivity truly requires a client component.

If you need client components:

keep them small
use them for actual UI interactivity only
do not move runtime state loading or commit logic into them

Keep the Reader shell server-first.

Task 10 — keep runtime commit separate

This prompt may display current scene choices, but it must not become the runtime commit pipeline itself.

If any submit or interaction path is added for future-facing shell completeness:

keep it extremely thin
route it through proper runtime services
do not embed commit logic in the page or UI component

If that is not necessary yet, do not add it.

Task 11 — create Reader shell documentation

Create:

docs/reader-shell.md

This doc should explain:

what the Reader shell is for
what routes exist
what data the Reader shell loads
what does and does not belong in Reader UI
why this prompt stops short of full prose generation
how later prompts will deepen the experience

It should also clarify that:

13_scene_package_rendering.md deepens scene presentation
generator work remains outside the Reader shell
runtime commit logic remains outside route/UI code
Task 12 — refine exports

Update src/ui/reader/index.ts and any local barrels needed so Reader UI is easy to compose later.

Keep exports intentional and readable.

Task 13 — verify the Reader shell

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
reader routes compile
chronicle list/summary routes load cleanly
scene route loads cleanly
no raw DB imports leaked into UI
no runtime/planner/generator logic leaked into reader UI
Task 14 — add focused reader shell tests if appropriate

Add a small amount of focused testing where useful, such as:

reader empty state rendering
chronicle summary rendering with minimal data
scene page handling missing scene state cleanly

Keep this light and purposeful.
Do not build the full end-to-end reader test matrix yet.

Task 15 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Design guidance
Good Reader shell design

Good:

clean layout
chronicle-first organization
clear route structure
reusable reader presentation components
graceful empty/loading/error states
thin page files
server-first composition
Bad Reader shell design

Bad:

route files full of runtime logic
UI components importing DB or runtime services directly
reader routes organized around graph nodes
exposing raw planner/runtime internals as user-facing UX
giant one-page reader implementation
pushing generator concerns into the shell
Safe simplification guidance

This is the Reader shell, not the final reading experience.

Acceptable simplifications:

structural scene placeholder rendering when prose is not ready
simple chronicle lists
minimal progress panels
straightforward header/navigation
practical empty states

Unacceptable shortcuts:

exposing planner payload JSON directly to readers as the main content
hardcoding fake chronicle data instead of using the data layer
embedding runtime commit logic in route handlers or components
introducing beat graph navigation
Suggested data access usage

Use the data layer explicitly.

The Reader shell will likely need read paths such as:

list chronicles
get chronicle by id
get chronicle state by chronicle id
get perspective runs for a chronicle
get current scene instance for a chronicle
get scene choices for the current scene instance

If one or two specific read helpers are missing, add them cleanly to the data layer instead of bypassing the boundary.

Do not let Reader pages import the DB client directly.

Guardrails against bad reader design
Do not do this

Bad patterns include:

one giant /reader/page.tsx that owns all logic
reader routes based on beat/node traversal
UI components importing db or raw mutations
reader pages resolving runtime choices directly
generator code embedded in scene components
planner diagnostics dumped into reader UX
Do this instead

Good patterns include:

chronicle-centered routes
thin pages
reusable reader UI
server-first composition
clean query usage
clear states for empty, loading, blocked, and current-scene views
Acceptance criteria

This prompt is complete only if all of the following are true:

Reader has a real shared layout under App Router.
Reader has a route structure for chronicle listing, chronicle summary, and current scene viewing.
/reader renders a meaningful entry shell.
Reader UI components live under src/ui/reader in a reusable structure.
Chronicle list and chronicle summary surfaces are real and data-backed.
Current scene surface is real and data-backed.
Loading, empty, and error states are implemented cleanly.
Page files remain thin and do not contain runtime/planner/generator logic.
No raw DB imports were added to Reader UI components.
No beat-graph-first concepts appear in Reader routes or UX.
docs/reader-shell.md exists and explains the shell clearly.
Lint and typecheck pass.
The repo is ready for 13_scene_package_rendering.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
reader routes compile or render cleanly enough to proceed
chronicle list page works
chronicle summary page works
scene page works
empty/loading/error states behave reasonably
no forbidden imports were introduced
reader shell remains within current architecture boundaries

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a half-formed Reader shell behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 12_reader_shell.md

To:

 12_reader_shell.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 12_reader_shell.md
Status: completed
Summary:
implemented the Reader shell, layout, chronicle routes, and current-scene surface
added reusable Reader UI shell components and clean reader states
established a chronicle-centered reading home without mixing in planner, generator, or runtime commit logic
documented the purpose and limits of the Reader shell
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally placeholder scene presentation
note any lightweight reader interactions intentionally deferred
note that scene rendering deepening remains for 13
note that generator integration remains separate

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Reader becomes a clean, chronicle-centered shell for viewing committed runtime state and current scene choices.

It fails if Reader turns into a runtime logic layer, a generator surface, a graph navigator, or a page-level monolith.


Next is `13_scene_package_rendering.md`, which is where the reader stops showing mostly structural placeholders and starts rendering scene packages cleanly before AI generation is added.
::contentReference[oaicite:1]{index=1}