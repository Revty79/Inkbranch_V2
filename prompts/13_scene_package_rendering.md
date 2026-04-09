# 13_scene_package_rendering.md

## Title
Inkbranch v2 — Scene Package Rendering

## Objective
Implement the first real scene package rendering layer for Inkbranch v2.

This prompt exists to turn committed scene instances and their decision packages into a clean, reader-facing presentation layer before AI prose generation is introduced.

By the end of this prompt, the repo should have:
- a real scene package rendering pipeline for the Reader surface
- clean transformation from runtime scene data into reader-facing scene presentation
- structured rendering for scene content, metadata, and choices
- safe fallback rendering when generated prose is not yet present
- consistent scene composition patterns
- reusable rendering components
- documentation explaining how scene package rendering works
- the repo ready for generator boundary work later

This prompt is about rendering committed scene packages cleanly.

This is not the prompt for:
- AI prose generation
- generator provider integration
- runtime commit logic
- planner implementation
- admin observability UI
- final literary polish

---

## Why this prompt matters
Inkbranch v2 already has:
- authored truth
- a planner
- a runtime commit pipeline
- a Reader shell

But the Reader still needs the scene package to feel like an actual readable experience.

Right now, the system may have:
- scene kind
- scene goal
- scene payloads
- current perspective
- available choices
- structural metadata

This prompt is where those structural pieces become a readable scene surface.

The system must be able to render a committed scene package even when:
- generated prose does not exist yet
- prose is partial
- only structural information is available
- the scene is present but lightly populated

That makes this prompt critical.
It ensures the app remains usable and coherent before generation is layered in.

---

## Product direction to preserve
Inkbranch v2 is not a graph browser and not a raw payload viewer.

Do not render the scene as:
- a JSON dump
- a planner debug object
- a node inspector
- a graph-traversal interface
- an engine-internals panel masquerading as reader UI

Instead, render the committed scene package as:
- readable scene content
- perspective-aware context
- scene metadata where useful
- clean available choices
- graceful fallbacks when prose is absent

The reader should feel like they are inside a structured interactive story, not browsing engine objects.

---

## Non-negotiable rules
1. Do not implement AI generation in this prompt.
2. Do not call an LLM in this prompt.
3. Do not implement planner algorithms in this prompt.
4. Do not implement runtime commit logic in this prompt.
5. Do not expose raw planner payloads as the main user-facing scene body.
6. Do not expose raw generator payloads as the main user-facing scene body.
7. Do not put raw DB calls in UI components.
8. Do not let page files become rendering engines.
9. Keep rendering reusable and composable.
10. Build a structural rendering layer, not final literary generation.

---

## Scope
You should implement:
- a scene rendering transformation layer
- reusable reader scene presentation components
- structural scene content rendering
- clean choice rendering
- perspective-aware scene headers/context
- metadata rendering where appropriate
- safe empty/fallback rendering for missing prose
- clear separation between runtime data shape and reader presentation shape
- scene package rendering documentation

You should also:
- preserve architecture boundaries
- keep route pages thin
- keep rendering logic out of route pages where practical
- keep the system ready for generator boundary work in later prompts

---

## Out of scope
Do not implement:
- generator adapters
- model/provider calls
- prose generation prompts
- runtime choice commit flow
- admin planner/runtime diagnostics UI
- advanced typography systems
- audio/media rendering
- cinematic effects
- rich editor preview systems
- graph visualization
- planner debugging as reader content

This prompt is about rendering committed scene packages into readable UI without AI generation.

---

## Scene rendering philosophy

### Principle 1 — render the committed scene, not the engine internals
The reader should be shown:
- the scene as a readable unit
- the current perspective
- any available scene body content
- scene status/context where helpful
- current choices

The reader should not be shown:
- internal DB record dumps
- raw payload JSON as the main content
- planner reasoning objects as the main scene body

### Principle 2 — prose is optional at this stage, readability is not
The rendering layer must work even when generated prose is absent.

That means the system should support:
- rendered prose if it exists
- structured fallback scene text or scene framing if prose does not exist
- metadata-supported readable presentation
- non-broken choice rendering in all cases

The reading experience must not collapse just because generator work has not happened yet.

### Principle 3 — scene composition should be explicit
A committed scene package should render through a clear composition model.

Possible components of the rendered scene:
- scene header/context
- perspective label
- scene body
- scene meta/supporting context
- decision area

Do not allow ad hoc rendering logic to spread through route pages.

### Principle 4 — rendering is presentation, not truth
The rendering layer may transform runtime data into a display shape.

It must not:
- decide canon truth
- decide valid next scenes
- decide runtime effects
- decide what choices are legal

Those decisions have already been made elsewhere.

### Principle 5 — structural fallback text should remain honest
If prose is missing, the renderer may present structured fallback content.

That fallback should:
- be readable
- be honest about what is available
- preserve immersion as much as possible
- not pretend to be final generated prose

