# 17_validation_and_continuity_guards.md

## Title
Inkbranch v2 — Validation and Continuity Guards

## Objective
Implement the validation and continuity guard layer for Inkbranch v2.

This prompt exists to harden the system so invalid structural state, continuity contradictions, illegal reveals, invalid endings, and unsafe generation/runtime assumptions are caught instead of silently passing through.

By the end of this prompt, the repo should have:
- real continuity validation services
- reveal legality guards
- scene package sanity guards
- runtime transition guards
- canon commit guards
- ending eligibility guards
- generation/result safety guards where appropriate
- reusable validation result structures integrated into real flows
- documentation describing what the guard layer protects and where it runs

This prompt is about system hardening and continuity safety.

This is not the prompt for:
- new planner features
- new runtime features
- new reader UX features
- new authoring features
- admin mutation tools
- analytics/reporting dashboards
- broad policy engines beyond current story continuity needs

---

## Why this prompt matters
Inkbranch v2 only works if the system can trust its own state.

Right now, the architecture includes:
- authored truth
- planner outputs
- runtime commits
- reader rendering
- generator presentation
- admin inspection

But without guardrails, the system is still vulnerable to silent corruption.

Examples of failure modes this prompt must protect against:
- a reveal becoming exposed before it is legal
- a canon commit contradicting authored truth or prior run truth
- a planner package targeting an impossible milestone
- a choice resolution updating knowledge in an impossible way
- an ending being marked eligible before required conditions are met
- generated presentation implying truth that runtime did not commit
- chronicle projection drifting away from underlying event/history state

This prompt is where we stop trusting that every upstream layer always behaves perfectly.

This is where the system starts defending itself.

---

## Product direction to preserve
Inkbranch v2 is planner-led, runtime-committed, and AI-on-rails.

That means:
- authoring defines possible truth
- planner defines valid next structure
- runtime defines committed truth for a run
- generator defines presentation only

The validation and continuity layer exists to preserve those boundaries.

It must not become:
- a second planner
- a hidden runtime mutation engine
- a freeform rule interpreter that replaces authored structure
- a beat-graph validator
- a vague “quality check” layer with no concrete protections

It should specifically guard:
- continuity
- legality
- structural consistency
- run truth integrity

---

## Non-negotiable rules
1. Do not implement new planner features in this prompt.
2. Do not implement new runtime feature workflows in this prompt.
3. Do not let validation mutate truth silently.
4. Do not let generator output become canon truth.
5. Do not validate via vague heuristics only; use explicit structural checks.
6. Do not reintroduce beat-graph logic or node validation.
7. Keep validators modular and inspectable.
8. Return structured validation results, not ad hoc booleans only.
9. Integrate guards into relevant flows where they actually protect the system.
10. Prefer rejecting or clearly degrading invalid states over silently accepting them.

---

## Scope
You should implement:
- continuity validator services
- reveal legality validation
- milestone/scene package sanity validation
- runtime transition validation
- knowledge state validation
- canon commit validation
- ending eligibility validation
- generator output safety validation where it touches continuity assumptions
- integration of validators into planner/runtime/generator touchpoints where appropriate
- validation documentation
- focused validation tests

You should also:
- align with existing validation contracts from earlier prompts
- preserve architecture boundaries
- keep validators independent from UI
- keep validation results readable in future admin/debug use

---

## Out of scope
Do not implement:
- new planner heuristics
- new runtime orchestration features
- admin mutation/remediation tools
- automated repair workflows that rewrite run state
- advanced authoring lint systems beyond what is needed for continuity protection
- fully generic rule engines
- speculative future moderation/safety systems unrelated to story continuity

This prompt is about continuity and structural safety for the current rebuild.

---

## Validation philosophy

### Principle 1 — protect truth boundaries
The validator layer should protect the distinction between:
- authored truth
- planned structure
- committed runtime truth
- generated presentation

A validator should catch cases where those boundaries are being crossed incorrectly.

### Principle 2 — reject bad state early
Where possible, invalid state should be caught before it becomes committed runtime truth.

Examples:
- invalid planner scene package
- illegal reveal set
- impossible ending eligibility
- invalid canon commit request

Do not wait until after corruption spreads.

