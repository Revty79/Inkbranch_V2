# Core Planner Layer

## Owns

- Planner contracts and planning context boundaries.
- Scene package and decision package interface definitions.
- Strategy selection and deterministic planning services.

## Must not own

- React route rendering.
- Direct persistence driver code.
- Generator prose rendering implementations.

## Allowed examples

- `PlanningContext` interfaces.
- Planner service contracts.
- Strategy dispatch signatures.

## Forbidden examples

- Next.js page components.
- SQL query execution.
- Runtime event persistence details.