Do not misrepresent fallback content as fully generated narrative.

---

## Required rendering domains
You should define and implement rendering behavior for the following conceptual areas.

### 1. Scene presentation model
Create a reader-facing scene presentation shape.

This should be separate from raw runtime schema rows.

It should include things like:
- scene id
- scene kind
- scene goal
- perspective display info
- body content to render
- structural summary or fallback content
- rendered choices
- scene status/context metadata

This can live in a renderer/mapper layer appropriate to the current architecture.

### 2. Scene body rendering
Implement logic for determining what scene body to show.

Priority should generally be:
1. rendered prose if committed scene prose exists
2. a structured textual fallback derived from valid scene package/runtime-safe content
3. a clean empty/placeholder scene state if neither exists

The renderer should produce something coherent and reader-safe.

### 3. Choice rendering
Render scene choices clearly and consistently.

Choice rendering should:
- show enabled options clearly
- distinguish disabled options if they exist
- keep structural intent readable
- avoid exposing raw effect payloads as reader-facing junk
- preserve future ability to deepen styling later

### 4. Perspective rendering
The current perspective matters.

Render perspective context cleanly, such as:
- current perspective name
- character association if useful
- small perspective/status framing

Do not overload the scene with metadata noise.

### 5. Scene metadata rendering
Some scene metadata may be useful, such as:
- scene kind
- progression indicator
- chronicle context
- structural status

Render metadata only where it helps the reader understand context.
Do not turn the scene into an engine dashboard.

### 6. Empty and degraded states
The rendering layer must support:
- no current scene
- current scene exists but has no prose
- current scene exists but choices are missing
- current chronicle is not ready
- scene payload is partially present

These states should remain readable and graceful.

---

## Required implementation structure

Use or normalize a structure like:

