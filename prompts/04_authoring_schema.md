# 04_authoring_schema.md

## Title
Inkbranch v2 — Authoring Schema

## Objective
Implement the relational authoring schema for Inkbranch v2.

This prompt exists to create the database tables, relations, constraints, and schema exports for the authored truth layer of the platform.

By the end of this prompt, the repo should have:
- relational authoring tables implemented in Drizzle
- clear separation between authored truth tables and future runtime tables
- primary keys, foreign keys, indexes, and basic constraints where appropriate
- schema exports wired for Drizzle migrations
- documentation explaining the authoring schema and its role
- a migration generated and applied for the authoring layer
- the repo ready for `05_runtime_schema.md`

This prompt is about the authoring plane only.

Do not implement runtime tables here.
Do not implement planner logic here.
Do not implement query/mutation business logic here.

---

## Why this prompt matters
Inkbranch v2 is driven by authored truth.

That means the system needs a real relational home for:
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

These are not runtime artifacts.
These are the structured source inputs that later drive planning, generation, and continuity.

If this layer is weak, the planner will end up guessing.
If this layer is vague, the generator will end up doing too much.
If this layer is blob-based, runtime inspectability will rot later.

This prompt creates the truth spine the rest of the system depends on.

---

## Product direction to preserve
Inkbranch v2 is not a hand-authored beat graph.

Do not create tables centered around:
- beat nodes
- beat edges
- next beat links
- story graph traversal
- choice graph definitions

Instead, this schema must support the actual product model:

book bible -> planner -> scene package -> reader decision -> runtime update

The authoring schema is the book-bible side of that loop.

---

## Non-negotiable rules
1. Do not implement runtime tables in this prompt.
2. Do not implement graph-first beat architecture.
3. Do not use a giant JSON blob as the authored source of truth.
4. Use relational tables for the main authored entities.
5. Use `jsonb` only where bounded metadata or flexible rule configuration is appropriate.
6. Keep schema files explicit and readable.
7. Export all schema models cleanly so Drizzle can use them for migrations.
8. Do not mix queries or mutations into schema files.
9. Do not implement planner or generator logic here.
10. Keep the schema aligned with the planner-first architecture.

---

## Scope
You should implement the authoring tables for:
- worlds
- books
- book_versions
- canon_entries
- characters
- locations
- factions
- perspectives
- arc_milestones
- reveal_rules
- pacing_rules
- ending_rules

You should also implement:
- their core foreign-key relationships
- useful indexes
- status/default fields where appropriate
- schema exports
- documentation
- migration generation and migration application

You should update:
- `src/data/schema/index.ts`
- any schema organization files needed under `src/data/schema/`

You should not implement:
- runtime schema
- data access logic
- CRUD services
- route logic
- planner logic

---

## Out of scope
Do not implement:
- chronicles
- chronicle_states
- perspective_runs
- scene_instances
- scene_choices
- choice_resolutions
- knowledge_state
- event_log
- canon_commits
- auth tables
- background jobs
- AI provider storage
- story graph tables
- generic content node systems
- arbitrary “future proof” tables with no clear current purpose

Keep this prompt focused.

---

## Schema philosophy

### Principle 1 — relational first
Main authoring truth should live in real relational columns.

That means:
- IDs
- foreign keys
- names/titles
- slugs/keys
- statuses
- summaries/descriptions
- priorities/order hints
- activation/publishing flags

should all be normal columns where they are stable and meaningful.

### Principle 2 — `jsonb` is bounded support, not main truth
Use `jsonb` only for things like:
- flexible rule configuration
- optional metadata
- bounded tag/config structures
- rule payloads that are inherently semi-structured

Do not turn every table into:
- `id`
- `type`
- `payload_jsonb`

That would reintroduce the same mess in a different costume.

### Principle 3 — versioned authored truth
`book_versions` should anchor authored truth for a specific playable version.

Most authoring entities in this schema should belong to a `book_version_id`, not merely a `book_id`.

This is important because:
- published versions must be stable
- draft/test versions may vary
- planners should consume version-specific truth

### Principle 4 — planner-facing, not beat-facing
This schema should support:
- planner context construction
- reveal gating
- pacing guidance
- ending eligibility
- milestone progression intent

It should not require:
- manual author-authored next-scene chains

### Principle 5 — clean future runtime separation
The authoring plane should remain clearly separate from the runtime plane.

Future runtime tables will reference authored truth where appropriate, but they are not part of this prompt.

---

## Required schema organization

Use or normalize a schema layout under `src/data/schema` that keeps this prompt readable.

A recommended structure is:

```text
src/data/schema/
  index.ts
  README.md
  shared.ts
  authoring/
    worlds.ts
    books.ts
    canon.ts
    entities.ts
    planning-rules.ts
    index.ts

You may choose slightly different file names if they are clearer, but keep the split intentional and readable.

Suggested grouping:

worlds.ts → worlds
books.ts → books, book_versions
canon.ts → canon_entries
entities.ts → characters, locations, factions, perspectives
planning-rules.ts → arc_milestones, reveal_rules, pacing_rules, ending_rules

Do not put the entire authoring schema into one massive file.

Required tables and design guidance
1. worlds

Purpose:
Top-level universe/container.

Core fields should include:

id
slug
title
description
status
metadataJson
created/updated timestamps

Guidance:

slug should be unique
keep this table simple and stable
2. books

Purpose:
Book-level unit within a world.

Core fields should include:

id
worldId
slug
title
premise
defaultTone
status
metadataJson
created/updated timestamps

Guidance:

foreign key to worlds
unique slug at least within practical app expectations
index foreign-key relationships
3. book_versions

Purpose:
Versioned authored definition of a book.

Core fields should include:

id
bookId
versionLabel
status
isActive
notes
created/updated timestamps

Guidance:

foreign key to books
this should be the anchor for most authored truth
later published/test/draft behavior can hang off this table
add useful indexes for bookId, status, and isActive

Do not overcomplicate version promotion logic yet.

4. canon_entries

Purpose:
Atomic authored truths.

Core fields should include:

id
bookVersionId
entryType
subjectType
subjectId
canonicalText
importance
visibility
tagsJson
metadataJson
created/updated timestamps

Guidance:

foreign key to book_versions
subjectType and subjectId may remain a typed polymorphic reference for now
use bounded JSON for tags/metadata only where it makes sense
do not try to normalize every possible canon subject relation in this prompt
index fields that will matter for lookup, such as bookVersionId, entryType, subjectType, and perhaps importance
5. characters

Purpose:
Authored characters for a specific book version.

Core fields should include:

id
bookVersionId
slug
name
summary
status
metadataJson
created/updated timestamps

Guidance:

foreign key to book_versions
slug should be unique per version if practical
keep flexible detail in metadata bounded
6. locations

Purpose:
Authored locations for a specific book version.

Core fields should include:

id
bookVersionId
slug
name
summary
status
metadataJson
created/updated timestamps

Guidance:

same style as characters
clean, stable relational structure first
7. factions

Purpose:
Authored factions for a specific book version.

Core fields should include:

id
bookVersionId
slug
name
summary
status
metadataJson
created/updated timestamps
8. perspectives

Purpose:
Authored playable/narrative perspectives for a specific book version.

Core fields should include:

id
bookVersionId
characterId
slug
name
summary
voiceGuide
knowledgeBaselineJson
eligibilityRulesJson
status
created/updated timestamps

Guidance:

foreign key to book_versions
foreign key to characters
this is a major planner-facing table
bounded JSON is acceptable for knowledge baseline and eligibility configuration
9. arc_milestones

Purpose:
Major structural milestones the planner can target.

Core fields should include:

id
bookVersionId
arcKey
milestoneKey
title
description
priority
required
sequenceHint
eligibilityRulesJson
completionRulesJson
created/updated timestamps

Guidance:

these are not beats
they are planner-facing structural markers
index by bookVersionId, arcKey, milestoneKey
10. reveal_rules

Purpose:
Rules for what may be revealed, when, and under what conditions.

Core fields should include:

id
bookVersionId
revealKey
subjectType
subjectId
gatingRulesJson
exposureEffectsJson
created/updated timestamps

Guidance:

keep structured rule payloads bounded
index bookVersionId and revealKey
11. pacing_rules

Purpose:
Planner pacing constraints and targets.

Core fields should include:

id
bookVersionId
scope
ruleType
ruleConfigJson
created/updated timestamps

Guidance:

keep this flexible enough for pacing configs
but do not collapse all planning logic into one giant JSON universe
12. ending_rules

Purpose:
Ending definitions and eligibility criteria.

Core fields should include:

id
bookVersionId
endingKey
title
endingType
eligibilityRulesJson
priorityRulesJson
resolutionTemplateJson
created/updated timestamps

Guidance:

foreign key to book_versions
index bookVersionId and endingKey
Status and enum guidance

Where statuses are appropriate, define clean string enums or constrained text values.

Use stable categories such as:

draft
active
archived
published
test

Do not create enum chaos.
Use constrained, readable values that fit the current model.

If Drizzle enum support fits cleanly with the repo style, use it.
If simple constrained text plus clear typing is cleaner for the current scaffold, that is acceptable.

Choose consistency and maintainability.

Timestamp guidance

Where practical, include:

createdAt
updatedAt

Use a consistent convention across the authoring schema.

Do not make timestamp naming inconsistent across tables.

Index and constraint guidance

Add indexes and constraints that are obviously useful now.

At minimum, think in terms of:

foreign-key indexes
slug uniqueness where appropriate
version-scoped uniqueness where appropriate
key uniqueness where appropriate

Examples of good constraints:

unique world slug
unique book slug within the intended scope
unique perspective slug per book version
unique milestone key within arc/version scope
unique ending key per book version

Do not overbuild every conceivable index.
Add the ones that serve clear lookup and integrity needs.

Relations guidance

Define relations where doing so is clean and useful.

At minimum, model obvious one-to-many relationships such as:

world → books
book → book_versions
book_version → canon_entries
book_version → characters
book_version → locations
book_version → factions
book_version → perspectives
book_version → arc_milestones
book_version → reveal_rules
book_version → pacing_rules
book_version → ending_rules
character → perspectives

Keep relations readable.
Do not create relation noise just for completeness.

Required implementation tasks
Task 1 — inspect current schema foundation

Inspect:

src/data/schema/index.ts
src/data/schema/README.md
drizzle.config.ts
migration scripts
any schema placeholders from earlier prompts

Determine how to add the authoring schema cleanly.

Task 2 — create shared schema helpers if needed

If useful, add a small shared schema helper file for consistent:

ID columns
timestamp columns
common metadata jsonb columns
common status typing

Keep shared helpers small and practical.

Do not create a giant abstraction framework around columns.

Task 3 — implement authoring tables

Create the authoring tables listed above using Drizzle’s Postgres schema tools.

Keep the implementation readable and split across files logically.

Task 4 — implement relations

Add clear relations for the obvious table relationships.

Do not overbuild speculative relations that are not helpful yet.

Task 5 — export schema cleanly

Update src/data/schema/index.ts and any local schema barrels so all authoring models are exported cleanly.

This is important so Drizzle can use the schema for migrations.

Task 6 — generate migration

Run the appropriate migration generation command for the newly added authoring schema.

Do not skip this.

Task 7 — apply migration

Apply the generated migration to the local database.

The local dev target should continue using:

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
the authoring tables exist in the local DB
no runtime tables were accidentally introduced
Task 9 — document the authoring schema

Create or update:

docs/authoring-schema.md

This doc should explain:

what belongs in the authoring plane
which tables exist
why the schema is version-centered
why this is not a beat graph
what runtime schema is intentionally deferred to 05
Task 10 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Required files to create or normalize

You may create or update files such as:

Schema files
src/data/schema/shared.ts
src/data/schema/authoring/worlds.ts
src/data/schema/authoring/books.ts
src/data/schema/authoring/canon.ts
src/data/schema/authoring/entities.ts
src/data/schema/authoring/planning-rules.ts
src/data/schema/authoring/index.ts
src/data/schema/index.ts
src/data/schema/README.md
Documentation
docs/authoring-schema.md
Migration artifacts
files generated under drizzle/

You may add a few small support files if needed, but do not expand into queries, mutations, or app logic.

Guardrails against bad schema design
Do not do this

Bad patterns include:

one generic content_nodes table for everything
one giant book_payload_jsonb table
a beat/choice/edge graph schema
putting runtime state columns into authoring tables
hiding canon in untyped blobs
making the planner depend on manual next-scene linking
Do this instead

Good patterns include:

explicit authored entity tables
version-anchored truth
bounded JSON for flexible rule payloads
clear foreign-key relationships
planner-facing milestone/reveal/pacing/ending tables
Acceptance criteria

This prompt is complete only if all of the following are true:

All required authoring tables are implemented.
The schema is split cleanly across readable files.
book_versions is the anchor for version-specific authored truth.
Core foreign keys and useful indexes are in place.
Schema exports are wired correctly for Drizzle.
A migration is generated successfully.
The migration is applied successfully to the local dev database.
docs/authoring-schema.md exists and explains the authoring plane clearly.
No runtime tables were introduced.
No beat-graph-first schema was introduced.
Lint and typecheck pass.
The repo is ready for 05_runtime_schema.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
migration generation succeeds
migration application succeeds
authoring tables are present in the local DB
no runtime schema slipped in
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

 04_authoring_schema.md

To:

 04_authoring_schema.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 04_authoring_schema.md
Status: completed
Summary:
implemented the relational authoring schema for Inkbranch v2
added version-anchored authored truth tables, relations, and core constraints
generated and applied the authoring migration
documented the authoring plane and deferred runtime schema to 05
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally bounded json fields
note any relation/detail intentionally deferred
note that runtime schema remains for 05

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if authored truth becomes a clean relational schema.

It fails if you sneak runtime behavior, beat-graph architecture, or blob-first storage into the authoring plane.


Next is `05_runtime_schema.md`, which is where the run state, scene instances, events, and inspectable continuity get their own clean relational layer.
::contentReference[oaicite:1]{index=1}