# 09_planner_contracts.md

## Title
Inkbranch v2 — Planner Contracts

## Objective
Define the formal contracts, interfaces, input shapes, output shapes, and decision boundaries for the Inkbranch v2 planner.

This prompt exists to establish exactly:
- what the planner is allowed to read
- what the planner is allowed to decide
- what the planner must return
- what the planner must not own
- how the planner hands structure off to runtime and generation

By the end of this prompt, the repo should have:
- explicit planner contract types
- planner-facing context shapes
- scene package contracts
- decision package contracts
- reveal and ending eligibility contracts
- planner result contracts
- planner error / fallback contracts
- planner documentation
- clean exports for later implementation

This prompt is about planner boundaries and planner language.

This is not the prompt for:
- implementing planner algorithms
- selecting real next scenes yet
- applying runtime commits
- generating prose
- building planner UI
- writing story logic into route files

---

## Why this prompt matters
The planner is the structural brain of Inkbranch v2.

The planner is what keeps the system from collapsing into:
- hand-authored next-beat chains
- generator-led story logic
- giant runtime blobs that “remember what happened somehow”
- UI-owned narrative flow
- ad hoc branching behavior

If the planner boundary is vague:
- runtime code will start making planning decisions
- Studio authoring will start assuming graph logic
- generator code will decide too much
- the architecture will drift

This prompt prevents that.

It tells the repo:
- what planning means
- what a valid scene package is
- what a valid choice package is
- what the planner is responsible for
- what the planner is not responsible for

---

## Product direction to preserve
Inkbranch v2 is a planner-led, book-first, world-first interactive fiction platform.

The core loop remains:

book bible -> planner -> scene package -> reader decision -> runtime state update -> next scene package

Do not drift back into:
world -> version -> beat -> choice -> next beat

The planner must be designed around:
- authored truth
- milestone progression
- reveal gating
- pacing constraints
- ending readiness
- perspective-aware scene packaging

The planner must not be designed around:
- graph traversal
- next-node lookup
- beat-edge resolution
- manual choice-chain wiring

---

## Non-negotiable rules
1. Do not implement the planner algorithm in this prompt.
2. Do not implement runtime mutation logic in this prompt.
3. Do not implement generator logic in this prompt.
4. Do not define planner contracts around beat graphs.
5. Do not let the planner return prose as truth.
6. Do not let the planner own persistence logic.
7. Do not let the planner own rendering/UI concerns.
8. Keep planner contracts explicit and inspectable.
9. Prefer small, clear contract files over giant all-in-one files.
10. The planner decides valid structure, not presentation.

---

## Scope
You should implement:
- planner-facing input contracts
- planning context contracts
- scene planning contracts
- decision package contracts
- reveal eligibility contracts
- pacing contracts where needed
- ending eligibility contracts
- planner result envelopes
- planner issue/error/fallback contracts
- planner service interface contracts
- planner documentation
- clean exports

You should also:
- align contracts with the authoring schema and runtime schema already created
- align contracts with the domain types already created
- keep the planner independent of UI and persistence details
- preserve the existing architecture boundaries

---

## Out of scope
Do not implement:
- deterministic planning logic
- planner heuristics
- runtime state commits
- scene instance creation
- generator input building
- generator provider calls
- planner admin dashboards
- authoring tools for planner internals
- caching layers
- background job orchestration

This prompt defines planner shape, not planner behavior.

---

## Planner philosophy

### Principle 1 — planner decides structure, not prose
The planner should decide:
- what kind of scene is valid next
- what the scene is trying to accomplish
- what milestones it can advance
- what reveals are allowed
- what choices are valid
- whether an ending is eligible

The planner should not decide:
- final prose wording
- polished reader-facing copy
- UI formatting

That belongs later to the generator and UI.

### Principle 2 — planner consumes authored truth plus runtime state
The planner should be fed from:
- authored truth
- current runtime context
- current perspective
- current knowledge state
- milestone state
- pacing context
- ending state

It should not invent core truth from nowhere.

### Principle 3 — planner output is a proposal until runtime commits it
A planner result is not yet “what happened.”

It is a valid next package proposal.

It becomes part of runtime history only after:
- scene instantiation
- reader choice
- runtime commit

The contracts should make this distinction clear.

### Principle 4 — planner is not a graph walker
The planner should not fundamentally operate as:
- “current node -> next connected node”
- “choice edge -> beat edge”
- “graph traversal state”

The planner should operate as:
- context evaluation
- eligibility evaluation
- structural packaging

### Principle 5 — planner should be inspectable
Planner outputs should be inspectable enough that later admin/debug tooling can explain:
- why a scene type was selected
- why certain reveals were allowed or blocked
- why certain choices were offered
- why an ending was or was not eligible

Do not make the planner contracts too opaque for later diagnostics.

---

## Required planner domains
You should define contracts for the following conceptual areas.

### 1. Planning context
This is the planner’s input world.

It should include enough structure to represent:
- target book version
- current chronicle
- current chronicle projection
- current perspective context
- current knowledge state
- unresolved and completed milestone context
- reveal context
- pacing context
- ending context
- optional previous scene context

