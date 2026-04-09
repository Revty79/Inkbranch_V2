# 20_docs_and_handoff.md

## Title
Inkbranch v2 — Docs and Handoff

## Objective
Finalize the documentation and handoff materials for Inkbranch v2.

This prompt exists to turn the rebuilt repository from “working system” into “maintainable project.”

By the end of this prompt, the repo should have:
- clear architecture documentation
- setup and local-development documentation
- workflow documentation for Studio, Reader, Admin, planner, runtime, generator, and validation
- documentation for seed/demo usage
- documentation for testing and verification
- a clean contributor/handoff guide
- a repo state that a future developer can understand without guesswork

This prompt is about clarity, continuity, and maintainability.

This is not the prompt for:
- new product features
- new planner/runtime/generator logic
- new UI features
- major refactors
- rebuilding already-completed prompts unless truly required for documentation accuracy

---

## Why this prompt matters
A rebuild is not truly complete when the code merely exists.

It is complete when:
- the structure is understandable
- the decisions are documented
- the workflows are repeatable
- the architecture is defensible
- a future contributor can continue without collapsing the design

Without a real handoff layer, the repo will drift back toward:
- hidden assumptions
- “tribal knowledge”
- accidental architecture violations
- undocumented workflows
- fragile onboarding
- confusion about what each layer owns

This prompt is what makes Inkbranch v2 sustainable.

---

## Product direction to preserve
Inkbranch v2 is:
- book-first
- world-first
- planner-led
- runtime-committed
- AI-on-rails
- relational and inspectable

The final docs and handoff must preserve that.

They must reinforce:
- no beat-graph-first architecture
- planner decides structure
- generator renders approved structure
- runtime commits what happened
- UI does not own engine logic
- relational state is the source of truth, not opaque blobs
- continuity is guarded explicitly

This prompt is where the repo tells future contributors how not to break it.

---

## Non-negotiable rules
1. Do not add major new features in this prompt.
2. Do not rewrite working architecture for cosmetic reasons.
3. Do not weaken boundaries in docs for the sake of simplicity.
4. Do not leave important workflows undocumented.
5. Do not let docs become vague marketing copy.
6. Prefer concrete, practical documentation over abstract hand-waving.
7. Keep docs aligned with the actual implemented repo state.
8. Make the handoff usable for a future developer who has not lived through this rebuild.
9. Keep the repo’s architecture doctrine explicit.
10. Finish the rebuild cleanly.

---

## Scope
You should implement:
- final architecture docs
- local setup docs
- developer workflow docs
- feature-area docs where needed
- demo/seed docs cleanup and consolidation
- verification/testing docs cleanup
- contributor/handoff docs
- README normalization if needed
- final repo-level navigation docs or index docs where useful

You should also:
- audit the current docs for accuracy
- reduce duplication where possible
- preserve important per-layer docs
- make the documentation tree coherent and navigable

---

## Out of scope
Do not implement:
- new architecture
- new data model features
- new planner/runtime/generator capabilities
- extensive design-system polish
- large doc sites or external publishing systems
- broad CI/CD infrastructure work
- nonessential repo churn

This prompt is the final documentation and handoff pass.

---

## Documentation philosophy

### Principle 1 — docs should reflect the architecture, not fight it
The documentation should make the architecture legible.

A future contributor should be able to understand:
- the main product loop
- which layer owns what
- how data flows
- where to add new functionality safely
- what not to do

### Principle 2 — setup docs should be practical
Setup docs should answer:
- how to install
- how to configure env
- how to run the DB
- how to seed demo data
- how to start the app
- how to verify the repo

They should not assume prior tribal knowledge.

### Principle 3 — handoff docs should preserve design doctrine
The rebuild has strong architecture rules.

The handoff should explicitly preserve:
- no beat-graph-first architecture
- no engine logic in UI
- no giant runtime blob
- planner first
- generator constrained
- runtime relational and inspectable

These must be written down clearly.

### Principle 4 — docs should be layered like the codebase
The docs should mirror the system:
- architecture overview
- module boundaries
- setup
- Studio
- Reader
- Admin
- planner
- runtime
- generator
- validation
- testing
- seed/demo content
- contributor workflow

### Principle 5 — docs should be useful during real work
A good doc set should help someone:
- debug
- extend
- onboard
- seed
- test
- verify
- avoid architectural mistakes

Not just admire the structure.

---

## Required documentation outcomes

By the end of this prompt, the repo should clearly answer all of these questions:

