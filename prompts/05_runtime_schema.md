# 05_runtime_schema.md

## Title
Inkbranch v2 — Runtime Schema

## Objective
Implement the relational runtime schema for Inkbranch v2.

This prompt exists to create the database tables, relations, constraints, and schema exports for the runtime plane of the platform.

By the end of this prompt, the repo should have:
- relational runtime tables implemented in Drizzle
- clear separation between authored truth tables and runtime tables
- primary keys, foreign keys, indexes, and practical constraints where appropriate
- schema exports wired for Drizzle migrations
- a migration generated and applied for the runtime layer
- documentation explaining the runtime schema and its role
- the repo ready for `06_data_access_boundaries.md`

This prompt is about runtime persistence only.

Do not implement planner logic here.
Do not implement generator logic here.
Do not implement query or mutation services here.
Do not collapse runtime into a single blob.

---

## Why this prompt matters
Inkbranch v2 lives or dies on continuity.

The authoring schema defines truth.
The planner decides valid next structure.
The generator renders approved structure.
But the runtime is what commits what actually happened.

That means the runtime layer must make it possible to inspect:
- what chronicle is being played
- what the current projected state is
- which perspective runs exist
- what scene instances have been created
- what choices were shown
- what choices were resolved
- what knowledge has been discovered
- what events happened
- what canon commitments became true in this run

If this layer is weak, the system becomes opaque.
If this layer is a giant JSON blob, continuity becomes untrustworthy.
If this layer mixes authoring and runtime concerns, the app becomes impossible to reason about.

This prompt creates the relational runtime spine.

---

## Product direction to preserve
Inkbranch v2 is not a beat graph engine.

Do not create runtime tables centered around:
- beat nodes
- next beat links
- story graph traversal edges
- node trees
- choice graph maps

Instead, this runtime schema must support the actual loop:

book bible -> planner -> scene package -> reader decision -> runtime state update -> next scene package

The runtime schema is the "what actually happened" side of that loop.

---

## Non-negotiable rules
1. Do not implement authoring tables in this prompt.
2. Do not implement beat-graph-first runtime structures.
3. Do not use a giant JSON blob as the runtime source of truth.
4. Runtime state must be relational and inspectable.
5. Use `jsonb` only where bounded payloads or snapshots make sense.
6. Keep current-state projection separate from event history.
7. Keep scene instance records separate from choice resolution records.
8. Keep runtime schema separate from planner/generator logic.
9. Do not add queries or mutations in schema files.
10. Keep the schema aligned with planner-first architecture.

---

## Scope
You should implement the runtime tables for:
- chronicles
- chronicle_states
- perspective_runs
- scene_instances
- scene_choices
- choice_resolutions
- knowledge_state
- event_log
- canon_commits

You should also implement:
- core foreign-key relationships
- useful indexes
- status/default fields where appropriate
- schema exports
- migration generation
- migration application
- runtime schema documentation

You should update:
- `src/data/schema/index.ts`
- any runtime schema organization files needed under `src/data/schema/`

You should not implement:
- planner services
- runtime mutation services
- generator services
- UI logic
- authoring tables
- seed content
- runtime projections in app code

---

## Out of scope
Do not implement:
- authored truth tables
- auth tables
- job/queue tables
- analytics tables
- moderation tables
- graph traversal tables
- generic "state_blob" tables
- content node systems
- scene-template authoring systems
- anything that starts pulling runtime back toward beat chaining

Stay focused on runtime persistence.

---

## Runtime schema philosophy

### Principle 1 — runtime is not authoring
Runtime tables represent what happened during a run.

They are not the same as:
- authored truth
- planner contracts
- generated prose contracts

Keep the runtime plane clearly separate from the authoring plane.

### Principle 2 — projection is not the only truth
`chronicle_states` should exist as a current-state projection.

But it must not be the only truth.

The full runtime should still be reconstructable from:
- scene instances
- choice resolutions
- knowledge state
- event log
- canon commits

The projection is for convenience and performance, not epistemic monopoly.

### Principle 3 — event history matters
The system must preserve an append-oriented history of runtime changes.

That is why `event_log` exists.

Do not make the runtime depend only on mutating current-state rows.

