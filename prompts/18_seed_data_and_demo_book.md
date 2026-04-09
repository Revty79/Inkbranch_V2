# 18_seed_data_and_demo_book.md

## Title
Inkbranch v2 — Seed Data and Demo Book

## Objective
Create realistic seed data and a demo book package for Inkbranch v2.

This prompt exists to populate the rebuilt system with enough authored truth and starter runtime data to meaningfully exercise the architecture end-to-end.

By the end of this prompt, the repo should have:
- seed data for a demo world
- a demo book
- a demo book version
- meaningful canon entries
- meaningful entities
- meaningful perspectives
- meaningful planning rules
- at least one demo chronicle or clean chronicle bootstrap path
- seed scripts or seed workflow documentation
- a demo scenario that exercises planner/runtime/reader/admin/generator flows

This prompt is about realistic seeded content for system exercise.

This is not the prompt for:
- broad content packs
- multiple polished books
- final production content pipelines
- asset libraries
- advanced content import/export tooling
- final narrative quality tuning

---

## Why this prompt matters
Up to now, Inkbranch has been building the machine.

This prompt gives the machine something real to run on.

Without seeded content:
- the planner cannot be meaningfully exercised
- the runtime cannot be tested in a believable way
- the reader shell stays too abstract
- the admin inspector stays too empty
- generator integration is hard to judge in context
- validation guards are harder to verify against real-world cases

This prompt should create one coherent demo package that is rich enough to pressure the architecture without overwhelming it.

The goal is not “a giant content dump.”
The goal is “one believable authored package that exercises the whole system.”

---

## Product direction to preserve
Inkbranch v2 is book-first, world-first, planner-led.

That means the seeded demo content should reflect:
- authored truth first
- planner-facing structure
- runtime-ready structure
- perspective-aware design
- meaningful reveals
- meaningful milestone progression
- meaningful ending possibilities

Do not seed:
- beat graphs
- next-node chains
- hand-authored scene trees
- giant opaque story blobs
- content that only works if AI improvises the real logic

The seed data must prove the planner-first architecture.

---

## Non-negotiable rules
1. Do not seed a beat-graph-first story structure.
2. Do not seed giant opaque JSON blobs as the main book truth.
3. Do not rely on the generator to invent the actual story framework.
4. Do not create a trivial empty demo with no real planning value.
5. Do not create so much content that the seed becomes unmaintainable.
6. Keep the seeded content coherent and version-centered.
7. Make sure the seed data meaningfully exercises planner/runtime/reader/admin paths.
8. Use the real authoring schema and runtime schema, not shortcuts.
9. Keep seeds readable and maintainable.
10. Prefer one strong demo package over many weak ones.

---

## Scope
You should implement:
- seed data for one demo world
- seed data for one demo book
- one active demo book version
- enough canon entries to matter
- enough characters/locations/factions/perspectives to matter
- enough milestones/reveal rules/pacing rules/ending rules to matter
- a seed path for at least one demo chronicle or a clean bootstrap mechanism for creating one
- seed workflow documentation
- validation that the seeded content actually works with the current architecture

You should also:
- preserve architecture boundaries
- keep seed code separate from app logic
- make the demo content feel intentionally designed, not random filler
- make the seed useful for debugging and demonstration

---

## Out of scope
Do not implement:
- multiple finished books
- large libraries of world content
- content import/export systems
- author collaboration tools
- advanced sample data generators
- asset/media attachment systems
- lore encyclopedia systems beyond the existing authored truth model
- final polished commercial content packs

This is one demo package for exercising the rebuilt system.

---

## Demo content philosophy

### Principle 1 — the demo should pressure the architecture
The seeded content should not be too simple.

It should include enough structure to test:
- version-owned authoring truth
- multiple perspectives
- milestone progression
- reveal gating
- pacing pressure
- ending eligibility differences
- runtime continuity changes
- admin inspection surfaces
- generation fallback/live generation behavior

