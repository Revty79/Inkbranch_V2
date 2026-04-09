# 03_domain_contracts.md

## Title
Inkbranch v2 — Domain Contracts

## Objective
Define the core domain language and contract boundaries for Inkbranch v2.

This prompt exists to create the shared types, interfaces, enums, value objects, and structural contracts that later prompts will build on.

The goal is to give the system a clean internal vocabulary before deeper implementation begins.

By the end of this prompt, the repo should have:
- explicit domain contracts for the authoring layer
- explicit domain contracts for planner inputs/outputs
- explicit domain contracts for runtime concepts
- explicit domain contracts for generator boundaries
- explicit domain contracts for validation results
- a clean export structure for those contracts
- documentation describing the purpose of the domain layer

This prompt is about language and boundaries, not implementation.

---

## Why this prompt matters
If the rebuild does not define its language early, the architecture will drift.

Without strong contracts:
- the planner will invent structures ad hoc
- the runtime will commit arbitrary blobs
- the generator will start defining truth implicitly
- the UI will end up shaping engine logic
- the DB schema will drive the product instead of supporting it

This prompt prevents that.

It gives later prompts a clean set of nouns and shapes to build from.

---

## Product direction to preserve
Inkbranch v2 is not a beat-graph-first system.

It is a planner-led, book-first, world-first interactive fiction platform.

The core flow remains:

book bible -> planner -> scene package -> reader decision -> runtime state update -> next scene package

The domain contracts created here must reinforce that architecture.

Do not define contracts around:
- beat chains
- node graphs
- next-beat maps
- hand-authored branching trees

Instead define contracts around:
- authored truth
- planning context
- scene packages
- decisions
- runtime commits
- continuity state
- canonical knowledge
- endings and pacing

---

## Non-negotiable rules
1. Do not implement planner logic in this prompt.
2. Do not implement runtime commit logic in this prompt.
3. Do not implement generator provider logic in this prompt.
4. Do not implement database schema in this prompt.
5. Do not import from `src/data`.
6. Do not import from `src/ui`.
7. Do not import from `src/app`.
8. Keep the domain layer framework-light and persistence-independent.
9. Do not create giant catch-all type files.
10. Prefer small, explicit, composable contracts.

---

## Scope
You should implement:
- domain enums
- domain interfaces
- value object types
- shared primitives
- planner contracts
- runtime contracts
- generator contracts
- validator result contracts
- export barrels where appropriate
- domain-layer documentation

You should also:
- inspect the scaffold created so far
- preserve any clean placeholder structure from `00`
- normalize file layout if needed
- keep naming aligned with the rebuild philosophy

---

## Out of scope
Do not implement:
- actual planner algorithms
- actual runtime mutation functions
- actual validation rule logic
- actual generator adapters
- database tables
- query code
- mutation code
- React components
- app route logic
- story seeds
- test suites beyond a tiny smoke-level contract test if needed

Do not let “contracts” become disguised implementation.

---

## Required design principles

### Principle 1 — the domain layer defines vocabulary, not storage
A domain contract may later map to a DB table, but it is not itself a database model.

Do not design these files as if they are ORM row types.

The domain layer should describe meaning, not storage shape.

### Principle 2 — the domain layer defines truth categories
The contracts should distinguish clearly between:
- authored truth
- planned structure
- generated presentation
- runtime outcome
- validation result

Do not blur these categories together.

### Principle 3 — generated prose is not truth
The domain contracts must make it obvious that:
- generated prose is presentation
- structured scene planning is decision logic
- runtime commits are persisted outcome
- canon truth does not originate from prose text

### Principle 4 — contracts should support inspectable runtime
The domain shapes should make later runtime tables and event logs easier to reason about.

Do not define everything as giant open-ended `Record<string, unknown>` structures.

Use JSON-like openness only where truly appropriate and bounded.

### Principle 5 — no beat graph language
Do not create core concepts like:
- BeatNode
- BeatEdge
- NextBeatMap
- ChoiceGraph
- StoryNodeTree

Those concepts belong to the old architecture and should not re-enter through type names.

---

## Required domain areas
You should create contracts for the following conceptual areas.

### 1. Shared primitives
Create a small, reusable set of shared primitive types and value helpers for concepts like:
- entity identifiers
- slugs
- timestamps
- status fields
- sort order
- optional metadata records
- opaque keys

These should stay simple and reusable.

Recommended location examples:
- `src/core/domain/types/primitives.ts`
- `src/core/domain/types/common.ts`

Do not overengineer branded types unless the repo style already supports them cleanly.

### 2. Authoring layer contracts
Create types/interfaces for the authored truth layer.

These should cover concepts such as:
- world
- book
- book version
- canon entry
- character
- location
- faction
- perspective
- arc milestone
- reveal rule
- pacing rule
- ending rule

These contracts should represent meaning, not DB schema details.

Example expectations:
- each authored concept should have a clear identity
- each should have a clean status concept where relevant
- each should be suitable for planner input later
- relationships should be understandable without a database context

Do not define every possible field exhaustively if the exact detail is not stable yet.
Prefer a stable core over fake completeness.