### Principle 4 — scene structure and resolution are different
A scene instance is not the same thing as a reader’s resolved choice.

The runtime schema must distinguish:
- planned/instantiated scene
- presented choices
- selected/resolved choice
- downstream committed effects

Do not collapse those into one table.

### Principle 5 — canon commitments must be inspectable
Some truths become committed in a given run.

Those truths need their own inspectable table, not hidden side effects buried in prose or ad hoc blobs.

### Principle 6 — use `jsonb` with discipline
Bounded `jsonb` is appropriate for:
- planner payload snapshots
- generator payload snapshots
- resolution payload details
- event payloads
- bounded summary metadata

It is not appropriate for:
- the only source of runtime state
- an everything-table
- replacing obvious relational columns

---

## Required schema organization

Use or normalize a schema layout under `src/data/schema` that keeps runtime readable and separate from authoring.

A recommended structure is:

```text
src/data/schema/
  index.ts
  README.md
  shared.ts
  authoring/
    ...
  runtime/
    chronicles.ts
    scenes.ts
    state.ts
    events.ts
    index.ts

A suggested grouping is:

chronicles.ts → chronicles, perspective_runs
state.ts → chronicle_states, knowledge_state, canon_commits
scenes.ts → scene_instances, scene_choices, choice_resolutions
events.ts → event_log
index.ts → runtime schema exports

You may choose slightly different file names if they improve readability, but do not put the whole runtime schema in one giant file.

Required tables and design guidance
1. chronicles

Purpose:
Top-level runtime record for a reader's run of a specific book version.

Core fields should include:

id
bookVersionId
readerId nullable if needed for current scaffold
status
startedAt
completedAt nullable
metadataJson
created/updated timestamps

Guidance:

foreign key to book_versions
runtime must be anchored to a specific authored version
readerId may remain a simple string or nullable text for now if full auth is not built yet
add indexes for bookVersionId, readerId, and status
2. chronicle_states

Purpose:
Current-state projection for a chronicle.

Core fields should include:

id
chronicleId
currentPerspectiveId nullable
currentSceneInstanceId nullable
progressIndex
endingLocked
summaryJson
updated timestamp
optionally created timestamp if consistent with repo style

Guidance:

foreign key to chronicles
foreign key to perspectives if using currentPerspectiveId
foreign key to scene_instances if using currentSceneInstanceId
one state row per chronicle is the intended model
enforce uniqueness on chronicleId

Important:
This is a projection table, not the only source of truth.

3. perspective_runs

Purpose:
Track runtime progression for each perspective within a chronicle.

Core fields should include:

id
chronicleId
perspectiveId
status
entryCount
knowledgeScore
lastSceneInstanceId nullable
metadataJson
created/updated timestamps

Guidance:

foreign key to chronicles
foreign key to perspectives
foreign key to scene_instances for lastSceneInstanceId if practical
uniqueness should likely prevent duplicate perspective runs for the same chronicle/perspective pair
4. scene_instances

Purpose:
Committed scene packages shown in a run.

Core fields should include:

id
chronicleId
perspectiveRunId
plannerCycle
sceneKind
sceneGoal
plannerPayloadJson
generatorPayloadJson
renderedProse
status
created/updated timestamps

Guidance:

foreign key to chronicles
foreign key to perspective_runs
scene instance is the committed package for that moment in the run
plannerPayloadJson and generatorPayloadJson are bounded snapshots, not the whole runtime
index by chronicleId, perspectiveRunId, plannerCycle, and perhaps status
5. scene_choices

Purpose:
Choices presented for a specific scene instance.

Core fields should include:

id
sceneInstanceId
choiceKey
label
intent
sortOrder
plannerEffectsJson
isEnabled
created/updated timestamps

Guidance:

foreign key to scene_instances
choices belong to a scene instance
choiceKey should be unique within a scene instance if practical
keep plannerEffectsJson bounded and structural
6. choice_resolutions

Purpose:
Record what the reader selected and how it resolved.

Core fields should include:

id
sceneChoiceId
chronicleId
resolutionType
resolutionPayloadJson
resolvedAt
created timestamp if helpful

Guidance:

foreign key to scene_choices
foreign key to chronicles
resolution should be separate from the original choice row
enforce the intended model carefully:
if each choice may only resolve once, reflect that through uniqueness as appropriate
if later multi-resolution behavior is possible, do not overconstrain falsely

For current architecture, aim for one chosen resolution per actual selected choice event, not blob history.

7. knowledge_state

Purpose:
Inspectable discovered/known truths for a chronicle and optionally a perspective.

Core fields should include:

id
chronicleId
perspectiveId nullable if knowledge may be chronicle-wide
knowledgeKey
knowledgeStatus
sourceSceneInstanceId nullable
metadataJson
created/updated timestamps

Guidance:

foreign key to chronicles
foreign key to perspectives if used
foreign key to scene_instances for source linkage if practical
unique constraints should reflect your intended granularity, likely around chronicle + perspective + knowledge key

This table should make knowledge inspectable, not buried in prose.

8. event_log

Purpose:
Append-oriented record of runtime events.

Core fields should include:

id
chronicleId
eventType
eventTs
causedByType
causedById
payloadJson
created timestamp if separate from eventTs

Guidance:

foreign key to chronicles
do not over-normalize every possible event cause in this prompt
causedByType + causedById can remain a polymorphic reference pattern for now
index by chronicleId, eventType, and eventTs

Important:
This is append-oriented history.
Do not design it as a mutable summary table.

9. canon_commits

Purpose:
Run-specific truth commitments.

Core fields should include:

id
chronicleId
canonEntryId nullable
commitType
commitKey
commitValueJson
sourceEventId nullable
created/updated timestamps

Guidance:

foreign key to chronicles
optional foreign key to canon_entries
optional foreign key to event_log
this table should represent truths committed in the run
index by chronicleId, commitType, commitKey

This is how runtime truth stays inspectable and not hidden inside prose or temporary planner memory.

Status and enum guidance

Where statuses are appropriate, define clean constrained values for concepts like:

chronicle status
perspective run status
scene instance status
knowledge status
resolution type

Use stable categories such as:

active
completed
abandoned
pending
committed
discovered
hidden
selected
skipped

Do not create enum spam.
Be consistent and readable.

If the current repo style supports Drizzle enums cleanly, use them where appropriate.
If constrained text is cleaner for the current stage, that is acceptable.

Timestamp guidance

Use a consistent timestamp convention across runtime tables.

Where practical include:

createdAt
updatedAt

And for event-specific or resolution-specific moments:

eventTs
resolvedAt
startedAt
completedAt

Do not make time naming inconsistent.

Index and constraint guidance

Add indexes and constraints that are clearly useful now.

At minimum consider:

foreign-key indexes
chronicle-scoped lookup indexes
uniqueness on one state row per chronicle
uniqueness on perspective run per chronicle/perspective
uniqueness of choice key within scene
useful ordering indexes for event timelines and scene progress

Examples of good constraints:

unique chronicleId in chronicle_states
unique (chronicleId, perspectiveId) in perspective_runs
unique (sceneInstanceId, choiceKey) in scene_choices

Do not overbuild speculative indexes.
Add the ones that support clear integrity and lookup behavior.

Relations guidance

Define relations where doing so is clean and useful.

At minimum, model obvious relationships such as:

book_version → chronicles
chronicle → chronicle_state
chronicle → perspective_runs
chronicle → scene_instances
chronicle → choice_resolutions
chronicle → knowledge_state
chronicle → event_log
chronicle → canon_commits
perspective_run → scene_instances
scene_instance → scene_choices
scene_choice → choice_resolutions
scene_instance → knowledge_state by source linkage where practical
event_log → canon_commits by source linkage where practical
canon_entry → canon_commits where practical

Keep relations readable.
Do not create relation clutter just for symmetry.

Required implementation tasks
Task 1 — inspect current schema state

Inspect:

src/data/schema/index.ts
runtime schema placeholders if any
src/data/schema/README.md
shared schema helpers
generated migrations so far
authoring schema from 04

Determine how to add runtime schema cleanly without tangling it into authoring files.

Task 2 — add shared runtime-friendly helpers if needed

If useful, extend src/data/schema/shared.ts with small practical helpers for:

IDs
timestamps
bounded metadata jsonb
status typing patterns

Keep helpers small and composable.

Do not create a mini framework around columns.

Task 3 — implement runtime tables

Create the runtime tables listed above using Drizzle’s Postgres schema tools.

Keep the implementation split across readable files.

Task 4 — implement relations

Add the obvious relations for runtime and authoring-to-runtime references.

Keep the relation layer readable and useful.

Task 5 — export schema cleanly

Update:

src/data/schema/runtime/index.ts
src/data/schema/index.ts

so all runtime models are exported cleanly for Drizzle and future data access work.

Task 6 — generate migration

Run the appropriate migration generation command for the runtime schema additions.

Do not skip migration generation.

Task 7 — apply migration

Apply the generated migration to the local dev database.

The local dev database target remains:

database: inkbranch_dev
user: inkbranch_app

Use the repo’s local env flow.
Do not commit real secrets.

Task 8 — verify schema state

Verify as appropriate:

lint passes
typecheck passes
migration generation succeeds
migration application succeeds
runtime tables exist in the local DB
no accidental authoring regressions were introduced
no beat-graph structures slipped in
Task 9 — document the runtime schema

Create or update:

docs/runtime-schema.md

This doc should explain:

what belongs in the runtime plane
which tables exist
why current-state projection is separate from event history
why scene instances, choices, and resolutions are separate
why canon commits exist
why this is not a giant runtime blob
that queries/mutations are intentionally deferred to 06
Task 10 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Required files to create or normalize

You may create or update files such as:

Schema files
src/data/schema/runtime/chronicles.ts
src/data/schema/runtime/scenes.ts
src/data/schema/runtime/state.ts
src/data/schema/runtime/events.ts
src/data/schema/runtime/index.ts
src/data/schema/index.ts
src/data/schema/README.md
src/data/schema/shared.ts
Documentation
docs/runtime-schema.md
Migration artifacts
files generated under drizzle/

You may add a few small support files if needed, but do not expand into queries, mutations, or app logic.

Guardrails against bad runtime design
Do not do this

Bad patterns include:

one runtime_state table with a giant jsonb blob containing everything
storing all continuity only in prose output
storing scene, choices, and chosen resolution in one record
using event log as the only runtime structure with no current projection
putting runtime columns into authoring tables
recreating beat graph traversal through runtime linkage tables
Do this instead

Good patterns include:

top-level chronicle record
one current-state projection row per chronicle
perspective-specific run tracking
scene instance records
separate presented choices
separate choice resolution records
inspectable knowledge state
append-oriented event log
explicit canon commits
Acceptance criteria

This prompt is complete only if all of the following are true:

All required runtime tables are implemented.
The runtime schema is split cleanly across readable files.
Runtime is clearly separated from authoring schema.
chronicles are anchored to book_versions.
chronicle_states exists as a projection table, not the only runtime truth.
Scene instances, scene choices, and choice resolutions are separate tables.
Knowledge state, event log, and canon commits are implemented.
Core foreign keys and useful indexes are in place.
Schema exports are wired correctly for Drizzle.
A migration is generated successfully.
The migration is applied successfully to the local dev database.
docs/runtime-schema.md exists and explains the runtime plane clearly.
No beat-graph-first runtime schema was introduced.
Lint and typecheck pass.
The repo is ready for 06_data_access_boundaries.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
migration generation succeeds
migration application succeeds
runtime tables are present in the local DB
authoring tables remain intact
no graph-first structures slipped in
schema exports are clean

If verification fails:

fix the issue
rerun verification
only then mark complete

If the DB is genuinely unreachable:

log the exact blocker
do not mark complete
STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 05_runtime_schema.md

To:

 05_runtime_schema.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 05_runtime_schema.md
Status: completed
Summary:
implemented the relational runtime schema for Inkbranch v2
added chronicles, projection state, scene records, choices, resolutions, knowledge, events, and canon commits
generated and applied the runtime migration
documented the runtime plane and deferred data access work to 06
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally bounded json fields
note any relation/detail intentionally deferred
note that data access boundaries remain for 06

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Inkbranch v2 gains a clean, relational, inspectable runtime spine.

It fails if runtime becomes a blob, a disguised beat graph, or a tangle mixed into authoring truth.


Next is `06_data_access_boundaries.md`, which is where we make sure schema access stays clean instead of DB calls leaking all over the app.