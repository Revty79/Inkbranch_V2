# Planner MVP

## Scope

Prompt `10_planner_mvp.md` implements the first deterministic planner behavior for Inkbranch v2.

The MVP planner is structural only. It does not render prose and does not commit runtime state.

## What was implemented

Implemented planner services under `src/core/planner/services`:

- `context-loader.ts`: planner context-loader boundary + chronicle orchestration helper
- `milestone-selector.ts`: deterministic milestone targeting
- `reveal-evaluator.ts`: reveal allow/block evaluation
- `pacing-evaluator.ts`: pacing pressure/hint evaluation
- `ending-evaluator.ts`: ending eligibility evaluation
- `scene-selector.ts`: scene kind/goal + constraints/continuity selection
- `decision-builder.ts`: deterministic choice package construction
- `planner-mvp.ts`: end-to-end deterministic planner service orchestration

## Data-access integration

Planner context loading support is implemented via data-layer query composition in:

- `src/data/queries/runtime/planner-context.ts`

This module builds `PlanningContext` using authoring/runtime query functions, not raw route/UI logic.

Core planner logic remains DB-client-agnostic and receives planner-safe context objects.

## Deterministic planning flow

Given a `PlanningContext`, the planner executes a fixed sequence:

1. Target milestone selection
2. Reveal eligibility evaluation
3. Pacing evaluation
4. Ending eligibility evaluation
5. Scene selection
6. Decision package generation
7. Result + diagnostics generation

No randomization is used.

## Result behavior

Planner returns a `PlannerResult` envelope:

- `success` with scene package + decision summary + diagnostics
- `fallback` if safety conditions require fallback output
- `failure` when context cannot be loaded for chronicle-driven planning

## What the MVP planner outputs

Structural scene package data includes:

- scene kind and scene goal
- intent and constraints
- continuity facts
- active milestones
- allowed and blocked reveals
- pacing snapshot and hints
- ending eligibility
- deterministic decision package

## Validation and inspectability

MVP output includes diagnostics and issue surfaces to support later debugging and admin inspection.

A unit test suite in `tests/planner/planner-mvp.test.ts` validates deterministic behavior for repeated contexts and ending-scene eligibility behavior.

## Deliberate limitations

Still deferred to later prompts:

- runtime commit pipeline and event writes
- generator rendering integration
- reader route integration
- advanced optimization and ranking

This MVP is intended to be stable, inspectable, and sufficient for integration with runtime commit in prompt `11`.
