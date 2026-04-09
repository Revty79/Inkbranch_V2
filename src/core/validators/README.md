# Core Validators Layer

## Owns

- Validation contracts for continuity and legality checks.
- Rule boundaries for reveal gating, pacing, and ending eligibility.
- Pure validation interfaces used by planner/runtime services.

## Must not own

- React rendering logic.
- Database I/O orchestration.
- Generator provider integrations.

## Allowed examples

- Continuity validator contracts.
- Reveal legality check signatures.
- Ending gate evaluation interfaces.

## Forbidden examples

- Query execution modules.
- Route handlers.
- Planner scene package generation logic.