### Repo understanding
- What is Inkbranch v2?
- What problem is it solving?
- What is the core product loop?
- Why is it not a beat-graph-first system?

### Local setup
- How do I install dependencies?
- How do I configure env?
- How do I connect to the local PostgreSQL database?
- How do I run migrations?
- How do I seed demo data?
- How do I start the app?

### Architecture
- What are the top-level layers?
- What belongs in `core`, `data`, `ui`, `app`, and `lib`?
- What does the planner own?
- What does runtime own?
- What does the generator own?
- What does validation own?

### Workflows
- How does Studio fit in?
- How does Reader fit in?
- How does Admin fit in?
- How does authoring flow into planner/runtime?
- How does generation fit without owning truth?

### Debugging and inspection
- How do I inspect a chronicle?
- How do I understand events, knowledge, and canon commits?
- How do I know whether generation succeeded or fell back?
- Where do I look when continuity fails?

### Testing and verification
- What commands should I run before shipping changes?
- What does `verify` do?
- What tests exist?
- How do I run unit vs integration vs e2e tests?

### Contribution and continuation
- How should future contributors extend the system?
- Where should new logic go?
- What are the architectural red lines?
- What patterns should not be reintroduced?

---

## Required implementation tasks

### Task 1 — audit current documentation
Inspect all current docs created through the rebuild, including but not limited to:
- root `README.md`
- architecture docs
- module boundary docs
- domain/planner/runtime/generator/validator docs
- Studio/Reader/Admin docs
- seed/demo docs
- testing docs
- bootstrap/status workflow docs if present

Determine:
- what is accurate
- what is redundant
- what is missing
- what needs consolidation
- what needs clearer navigation

Do not blindly rewrite everything.
Normalize where it improves clarity.

### Task 2 — normalize root README
Create or update the root `README.md` so it serves as the main repo entry point.

It should explain at minimum:
- what Inkbranch v2 is
- core philosophy
- stack overview
- architecture summary
- local setup summary
- demo/seed summary
- test/verify summary
- docs navigation
- contributor/handoff guidance pointer

The root README should be strong enough that a new contributor can start there.

### Task 3 — create or refine architecture index docs
Ensure there is a clean architecture overview path.

At minimum, the docs should clearly cover:
- top-level architecture
- module boundaries
- planner-first flow
- runtime truth model
- generator boundary
- validation/continuity posture

If useful, create a docs index such as:
- `docs/README.md`
- or `docs/index.md`

This should make the docs set navigable.

### Task 4 — finalize setup and local development docs
Create or refine docs that clearly explain:
- prerequisites
- dependency installation
- env setup
- local DB config
- migrations
- demo seed/bootstrap
- local app startup
- common commands

This can live in:
- `docs/local-setup.md`
- or equivalent
- plus README references

Use the actual local DB convention already established for the project.

### Task 5 — finalize workflow docs by product area
Ensure the docs clearly explain the roles of:
- Studio
- Reader
- Admin

At minimum, each area should explain:
- what it is for
- what it is not for
- how it fits in the architecture
- how it should evolve safely

If the existing docs already cover this well, normalize and cross-link them rather than duplicating them.

### Task 6 — finalize core system docs
Ensure the docs clearly explain:
- planner
- runtime commit pipeline
- generator boundary/integration
- validation/continuity guards

These docs should not just describe what files exist.
They should explain:
- ownership
- flow
- boundary discipline
- debugging implications

### Task 7 — finalize seed/demo docs
Ensure the docs clearly explain:
- the demo world/book/version
- how to seed it
- how to bootstrap a demo chronicle if applicable
- how to inspect it
- why it exists

This should make it easy for someone to exercise the system end-to-end.

### Task 8 — finalize testing and quality docs
Ensure the docs clearly explain:
- test structure
- which test layers exist
- what commands to run
- what `verify` does
- how contributors should add future tests

### Task 9 — create contributor/handoff guide
Create a clear handoff/contributor guide such as:
- `docs/contributor-handoff.md`

This doc should explain:
- how to approach future work safely
- where to place new logic
- where not to place logic
- what architecture mistakes to avoid
- how to preserve the planner/runtime/generator separation
- how to use the existing prompt/STATUS workflow if it remains part of the repo process

This doc should be blunt and practical.

### Task 10 — create a “do not regress” architecture section
Somewhere prominent, document the red lines clearly.

Examples of architecture red lines:
- do not reintroduce beat graphs as the core architecture
- do not let UI own engine logic
- do not let the generator decide story truth
- do not turn runtime truth into a giant blob
- do not bypass the data layer
- do not treat generated prose as canon truth

