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
- Database-specific driver setup.

## Data layer (`src/data`)

Owns:

- Database client wiring.
- Schema entry points.
- Query and mutation modules.
- Mapping between persistence records and core contracts.

Must not own:

- UI rendering or route composition.
- Story validity decisions that belong in planner/runtime/validator services.

## UI layer (`src/ui`)

Owns:

- Reusable presentational components.
- Typed props and display-only formatting helpers.

Must not own:

- Planner or runtime state mutation decisions.
- Data persistence orchestration.

## Validation layer (`src/core/validators`)

Owns:

- Structured guard contracts and issue/result shapes.
- Continuity, legality, and projection consistency checks.
- Blocking vs safe-degrade guard outcomes.

Must not own:

- Runtime state mutation.
- UI rendering.
- Planner scene generation.

## Examples of boundary crossing

Good:

- `app` composes data-query output and UI components for route rendering.
- `data` adapters call `core` planner/runtime services using explicit contracts/stores.
- `core` services remain persistence-agnostic and UI-agnostic.

Bad:

- `app` computes valid next scenes directly.
- `ui` writes runtime commits.
- `data` defines planner decision rules.
- `core` imports `app` or `ui` modules.

## Related docs

- [Architecture Overview](architecture-overview.md)
- [Rebuild Principles](rebuild-principles.md)
- [Contributor Handoff](contributor-handoff.md)