### Principle 3 — presentation is not authority
Generated prose or generated choice wording must never be treated as proof of continuity truth.

Validation should reinforce that:
- runtime truth comes from runtime records
- canon truth comes from authoring plus runtime commits
- generated presentation is only a render layer

### Principle 4 — validation results must be inspectable
Validation should not just say “pass/fail.”

It should be possible to inspect:
- what failed
- why it failed
- severity
- affected domain
- whether fallback/degraded handling is allowed

This will matter for later observability and debugging.

### Principle 5 — continuity is about consistency over time
Continuity checks should compare:
- current proposal vs existing committed state
- new reveal vs existing knowledge/canon state
- new ending result vs current progression state
- projection state vs underlying runtime history where relevant

Continuity is not just schema validation.
It is state-consistency validation.

### Principle 6 — degrade safely when possible, reject when necessary
Some failures should block progress.
Some failures may allow safe fallback behavior.

Examples:
- invalid generator output can fall back to structural rendering
- illegal reveal should be blocked
- impossible ending should be blocked
- malformed planner package may need hard failure or fallback scene planning depending on severity

Make these outcomes explicit.

---

## Required validation domains

You should implement guard coverage for the following areas.

### 1. Planner scene package validation
Validate that a planner package is structurally sane before runtime instantiation.

Examples of checks:
- scene kind is valid
- target milestone references are valid and belong to the current version
- allowed reveals belong to the current version and are not blocked
- blocked reveals are not simultaneously allowed
- choices are structurally distinct and valid
- ending eligibility output is internally coherent
- continuity facts are present in an expected safe shape

This is not the planner itself.
This is validation of what the planner produced.

### 2. Reveal legality validation
Validate that reveals being used or committed are legal.

Examples of checks:
- reveal exists
- reveal belongs to current book version
- reveal is not blocked by current runtime state
- reveal is not already committed in an incompatible way
- reveal exposure does not contradict known progression state

Illegal reveals should not pass.

### 3. Runtime instantiation validation
Validate that scene instantiation requests are coherent.

Examples of checks:
- chronicle exists
- scene package belongs to the correct version context
- target perspective run is valid for the chronicle
- scene choices belong to the scene package
- planner payload snapshot is structurally valid enough to instantiate
- instantiation does not violate obvious chronicle state assumptions

### 4. Choice resolution validation
Validate that a choice resolution is legal.

Examples of checks:
- choice belongs to the scene instance
- scene instance belongs to the chronicle
- choice is enabled if enabled/disabled semantics exist
- scene is in a resolvable state
- resolution is not duplicated illegally
- structural effects to be applied are coherent

### 5. Knowledge state validation
Validate knowledge updates.

Examples of checks:
- knowledge key is valid or at least structurally coherent
- knowledge status progression is legal
- knowledge does not regress illegally unless explicitly supported
- source scene linkage is valid if present
- perspective-scoped knowledge updates are coherent with chronicle/perspective context

### 6. Canon commit validation
Validate canon commits before or during runtime update.

Examples of checks:
- canon entry exists if referenced
- canon commit belongs to the correct chronicle/book version context
- commit key/value shape is coherent
- commit does not contradict already committed run truth
- commit is consistent with source event or source scene when required

### 7. Chronicle projection validation
Validate chronicle projection refreshes.

Examples of checks:
- current scene instance belongs to chronicle
- current perspective belongs to chronicle/perspective runs
- progress index is coherent
- projection does not point to impossible runtime records
- current-state projection remains consistent enough with committed runtime history

This does not require perfect event-sourcing replay, but it should catch obvious drift.

### 8. Ending eligibility validation
Validate ending eligibility and ending transition safety.

Examples of checks:
- ending exists in current version
- required conditions are met
- blocked conditions are not violated
- ending is not committed prematurely
- ending-related scene/resolution flow is consistent with current run state

### 9. Generator safety validation
Validate generation results only in the areas where continuity could be confused.

Examples of checks:
- generator output schema validity
- fallback use when output is invalid
- generated choice text count aligns with structural choices
- generated presentation does not overwrite runtime truth fields
- generated output remains presentational and bounded

Do not try to semantically solve all prose quality issues here.
Focus on truth-boundary safety.