This can live in the root README, contributor guide, or architecture docs.
It should be hard to miss.

### Task 11 — clean cross-linking and navigation
Make the docs easy to navigate.

Ensure the main docs point to one another where helpful:
- README → setup, architecture, demo, testing
- architecture docs → module boundaries, planner, runtime, generator, validation
- setup docs → seed/demo, testing
- contributor guide → architecture red lines, verify, docs index

A contributor should not have to hunt blindly.

### Task 12 — verify documentation accuracy against the actual repo
Audit the final docs against reality.

Verify that docs match:
- actual scripts
- actual env names
- actual folder structure
- actual routes
- actual seed/demo flow
- actual verification commands

Do not leave stale or aspirational docs behind.

### Task 13 — run final verification
Run the appropriate final verification commands and ensure:
- lint passes
- typecheck passes
- tests still pass
- docs references align with the actual repo state
- no forbidden imports or architecture regressions were introduced while cleaning docs

### Task 14 — update STATUS
Update `/prompts/STATUS.md` only after the prompt is truly complete.

---

## Suggested documentation structure
You may normalize toward something like this if it improves clarity:

```text
README.md
docs/
  README.md
  architecture-overview.md
  module-boundaries.md
  rebuild-principles.md
  local-setup.md
  studio-shell.md
  authoring-workflow-v1.md
  reader-shell.md
  scene-package-rendering.md
  planner-contracts.md
  planner-mvp.md
  runtime-schema.md
  runtime-commit-pipeline.md
  generator-boundary.md
  generator-integration.md
  validation-and-continuity-guards.md
  admin-inspector.md
  demo-book.md
  seed-data.md
  testing-and-quality-gates.md
  contributor-handoff.md

  You do not need to force this exact list if the repo already has a clear structure, but the final documentation should feel coherent and complete.

Design guidance
Good handoff design

Good:

clear root README
strong architecture overview
practical local setup
clear product-area docs
explicit contributor guidance
explicit red lines
docs that match reality
Bad handoff design

Bad:

vague README
scattered undocumented assumptions
duplicate conflicting docs
“future vision” docs that don’t match implementation
no contributor guidance
architecture doctrine only implied, not stated
Safe simplification guidance

This is a handoff prompt, not a doc-site project.

Acceptable simplifications:

markdown docs only
simple docs index
concise cross-linking
practical examples where helpful

Unacceptable shortcuts:

only updating the root README
leaving major systems undocumented
leaving stale docs in place
assuming future contributors “will figure it out”
Guardrails against bad handoff design
Do not do this

Bad patterns include:

docs that describe the old architecture accidentally
docs that say AI “writes the story logic”
docs that imply runtime truth lives in prose
docs that skip local setup details
docs that ignore validation and inspection
docs that bury the architecture red lines
Do this instead

Good patterns include:

planner-first explanation
runtime-truth explanation
generator-boundary explanation
setup commands
demo seed workflow
verification workflow
explicit continuation guidance
hard-to-miss architecture red lines
Acceptance criteria

This prompt is complete only if all of the following are true:

The root README.md is strong, current, and useful.
Architecture documentation is clear and accurate.
Local setup and environment workflow are documented clearly.
Studio, Reader, and Admin workflows are documented clearly.
Planner, runtime, generator, and validation workflows are documented clearly.
Demo seed/bootstrap workflow is documented clearly.
Testing and verify workflow are documented clearly.
A contributor/handoff guide exists and is practical.
Architecture red lines are documented prominently.
Documentation is cross-linked and navigable.
Docs match the actual implemented repo state.
Lint and typecheck pass.
Tests still pass.
The rebuild is effectively ready for real continuation and use.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
tests pass
README instructions match actual scripts and repo structure
docs references are accurate
setup/seed/verify instructions are usable
no forbidden imports or architecture regressions were introduced while finalizing docs

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a fake handoff behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 20_docs_and_handoff.md

To:

 20_docs_and_handoff.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 20_docs_and_handoff.md
Status: completed
Summary:
finalized the documentation and handoff layer for Inkbranch v2
normalized setup, architecture, workflow, demo, testing, and contributor docs
documented architecture red lines and continuation guidance clearly
verified that docs match the implemented repo state
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any documentation areas intentionally concise
note any future doc expansion opportunities
note that the rebuild prompt chain is now complete

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Inkbranch v2 ends with a clear, accurate, maintainable documentation and handoff layer that preserves the rebuild’s architecture and makes future continuation safe.

It fails if the repo is left understandable only to the people who built it.

