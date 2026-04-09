# Domain Contracts

## Purpose

The domain layer defines Inkbranch v2 vocabulary and boundaries before implementation logic.

## Why this exists

- Prevents planner/runtime/generator structures from drifting ad hoc.
- Keeps authored truth, planning output, runtime outcome, and generated presentation distinct.
- Keeps contracts independent from database rows and UI concerns.

## Contract categories

- `authoring.ts`: authored truth concepts such as world, book, version, canon, perspective, and rules.
- `planning.ts`: planner input/output structures (`PlanningContext`, `ScenePlan`, `DecisionPackage`, `PlannedChoice`).
- `runtime.ts`: runtime concepts for chronicles, scene instances, choices, knowledge, events, and canon commits.
- `generation.ts`: generator input/output envelopes where generation is presentation-only.
- `validation.ts`: validation issue/result contracts with severity and machine-readable codes.
- `primitives.ts` and `common.ts`: shared reusable building blocks.

## Boundary reminders

- These are domain contracts, not ORM row definitions.
- Generator output is never canon truth.
- Domain files must not import from `app`, `ui`, or `data`.
- Contract barrels in `core/planner`, `core/runtime`, `core/generator`, and `core/validators` re-export only what each layer needs.

## How later prompts should use this layer

1. Reuse these contracts as the source vocabulary.
2. Extend types deliberately instead of inventing duplicate shapes.
3. Keep implementation logic in the correct layer (planner/runtime/generator/validators), not in domain type files.
