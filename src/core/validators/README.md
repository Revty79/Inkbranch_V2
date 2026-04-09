# Core Validators Layer

## Owns

- Structured continuity and legality guard contracts.
- Domain rule sets for planner scene packages, reveals, runtime transitions, knowledge, canon commits, chronicle projection, endings, and generator safety.
- Validation service wrappers integrated into planner/runtime/generator touchpoints.

## Must not own

- React rendering logic.
- Database I/O orchestration.
- Planner or runtime mutation orchestration.

## Allowed examples

- Blocking continuity guard checks with inspectable issue codes.
- Safe-degrade validation for presentation-only generator failures.
- Reusable guard services consumed by runtime/generator pipelines.

## Forbidden examples

- Query execution modules.
- Route handlers.
- Planner scene package generation logic.

## Runtime Integration

- Planner scene packages are validated before runtime instantiation.
- Choice resolution, reveal usage, knowledge updates, canon commits, ending transitions, and chronicle projection refreshes are guard-validated in runtime commit flow.
- Generator output passes schema validation and continuity-safe generator safety guards before success is returned.
