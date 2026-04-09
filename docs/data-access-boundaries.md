# Data Access Boundaries

## Purpose

This layer keeps persistence access disciplined and out of UI/routes/engine orchestration.

## Layer split

- `src/data/queries`: read-only database access.
- `src/data/mutations`: write-side database access.
- `src/data/mappers`: shape translators for stable typed records.

## What belongs in queries

- Focused read operations by area (`authoring/*`, `runtime/*`).
- Typed return shapes mapped from Drizzle rows.
- No write behavior.

## What belongs in mutations

- Explicit inserts/updates/deletes with narrow function names.
- Optional small transactions only where consistency needs it.
- No planner validity logic, reveal legality logic, or generator orchestration.

## What belongs in mappers

- Row/result shape translation.
- Timestamp normalization and payload shape normalization.
- No database calls and no business rule decisions.

## Import and server boundaries

- DB-accessing modules import `server-only` to mark server-side intent.
- UI and route page/layout components must not import `@/data/db` directly.
- Higher layers should consume `queries` and `mutations` modules, not raw Drizzle calls.

## Architectural reminders

- Planner logic remains in `src/core/planner`.
- Runtime orchestration remains in `src/core/runtime`.
- This prompt establishes persistence boundaries only; feature workflows are implemented later.