### Principle 2 — the demo should still be maintainable
Do not create a giant lore bible in the seed.

Create enough content to be meaningful, but small enough that:
- Codex can manage it
- you can inspect it
- you can reason about failures
- the architecture remains the focus

### Principle 3 — the demo should feel like a book, not a schema test
Even though this is seed data, it should still feel like:
- a world
- a book
- a playable version
- perspectives with real differences
- reveals that matter
- endings that differ meaningfully

Do not seed lifeless placeholder text everywhere.

### Principle 4 — the demo should be planner-friendly
The content should be designed so the planner has something to work with.

That means:
- multiple unresolved milestone possibilities
- at least a few reveal rules that can be legal or blocked
- pacing rules that matter
- ending rules that are not trivially always eligible
- perspectives that create variation

### Principle 5 — the demo should be runtime-inspectable
The seeded content should make admin inspection meaningful.

That means:
- identifiable milestones
- identifiable reveals
- identifiable commit keys
- identifiable knowledge keys
- scene and choice flows that can be understood by a human

---

## Required demo package content

Create one coherent demo package that includes at minimum:

### 1. One demo world
Must include:
- title
- slug
- description
- status
- enough world framing to support the book

### 2. One demo book
Must include:
- title
- slug
- premise
- default tone
- status
- clear relation to the world

### 3. One active demo book version
Must include:
- version label
- active status
- notes if useful
- clear position as the playable authored package

### 4. Canon entries
Seed enough canon entries to support real planning and continuity.

They should include a mix such as:
- world truths
- character truths
- relationship truths
- danger/truth-of-situation entries
- hidden facts that reveals can expose
- truths relevant to endings

Do not create only generic filler canon.

### 5. Characters
Seed enough characters to support perspective-based planning.

At minimum:
- one primary perspective character
- one secondary perspective character
- supporting characters relevant to reveals and endings

These should feel distinct.

### 6. Locations
Seed enough locations to support meaningful scene context.

At minimum:
- a starting location
- a pressure/escalation location
- a location relevant to a reveal or ending

### 7. Factions
Seed at least one or two factions if they matter to the demo premise.

They should have enough identity to be meaningful in canon and reveals.

### 8. Perspectives
Seed at least two meaningful perspectives.

These should differ in:
- voice guide
- knowledge baseline
- role in the conflict
- likely reveal access or sensitivity

The system should be able to show why perspective matters.

### 9. Arc milestones
Seed enough milestones to support real progression.

At minimum include:
- early progression milestone(s)
- mid-pressure milestone(s)
- reveal-related milestone(s)
- ending-readiness milestone(s)

These should be planner-friendly, not beat nodes.

### 10. Reveal rules
Seed reveals that matter.

At minimum include:
- one early reveal that becomes legal fairly soon
- one reveal that is initially blocked
- one reveal tied strongly to ending eligibility or major progression

Each reveal should have a meaningful subject and legal context.

### 11. Pacing rules
Seed enough pacing rules to influence structural flow.

Examples:
- don’t allow too many calm scenes in a row
- push escalation after certain progression
- don’t allow ending resolution too early

Keep the rules simple but real.

### 12. Ending rules
Seed at least two meaningfully different endings.

For example:
- an ending reached through a high-trust/high-truth path
- an ending reached through concealment, compromise, or partial truth

The endings do not need full prose here, but they should be structurally distinct and planner-meaningful.

---

## Demo book design guidance
Create a demo book premise that is small enough to manage but rich enough to matter.

A good demo premise should support:
- secrets
- relationships
- perspective differences
- escalating pressure
- legal/illegal reveal timing
- multiple endings

Examples of the kind of shape that works well:
- investigation under social pressure
- mystery with partial truths and conflicting loyalties
- survival/containment scenario with hidden cause
- political or familial tension with concealed facts

Do not create a demo that is so simple the planner has nothing to do.