### 3. Planning contracts
Create types/interfaces for planning concepts.

These should include at minimum:
- `PlanningContext`
- `ScenePlan`
- `DecisionPackage`
- `PlannedChoice`
- `SceneKind`
- `SceneGoal`
- `RevealEligibility`
- `EndingEligibility`

The planner contracts should express:
- what authored inputs matter
- what runtime context matters
- what the planner is allowed to decide
- what a valid next scene package looks like

The planner is the source of structural story validity, so these contracts matter a lot.

Do not implement planning services yet.
Just define the contracts.

### 4. Runtime contracts
Create types/interfaces for runtime concepts.

These should include shapes for ideas such as:
- chronicle
- chronicle state
- perspective run
- scene instance
- scene choice
- choice resolution
- knowledge state
- event entry
- canon commit

These contracts should clearly separate:
- current state projection
- event history
- scene instance records
- choice resolution outcomes
- discovered knowledge / revealed truth
- run-specific canon commitments

Do not define these as DB rows.
Define them as domain-safe runtime concepts.

### 5. Generator boundary contracts
Create types/interfaces for generator concepts.

These should include shapes for ideas such as:
- generator input
- generator scene payload
- generator choice payload
- generated prose result
- generator output envelope
- generator fallback result or error-safe result

The generator contracts should make it obvious that:
- the generator receives approved structure
- the generator returns presentation
- the generator does not create canon truth

### 6. Validator contracts
Create types/interfaces for validation concepts.

These should include shapes for ideas such as:
- validation result
- validation issue
- issue severity
- issue code
- continuity check result
- reveal rule validation result
- ending validation result

Do not implement actual validators yet.
Only define the shared shapes they will return.

---

## Required directory and file shape
Create or normalize the domain contract structure under `src/core/domain` and the contract entry points under the other core areas.

A recommended shape is:

