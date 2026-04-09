# Core Planner Layer

## Purpose

The planner is Inkbranch v2's structural decision engine.

It consumes planner-safe context, evaluates authored truth against runtime state, and returns an inspectable next `ScenePackage` proposal.

## Owns

- Planner contracts for context, scene plans, decisions, reveals, pacing, endings, results, and issues.
- Deterministic MVP planner service orchestration (`services/planner-mvp.ts`).
- Planner domain evaluators/selectors for milestones, reveals, pacing, endings, scene selection, and decision construction.
- Context-loader service boundary for chronicle-driven planning requests.

## Does not own

- Runtime persistence writes (scene commits, event appends, state projection writes).
- Prose generation or generator provider calls.
- Route/UI rendering logic.
- Direct DB client usage.

## Context loading boundary

Core planner services do not query the DB directly.

Context loading is provided through a `PlanningContextLoader` interface. The data layer can implement that interface (for example via `runtime/planner-context.ts`) using query modules.

## MVP deterministic flow

1. Load planning context.
2. Select target milestone.
3. Evaluate reveal eligibility.
4. Evaluate pacing snapshot and hints.
5. Evaluate ending eligibility.
6. Select next scene kind and scene goal.
7. Build deterministic decision package.
8. Return success/failure/fallback planner result with diagnostics.

## Not a beat-graph engine

Planner behavior is context-and-eligibility based.

Avoid introducing beat-node traversal structures (`node -> edge -> next-node`) as planner core logic.

## Implementation status

- Contract layer: complete for MVP.
- Deterministic planner MVP: implemented in core services.
- Runtime commit integration: deferred to `11_runtime_commit_pipeline.md`.
