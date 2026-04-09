# Module Boundaries

## App layer (`src/app`)

Owns:

- Next.js route segments, layouts, pages, and request orchestration.

Must not own:

- Planner validity logic.
- Runtime mutation logic.
- Generator business rules.

## Core layer (`src/core`)

Owns:

- Domain contracts.
- Planner contracts and planning services.
- Runtime contracts and state transition services.
- Generator contracts and adapter boundaries.
- Validation contracts and business rules.

Must not own:

- React rendering logic.
- Direct route definitions.
- Database-specific driver setup inside domain contracts.

## Data layer (`src/data`)

Owns:

- Database client wiring.
- Schema entry points.
- Query and mutation modules.
- Mapping between persistence records and core contracts.

Must not own:

- UI rendering or route composition.
- Story validity decisions that belong in planner/runtime contracts.

## UI layer (`src/ui`)

Owns:

- Reusable presentational components.
- Typed props and display-only formatting helpers.

Must not own:

- Planner or runtime state mutation decisions.
- Data persistence orchestration.

## Examples of boundary crossing

Good:

- `app` calls a `core` planner service and passes results to `ui` components.
- `core/runtime` uses `data` repositories to persist runtime events.

Bad:

- `app` computes valid next scenes directly.
- `ui` writes runtime commits.
- `data` defines story progression rules.
