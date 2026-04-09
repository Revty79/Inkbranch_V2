# Core Runtime Layer

## Owns

- Runtime commit contracts for scene instantiation and choice resolution.
- Runtime commit orchestration services (instantiate, resolve, append events, projection refresh).
- Projection derivation helpers for `chronicle_states` and `perspective_runs`.
- Deterministic structural effect handling for knowledge and canon updates.

## Must not own

- UI components, route handlers, or form logic.
- Planner algorithms for scene validity decisions.
- Prose generation or provider adapter calls.
- Raw database access implementations.

## Runtime backbone responsibilities

1. Accept planner-approved structural scene packages.
2. Instantiate runtime scene rows and runtime choice rows.
3. Resolve selected choices through a dedicated path.
4. Append explicit runtime events for each key transition.
5. Update knowledge state and canon commits from structural effect hints.
6. Refresh chronicle and perspective projection state.

## Layer boundary pattern

- `src/core/runtime/*`: contracts, projections, and orchestration logic only.
- `src/data/mutations/runtime/runtime-commit-pipeline.ts`: database-backed store adapter.
- Runtime core services depend on injected store ports, not `@/data/*`.

## Forbidden examples

- Collapsing scene instantiation and choice resolution into a single opaque write.
- Treating planner payload as committed runtime truth without scene instantiation.
- Persisting all run state in one giant JSON blob.
- Inferring runtime commits from generated prose.