```text
src/core/domain/
  README.md
  types/
    primitives.ts
    common.ts
    authoring.ts
    planning.ts
    runtime.ts
    generation.ts
    validation.ts
    index.ts
  value-objects/
    index.ts
  rules/
    index.ts

src/core/planner/
  README.md
  contracts/
    index.ts

src/core/runtime/
  README.md
  contracts/
    index.ts

src/core/generator/
  README.md
  contracts/
    index.ts

src/core/validators/
  README.md
  contracts/
    index.ts

You may split files more finely if needed, but do not create giant catch-all files.

A good rule:

shared domain types live in src/core/domain/types
layer-specific contract barrels may re-export what they need from there
layer readmes should remain accurate
Naming guidance

Use names that reinforce the new architecture.

Good names:

BookVersion
CanonEntry
PlanningContext
ScenePlan
DecisionPackage
SceneInstance
ChoiceResolution
KnowledgeStateEntry
CanonCommit
GeneratorSceneInput
ValidationIssue

Bad names:

BeatNode
StoryGraph
ChoiceNode
NextBeatResolver
BranchMap
SceneTree
InteractiveGraphState

Avoid legacy language that pulls the design backward.

Contract quality guidance
Good contracts

Good contracts are:

explicit
named clearly
small enough to understand
separated by concern
reusable
neutral about persistence
neutral about UI
Bad contracts

Bad contracts are:

giant kitchen-sink interfaces
pseudo-ORM row dumps
vague any-heavy blobs
types that combine authored truth, generated prose, and runtime outcome together
structures that assume graph-first story architecture
Required implementation tasks
Task 1 — inspect current core placeholders

Inspect the existing src/core scaffold.

Determine:

what placeholder files already exist
what should be replaced
what should be preserved
what should be normalized for a cleaner contract layout

Do not keep empty placeholders if they block a clearer contract structure.

Task 2 — define shared primitives

Create a small set of shared primitive and common types.

Examples:

ID-like fields
timestamps
slugs
status enums
metadata-like bounded records
sort order / priority style helpers

These should help later contracts stay cleaner.

Do not overcomplicate this layer.

Task 3 — define authoring contracts

Create the authored truth contracts for:

worlds
books
book versions
canon entries
characters
locations
factions
perspectives
arc milestones
reveal rules
pacing rules
ending rules

Keep them meaning-oriented.

Do not attempt to mirror future DB nullability or migration-level concerns.

Task 4 — define planning contracts

Create the shared planner-facing contracts.

At minimum, define:

PlanningContext
ScenePlan
DecisionPackage
PlannedChoice
enums/unions for scene kinds and eligibility statuses where useful

These should describe what the planner consumes and produces.

Do not create planner services yet.

Task 5 — define runtime contracts

Create the shared runtime-facing contracts.

At minimum, define:

chronicle
chronicle state
perspective run
scene instance
scene choice
choice resolution
knowledge entry
event entry
canon commit

These should make later runtime persistence and projections easier to design.

Task 6 — define generator contracts

Create generator boundary contracts showing approved input vs generated output.

At minimum, define:

generator input envelope
generator scene payload
generator choice rendering payload
generated scene result
generator result wrapper

These contracts should clearly communicate that the generator is subordinate to planner truth.

Task 7 — define validator contracts

Create validation result contracts.

At minimum, define:

validation issue
validation result
issue severity
issue code
specialized result aliases or interfaces for continuity/reveal/ending validation

Do not implement validation logic.

Task 8 — create clean exports

Add barrel exports where appropriate.

The goal is to make future imports obvious and stable.

Examples:

src/core/domain/types/index.ts
src/core/planner/contracts/index.ts
src/core/runtime/contracts/index.ts
src/core/generator/contracts/index.ts
src/core/validators/contracts/index.ts

Do not create export chaos.
Keep the public surface intentional.

Task 9 — update documentation

Update or create domain-focused documentation.

At minimum create:

docs/domain-contracts.md

This doc should explain:

why the domain layer exists
how contracts are separated
why the contracts are not DB models
why generator output is not canon truth
how future prompts should use these types
Task 10 — verify the contract layer

Run the appropriate checks to make sure:

typecheck passes
lint passes
imports respect the existing guardrails
no forbidden layer coupling was introduced

A tiny smoke-level import test is acceptable if needed, but do not overbuild testing here.

Task 11 — update STATUS

Update /prompts/STATUS.md only after all work and verification are complete.

Required files to create or normalize

You may create or update files such as:

Domain type files
src/core/domain/types/primitives.ts
src/core/domain/types/common.ts
src/core/domain/types/authoring.ts
src/core/domain/types/planning.ts
src/core/domain/types/runtime.ts
src/core/domain/types/generation.ts
src/core/domain/types/validation.ts
src/core/domain/types/index.ts
Supporting domain files
src/core/domain/value-objects/index.ts
src/core/domain/rules/index.ts
Layer contract barrels
src/core/planner/contracts/index.ts
src/core/runtime/contracts/index.ts
src/core/generator/contracts/index.ts
src/core/validators/contracts/index.ts
Documentation
docs/domain-contracts.md

You may add a few additional small files if they serve this prompt directly.

Do not create product implementation code.

Guidance for contract content
Authoring contracts should include stable core fields

Use a stable set of core fields like:

identity
key/slug
title/name
summary/description
status where applicable
metadata only where helpful and bounded

Do not fake 50 fields per entity just to feel complete.

Planning contracts should define structure, not prose

A ScenePlan should define structural intent like:

scene kind
scene goal
active milestone references
allowed reveal references
continuity constraints
decision package
ending eligibility context

It should not contain generated prose as its truth.

Runtime contracts should distinguish projections from history

Make sure your runtime contracts do not collapse everything together.

There should be a clear conceptual difference between:

a current state projection
an event entry
a scene instance
a reader choice
a choice resolution
a canon commit
Generator contracts should preserve planner authority

The generator input should look like approved structure being handed off for rendering.

The generator output should look like presentation being returned.

Do not define generator types that imply it may decide what the next valid scene is.

Validator contracts should support inspection

A validation result should be inspectable and useful.

It should support:

success/failure
issue list
severity
machine-readable issue codes
human-readable messages

This will help later admin/debug views.

Optional guidance on enums and unions

Use enums or string unions where they clearly improve clarity, such as:

book version status
scene kind
issue severity
chronicle status
reveal status

Do not create enum spam for everything.

Choose clarity over ceremony.

Keep future flexibility without becoming vague

The contracts should be strong enough to guide implementation, but not so over-specified that later prompts must fight fake certainty.

Prefer:

a stable core set of known fields
optional extensions only where clearly justified
bounded metadata shapes when some flexibility is needed

Avoid:

huge open-ended objects everywhere
any
top-level unknown blobs as the default model
Acceptance criteria

This prompt is complete only if all of the following are true:

Shared domain contract files exist and are organized clearly.
Authoring concepts have explicit domain contracts.
Planning concepts have explicit domain contracts.
Runtime concepts have explicit domain contracts.
Generator boundary concepts have explicit domain contracts.
Validator result concepts have explicit domain contracts.
Export surfaces are clean and intentional.
No database code was introduced into the domain layer.
No UI or app code was introduced into the domain layer.
No planner/runtime/generator implementation logic was added.
No beat-graph-first naming or structures were introduced.
docs/domain-contracts.md exists and explains the intent of the layer.
Lint and typecheck pass.
The repo is in a clean state for 04_authoring_schema.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
test scaffold still passes if applicable
no forbidden imports were introduced
contracts compile cleanly
the current repo remains aligned with planner-first architecture

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave broken contract definitions behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 03_domain_contracts.md

To:

 03_domain_contracts.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 03_domain_contracts.md
Status: completed
Summary:
defined the core domain vocabulary for authoring, planning, runtime, generation, and validation
created clean shared contracts and export surfaces
preserved separation from DB, UI, and framework logic
documented the purpose and boundaries of the domain layer
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally deferred field detail
note any contract areas expected to deepen in later prompts

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Inkbranch v2 gains a clean internal language.

It fails if contracts turn into hidden implementation or drag the architecture back toward beat-graph thinking.


After this, the next clean step is `04_authoring_schema.md`, where we map the authored truth into the actual relational tables.