```text
src/ui/reader/
  scene/
    SceneFrame.tsx
    SceneHeader.tsx
    SceneBody.tsx
    SceneFallbackBody.tsx
    SceneMeta.tsx
    ChoiceList.tsx
    ChoiceCard.tsx
    index.ts

src/data/mappers/
  runtime.ts
  reader-scene.ts

src/app/
  (reader)/
    reader/
      chronicles/
        [chronicleId]/
          scene/
            page.tsx

You may choose slightly different file names if they are cleaner, but the responsibilities should remain clear.

Recommended meaning:

SceneFrame.tsx → full composed scene surface
SceneHeader.tsx → perspective/title/context framing
SceneBody.tsx → main scene content renderer
SceneFallbackBody.tsx → clean fallback when prose is absent
SceneMeta.tsx → secondary context
ChoiceList.tsx and ChoiceCard.tsx → reader choice rendering
reader-scene.ts mapper → transforms runtime data into reader presentation shape

Do not implement this as one giant scene page file.

Required implementation tasks
Task 1 — inspect current reader shell, runtime data, and scene schema

Inspect:

src/app/(reader)/reader/chronicles/[chronicleId]/scene/page.tsx
src/ui/reader/*
runtime query surfaces from 06
runtime pipeline outputs from 11
current scene instance schema
current choice schema

Determine how to build a reusable rendering layer from committed runtime state.

Task 2 — create a reader-facing scene presentation shape

Create or refine a mapping layer that transforms committed runtime scene data into a presentation-safe scene model.

This model should be designed for the Reader UI, not for persistence.

It should separate:

runtime storage shape
structural planning data
reader-facing presentation content

Do not expose the raw DB shape directly to the reader components.

Task 3 — implement scene body rendering logic

Implement the logic that decides what the scene body displays.

At minimum:

render committed prose if available
otherwise render a structured fallback body
otherwise render a clear no-content-yet state

The fallback body should use safe, reader-appropriate structural content such as:

scene kind
scene goal framing
perspective context
committed scene metadata already safe for the reader

Do not dump raw payloads.
Do not fabricate AI-style prose.

Task 4 — implement scene composition UI

Implement reusable scene rendering components.

At minimum:

scene frame
header/context
body
meta
choice list

Keep components small and readable.

Do not put transformation-heavy logic in the JSX tree if a mapper or helper makes it clearer.

Task 5 — implement choice presentation

Render scene choices cleanly.

At minimum:

show available choices
show disabled choices clearly if present
distinguish labels from internal intent keys
preserve a reader-friendly presentation surface

Do not display raw planner effect objects as the main choice content.

Task 6 — render perspective and progress context

Add reader-appropriate context such as:

current perspective
chronicle or scene progression cues
scene type/status if helpful

Keep this minimal and supportive.
Do not overwhelm the story surface.

Task 7 — refine route page usage

Update the current scene page so it:

loads scene and choice data through the data layer
maps it into a presentation-safe scene model
renders through reusable reader UI components
stays thin

Do not turn the page into a rendering system.

Task 8 — handle degraded and empty states cleanly

Implement clear rendering for cases like:

no current scene
missing prose
no choices available
malformed or incomplete scene data
chronicle not ready

These states should still feel intentional and usable.

Task 9 — document scene package rendering

Create:

docs/scene-package-rendering.md

This doc should explain:

what scene package rendering is responsible for
how committed scene data is transformed into reader presentation
how prose fallback works
why raw planner/runtime payloads are not the main reader content
what later generator prompts will deepen

It should also clarify that:

this prompt does not implement AI prose generation
runtime truth remains elsewhere
planner truth remains elsewhere
Task 10 — refine exports

Update relevant Reader UI barrels and mapper exports so the rendering layer is easy to reuse later.

Keep exports intentional and readable.

Task 11 — verify the rendering layer

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
scene page compiles and renders cleanly
committed prose renders when present
fallback body renders when prose is absent
choice rendering works cleanly
no forbidden imports were introduced
no raw DB imports leaked into UI
Task 12 — add focused rendering tests if appropriate

Add a small number of focused tests for rendering behavior where useful, such as:

renders prose when renderedProse exists
renders fallback body when prose is absent
renders empty state when no scene exists
renders enabled and disabled choices correctly

Keep tests focused and purposeful.
Do not build the full end-to-end reader test matrix yet.

Task 13 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Design guidance
Good scene rendering design

Good:

reader-facing scene model
reusable scene UI
readable fallback body
clean choice presentation
thin route page
graceful empty/degraded states
Bad scene rendering design

Bad:

route page doing all rendering logic inline
raw JSON payloads shown as the scene
UI components coupled directly to DB rows
prose fabrication without generator work
exposing planner diagnostics as reader content
treating scene packages like graph nodes
Safe fallback guidance

Fallback rendering is important here.

Good fallback examples:

readable structural framing for the scene
a brief, clear scene context block
perspective-aware scene intro
simple neutral body text that reflects committed structure without pretending to be AI prose

Bad fallback examples:

dumping sceneKind and sceneGoal raw with no framing
dumping planner payload JSON
inventing polished story prose out of thin air
showing “TODO render scene” as the main reader body

The fallback should feel like a deliberate interim reading surface.

Suggested rendering precedence

When deciding what to show in the scene body, use a clear priority order.

A good rendering priority is:

renderedProse if it exists and is meaningful
structural fallback scene body generated from safe scene package/runtime content
reader-facing empty state when insufficient content exists

Keep this precedence explicit and documented.

Guardrails against bad rendering design
Do not do this

Bad patterns include:

exposing planner payload JSON directly to readers
exposing generator payload JSON directly to readers
building the whole renderer inside the page file
fabricating AI prose without the generator system
coupling scene UI directly to raw runtime storage rows
turning scene rendering into planner debugging
Do this instead

Good patterns include:

a presentation model
clean runtime-to-reader mapping
reusable scene components
graceful prose fallback
clean choice rendering
strong separation from planner/runtime/generator ownership
Acceptance criteria

This prompt is complete only if all of the following are true:

A real scene package rendering layer exists.
Runtime scene data is transformed into a reader-facing presentation shape.
Scene pages render committed prose when available.
Scene pages render a coherent fallback body when prose is absent.
Choice rendering is clean and reader-friendly.
Perspective/context rendering is present and helpful.
Empty and degraded scene states are handled cleanly.
Page files remain thin and do not become rendering engines.
No raw DB imports were added to Reader UI components.
No planner/runtime/generator logic was improperly moved into the rendering layer.
No beat-graph-first reader structure was introduced.
docs/scene-package-rendering.md exists and explains the rendering layer clearly.
Lint and typecheck pass.
Rendering-focused tests exist where appropriate and pass.
The repo is ready for 14_generator_boundary.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
scene page renders committed prose correctly when present
scene page renders fallback body correctly when prose is absent
choice rendering behaves correctly
empty/degraded states behave reasonably
no forbidden imports were introduced
rendering remains within current architecture boundaries

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a fake rendering layer behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 13_scene_package_rendering.md

To:

 13_scene_package_rendering.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 13_scene_package_rendering.md
Status: completed
Summary:
implemented the scene package rendering layer for Reader
added runtime-to-reader presentation mapping, clean scene composition, and safe fallback rendering
improved choice rendering and reader-facing scene context without introducing AI generation
documented the rendering layer and preserved separation from planner, runtime commit, and generator logic
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally simple fallback rendering choices
note any scene metadata presentation intentionally kept minimal
note that generator boundary and AI generation remain for later prompts

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if committed scene packages render as a clean, readable reader experience even before AI prose generation exists.

It fails if rendering becomes a raw engine dump, a fake prose generator, a page-level monolith, or a graph-oriented reader surface.


Next is `14_generator_boundary.md`, which is where we define exactly how AI is allowed to participate without becoming the logic engine.