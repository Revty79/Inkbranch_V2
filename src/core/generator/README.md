# Core Generator Layer

## Owns

- Generator input and output contracts.
- Adapter interfaces for prose rendering providers.
- Validation hooks for structured generation output.

## Must not own

- Canon decision logic.
- Planner scene validity logic.
- Runtime commit mutation logic.

## Allowed examples

- Renderer adapter interfaces.
- Structured option text contract types.
- Generation fallback boundary contracts.

## Forbidden examples

- Planner strategy implementations.
- Runtime event append operations.
- UI route orchestration.