---

## Required implementation structure

Use or normalize a structure like:

```text
src/core/validators/
  README.md
  contracts/
    ...
  rules/
    planner-scene.ts
    reveals.ts
    runtime-instantiation.ts
    choice-resolution.ts
    knowledge.ts
    canon-commits.ts
    chronicle-state.ts
    endings.ts
    generator-safety.ts
    index.ts
  services/
    validate-planner-scene.ts
    validate-reveal-usage.ts
    validate-runtime-transition.ts
    validate-canon-commit.ts
    validate-ending-eligibility.ts
    validate-generator-output.ts
    index.ts

    You may choose slightly different file names if they are clearer, but the responsibilities should remain separated by validation domain.

Recommended meaning:

rules/* → domain-specific validation rule sets
services/* → orchestration wrappers that gather and run relevant validations
contracts/* → structured result/issue types already established or refined here

Do not implement this as one giant validator file.

Required implementation tasks
Task 1 — inspect current validation contracts and system touchpoints

Inspect:

src/core/validators/contracts/*
src/core/planner/*
src/core/runtime/*
src/core/generator/*
runtime schema and query/mutation flows
admin inspector surfaces where future validation visibility may matter

Determine where validation should run to actually protect the system.

Task 2 — refine validation contracts if needed

If needed, extend/refine the validator contract layer so it can express:

validation success/failure
issue severity
issue code
affected domain/entity
blocking vs non-blocking status
fallback-allowed status where appropriate

Keep contracts explicit and reusable.

Task 3 — implement planner scene package validation

Implement validator logic for planner outputs.

This should validate:

structural coherence of the scene plan
reveal coherence
decision package coherence
ending coherence
version context coherence

This should be run before runtime instantiation where appropriate.

Task 4 — implement reveal legality validation

Implement reveal legality checks.

This should:

validate reveal existence and context
validate current legality against known runtime state
reject contradictory or blocked reveal usage
Task 5 — implement runtime instantiation and choice resolution validation

Implement validation for:

scene instantiation
choice resolution

This should protect the runtime commit pipeline from bad input/state combinations.

Task 6 — implement knowledge and canon commit validation

Implement validation for:

knowledge state updates
canon commit creation/update

This should block contradictory or malformed state transitions.

Task 7 — implement chronicle projection validation

Implement validation for chronicle state refresh and projection coherence.

At minimum, catch obvious mismatches between projection pointers and runtime records.

Task 8 — implement ending eligibility and ending transition validation

Implement validation for:

ending candidate coherence
ending readiness
ending transition legality
premature ending commitment prevention
Task 9 — implement generator safety validation

Implement validation or guard logic ensuring:

generator output stays within schema
generation cannot overwrite runtime truth
structural choice counts stay aligned
invalid generation falls back safely

If some of this already exists from 14/15, consolidate and harden it rather than duplicating it.

Task 10 — integrate guards into real flows

Integrate validation into relevant existing layers, such as:

planner result handling before instantiation
runtime instantiation path
choice resolution path
canon commit path
chronicle projection refresh path
generation handling path

The goal is real protection, not standalone validator files nobody calls.

Do not bury validation in UI pages.

Task 11 — update validator README

Update src/core/validators/README.md so it clearly explains:

what the validator layer protects
where it runs
what it blocks
what it may allow to degrade safely
how it relates to planner, runtime, generator, and admin inspection
Task 12 — create continuity guard documentation

Create:

docs/validation-and-continuity-guards.md

This doc should explain:

what continuity means in Inkbranch v2
which domains are protected
where validators run
what kinds of failures block progress
what kinds of failures degrade safely
how this layer preserves the planner/runtime/generator boundary
what this prompt intentionally does not include
Task 13 — add focused validation tests

Add focused tests for the guard layer.

At minimum, cover cases such as:

illegal reveal is blocked
planner package with contradictory allowed/blocked reveal sets fails
invalid choice resolution is rejected
contradictory canon commit is rejected
premature ending eligibility is blocked
chronicle projection mismatch is detected
invalid generator output falls back or fails safely

Keep tests focused and readable.

Do not build an enormous full-system test matrix here.

Task 14 — verify the guard layer

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
validation tests pass
validators compile and integrate cleanly
relevant planner/runtime/generator flows now call the guard layer
no forbidden imports were introduced
no validation logic leaked into UI components or route pages
Task 15 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Design guidance
Good validation design

Good:

explicit domain checks
structured results
blocking vs non-blocking distinction
integration into real flows
readable issue codes/messages
modular validators
continuity-first mindset
Bad validation design

Bad:

one giant validateEverything.ts
vague true/false returns with no useful issues
validators no one actually calls
UI-level validation pretending to protect runtime truth
generator output treated as continuity authority
beat/node/graph validation concepts reintroduced
Suggested issue/code posture

Use readable, stable issue codes.

Examples of good validation issue categories:

INVALID_SCENE_KIND
REVEAL_NOT_ALLOWED
REVEAL_VERSION_MISMATCH
CHOICE_NOT_RESOLVABLE
KNOWLEDGE_STATE_CONTRADICTION
CANON_COMMIT_CONTRADICTION
CHRONICLE_PROJECTION_MISMATCH
ENDING_NOT_ELIGIBLE
GENERATOR_OUTPUT_INVALID

You may choose exact names that fit the repo style, but keep them:

explicit
stable
machine-readable
admin/debug-friendly
Safe degradation guidance

Some failures should hard-block.
Some can degrade safely.

Examples of likely hard-block failures:

illegal reveal
invalid choice resolution
contradictory canon commit
impossible ending
chronicle projection pointing to impossible records

Examples of likely safe-degrade failures:

invalid generator output
missing optional presentation fields
non-critical metadata mismatch

Make this distinction explicit in validation results where appropriate.

Guardrails against bad continuity design
Do not do this

Bad patterns include:

trusting planner output without checks
trusting runtime transitions without checks
trusting generator output as truth
hiding validation inside UI components
allowing contradictory canon commits through silently
allowing illegal reveals through because prose “sounds right”
rebuilding beat-graph semantics inside validators
Do this instead

Good patterns include:

explicit scene package validation
explicit reveal legality checks
explicit runtime transition validation
explicit canon/knowledge validation
explicit ending validation
explicit generator safety guards
structured results and tests
integration into real services
Acceptance criteria

This prompt is complete only if all of the following are true:

A real validation and continuity guard layer exists.
Planner scene packages are validated before relevant runtime use.
Reveal legality validation exists and is enforced.
Runtime instantiation and choice resolution validation exists and is enforced.
Knowledge update validation exists.
Canon commit validation exists.
Chronicle projection validation exists.
Ending eligibility/transition validation exists.
Generator safety validation exists where relevant.
Validation is integrated into real flows rather than left unused.
No beat-graph-first logic or naming was introduced.
docs/validation-and-continuity-guards.md exists and explains the guard layer clearly.
Lint and typecheck pass.
Focused validation tests exist and pass.
The repo is ready for 18_seed_data_and_demo_book.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
validation tests pass
planner/runtime/generator guard integrations work
illegal reveal scenarios are blocked
invalid choice resolution scenarios are blocked
contradictory canon/knowledge cases are blocked
invalid generator output is handled safely
no forbidden imports were introduced
validation remains within current architecture boundaries

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a fake guard layer behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 17_validation_and_continuity_guards.md

To:

 17_validation_and_continuity_guards.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 17_validation_and_continuity_guards.md
Status: completed
Summary:
implemented the validation and continuity guard layer for planner, runtime, canon, endings, and generator safety
integrated real structural guards into planner/runtime/generator touchpoints
blocked illegal reveals, contradictory commits, invalid transitions, and unsafe generation assumptions
documented the guard layer and added focused validation tests
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally bounded MVP validation logic
note any continuity areas expected to deepen later
note that seed/demo content remains for 18

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Inkbranch gains a real continuity-defense layer that blocks illegal reveals, contradictory runtime truth, invalid ending transitions, and unsafe generation assumptions.

It fails if validation stays superficial, unused, vague, UI-bound, or drifts back into beat-graph thinking.


Next is `18_seed_data_and_demo_book.md`, where we give the system a realistic demo world/book/version so the whole machine can actually be exercised end-to-end.