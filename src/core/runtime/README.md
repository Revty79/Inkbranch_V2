# Core Runtime Layer

## Owns

- Runtime contracts for scene commits, choices, and event append workflows.
- Runtime state projection service interfaces.
- Runtime-side invariants for commit pipelines.

## Must not own

- UI components or route logic.
- Provider-specific AI generation calls.
- Hand-authored beat-graph traversal logic.

## Allowed examples

- Choice resolution contract types.
- Event append service interfaces.
- Projection refresh signatures.

## Forbidden examples

- React rendering utilities.
- Route handlers deciding canonical story validity alone.
- Generator prompt templates.
