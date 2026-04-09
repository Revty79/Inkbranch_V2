# 11_runtime_commit_pipeline.md

## Title
Inkbranch v2 — Runtime Commit Pipeline

## Objective
Implement the runtime commit pipeline for Inkbranch v2.

This prompt exists to turn planner output and reader decisions into committed runtime history and updated runtime state.

By the end of this prompt, the repo should have:
- a real runtime commit service layer
- scene instantiation from planner output
- choice persistence for instantiated scenes
- choice resolution handling
- event log append behavior
- knowledge state updates
- canon commit updates
- chronicle state projection refresh
- perspective run updates
- runtime diagnostics and validation touchpoints
- documentation explaining the runtime commit pipeline

This prompt is about committing runtime truth.

This is not the prompt for:
- reader UI implementation
- prose generation
- planner implementation
- admin observability UI
- final end-to-end user flow polish

---

## Why this prompt matters
Inkbranch v2 only works if the system can reliably answer:

- what scene was instantiated
- what choices were shown
- what choice was selected
- what effects were committed
- what knowledge was revealed
- what canon became true in this run
- what the current run state is now

Without this layer:
- the planner is only hypothetical
- continuity cannot be trusted
- runtime inspection is fake
- later reader flow has nothing stable to stand on

This prompt is where the runtime becomes real.

---

## Product direction to preserve
Inkbranch v2 is not a graph traversal engine and not a runtime blob.

The runtime must not work like:
- “current node pointer changed”
- “append another opaque story JSON blob”
- “let generated prose imply what happened”
- “UI state is the run state”

Instead, the runtime commit pipeline must do this:

1. planner produces a valid scene package
2. runtime instantiates that package
3. reader selects a choice
4. runtime resolves and commits effects
5. event history is appended
6. current-state projection is refreshed
7. the next planner cycle reads from committed runtime truth

That is the pipeline this prompt should implement.

---

## Non-negotiable rules
1. Do not implement prose generation in this prompt.
2. Do not implement planner algorithms in this prompt.
3. Do not let runtime truth live in one giant JSON blob.
4. Do not let the reader UI become the runtime commit layer.
5. Do not put raw DB calls into route pages or UI components.
6. Use the data access layer and runtime core layer cleanly.
7. Keep event history append-oriented.
8. Keep current-state projection separate from event history.
9. Keep scene instantiation separate from choice resolution.
10. Keep the runtime commit pipeline inspectable and deterministic.

---

## Scope
You should implement:
- runtime service contracts if refinement is needed
- scene instantiation service behavior
- scene choice persistence behavior
- choice resolution service behavior
- event append behavior
- knowledge update behavior
- canon commit behavior
- chronicle state projection refresh behavior
- perspective run update behavior
- runtime orchestration service
- focused runtime tests
- runtime pipeline documentation

You should also:
- align the implementation with the runtime schema
- align with planner outputs from `10`
- keep generator concerns separate
- keep reader UI concerns separate
- preserve architecture boundaries

---

## Out of scope
Do not implement:
- reader-facing route flow
- reader UI choice submission screens
- prose rendering
- generator provider calls
- admin dashboard UI
- advanced reconciliation tools
- save rollback UI
- multiplayer/concurrency systems
- background processing infrastructure
- publishing workflows
- analytics/event streaming outside the runtime event log

This prompt is the runtime commit backbone.

---

## Runtime commit philosophy

### Principle 1 — planner output is not runtime truth yet
A planner result is a valid proposal.

It becomes runtime truth only when:
- a scene instance is created
- scene choices are stored
- a reader decision is resolved
- resulting state updates are committed

The code should make this distinction very clear.

### Principle 2 — instantiate first, resolve later
The runtime pipeline must distinguish between:
- scene package instantiation
- reader choice resolution
- downstream state updates

Do not collapse them into one write step.

### Principle 3 — event history matters
The runtime pipeline must append inspectable events for important state transitions.

It should be possible later to inspect:
- scene instantiated
- choices created
- choice resolved
- knowledge updated
- canon committed
- chronicle state refreshed

Do not treat event history as optional decoration.

