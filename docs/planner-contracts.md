# Planner Contracts

## Scope

Prompt `09_planner_contracts.md` defines the formal planner contract layer for Inkbranch v2.

This work establishes what the planner consumes and what it returns without implementing planner algorithms.

## What the planner consumes

The planner service takes `PlanNextSceneInput`, which includes a structured `PlanningContext` made of explicit sub-contexts:

- book/version context
- chronicle/runtime summary context
- perspective context
- knowledge context
- milestone context
- reveal context
- pacing context
- ending context
- optional previous-scene context

The context is planner-facing and inspectable, not a raw DB-row dump.

## What the planner returns

The planner returns a `PlannerResult` envelope:

- `PlannerSuccessResult` with a `ScenePackage`
- `PlannerFailureResult` with failure reason + diagnostics
- `PlannerFallbackResult` with fallback reason + fallback package + diagnostics

All variants carry explicit diagnostics support through typed issue contracts.

## Scene package boundaries

`ScenePlan` / `ScenePackage` describes structural output only:

- scene kind and goal
- scene intent
- continuity constraints/facts
- active milestone references
- allowed and blocked reveals
- pacing snapshot and hints
- ending eligibility
- decision package

No final prose is included in planner contracts.

## Decision package boundaries

`DecisionPackage` and `PlannedChoice` represent valid structural options:

- choice identity and intent
- availability state
- constraints
- effect hints
- disabled-choice reasons

Any option label/summary fields are treated as structural hints, not generator-owned final copy.

## Reveal, pacing, and ending fit

Dedicated contract files isolate major planning domains:

- `reveals.ts`: candidates, allowed/blocked reveals, block reasons, impact hints
- `pacing.ts`: targets, pressure, cadence, snapshot, decision hints
- `endings.ts`: candidates, eligibility state, blocked reasons, eligible endings

This keeps planner internals inspectable and avoids hidden gate logic.

## Service and issue boundary

- `service.ts` defines the planner service interface (`Planner`, `PlannerService`) and request/response types.
- `issues.ts` defines issue codes, severities, failure reasons, and fallback reasons.

These contracts support future deterministic implementation and later admin inspection tooling.

## Explicitly deferred

This prompt does not implement:

- deterministic planning algorithm behavior
- runtime commit behavior
- generator integration
- planner UI

Those responsibilities remain in later prompts.