Do not create a giant epic with too many moving parts.

The demo should be something the team can understand quickly and inspect easily.

---

## Required runtime seed posture

You have two acceptable options here.

### Option A — seed a demo chronicle directly
Seed at least one chronicle and enough related runtime state that the Reader and Admin surfaces immediately have something meaningful to inspect.

This can be helpful if the current app benefits from immediate inspectable state.

### Option B — seed authored truth and provide a clean demo chronicle bootstrap
If direct runtime seed is less clean, create a clear bootstrap script/path that:
- creates a demo chronicle from the seeded book version
- initializes its state
- optionally kicks off the first planner/instantiation cycle in a controlled way

Either approach is acceptable, but the result must let the system be exercised end-to-end.

Do not leave the repo with “authoring seed exists but there is no practical way to test a run.”

---

## Required implementation structure

Use or normalize a structure like:

```text
scripts/
  seed-demo.ts
src/
  data/
    seeds/
      demo-world.ts
      demo-book.ts
      demo-canon.ts
      demo-entities.ts
      demo-planning.ts
      index.ts
docs/
  demo-book.md
  seed-data.md

You may choose slightly different names if they are cleaner, but the responsibilities should remain clear:

world/book
canon
entities
planning rules
seed orchestration
docs

Do not hide the seed data deep inside app code.

Required implementation tasks
Task 1 — inspect current authoring/runtime schema, data access, planner/runtime/generator flow

Inspect:

authoring schema
runtime schema
seed-related scripts or conventions if any
planner/runtime flow
reader/admin expectations
current docs and scripts

Determine the cleanest seed strategy for this repo.

Task 2 — design one coherent demo package

Define one demo world/book/version concept that will exercise the architecture well.

This should be intentional and documented.

Before implementing the seed content, make sure the content plan includes:

premise
perspectives
main hidden truths
milestone structure
reveal structure
ending structure

Do not just improvise random records.

Task 3 — implement authoring seed data

Seed the demo authoring content:

world
book
version
canon entries
entities
perspectives
planning rules

Use the real authoring schema and clear, readable seed code.

Keep the seed data maintainable.

Task 4 — implement runtime seed or runtime bootstrap

Choose one clean strategy:

seed at least one demo chronicle directly
or implement a clean demo chronicle bootstrap

In either case, make sure there is a straightforward way to get:

a real chronicle
a current scene or a planner-triggerable starting point
enough runtime state to exercise reader/admin surfaces
Task 5 — integrate with existing planner/runtime flow where appropriate

If the repo architecture supports it cleanly, let the demo bootstrap exercise:

planner context loading
planner scene creation
runtime instantiation
current reader scene availability

Do this carefully.
Do not hack around the architecture just to force demo data through.

Task 6 — add seed scripts and package scripts

Add or refine scripts in package.json so the demo seed is easy to run.

Examples of useful script intent:

seed:demo
seed:reset-demo if clean and safe
possibly a bootstrap variant if needed

Keep the workflow obvious and documented.

Task 7 — document the demo content

Create:

docs/demo-book.md
docs/seed-data.md

docs/demo-book.md should explain:

the demo world/book/version premise
major characters/perspectives
major hidden truths
milestone structure
reveal structure
ending structure

docs/seed-data.md should explain:

how to run the seed
what gets created
whether runtime data is seeded or bootstrapped
how to verify the seeded data is working
how to inspect it in Reader/Admin/Studio
Task 8 — verify the seeded content actually works

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
seed script runs successfully
authoring data is present
runtime bootstrap or runtime seed works
planner can operate on the seeded content
reader can load the demo content
admin can inspect the demo content
generator path has something meaningful to render or fall back from

This prompt fails if the seed exists but is not actually usable.

Task 9 — add focused seed/demo tests if appropriate

Add a small number of focused tests where useful, such as:

seed builds expected world/book/version relationships
demo version has required perspectives
reveal rules and ending rules exist for the demo version
runtime bootstrap creates a coherent chronicle if that path is used

Keep tests focused and purposeful.

Task 10 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Design guidance
Good demo seed design

Good:

one coherent world/book/version
meaningful perspectives
meaningful secrets/reveals
meaningful milestones
meaningful endings
clean seed scripts
actual end-to-end usefulness
Bad demo seed design

Bad:

giant content dump
random filler data
only one flat perspective with no real variation
no real reveals or ending logic
authoring data only, with no usable runtime path
seed logic hidden in app code
beat graph or scene tree seeded as the real structure
Safe simplification guidance

This is a demo package, not a full commercial book.

Acceptable simplifications:

a compact cast
a compact location set
a handful of meaningful milestones
a handful of meaningful reveals
two or three endings
one bootstrap chronicle path

Unacceptable shortcuts:

generic lorem ipsum canon
no reveal gating
no meaningful perspective differences
no practical runtime exercise path
one giant config blob pretending to be authored truth
Suggested demo content profile

A good demo content profile would include:

1 world
1 book
1 active version
8–20 canon entries
3–6 characters
2–4 locations
1–3 factions
2 perspectives
4–8 milestones
3–6 reveal rules
2–4 pacing rules
2–3 ending rules

You do not have to use these exact numbers, but the content should be rich enough to matter and small enough to inspect.

Guardrails against bad seed design
Do not do this

Bad patterns include:

seeding beat nodes and branch trees
stuffing the whole book into one JSON field
using AI to invent the seed structure ad hoc during runtime
creating a trivial toy demo with no real reveal/endings pressure
seeding content that does not work with the planner/runtime model
Do this instead

Good patterns include:

relational authored truth
version-centered seed content
perspective-aware demo design
meaningful reveals and endings
runtime/bootstrap path that exercises the system
clean scripts and docs
Acceptance criteria

This prompt is complete only if all of the following are true:

One coherent demo world is seeded.
One coherent demo book is seeded.
One active demo book version is seeded.
Meaningful canon entries are seeded.
Meaningful characters, locations, factions, and perspectives are seeded.
Meaningful milestones, reveal rules, pacing rules, and ending rules are seeded.
There is a practical runtime seed or bootstrap path for a demo chronicle.
The seeded content works with the planner/runtime/reader/admin flow.
Seed scripts are present and usable.
docs/demo-book.md exists and explains the demo content clearly.
docs/seed-data.md exists and explains the seed workflow clearly.
No beat-graph-first content structure was introduced.
Lint and typecheck pass.
Focused seed/demo tests exist where appropriate and pass.
The repo is ready for 19_tests_and_quality_gates.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
demo seed script runs successfully
seeded authoring data exists
demo runtime path exists and works
planner can produce or consume meaningful demo context
reader can load demo chronicle content
admin can inspect demo chronicle content
no forbidden imports were introduced
seed logic remains within current architecture boundaries

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a fake or unusable demo package behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 18_seed_data_and_demo_book.md

To:

 18_seed_data_and_demo_book.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 18_seed_data_and_demo_book.md
Status: completed
Summary:
seeded a coherent demo world/book/version and enough authored truth to exercise the planner-first architecture
added meaningful demo canon, entities, perspectives, milestones, reveals, pacing rules, and endings
implemented a practical demo runtime seed/bootstrap path and documented how to use it
verified the seeded content works across planner/runtime/reader/admin flows
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally compact demo scope
note any runtime bootstrap assumptions
note that tests/quality gate hardening remains for 19

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Inkbranch gains one coherent, meaningful demo package that actually exercises the rebuilt architecture.

It fails if the seed is trivial, unusable, graph-first, blob-first, or disconnected from the real planner/runtime/reader/admin flow.


Next is `19_tests_and_quality_gates.md`, which is where we tighten the whole rebuild with real test coverage and final verify gates.