This should be a planner-facing shape, not a raw DB join dump.

### 2. Scene planning
This is the core structural output.

A `ScenePlan` should describe things like:
- scene kind
- scene goal
- target perspective
- active milestone references
- allowed reveal references
- blocked reveal references
- continuity facts the generator must respect
- scene intent and constraints
- allowed decision package
- ending eligibility state

This should be structural, not prose-heavy.

### 3. Decision package
The planner must define what choices are valid.

A decision package should cover:
- available options
- option intent
- option constraints
- expected structural effects
- disabled options if relevant
- maybe a reason or block state where useful

This package should represent valid choice structure, not rendered UI copy.

### 4. Reveal eligibility
The planner must explicitly handle reveal gating.

Define contracts for:
- allowed reveals
- blocked reveals
- reveal reasons
- reveal scope or impact where useful

Do not let reveal legality become hidden or implied.

### 5. Pacing state and pacing outcome
The planner should know enough about pacing to shape next-scene validity.

Define contracts that can represent:
- pacing summary
- pacing pressure or targets
- sequence rhythm signals
- scene cadence constraints

Do not implement pacing math yet.
Just define the contract shapes.

### 6. Ending eligibility
The planner must be able to say:
- no ending is currently allowed
- one or more endings are now eligible
- an ending is not yet permitted and why

Define this clearly.

### 7. Planner result envelope
The planner should return a structured result that can later be:
- validated
- instantiated into runtime
- passed into generator workflows

This result should be explicit and inspectable.

### 8. Planner issue/failure contracts
Later implementations may encounter:
- insufficient context
- invalid authored truth
- contradictory runtime state
- no valid scene package
- planner fallback conditions

Define clean contracts for issues and failures now.

---

## Required directory and file shape
Use or normalize a structure like:

```text
src/core/planner/
  README.md
  contracts/
    context.ts
    scene-plan.ts
    decisions.ts
    reveals.ts
    pacing.ts
    endings.ts
    result.ts
    service.ts
    issues.ts
    index.ts

You may choose slightly different file names if they are clearer, but keep concerns separated.

Recommended meaning:

context.ts → planner input context
scene-plan.ts → scene package / scene plan
decisions.ts → decision package / planned choices
reveals.ts → reveal eligibility and reveal result types
pacing.ts → pacing summary and pacing-related contracts
endings.ts → ending eligibility contracts
result.ts → planner result envelopes
service.ts → planner interface definitions
issues.ts → errors, warnings, fallback outcomes
index.ts → clean exports

Do not put all planner contracts into one giant file.

Required contract areas
1. Planning context contracts

Create contracts such as:

PlanningContext
PlanningBookContext
PlanningChronicleContext
PlanningPerspectiveContext
PlanningKnowledgeContext
PlanningMilestoneContext
PlanningRevealContext
PlanningPacingContext
PlanningEndingContext
PreviousSceneContext or equivalent if useful

These should be planner-safe shapes, not schema row dumps.

The planner context should represent what the planner needs to know, not everything in the database.

2. Scene plan contracts

Create contracts such as:

ScenePlan
ScenePlanId or key shape if helpful
SceneKind
SceneGoal
SceneConstraint
SceneContinuityFact
SceneIntent
ScenePackage

You may choose exact names, but the result should clearly express:

what kind of scene is next
what the scene is for
what must be respected
what may be revealed
what choices are offered

A ScenePlan should not contain final prose.

3. Decision package contracts

Create contracts such as:

DecisionPackage
PlannedChoice
PlannedChoiceIntent
ChoiceAvailability
ChoiceConstraint
ChoiceEffectHint
DisabledChoiceReason if useful

The planner should be able to represent:

enabled options
disabled options if needed
structural intent of options
expected downstream effect hints

Do not design this as rendered button copy logic.

4. Reveal contracts

Create contracts such as:

RevealCandidate
RevealEligibility
AllowedReveal
BlockedReveal
RevealBlockReason
RevealImpactHint

The planner contracts should make it explicit:

which reveals are permitted
which are blocked
why
5. Pacing contracts

Create contracts such as:

PacingSnapshot
PacingTarget
PacingPressure
PacingDecisionHint
SceneCadenceState

These should help later planner implementations reason about rhythm and progression without hardcoding the math here.

6. Ending contracts

Create contracts such as:

EndingEligibility
EligibleEnding
BlockedEnding
EndingBlockReason
EndingCandidateSet

The planner must be able to express:

whether an ending is allowed
which endings are candidates
why endings are blocked
7. Planner result contracts

Create contracts such as:

PlannerResult
PlannerSuccessResult
PlannerFailureResult
PlannerFallbackResult
PlannerDiagnostics or equivalent
PlannerDecisionSummary

The result should be explicit enough that later runtime and admin tooling can understand it.

8. Planner service contracts

Create interface contracts such as:

Planner
PlannerService
PlanNextSceneInput
PlanNextSceneOutput

This should define the formal service boundary for the later planner implementation.

Do not implement the service behavior yet.

9. Planner issue contracts

Create contracts such as:

PlannerIssue
PlannerIssueCode
PlannerIssueSeverity
PlannerFailureReason
PlannerFallbackReason

These should support later diagnostics and admin inspection.

Required implementation tasks
Task 1 — inspect current domain contracts and schema

Inspect:

src/core/domain/types/*
src/data/schema/*
src/data/queries/*
current planner placeholders under src/core/planner/*

Determine how to define planner contracts that align with existing domain language without depending directly on DB details.

Task 2 — define planning context contracts

Create the input context contracts for the planner.

These should represent:

authored truth context
runtime snapshot context
perspective context
progression context
eligibility context

Keep them explicit and composable.

Do not make one giant unstructured context blob.

Task 3 — define scene package contracts

Create the contracts for the planner’s main structural output.

These contracts should represent:

scene type
scene purpose
active constraints
allowed reveals
continuity facts
decision package
ending state

Keep them prose-free.

Task 4 — define decision package contracts

Create the contracts for valid reader-facing structural options.

These should describe:

option identity
option intent
availability
effect hints
constraints

Do not confuse this with final UI rendering.

Task 5 — define reveal, pacing, and ending contracts

Create the contracts for:

reveal eligibility
pacing summary/pressure
ending eligibility

These are key planner domains and should be defined clearly.

Task 6 — define planner result/service/issue contracts

Create:

planner result envelopes
planner service interfaces
planner issue/failure/fallback contracts

These should make later implementation and inspection straightforward.

Task 7 — update planner README

Update or create src/core/planner/README.md so it clearly states:

what the planner owns
what the planner does not own
how planner contracts relate to runtime and generation
why the planner is not a beat-graph engine
Task 8 — create planner contract documentation

Create:

docs/planner-contracts.md

This doc should explain:

what the planner consumes
what the planner returns
what belongs in a scene package
what belongs in a decision package
how reveals, pacing, and endings fit in
what this prompt intentionally does not implement
Task 9 — refine exports

Update:

src/core/planner/contracts/index.ts
any supporting barrels needed for clarity

Keep exports intentional and stable.

Task 10 — verify the planner contract layer

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
planner contracts compile cleanly
no forbidden imports were introduced
planner contracts do not depend on UI or persistence
no implementation logic slipped in
Task 11 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Contract design guidance
Good planner contracts

Good contracts are:

structural
explicit
typed
inspectable
domain-aligned
independent of UI and persistence shape
Bad planner contracts

Bad contracts are:

beat-graph-shaped
prose-heavy
giant context blobs
vague any objects
hidden DB row mirrors
runtime mutation disguised as planning output
Example design direction

The planner should feel like it produces something conceptually like:

planning context in
scene package out
decision package out
reveal and ending eligibility included
diagnostics attached

Not:

currentNode -> nextNode
graph traversal result
prose blob with suggested choices
random story JSON

Do not hardcode these exact names if a better naming fit emerges, but preserve the architecture.

Guardrails against bad planner design
Do not do this

Bad patterns include:

BeatNodePlan
NextBeatResolver
GraphTraversalContext
planner contracts that contain rendered prose
planner contracts that embed DB client types
planner result contracts that are just opaque payload blobs
issue contracts too vague to debug later
Do this instead

Good patterns include:

PlanningContext
ScenePlan
DecisionPackage
RevealEligibility
EndingEligibility
PlannerResult
PlannerIssue

Keep the planner vocabulary aligned with the rebuild.

Acceptance criteria

This prompt is complete only if all of the following are true:

Planner contract files exist and are organized clearly.
Planning context contracts are explicitly defined.
Scene plan / scene package contracts are explicitly defined.
Decision package contracts are explicitly defined.
Reveal eligibility contracts are explicitly defined.
Pacing contracts are explicitly defined.
Ending eligibility contracts are explicitly defined.
Planner result/service/issue contracts are explicitly defined.
Planner contracts do not depend on UI, route, or DB client code.
No planner implementation logic was added.
No beat-graph-first planner structures or naming were introduced.
docs/planner-contracts.md exists and explains the planner boundary clearly.
Lint and typecheck pass.
The repo is ready for 10_planner_mvp.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
planner contracts compile cleanly
no forbidden imports were introduced
no implementation logic slipped into planner contracts
planner contracts remain aligned with planner-first architecture

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave vague planner boundaries behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 09_planner_contracts.md

To:

 09_planner_contracts.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 09_planner_contracts.md
Status: completed
Summary:
defined the formal planner contracts for context, scene packaging, decisions, reveals, pacing, endings, and planner results
established the planner’s boundary as structural story logic rather than prose generation or runtime mutation
added planner service and issue contracts for future implementation and diagnostics
documented the planner boundary and preserved separation from UI, persistence, and generator logic
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally deferred field/detail refinement
note any contract areas expected to deepen in 10
note that runtime commit and generator work remain separate

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if the planner becomes a clearly bounded structural system.

It fails if the planner contracts drift into beat-graph thinking, prose generation, persistence ownership, or vague uninspectable blobs.


Next is `10_planner_mvp.md`, and that’s where the planner actually starts making deterministic decisions from authored truth and runtime context.