### Principle 4 — projection is useful, but not sole truth
`chronicle_states` should be refreshed as a current-state projection.

But the system should still rely on:
- scene instances
- choice resolutions
- knowledge state
- event log
- canon commits

for reconstructable truth.

### Principle 5 — runtime updates must be deterministic
Given the same planner package and the same selected choice, the runtime should commit the same structural outcomes.

Do not add randomness here.

### Principle 6 — effects must stay structural
The runtime commit pipeline should commit:
- selected choice
- structural effect hints
- knowledge changes
- canon commitments
- projection updates

It should not invent prose or literary interpretation.

---

## Required implementation structure

Use or normalize a structure like:

```text
src/core/runtime/
  README.md
  contracts/
    ...
  services/
    instantiate-scene.ts
    resolve-choice.ts
    append-event.ts
    update-knowledge.ts
    update-canon-commits.ts
    refresh-chronicle-state.ts
    update-perspective-run.ts
    runtime-commit-pipeline.ts
    index.ts
  projections/
    chronicle-state.ts
    perspective-run.ts
    index.ts

You may choose slightly different names if they are clearer, but the responsibilities should remain separate.

Recommended meaning:

instantiate-scene.ts → turn planner result into scene instance + choices
resolve-choice.ts → persist selected choice resolution and structural effects
append-event.ts → event log append helpers
update-knowledge.ts → knowledge state changes
update-canon-commits.ts → canon commit creation/update
refresh-chronicle-state.ts → projection refresh logic
update-perspective-run.ts → perspective-run projection updates
runtime-commit-pipeline.ts → orchestration layer
projections/* → logic for deriving current-state updates from committed data

Do not implement this as one giant service file.

Required runtime flow

The MVP runtime commit pipeline should support at least these two major phases:

Phase A — Scene instantiation

Given:

a chronicle id
a target perspective run or perspective context
a valid planner result

The runtime should:

create a scene_instance
create the related scene_choices
append appropriate event log entries
refresh or initialize any projection fields needed
return a runtime-safe instantiated scene result

This is the moment the planner proposal becomes an instantiated scene package in the run.

Phase B — Choice resolution

Given:

a chronicle id
a scene instance id
a selected scene choice id

The runtime should:

validate that the choice belongs to the scene instance and chronicle
create a choice_resolution
append appropriate event log entries
update knowledge state as appropriate
update canon commits as appropriate
update perspective run projection
refresh chronicle state projection
return a runtime-safe resolution result

This is the moment the reader’s choice becomes committed run history.

Required runtime domains
1. Scene instantiation

Implement a service that takes planner output and persists it as runtime records.

At minimum it should:

create scene_instances
create scene_choices
preserve planner payload snapshot
preserve generator payload placeholder if appropriate
mark appropriate initial scene status
record planner cycle or equivalent sequencing info

Do not generate prose here.
Do not fake reader selection here.

2. Choice resolution

Implement a service that records the selected choice.

At minimum it should:

validate selected choice ownership
create choice_resolutions
mark chosen/committed outcome state if your schema supports it
produce structural effect output for downstream updates

Keep this deterministic and inspectable.

3. Event log append

Implement explicit event logging for the runtime pipeline.

At minimum, append events for:

scene instantiated
scene choices created if represented separately
choice resolved
knowledge updated
canon committed
chronicle state refreshed if appropriate

Use consistent event typing.

Do not create vague event names like updatedStuff.

4. Knowledge state update

Implement knowledge state updates based on committed structural effects.

The MVP does not need perfect lore inference.
It does need a real, explicit update path.

The source for knowledge updates should come from:

planned structural effects
allowed reveals actually used
choice resolution effects
explicit planner/runtime effect hints

Do not infer knowledge from prose.

5. Canon commit update

Implement canon commit creation/update behavior.

The runtime should be able to commit truths such as:

a reveal became exposed in this run
a stateful commitment became true for this run
a specific canon entry was activated/committed in the run

The exact MVP behavior can be simple, but it must be explicit and inspectable.

6. Chronicle state refresh

Implement chronicle projection refresh logic.

At minimum, refresh fields such as:

current perspective
current scene instance
progress index
ending locked or ending-ready fields if applicable
summary/metadata projection fields if used

Keep projection logic explicit.

7. Perspective run update

Implement perspective-run updates after scene instantiation and/or choice resolution.

At minimum, support updating:

last scene instance
entry count
knowledge score if your model uses it
status if needed

Keep the projection update bounded and readable.

Required service contracts

If needed, refine runtime contracts or add service-level contracts for:

InstantiateSceneInput
InstantiateSceneResult
ResolveChoiceInput
ResolveChoiceResult
RuntimeCommitDiagnostics
RuntimeCommitIssue
KnowledgeUpdateResult
CanonCommitResult
ChronicleProjectionResult

These should remain structural and inspectable.

Do not turn them into generic payload wrappers.

Required implementation tasks
Task 1 — inspect planner outputs, runtime schema, and data access layer

Inspect:

src/core/planner/*
src/core/runtime/contracts/*
src/data/schema/runtime/*
src/data/mutations/runtime/*
src/data/queries/runtime/*
existing validators if any

Determine the cleanest runtime pipeline structure using current planner outputs and runtime schema.

Task 2 — refine runtime contracts if needed

If the runtime contract layer needs additional service-level contracts for clean orchestration, add them now.

Keep them focused on:

instantiation
resolution
projection refresh
diagnostics

Do not dump all runtime logic into contracts.

Task 3 — implement scene instantiation service

Implement the scene instantiation service.

This service should:

accept a planner result and chronicle context
persist a scene instance
persist scene choices
append appropriate event log entries
return the instantiated runtime object/result

Use transactions where appropriate.

Do not mix reader submission logic into this step.

Task 4 — implement choice resolution service

Implement the choice resolution service.

This service should:

validate the selected choice
create the choice resolution record
append event log entries
trigger downstream knowledge/canon/projection updates
return a clean resolution result

Use transactions where appropriate.

Task 5 — implement knowledge update logic

Implement explicit knowledge-state update logic.

This should:

determine what knowledge keys/statuses change
write those updates through the mutation layer
record source scene linkage where appropriate
remain inspectable

Do not infer from prose.
Do not use vague blob merges.

Task 6 — implement canon commit logic

Implement explicit canon commit update logic.

This should:

create or update canon commit records as appropriate
preserve source event linkage when practical
remain chronicle-scoped and inspectable

Keep the MVP logic simple but real.

Task 7 — implement chronicle projection refresh

Implement chronicle-state refresh logic.

This should:

set current scene instance
set current perspective where appropriate
increment or update progress-related fields
maintain a stable current-state projection

Keep the logic bounded and readable.

Task 8 — implement perspective-run projection update

Implement perspective-run updates.

This should:

update last scene instance
update counts and runtime tracking fields
remain perspective-scoped and consistent
Task 9 — implement runtime orchestration pipeline

Implement the top-level runtime commit pipeline.

This orchestration should coordinate:

scene instantiation
choice resolution
event logging
knowledge updates
canon commits
projection refresh

Keep orchestration readable and modular.

It should not become a giant file.

Task 10 — use transactions where consistency truly matters

Use transactions for multi-step operations that must stay consistent.

Good examples:

scene instance + scene choices + event append
choice resolution + event append + knowledge updates + canon commits + projection refresh

Do not create abstract transaction frameworks.
Use transactions where they clearly protect runtime integrity.

Task 11 — document the runtime commit pipeline

Create or update:

docs/runtime-commit-pipeline.md

This doc should explain:

how planner output becomes runtime state
what happens during scene instantiation
what happens during choice resolution
how event log, knowledge, canon commits, and projections are updated
what this prompt intentionally does not cover yet
how this differs from prose generation
Task 12 — update runtime README if needed

Update src/core/runtime/README.md if needed so it accurately reflects:

runtime services now exist
runtime owns commit logic and projections
runtime is separate from planner and generator
runtime state is relational and inspectable
Task 13 — add focused runtime tests

Add tests for the runtime commit pipeline.

At minimum, cover cases such as:

scene instantiation creates scene instance and choices
choice resolution fails if the choice does not belong to the scene/chronicle
choice resolution appends expected events
knowledge updates occur when structural effects indicate discovery
canon commits are created when commit-worthy effects exist
chronicle state projection refreshes correctly
perspective run updates correctly

Keep tests focused and readable.

Do not build a giant full-stack test matrix here.

Task 14 — verify the runtime pipeline

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
runtime tests pass
runtime services compile
no forbidden imports were introduced
runtime uses data access boundaries correctly
planner and generator remain separate
committed runtime state is inspectable in the DB shape
Task 15 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Design guidance
Good runtime pipeline design

Good:

planner result in
scene instance created
scene choices created
choice selected and resolved later
events appended
knowledge updated
canon commits recorded
projection refreshed
all steps inspectable
Bad runtime pipeline design

Bad:

one function dumping everything into one JSON field
scene and resolution collapsed into one write
event logging skipped or vague
knowledge inferred from prose
route pages doing commit work directly
runtime logic hidden in UI or reader code
Suggested event types

Use clear event names.

Examples of good event types:

scene_instantiated
scene_choice_created
choice_resolved
knowledge_state_updated
canon_commit_created
chronicle_state_refreshed
perspective_run_updated

You may choose slightly different names if they are cleaner, but keep them:

explicit
consistent
inspectable

Do not use vague event types.

Suggested effect handling approach

The MVP runtime pipeline should use structural effect hints from the planner/decision package where appropriate.

Examples:

reveal X became exposed
knowledge key Y becomes discovered
canon commit Z should be recorded
progress index increments
perspective run should mark last scene

Keep this effect handling explicit.
Do not invent a giant untyped effect engine yet unless it is truly necessary and remains readable.

A small, explicit effect mapping layer is fine.
A sprawling hidden rules engine is not.

Guardrails against bad runtime pipeline design
Do not do this

Bad patterns include:

using the planner result as the permanent runtime record without instantiation
resolving choices by overwriting scene instance rows
storing current run state only in a blob
skipping event log updates
skipping projection refresh
mixing generator output into structural runtime truth
putting runtime commit logic in page files
Do this instead

Good patterns include:

instantiate scene package into runtime rows
resolve reader choice explicitly
append events explicitly
update knowledge explicitly
commit canon explicitly
refresh projections explicitly
keep services modular
use transactions for consistency
Acceptance criteria

This prompt is complete only if all of the following are true:

A real runtime commit pipeline implementation exists.
Planner results can be instantiated into scene instances and scene choices.
Selected choices can be resolved through a dedicated resolution path.
Event log entries are appended during key runtime transitions.
Knowledge state updates are implemented.
Canon commit updates are implemented.
Chronicle state projection refresh is implemented.
Perspective run updates are implemented.
Runtime services remain separate from planner and generator logic.
No prose generation was introduced.
No beat-graph-first runtime logic was introduced.
docs/runtime-commit-pipeline.md exists and explains the pipeline clearly.
Lint and typecheck pass.
Runtime tests exist and pass.
The repo is ready for 12_reader_shell.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
runtime tests pass
runtime services compile cleanly
no forbidden imports were introduced
runtime uses data access boundaries correctly
planner outputs can be instantiated
choice resolution produces coherent committed state
event log, knowledge, canon commits, and projections update as expected
no generator/prose logic slipped into runtime

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a fake runtime pipeline behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 11_runtime_commit_pipeline.md

To:

 11_runtime_commit_pipeline.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 11_runtime_commit_pipeline.md
Status: completed
Summary:
implemented the runtime commit pipeline for scene instantiation, choice resolution, event logging, knowledge updates, canon commits, and projection refresh
kept runtime commit logic separate from planner, generator, and UI
made committed runtime truth relational, inspectable, and deterministic
documented the runtime pipeline and added focused runtime tests
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally simple MVP effect handling
note any projection detail expected to deepen later
note that reader UI remains for 12
note that prose generation remains separate for later prompts

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Inkbranch gains a real runtime commit backbone that turns planner output and reader decisions into committed, inspectable run history and updated state.

It fails if runtime becomes a blob, a UI-side side effect, a generator-owned truth layer, or an opaque write soup.


Next is `12_reader_shell.md`, where we build the reader-facing frame without yet doing full prose generation.